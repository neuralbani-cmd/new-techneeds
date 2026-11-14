import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK with User-Agent header for telemetry
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check API
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'TechNeeds IGDTUW Mentorship Platform',
    timestamp: new Date().toISOString(),
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Gemini AI Profile Generation Endpoint
app.post('/api/gemini/profile-insights', async (req: Request, res: Response) => {
  try {
    const studentData = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.status(200).json({
        isDemo: true,
        message: 'No GEMINI_API_KEY found in server environment. Using synthetic intelligence engine.',
        insights: generateSyntheticInsights(studentData),
      });
    }

    const prompt = `
You are the AI Mentorship Intelligence Engine for TechNeeds at IGDTUW (Indira Gandhi Delhi Technical University for Women).
Analyze the actual technical progress, submissions, quiz metrics, and learning streak of this student:
${JSON.stringify(studentData, null, 2)}

Strict Rules:
- Rely strictly on the actual provided user metrics (points, completed resources, quizzes, projects, interests).
- Do NOT hallucinate unearned milestones.
- Generate an inspiring, authentic technical identity, skill badges, strengths summary, and personalized next-step learning recommendations.
- Keep output concise, professional, encouraging, and tailored for high-achieving women in engineering.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            technicalIdentity: {
              type: Type.STRING,
              description: 'A 1-2 sentence punchy technical identity persona for this engineer.',
            },
            performanceSummary: {
              type: Type.STRING,
              description: '2-3 sentences summarizing genuine strengths, growth velocity, and project execution based on the data.',
            },
            skillBadges: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  category: { type: Type.STRING },
                  level: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ['title', 'category', 'level', 'description'],
              },
              description: '4-6 specialized skill badges earned through completed modules and projects.',
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  topic: { type: Type.STRING },
                  type: { type: Type.STRING, description: 'E.g., Architecture, Open Source, Advanced Topic, Practice' },
                  reason: { type: Type.STRING },
                  suggestedAction: { type: Type.STRING },
                },
                required: ['topic', 'type', 'reason', 'suggestedAction'],
              },
              description: '3 concrete personalized next-step technical recommendations.',
            },
            achievements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  timestamp: { type: Type.STRING },
                  metricValue: { type: Type.STRING },
                },
                required: ['title', 'timestamp', 'metricValue'],
              },
            },
          },
          required: ['technicalIdentity', 'performanceSummary', 'skillBadges', 'recommendations', 'achievements'],
        },
      },
    });

    const parsed = JSON.parse(response.text ?? '{}');
    return res.json({
      isDemo: false,
      model: 'gemini-3.8-flash',
      insights: parsed,
    });
  } catch (error: any) {
    console.error('Error generating AI profile insights via Gemini:', error);
    // Graceful fallback so UI remains functional
    return res.status(200).json({
      isDemo: true,
      error: error?.message || 'Gemini generation error',
      insights: generateSyntheticInsights(req.body),
    });
  }
});

// Deterministic synthetic fallback insights
function generateSyntheticInsights(data: any) {
  const name = data?.name || 'Engineer';
  const points = Number(data?.points) || 680;
  const rank = data?.rank || 2;
  const streak = Number(data?.streak) || 12;
  const programme = data?.programmeName || 'Full-Stack Web & Cloud Systems';

  return {
    technicalIdentity: `${name} is an agile, systems-minded engineer in the ${programme} track, demonstrating strong backend proficiency and consistent sprint velocity.`,
    performanceSummary: `With ${points} earned points, a ${streak}-day active streak, and rank #${rank} in the cohort, ${name} exhibits high code quality, timely project submissions, and rigorous quiz retention.`,
    skillBadges: [
      {
        title: 'Distributed Systems',
        category: 'Backend Architecture',
        level: 'Proficient',
        description: 'Demonstrated through microservices and caching project implementations.',
      },
      {
        title: 'Full-Stack Engineering',
        category: 'Application Development',
        level: 'Advanced',
        description: 'Consistent high marks across React frontend and Node.js REST API builds.',
      },
      {
        title: 'Algorithmic Problem Solver',
        category: 'Data Structures',
        level: 'Mastery',
        description: 'Top-tier performance in weekly algorithm diagnostic quizzes.',
      },
      {
        title: 'Cloud & Containerization',
        category: 'DevOps',
        level: 'Intermediate',
        description: 'Successfully containerized multi-tier applications with Docker.',
      },
    ],
    recommendations: [
      {
        topic: 'Event-Driven Architectures with Apache Kafka & Redis Pub/Sub',
        type: 'Architecture Deep-Dive',
        reason: 'Natural progression from RESTful microservices to high-throughput stream processing.',
        suggestedAction: 'Explore the TechNeeds Redis caching masterclass and build an async job queue.',
      },
      {
        topic: 'Database Indexing & Query Optimization (PostgreSQL & MongoDB)',
        type: 'Database Engineering',
        reason: 'Reinforces backend efficiency as student projects scale in complexity.',
        suggestedAction: 'Complete the database performance diagnostic quiz in module 4.',
      },
      {
        topic: 'Open Source Mentorship Contribution',
        type: 'Community Impact',
        reason: 'High rank qualifies student to review PRs for incoming junior cohort mentees.',
        suggestedAction: 'Contribute a pull request to the TechNeeds open-source component library.',
      },
    ],
    achievements: [
      {
        title: 'Consistent 10+ Day Learning Sprint',
        timestamp: 'Current Week',
        metricValue: `${streak} Days`,
      },
      {
        title: 'Cohort Top Tier Contender',
        timestamp: 'Cohort 2026',
        metricValue: `Rank #${rank}`,
      },
      {
        title: 'Capstone Project Milestone',
        timestamp: 'Completed',
        metricValue: '96% Score',
      },
    ],
  };
}

async function startServer() {
  const httpServer = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TechNeeds IGDTUW Server] listening on http://0.0.0.0:${PORT}`);
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const hmrDisabled = process.env.DISABLE_HMR === 'true';
    const vitePromise = import('vite').then(({ createServer: createViteServer }) =>
      createViteServer({
        server: {
          middlewareMode: true,
          hmr: !hmrDisabled,
          ws: hmrDisabled ? false : { server: httpServer },
          watch: hmrDisabled ? null : {},
        },
        appType: 'spa',
      })
    );

    vitePromise.catch((err) => {
      console.error('[TechNeeds IGDTUW Server] Failed to initialize Vite dev server:', err);
    });

    app.use(async (req, res, next) => {
      try {
        const vite = await vitePromise;
        vite.middlewares(req, res, next);
      } catch (err) {
        next(err);
      }
    });

    const shutdown = async () => {
      try {
        const vite = await Promise.race([
          vitePromise,
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 500)),
        ]);
        await vite?.close();
      } catch {
        // ignore close errors on shutdown
      }
      httpServer.closeAllConnections?.();
      httpServer.close(() => {
        process.exit(0);
      });
      setTimeout(() => process.exit(0), 1000).unref();
    };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    return;
  }

  const shutdown = () => {
    httpServer.closeAllConnections?.();
    httpServer.close(() => {
      process.exit(0);
    });
    setTimeout(() => process.exit(0), 1000).unref();
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer();

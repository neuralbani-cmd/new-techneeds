import { AIProfileData, User, StudentProgress, Submission, LearningResource } from '../types';

export interface ProfileInsightRequestData {
  name: string;
  enrollmentNo?: string;
  role: string;
  branch?: string;
  year?: string;
  points: number;
  streak: number;
  rank: number;
  programmeName: string;
  completedResourceTitles: string[];
  gradedSubmissions: Array<{
    title: string;
    type: string;
    score?: number;
    maxMarks: number;
  }>;
  interestTags: string[];
}

export async function fetchAIProfileInsights(
  user: User,
  progress: StudentProgress,
  submissions: Submission[],
  resources: LearningResource[],
  programmeName: string
): Promise<AIProfileData> {
  const completedResources = resources.filter((r) =>
    progress.completedResourceIds.includes(r.id)
  );

  const gradedSubmissions = submissions
    .filter((s) => s.menteeId === user.id && s.status === 'graded')
    .map((s) => ({
      title: s.resourceTitle,
      type: s.resourceType,
      score: s.score,
      maxMarks: s.maxMarks,
    }));

  const payload: ProfileInsightRequestData = {
    name: user.name,
    enrollmentNo: user.enrollmentNo,
    role: user.role,
    branch: user.branch,
    year: user.year,
    points: progress.totalPoints,
    streak: progress.streakDays,
    rank: progress.rank,
    programmeName,
    completedResourceTitles: completedResources.map((r) => r.title),
    gradedSubmissions,
    interestTags: user.interestTags || ['Full-Stack', 'Systems Design'],
  };

  try {
    const res = await fetch('/api/gemini/profile-insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
      technicalIdentity: data.insights.technicalIdentity,
      performanceSummary: data.insights.performanceSummary,
      skillBadges: data.insights.skillBadges,
      recommendations: data.insights.recommendations,
      achievements: data.insights.achievements,
      generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: data.model || 'Gemini 3.8 Flash',
      isDemo: Boolean(data.isDemo),
    };
  } catch (err) {
    console.warn('Using client-side synthetic AI profile generation fallback:', err);
    return getSyntheticClientInsights(payload);
  }
}

function getSyntheticClientInsights(data: ProfileInsightRequestData): AIProfileData {
  const scoreRatio = data.points > 600 ? 'High' : 'Consistent';
  return {
    technicalIdentity: `${data.name} is an exceptional technical thinker and systems developer at IGDTUW, specializing in ${data.interestTags.slice(0, 2).join(' & ')}.`,
    performanceSummary: `Demonstrates ${scoreRatio.toLowerCase()} velocity across ${data.completedResourceTitles.length} completed modules with a robust ${data.streak}-day learning streak. Top ${Math.max(1, data.rank)} rank in ${data.programmeName}.`,
    skillBadges: [
      {
        title: 'Distributed Systems',
        category: 'Architecture',
        level: 'Proficient',
        description: 'Verified via real-time WebSocket Whiteboard implementation.',
      },
      {
        title: 'System Design Diagnostician',
        category: 'Core Concepts',
        level: 'Mastery',
        description: '100% mastery score in CAP theorem and caching paradigms.',
      },
      {
        title: 'Algorithmic Problem Solver',
        category: 'Data Structures',
        level: 'Advanced',
        description: 'Demonstrated deep conceptual rigor in system partitioning challenges.',
      },
      {
        title: 'Full-Stack Integration',
        category: 'Software Engineering',
        level: 'Specialist',
        description: 'Clean end-to-end component modularity with client-server separation.',
      },
    ],
    recommendations: [
      {
        topic: 'Distributed Tracing & OpenTelemetry',
        type: 'Observability Deep Dive',
        reason: 'Essential for diagnosing latency bottlenecks in multi-tier microservice networks.',
        suggestedAction: 'Instrument the Whiteboard service with OpenTelemetry spans and Jaeger dashboards.',
      },
      {
        topic: 'LSM-Trees vs B+Trees in Persistent Storage',
        type: 'Database Internals',
        reason: 'Builds upon current caching strengths to master high-write throughput databases.',
        suggestedAction: 'Review the upcoming Systems Programming cohort storage engine syllabus.',
      },
      {
        topic: 'Junior Mentee Code Review Program',
        type: 'Leadership & Mentorship',
        reason: 'Top 1% cohort velocity qualifies student to review Pull Requests for new entrants.',
        suggestedAction: 'Apply as an Associate Student Mentor for the upcoming Summer batch.',
      },
    ],
    achievements: [
      {
        title: 'Consecutive Learning Sprint',
        timestamp: 'Active',
        metricValue: `${data.streak} Days`,
      },
      {
        title: 'Cohort Leaderboard Standing',
        timestamp: 'Current Term',
        metricValue: `Rank #${data.rank}`,
      },
      {
        title: 'Full Capstone Score',
        timestamp: 'Verified',
        metricValue: '96% Execution',
      },
    ],
    generatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    model: 'Gemini 3.8 Flash (Synthetic)',
    isDemo: true,
  };
}

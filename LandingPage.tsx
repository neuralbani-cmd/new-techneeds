import React, { useState } from 'react';
import {
  Code2,
  Users,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Shield,
  Layers,
  Award,
  TrendingUp,
  Cpu,
  GraduationCap,
  ExternalLink,
  ChevronDown,
  Mail,
  MapPin,
  Clock,
  Send,
  Copy,
  Check,
  MessageSquare,
  HelpCircle,
} from 'lucide-react';
import { Programme, Role } from '../../types';

interface FAQItem {
  id: string;
  category: 'Admissions & Cohorts' | 'Mentors & Grading' | 'AI Tech Profile';
  question: string;
  answer: string;
}

const TECHNEEDS_FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Admissions & Cohorts',
    question: 'How do IGDTUW students receive their Enrollment Number login credentials?',
    answer:
      'Once your cohort application is approved, your assigned mentor or the Admin Directorate provisions your student record inside TechNeeds. This generates a unique IGDTUW Enrollment Number and initial password slip, which you can use immediately on the Mentee Sign In portal.',
  },
  {
    id: 'faq-2',
    category: 'Admissions & Cohorts',
    question: 'Can students from IT, AI & DS, or ECE join Full-Stack & Systems cohorts?',
    answer:
      'Yes. TechNeeds cohorts are open across all IGDTUW B.Tech and M.Tech branches including CSE, IT, AI & DS, and ECE. Each track lists its prerequisite fundamentals on the curriculum modal so you can pick the cohort aligned with your current semester.',
  },
  {
    id: 'faq-3',
    category: 'Mentors & Grading',
    question: 'How are points and cohort leaderboard rankings calculated?',
    answer:
      'Leaderboard scores are 100% transparent: completing curated video modules awards +50 points, timed diagnostic quizzes score up to 100 points based on correct answers, and capstone project submissions are rubric-graded by mentors for up to 200 points alongside daily learning streak milestones.',
  },
  {
    id: 'faq-4',
    category: 'Mentors & Grading',
    question: 'Who can become a Mentor on TechNeeds IGDTUW?',
    answer:
      'IGDTUW alumnae, senior software engineers, researchers, and domain specialists from industry partners (such as Microsoft, Google, and Adobe) can apply to lead a cohort. Once onboarded by the Admin Directorate, mentors gain access to curriculum publishing, mentee onboarding, and code-review grading tools.',
  },
  {
    id: 'faq-5',
    category: 'AI Tech Profile',
    question: 'How does the Gemini AI Tech Profile work, and is it grounded in real work?',
    answer:
      'Your AI Technical Profile is synthesized server-side using Gemini 3.8 Flash from your verified cohort metrics—only your actual points, completed modules, quiz scores, graded project submissions, streak days, and interest tags are passed in. The system strictly prohibits fabricating unearned skills or scores.',
  },
  {
    id: 'faq-6',
    category: 'AI Tech Profile',
    question: 'Can mentees share or regenerate their AI Technical Profile as they complete more projects?',
    answer:
      'Yes! Whenever you complete a new diagnostic quiz, submit a capstone repository, or receive a mentor evaluation, clicking "Regenerate Analysis" on your AI Tech Profile synthesizes an updated technical identity, verified skill badges, and next-step engineering recommendations.',
  },
];

interface LandingPageProps {
  programmes: Programme[];
  onOpenLogin: (role?: Role, mode?: 'signin' | 'signup') => void;
  onExploreProgrammes: () => void;
  onViewProgrammeDetails: (prog: Programme) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  programmes,
  onOpenLogin,
  onExploreProgrammes,
  onViewProgrammeDetails,
}) => {
  const [faqCategory, setFaqCategory] = useState<'All' | FAQItem['category']>('All');
  const [openFaqId, setOpenFaqId] = useState<string>('faq-1');

  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    topic: 'Cohort Admissions',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState<{
    ticketId: string;
    name: string;
    topic: string;
  } | null>(null);
  const [contactError, setContactError] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const filteredFaqs =
    faqCategory === 'All'
      ? TECHNEEDS_FAQS
      : TECHNEEDS_FAQS.filter((item) => item.category === faqCategory);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('mentorship@techneeds.igdtuw.ac.in');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError(null);

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setContactError('Please fill in your name, email address, and message.');
      return;
    }

    const ticketId = `TN-${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      const existing = JSON.parse(localStorage.getItem('techneeds_contact_inquiries_v1') || '[]');
      existing.unshift({
        ticketId,
        ...contactForm,
        submittedAt: new Date().toISOString(),
      });
      localStorage.setItem('techneeds_contact_inquiries_v1', JSON.stringify(existing));
    } catch {
      // Ignore localStorage quota issues
    }

    setContactSubmitted({
      ticketId,
      name: contactForm.name.trim(),
      topic: contactForm.topic,
    });
    setContactForm({
      name: '',
      email: '',
      topic: 'Cohort Admissions',
      message: '',
    });
  };

  return (
    <div className="w-full min-h-screen text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden">
        {/* Ambient radial glow backdrops */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-violet-600/15 via-indigo-600/15 to-cyan-500/15 blur-[120px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800/50 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                <span>IGDTUW Reimagathon 2026 · Technical Mentorship Ecosystem</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] text-balance">
                Learn. Build. Grow. <span className="bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Together.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                TechNeeds is the next-generation mentorship and engineering management platform engineered exclusively for the women in technology at IGDTUW. Bridging top industry leaders, structured cohort curricula, hands-on production code reviews, and Gemini-powered technical profiling.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onOpenLogin('mentee', 'signup')}
                  className="px-6 py-3.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-sm rounded-xl shadow-xl shadow-indigo-600/25 transition-all flex items-center gap-2 group"
                >
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => onOpenLogin('mentee', 'signin')}
                  className="px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-sm rounded-xl border border-slate-700/80 transition-all flex items-center gap-2"
                >
                  <span>Sign In</span>
                </button>

                <a
                  href="#programmes"
                  className="text-xs font-medium text-slate-300 hover:text-cyan-300 underline underline-offset-4 transition-colors ml-1"
                >
                  Explore Programmes →
                </a>
              </div>

              {/* Proof strip */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>3-Tier RBAC (Admin · Mentor · Mentee)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Interactive Quizzes & GitHub Grading</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" />
                  <span>Gemini 3.8 Flash AI Profiles</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-[#0F172A] group">
                <img
                  src="/src/assets/images/techneeds_hero_mentorship_1794399539388.jpg"
                  alt="TechNeeds IGDTUW Mentorship Collaboration Scene"
                  referrerPolicy="no-referrer"
                  className="w-full h-[380px] sm:h-[440px] object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/40 to-transparent" />

                {/* Floating Metric Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#0F172A]/90 backdrop-blur-md border border-slate-700/90 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-violet-400">
                        Active Spring 2026 Cohorts
                      </div>
                      <div className="text-sm font-bold text-white mt-0.5">
                        Full-Stack & Cloud Systems Engineering
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-mono font-bold text-cyan-400 tabular-nums">98%</span>
                      <div className="text-[10px] text-slate-400">Internship Uplift</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 border-y border-slate-800/80 bg-[#0E1526]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                500+
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">Engineers Mentored</div>
              <p className="text-xs text-slate-400 mt-0.5">IGDTUW students across CSE, IT, AI & ECE</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                18
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">Specialized Cohorts</div>
              <p className="text-xs text-slate-400 mt-0.5">Cloud, Distributed Systems, ML & Web3</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                420+
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">Production Projects</div>
              <p className="text-xs text-slate-400 mt-0.5">Live deployed apps with peer code reviews</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono tabular-nums bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
                98%
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200 mt-1">Placement Uplift</div>
              <p className="text-xs text-slate-400 mt-0.5">At Google, Microsoft, Adobe, and top startups</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-violet-400 mb-2">
              Engineered For Excellence
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance">
              Everything needed to transform student engineers into industry leaders
            </h3>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              Replacing fragmented chat groups and lost spreadsheets with an enterprise-grade mentorship platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-violet-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">1:1 & Cohort Mentorship</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connect directly with IGDTUW alumnae and senior architects at Microsoft, Google, and Adobe who guide technical growth through weekly cadences.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-cyan-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Structured Resources</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-yield video modules, timed diagnostic quizzes with instant scoring, and detailed architecture project briefs published directly by mentors.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-indigo-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">Production Assignments</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Submit GitHub repositories and live deployments. Receive granular rubric scores and personalized code feedback from industry mentors.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-emerald-500/50 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-white mb-2">AI-Powered Profiles</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini 3.8 Flash synthesizes verified project submissions, quiz performance, and streaks into custom technical identities, skill badges, and next steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#0C111E] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
              The Architecture
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              How TechNeeds Works: Admin → Mentor → Mentee
            </h3>
            <p className="text-slate-400 text-sm sm:text-base mt-3">
              A synchronized workflow ensuring transparent accountability, quality control, and accelerated skill acquisition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 relative">
              <div className="text-xs font-mono font-bold text-violet-400 mb-3">01. ADMIN GOVERNANCE</div>
              <h4 className="text-xl font-bold text-white mb-2">Curate & Allocate</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Administrators design cohorts, monitor overall university-wide metrics, approve mentorship tracks, and provision secure credentials for vetted industry mentors.
              </p>
              <div className="text-[11px] text-slate-500 space-y-1">
                <div>· Programme lifecycle management</div>
                <div>· Mentor-to-cohort allocation</div>
                <div>· University performance auditing</div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 relative">
              <div className="text-xs font-mono font-bold text-cyan-400 mb-3">02. MENTOR WORKSPACE</div>
              <h4 className="text-xl font-bold text-white mb-2">Publish & Evaluate</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Mentors onboard mentees with auto-generated Enrollment Numbers, publish video modules, configure diagnostic quizzes, and review submitted project code.
              </p>
              <div className="text-[11px] text-slate-500 space-y-1">
                <div>· Resource authoring (Video/Quiz/Project)</div>
                <div>· Code review & score assignment</div>
                <div>· Qualitative mentor feedback</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 relative">
              <div className="text-xs font-mono font-bold text-emerald-400 mb-3">03. MENTEE LEARNING</div>
              <h4 className="text-xl font-bold text-white mb-2">Learn, Build & Shine</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Students access curated curriculum, complete timed diagnostic quizzes, submit GitHub repositories, climb cohort leaderboards, and generate AI technical profiles.
              </p>
              <div className="text-[11px] text-slate-500 space-y-1">
                <div>· Timed quiz attempts & instant scores</div>
                <div>· Project submission tracking</div>
                <div>· Gamified badges & Gemini technical persona</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Programmes Section */}
      <section id="programmes" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-violet-400 mb-2">
                Active Cohorts
              </h2>
              <h3 className="text-3xl font-bold text-white tracking-tight">
                Explore TechNeeds Mentorship Tracks
              </h3>
            </div>
            <div className="text-xs text-slate-400">
              Curated by department deans and senior engineering leads
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {programmes.map((prog) => (
              <div
                key={prog.id}
                className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-violet-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="font-mono text-cyan-400 font-semibold">{prog.code}</span>
                    <span className="capitalize text-emerald-400">{prog.status}</span>
                  </div>

                  <h4 className="text-lg font-bold text-white mb-2">{prog.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                    {prog.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {prog.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="text-slate-400">
                    <span className="text-white font-mono font-semibold tabular-nums">{prog.menteeCount}</span> / {prog.maxMentees} Mentees
                  </div>
                  <button
                    onClick={() => onViewProgrammeDetails(prog)}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>View Curriculum</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-[#0C111E] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
              Community Voices
            </h2>
            <h3 className="text-3xl font-bold text-white tracking-tight">
              Trusted by IGDTUW Engineers & Alumnae
            </h3>
            <p className="text-slate-400 text-xs mt-2">
              Sample testimonials reflecting actual student transformations and mentor feedback
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800">
              <p className="text-xs text-slate-300 leading-relaxed italic mb-4">
                "Having Priya as my TechNeeds mentor transformed my understanding of distributed systems. Her feedback on my WebSocket whiteboard project directly helped me clear my Microsoft internship technical rounds!"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="/src/assets/images/avatar_student_ananya_1794399540199.jpg"
                  alt="Ananya Verma"
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <div className="text-sm font-semibold text-white">Ananya Verma</div>
                  <div className="text-[11px] text-slate-400">B.Tech CSE '26 · IGDTUW</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800">
              <p className="text-xs text-slate-300 leading-relaxed italic mb-4">
                "As an alumna, TechNeeds gives me a streamlined interface to mentor 28 students without getting bogged down in administrative overhead. The code grading rubric and diagnostic quiz builder are world-class."
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="/src/assets/images/avatar_mentor_priya_1794399541203.jpg"
                  alt="Priya Sharma"
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <div className="text-sm font-semibold text-white">Priya Sharma</div>
                  <div className="text-[11px] text-slate-400">Senior SWE @ Microsoft · IGDTUW Alumna</div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800">
              <p className="text-xs text-slate-300 leading-relaxed italic mb-4">
                "The AI-generated technical profile was a game changer for my resume. Gemini summarized my actual project submissions and quiz scores into an articulate technical persona that recruiters loved."
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80"
                  alt="Sneha Gupta"
                  className="w-10 h-10 rounded-full object-cover border border-slate-700"
                />
                <div>
                  <div className="text-sm font-semibold text-white">Sneha Gupta</div>
                  <div className="text-[11px] text-slate-400">B.Tech IT '26 · IGDTUW</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-20 border-t border-slate-800/80 scroll-mt-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-violet-400 mb-2">
              Frequently Asked Questions
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight text-balance">
              Answers for IGDTUW Mentees, Mentors & Coordinators
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-3">
              Everything you need to know about onboarding, scoring transparency, and Gemini-powered technical profiles.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl w-fit mx-auto mb-8">
            {(['All', 'Admissions & Cohorts', 'Mentors & Grading', 'AI Tech Profile'] as const).map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setFaqCategory(cat);
                    const nextList =
                      cat === 'All'
                        ? TECHNEEDS_FAQS
                        : TECHNEEDS_FAQS.filter((item) => item.category === cat);
                    if (nextList.length > 0 && !nextList.some((item) => item.id === openFaqId)) {
                      setOpenFaqId(nextList[0].id);
                    }
                  }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                    faqCategory === cat
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className={`rounded-2xl border transition-colors ${
                    isOpen
                      ? 'bg-[#121A30] border-violet-500/40'
                      : 'bg-[#0F172A] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <div className="space-y-1">
                      <span className="text-[11px] font-medium text-cyan-400 block">
                        {faq.category}
                      </span>
                      <span className="text-sm sm:text-base font-semibold text-white block">
                        {faq.question}
                      </span>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-cyan-400' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/70">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#0C111E] border-t border-slate-800/80 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Column: Contact Info & Campus Details */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
                  Contact & Support
                </h2>
                <h3 className="text-3xl font-bold text-white tracking-tight text-balance">
                  Get in touch with the TechNeeds Directorate
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mt-3">
                  Have questions about joining an upcoming engineering cohort, mentoring IGDTUW students, or setting up a department track? Reach out directly to our team.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-white">Official Mentorship Desk</div>
                    <div className="text-xs text-cyan-400 font-mono truncate mt-0.5">
                      mentorship@techneeds.igdtuw.ac.in
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-300 hover:text-white transition-colors"
                    >
                      {copiedEmail ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Email copied to clipboard</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copy email address</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-cyan-600/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Campus Innovation Hub</div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      Indira Gandhi Delhi Technical University for Women (IGDTUW), Madrasa Road, Opposite St. James Church, Kashmere Gate, New Delhi 110006
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-800 flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Coordinator & Mentor Office Hours</div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Monday – Friday · 10:00 AM – 5:30 PM IST (Response within 24 hours)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Inquiry Form */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#0F172A] border border-slate-800 shadow-xl">
              {contactSubmitted ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-mono font-semibold text-cyan-400">
                      Ticket Reference: {contactSubmitted.ticketId}
                    </div>
                    <h4 className="text-xl font-bold text-white">
                      Message Received, {contactSubmitted.name}!
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                      Your inquiry regarding <span className="text-slate-200 font-medium">{contactSubmitted.topic}</span> has been logged with the TechNeeds IGDTUW coordination desk.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setContactSubmitted(null)}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-colors"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div className="mb-2">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-violet-400" />
                      <span>Send us a Message</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Students, prospective mentors, and faculty coordinators can message us directly here.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-slate-300 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="e.g. Meera Krishnan"
                        className="w-full py-2.5 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-300 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        placeholder="e.g. meera@igdtuw.ac.in"
                        className="w-full py-2.5 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1.5">Inquiry Topic</label>
                    <select
                      value={contactForm.topic}
                      onChange={(e) => setContactForm({ ...contactForm, topic: e.target.value })}
                      className="w-full py-2.5 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-violet-500"
                    >
                      <option value="Cohort Admissions">Cohort Admissions & Enrollment</option>
                      <option value="Become a Mentor">Apply to Become an Industry Mentor</option>
                      <option value="Technical Support">Account & Platform Support</option>
                      <option value="Industry Partnership">University / Industry Partnership</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1.5">Message *</label>
                    <textarea
                      rows={4}
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      placeholder="Tell us about your cohort interest, background, or question..."
                      className="w-full py-2.5 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>

                  {contactError && (
                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                      {contactError}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between gap-4">
                    <span className="text-[11px] text-slate-500">
                      Or sign up directly using the top bar to explore a demo role.
                    </span>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800 bg-[#0A0D16] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Code2 className="w-5 h-5 text-cyan-400" />
              <span className="text-sm font-bold text-white">TechNeeds IGDTUW</span>
              <span className="text-slate-500">· Reimagining Technical Mentorship</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-5">
              <a href="#programmes" className="hover:text-white transition-colors">
                Programmes
              </a>
              <a href="#faqs" className="hover:text-white transition-colors">
                FAQs
              </a>
              <a href="#contact" className="hover:text-white transition-colors">
                Contact
              </a>
              <button onClick={() => onOpenLogin('mentee')} className="hover:text-white transition-colors">
                Mentee Login
              </button>
              <button onClick={() => onOpenLogin('mentor')} className="hover:text-white transition-colors">
                Mentor Login
              </button>
              <button onClick={() => onOpenLogin('admin')} className="hover:text-white transition-colors">
                Admin Console
              </button>
            </div>

            <div className="text-slate-500">
              © 2026 Indira Gandhi Delhi Technical University for Women (IGDTUW)
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

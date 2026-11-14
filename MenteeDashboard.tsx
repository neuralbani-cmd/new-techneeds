import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Award,
  Video,
  FileQuestion,
  Code2,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Play,
  Check,
  Send,
  X,
  Trophy,
  Flame,
  Calendar,
  AlertCircle,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  User,
  Programme,
  LearningResource,
  Submission,
  QuizResource,
  ProjectResource,
} from '../../types';
import { store } from '../../services/store';

interface MenteeDashboardProps {
  currentUser: User;
  onOpenAIProfile: (userId: string) => void;
}

export const MenteeDashboard: React.FC<MenteeDashboardProps> = ({
  currentUser,
  onOpenAIProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'learning' | 'assignments' | 'progress' | 'leaderboard'>('learning');
  const [learningFilter, setLearningFilter] = useState<'all' | 'video' | 'quiz' | 'project'>('all');

  // Modals
  const [watchingVideo, setWatchingVideo] = useState<LearningResource | null>(null);
  const [takingQuiz, setTakingQuiz] = useState<QuizResource | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmittedResult, setQuizSubmittedResult] = useState<{ score: number; maxMarks: number } | null>(null);

  const [submittingProject, setSubmittingProject] = useState<ProjectResource | null>(null);
  const [projectGithub, setProjectGithub] = useState('');
  const [projectDemo, setProjectDemo] = useState('');
  const [projectNotes, setProjectNotes] = useState('');

  const [viewingFeedback, setViewingFeedback] = useState<Submission | null>(null);
  const [selectedLeaderboardProg, setSelectedLeaderboardProg] = useState<string>('all');
  const [showScoringRulesModal, setShowScoringRulesModal] = useState(false);

  // Data fetching
  const programmes = store.getProgrammes();
  const currentProgramme =
    programmes.find((p) => currentUser.assignedProgrammes.includes(p.id)) || programmes[0];

  const resources = store.getResources(currentProgramme?.id);
  const submissions = store.getSubmissions({ menteeId: currentUser.id });
  const progress = store.getMenteeProgress(currentUser.id);
  const leaderboard = store.getLeaderboard(
    selectedLeaderboardProg === 'all' ? undefined : selectedLeaderboardProg
  );

  // Derived metrics
  const completedResourcesCount = progress.completedResourceIds.length;
  const pendingAssignmentsCount = resources.filter(
    (r) =>
      r.type === 'project' &&
      !submissions.some((s) => s.resourceId === r.id && s.status === 'graded')
  ).length;

  const filteredResources = resources.filter((r) => {
    if (learningFilter === 'all') return true;
    return r.type === learningFilter;
  });

  // Handlers
  const handleMarkVideoComplete = (resId: string) => {
    store.markVideoCompleted(currentUser.id, resId);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
  };

  const handleStartQuiz = (quiz: QuizResource) => {
    setTakingQuiz(quiz);
    setQuizAnswers({});
    setQuizSubmittedResult(null);
  };

  const handleSubmitQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!takingQuiz) return;

    const sub = store.submitQuiz({
      menteeId: currentUser.id,
      resourceId: takingQuiz.id,
      answers: quizAnswers,
    });

    setQuizSubmittedResult({ score: sub.score || 0, maxMarks: sub.maxMarks });
    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
  };

  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingProject || !projectGithub) return;

    store.submitProject({
      menteeId: currentUser.id,
      resourceId: submittingProject.id,
      githubUrl: projectGithub,
      liveDemoUrl: projectDemo,
      notes: projectNotes,
    });

    setSubmittingProject(null);
    setProjectGithub('');
    setProjectDemo('');
    setProjectNotes('');
    confetti({ particleCount: 90, spread: 90, origin: { y: 0.6 } });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Personalized Greeting & Profile Header */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#11192E] via-[#151D36] to-[#1C1635] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute right-0 top-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-violet-500/50 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 p-1 bg-amber-500 text-slate-950 rounded-lg shadow font-mono text-[10px] font-bold flex items-center gap-0.5">
              <Trophy className="w-3 h-3" />
              <span>#{progress.rank}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded">
                IGDTUW Batch 2026
              </span>
              <span className="text-xs font-mono text-violet-300">
                Enrollment: {currentUser.enrollmentNo || '04201012023'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {currentUser.name}!
            </h1>

            <p className="text-xs sm:text-sm text-slate-300">
              Enrolled in <span className="font-semibold text-white">{currentProgramme?.title}</span>
            </p>
          </div>
        </div>

        {/* AI Profile CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAIProfile(currentUser.id)}
            className="px-5 py-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-xs rounded-xl shadow-lg shadow-violet-600/25 transition-all flex items-center gap-2 group"
          >
            <Sparkles className="w-4 h-4 text-cyan-200 group-hover:rotate-12 transition-transform" />
            <span>Generate AI Tech Profile</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Points */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>Total Points</span>
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {progress.totalPoints}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="text-cyan-400 font-semibold">+150</span> this week
          </div>
        </div>

        {/* Leaderboard Standing */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>Cohort Rank</span>
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            #{progress.rank}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Top tier in cohort</div>
        </div>

        {/* Learning Streak */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>Active Streak</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
            {progress.streakDays} Days
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Consistency multiplier 1.2x</div>
        </div>

        {/* Completed Modules */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>Completed Modules</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {completedResourcesCount} / {resources.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {Math.round((completedResourcesCount / Math.max(1, resources.length)) * 100)}% of cohort syllabus
          </div>
        </div>

        {/* Pending Assignments */}
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1.5">
            <span>Pending Reviews</span>
            <Clock className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-violet-400 tabular-nums">
            {pendingAssignmentsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Upcoming deadlines</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('learning')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'learning'
                ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>My Learning ({resources.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'assignments'
                ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>My Assignments ({submissions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'progress'
                ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>My Progress & Badges</span>
          </button>

          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'leaderboard'
                ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Leaderboard</span>
          </button>
        </div>

        {activeTab === 'leaderboard' && (
          <button
            onClick={() => setShowScoringRulesModal(true)}
            className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Scoring Rules</span>
          </button>
        )}
      </div>

      {/* TAB 1: My Learning */}
      {activeTab === 'learning' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Filter modules:</span>
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
              {(['all', 'video', 'quiz', 'project'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setLearningFilter(type)}
                  className={`px-3 py-1 rounded capitalize font-medium transition-colors ${
                    learningFilter === type
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {type === 'all' ? 'All Formats' : type}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => {
              const isCompleted = progress.completedResourceIds.includes(res.id);
              const submission = submissions.find((s) => s.resourceId === res.id);

              return (
                <div
                  key={res.id}
                  className={`p-6 rounded-2xl bg-[#0F172A] border transition-all flex flex-col justify-between ${
                    isCompleted
                      ? 'border-emerald-500/40 bg-emerald-950/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span
                        className={`font-semibold capitalize px-2 py-0.5 rounded text-[11px] ${
                          res.type === 'video'
                            ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/50'
                            : res.type === 'quiz'
                            ? 'bg-violet-950/80 text-violet-400 border border-violet-800/50'
                            : 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                        }`}
                      >
                        {res.type}
                      </span>

                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-emerald-400 text-[11px] font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px] font-mono tabular-nums">
                          {res.maxMarks} pts max
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white mb-1.5">{res.title}</h3>
                    <div className="text-[11px] text-slate-400 font-medium mb-3">
                      Topic: <span className="text-slate-200">{res.topic}</span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                      {res.description}
                    </p>

                    {res.type === 'video' && (
                      <div className="text-[11px] text-cyan-400 flex items-center gap-1.5 mb-2 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{res.durationMinutes} min lecture · Priya Sharma</span>
                      </div>
                    )}

                    {res.type === 'quiz' && (
                      <div className="text-[11px] text-violet-400 flex items-center gap-1.5 mb-2 font-mono">
                        <FileQuestion className="w-3.5 h-3.5" />
                        <span>{res.questions.length} Diagnostic Questions · Timed</span>
                      </div>
                    )}

                    {res.type === 'project' && (
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 mb-2 font-mono">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Production Capstone · Rubric Graded</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs mt-4">
                    <span className="text-[11px] text-slate-500">
                      {res.deadline ? `Due: ${res.deadline}` : 'Self-paced'}
                    </span>

                    {/* Action button based on type */}
                    {res.type === 'video' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setWatchingVideo(res)}
                          className="px-3 py-1.5 bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/40 rounded-lg font-semibold flex items-center gap-1 transition-colors"
                        >
                          <Play className="w-3.5 h-3.5" />
                          <span>Watch</span>
                        </button>
                        {!isCompleted && (
                          <button
                            onClick={() => handleMarkVideoComplete(res.id)}
                            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors"
                            title="Mark as completed"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}

                    {res.type === 'quiz' && (
                      <button
                        onClick={() => handleStartQuiz(res)}
                        className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                          isCompleted
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            : 'bg-violet-600 hover:bg-violet-500 text-white shadow-md'
                        }`}
                      >
                        <FileQuestion className="w-3.5 h-3.5" />
                        <span>{isCompleted ? 'Re-attempt Quiz' : 'Take Quiz'}</span>
                      </button>
                    )}

                    {res.type === 'project' && (
                      <button
                        onClick={() => setSubmittingProject(res)}
                        className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                          submission
                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{submission ? 'Update Submission' : 'Submit Project'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: My Assignments */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="rounded-2xl bg-[#0F172A] border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#131B2E] border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Assignment Title</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Submission Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Marks Awarded</th>
                    <th className="py-3.5 px-4 text-right">Mentor Feedback</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-500">
                        No assignments submitted yet. Explore the "My Learning" tab to submit your first project!
                      </td>
                    </tr>
                  ) : (
                    submissions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{sub.resourceTitle}</div>
                          {sub.projectLinks?.githubUrl && (
                            <a
                              href={sub.projectLinks.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-mono mt-0.5"
                            >
                              <span className="truncate max-w-[200px]">
                                {sub.projectLinks.githubUrl}
                              </span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="capitalize font-semibold text-slate-300">
                            {sub.resourceType}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-400">
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`font-semibold capitalize px-2 py-0.5 rounded text-[11px] ${
                              sub.status === 'graded'
                                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/50'
                                : 'bg-amber-950/80 text-amber-400 border border-amber-800/50'
                            }`}
                          >
                            {sub.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold tabular-nums">
                          {sub.score !== undefined ? (
                            <span className="text-white">
                              {sub.score} / {sub.maxMarks}
                            </span>
                          ) : (
                            <span className="text-slate-500 italic">Pending Review</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {sub.mentorFeedback ? (
                            <button
                              onClick={() => setViewingFeedback(sub)}
                              className="px-3 py-1 bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 border border-violet-500/40 rounded-lg text-xs font-semibold transition-colors"
                            >
                              Read Feedback
                            </button>
                          ) : (
                            <span className="text-slate-500 text-[11px] italic">In grading queue</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: My Progress & Badges */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Learning Streak Tracker */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Sprint Consistency
                </span>
                <Flame className="w-5 h-5 text-rose-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                {progress.streakDays} Days
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                You're in the top 5% of continuous daily code commits and quiz activity in IGDTUW!
              </p>
              {/* Daily dots */}
              <div className="flex items-center gap-1.5 pt-2">
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-6 flex-1 rounded-sm ${
                      i < progress.streakDays
                        ? 'bg-rose-500'
                        : 'bg-slate-800'
                    }`}
                    title={`Day ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Syllabus Velocity */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Cohort Syllabus Velocity
                </span>
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                {Math.round((completedResourcesCount / Math.max(1, resources.length)) * 100)}%
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {completedResourcesCount} of {resources.length} required curriculum modules cleared.
              </p>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full"
                  style={{
                    width: `${Math.round(
                      (completedResourcesCount / Math.max(1, resources.length)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Acquired Skills */}
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Verified Skills
                </span>
                <Code2 className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(currentUser.interestTags || [
                  'Distributed Systems',
                  'TypeScript',
                  'Node.js',
                  'Redis',
                  'Docker',
                  'WebSockets',
                ]).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Achievement Badges Showcase */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <span>Unlocked Milestones & Badges</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Badges earned through verified project submissions, quiz retention, and cohort streaks.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {progress.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800/90 flex items-start gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{badge.name}</h4>
                    <div className="text-[10px] text-cyan-400 font-medium mb-1">{badge.category}</div>
                    <p className="text-[11px] text-slate-400 leading-snug">{badge.description}</p>
                    {badge.unlockedAt && (
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                        Unlocked {badge.unlockedAt}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Dynamic Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              Transparent, points-based ranking updated live with quiz marks, project submissions, and consistency streaks.
            </p>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Programme:</span>
              <select
                value={selectedLeaderboardProg}
                onChange={(e) => setSelectedLeaderboardProg(e.target.value)}
                className="py-1.5 px-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-violet-500"
              >
                <option value="all">All Programmes</option>
                {programmes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0F172A] border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#131B2E] border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Rank</th>
                    <th className="py-3.5 px-4">Student Engineer</th>
                    <th className="py-3.5 px-4">Enrollment No</th>
                    <th className="py-3.5 px-4">Department</th>
                    <th className="py-3.5 px-4">Streak</th>
                    <th className="py-3.5 px-4">Badges</th>
                    <th className="py-3.5 px-4 text-right">Total Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {leaderboard.map((item) => {
                    const isMe = item.user.id === currentUser.id;
                    return (
                      <tr
                        key={item.user.id}
                        className={`transition-colors ${
                          isMe
                            ? 'bg-violet-950/40 border-l-2 border-l-cyan-400 text-white font-medium'
                            : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold">
                          <span
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs ${
                              item.rank === 1
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : item.rank === 2
                                ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                                : item.rank === 3
                                ? 'bg-amber-700/20 text-amber-400 border border-amber-700/40'
                                : 'text-slate-400'
                            }`}
                          >
                            {item.rank}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={item.user.avatar}
                              alt={item.user.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <div className="font-semibold text-white flex items-center gap-1.5">
                                <span>{item.user.name}</span>
                                {isMe && (
                                  <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-1.5 py-0.2 rounded font-sans">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-slate-400">{item.user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-violet-400">
                          {item.user.enrollmentNo || '04201012023'}
                        </td>
                        <td className="py-3.5 px-4">
                          <div>{item.user.branch}</div>
                          <div className="text-[11px] text-slate-400">{item.user.year}</div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-rose-400 tabular-nums">
                          {item.streak} days
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums">
                          {item.badgesCount} badges
                        </td>
                        <td className="py-3.5 px-4 font-mono font-extrabold text-right text-base text-cyan-400 tabular-nums">
                          {item.points} pts
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* WATCH VIDEO MODAL */}
      {watchingVideo && watchingVideo.type === 'video' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
            <button
              onClick={() => setWatchingVideo(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">{watchingVideo.title}</h3>
            <p className="text-xs text-slate-400 mb-4">{watchingVideo.topic} · By {watchingVideo.creatorName}</p>

            {/* Video Player */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black mb-4 border border-slate-800">
              <iframe
                src={`https://www.youtube.com/embed/${watchingVideo.videoUrl.split('v=')[1] || 'G1rOthIU-uo'}`}
                title={watchingVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">{watchingVideo.description}</p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-xs text-slate-400">Lecture Duration: {watchingVideo.durationMinutes} mins</span>
              <button
                onClick={() => {
                  handleMarkVideoComplete(watchingVideo.id);
                  setWatchingVideo(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Mark Module Completed (+50 pts)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAKE QUIZ MODAL */}
      {takingQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setTakingQuiz(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold text-white">{takingQuiz.title}</h3>
              <span className="text-xs font-mono font-bold text-violet-400">
                Max {takingQuiz.maxMarks} Marks
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-6">{takingQuiz.description}</p>

            {quizSubmittedResult ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-white">Quiz Evaluated!</h4>
                <div className="text-3xl font-mono font-extrabold text-cyan-400 tabular-nums">
                  {quizSubmittedResult.score} / {quizSubmittedResult.maxMarks} pts
                </div>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Your answers have been graded and leaderboard points have been updated immediately!
                </p>
                <button
                  onClick={() => setTakingQuiz(null)}
                  className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-xs shadow-md transition-all"
                >
                  Return to Learning Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitQuiz} className="space-y-6 text-xs">
                {takingQuiz.questions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3">
                    <div className="font-semibold text-white">
                      <span className="text-violet-400 font-mono mr-1.5">Q{idx + 1}.</span>
                      {q.question}
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, optIdx) => (
                        <label
                          key={optIdx}
                          className={`flex items-center gap-3 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                            quizAnswers[q.id] === optIdx
                              ? 'bg-violet-600/20 border-violet-500 text-white'
                              : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`quiz_q_${q.id}`}
                            checked={quizAnswers[q.id] === optIdx}
                            onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: optIdx })}
                            className="accent-violet-500"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setTakingQuiz(null)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Diagnostic Quiz</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* SUBMIT PROJECT MODAL */}
      {submittingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSubmittingProject(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Submit Project Assignment</h3>
            <p className="text-xs text-slate-400 mb-5">{submittingProject.title}</p>

            <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 text-xs text-slate-300 mb-5 space-y-2">
              <div className="font-semibold text-white">Problem Statement Brief:</div>
              <p className="text-slate-400">{submittingProject.problemStatement}</p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-cyan-400">
                Instructions: {submittingProject.submissionInstructions}
              </div>
            </div>

            <form onSubmit={handleSubmitProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Public GitHub Repository URL *
                </label>
                <input
                  type="url"
                  required
                  value={projectGithub}
                  onChange={(e) => setProjectGithub(e.target.value)}
                  placeholder="https://github.com/username/project-repo"
                  className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Live Deployment URL (Vercel / Render / Cloud Run)
                </label>
                <input
                  type="url"
                  value={projectDemo}
                  onChange={(e) => setProjectDemo(e.target.value)}
                  placeholder="https://my-project.vercel.app"
                  className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Implementation Notes & Architectural Highlights
                </label>
                <textarea
                  rows={3}
                  value={projectNotes}
                  onChange={(e) => setProjectNotes(e.target.value)}
                  placeholder="Mention test coverage, caching strategies, or challenges resolved..."
                  className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSubmittingProject(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Code for Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MENTOR FEEDBACK MODAL */}
      {viewingFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setViewingFeedback(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Mentor Evaluation & Feedback</h3>
            <p className="text-xs text-slate-400 mb-5">{viewingFeedback.resourceTitle}</p>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-3 text-xs mb-5">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Score Awarded:</span>
                <span className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
                  {viewingFeedback.score} / {viewingFeedback.maxMarks} marks
                </span>
              </div>
              <div className="pt-3 border-t border-slate-800/80">
                <span className="font-semibold text-white block mb-1">Mentor Review:</span>
                <p className="text-slate-300 leading-relaxed italic">
                  "{viewingFeedback.mentorFeedback}"
                </p>
              </div>
            </div>

            <button
              onClick={() => setViewingFeedback(null)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* SCORING RULES MODAL */}
      {showScoringRulesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setShowScoringRulesModal(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Transparent Scoring Rules</span>
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              How points and cohort leaderboards are computed in TechNeeds.
            </p>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="font-semibold text-cyan-400 mb-0.5">Capstone Projects: Up to 200 pts</div>
                <p className="text-slate-400">Awarded based on mentor code review, rubric completeness, and clean architecture.</p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="font-semibold text-violet-400 mb-0.5">Diagnostic Quizzes: Up to 100 pts</div>
                <p className="text-slate-400">Directly calculated from correct options in timed conceptual quizzes.</p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="font-semibold text-emerald-400 mb-0.5">Video Lectures: +50 pts</div>
                <p className="text-slate-400">Awarded upon completing and checking off curated lecture modules.</p>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                <div className="font-semibold text-rose-400 mb-0.5">Streak Velocity Multiplier</div>
                <p className="text-slate-400">Active consecutive daily sprints unlock bonus badges and high placement standing.</p>
              </div>
            </div>

            <button
              onClick={() => setShowScoringRulesModal(false)}
              className="w-full mt-6 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowLeft,
  RotateCw,
  Award,
  Zap,
  TrendingUp,
  Cpu,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Calendar,
  Layers,
  ShieldCheck,
  Trophy,
  Flame,
  User as UserIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, AIProfileData } from '../../types';
import { store } from '../../services/store';
import { fetchAIProfileInsights } from '../../services/geminiService';

interface AIProfileViewProps {
  userId: string;
  onBack: () => void;
}

export const AIProfileView: React.FC<AIProfileViewProps> = ({ userId, onBack }) => {
  const user = store.getUserById(userId) || store.getCurrentUser();
  const progress = store.getMenteeProgress(userId);
  const submissions = store.getSubmissions({ menteeId: userId });
  const programmes = store.getProgrammes();
  const programme =
    programmes.find((p) => user?.assignedProgrammes.includes(p.id)) || programmes[0];
  const resources = store.getResources(programme?.id);

  const [aiData, setAiData] = useState<AIProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInsights = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAIProfileInsights(
        user,
        progress,
        submissions,
        resources,
        programme?.title || 'TechNeeds Engineering Cohort'
      );
      setAiData(data);
      confetti({ particleCount: 35, spread: 70, origin: { y: 0.7 } });
    } catch (err: any) {
      setError(err?.message || 'Failed to synthesize AI profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInsights();
  }, [userId]);

  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workspace</span>
        </button>

        {/* Engine status indicator */}
        <div className="flex items-center gap-2">
          {aiData && (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border bg-slate-900 border-slate-800">
              <span className={`w-2 h-2 rounded-full ${aiData.isDemo ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <span className="text-slate-400 text-[11px]">Powered by:</span>
              <span className="text-cyan-400 font-semibold">{aiData.model}</span>
              {aiData.isDemo && (
                <span className="text-[10px] text-amber-300 bg-amber-950/80 px-1 rounded ml-1 font-sans">
                  Demo Synthesis
                </span>
              )}
            </div>
          )}

          <button
            onClick={loadInsights}
            disabled={loading}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 text-violet-400 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Synthesizing...' : 'Regenerate Analysis'}</span>
          </button>
        </div>
      </div>

      {/* Hero Profile Showcase Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#141C34] to-[#0E1527] border border-slate-700/80 p-6 sm:p-10 shadow-2xl overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-[500px] h-[350px] bg-gradient-to-bl from-violet-600/20 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Avatar and Primary Identity */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Visual Avatar with technical badge frame */}
            <div className="relative group">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl p-1 bg-gradient-to-tr from-violet-500 via-cyan-400 to-indigo-600 shadow-xl shadow-indigo-600/20">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full rounded-[22px] object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-lg bg-slate-950 border border-violet-500/60 text-[10px] font-mono font-bold text-cyan-300 shadow">
                RANK #{progress.rank}
              </div>
            </div>

            <div className="space-y-1.5 max-w-xl">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-xs font-semibold text-violet-400 bg-violet-950/80 border border-violet-800/60 px-2.5 py-0.5 rounded-full">
                  Verified IGDTUW Technical Identity
                </span>
                {user.enrollmentNo && (
                  <span className="text-xs font-mono text-slate-400">
                    ID: {user.enrollmentNo}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                {user.name}
              </h1>

              <p className="text-xs sm:text-sm text-cyan-300 font-medium">
                {user.branch} · {user.year}
              </p>

              {/* AI Synthesized Technical Persona */}
              {aiData ? (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 font-sans italic border-l-2 border-violet-500 pl-3">
                  "{aiData.technicalIdentity}"
                </p>
              ) : (
                <div className="h-12 flex items-center text-xs text-slate-500 italic">
                  Synthesizing persona through Gemini 3.8 Flash...
                </div>
              )}
            </div>
          </div>

          {/* Key Metric Pillars */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0 text-center">
            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Cohort Points</div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-400 mt-0.5 tabular-nums">
                {progress.totalPoints}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Learning Streak</div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-rose-400 mt-0.5 tabular-nums">
                {progress.streakDays} Days
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Modules Cleared</div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-emerald-400 mt-0.5 tabular-nums">
                {progress.completedResourceIds.length}
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] uppercase font-semibold text-slate-400">Cohort Standing</div>
              <div className="text-xl sm:text-2xl font-mono font-bold text-amber-400 mt-0.5 tabular-nums">
                Top {Math.max(1, progress.rank)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Performance Summary & Verified Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: AI Performance Summary & Skill Badges */}
        <div className="lg:col-span-7 space-y-8">
          {/* AI Performance Summary */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-400" />
                <span>AI Performance & Growth Analysis</span>
              </h2>
              <span className="text-[11px] text-slate-500 font-mono">
                Updated: {aiData?.generatedAt || 'Just now'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {aiData?.performanceSummary || (
                <span className="text-slate-500">
                  Synthesizing quantitative submissions and diagnostic quiz scores...
                </span>
              )}
            </p>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Audited against IGDTUW Technical Mentorship Rubric</span>
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Verified Data</span>
              </span>
            </div>
          </div>

          {/* AI Skill Badges */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>Synthesized Skill Badges</span>
              </h2>
              <span className="text-xs text-slate-400">Rigorously earned through code</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {aiData?.skillBadges.map((badge, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{badge.title}</span>
                    <span className="text-[10px] font-semibold text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800/40">
                      {badge.level}
                    </span>
                  </div>
                  <div className="text-[11px] text-violet-400 font-medium">{badge.category}</div>
                  <p className="text-xs text-slate-400 leading-snug">{badge.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Milestone Achievements */}
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Milestone Achievements</span>
            </h2>

            <div className="space-y-3">
              {aiData?.achievements.map((ach, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-white">{ach.title}</div>
                      <div className="text-[10px] text-slate-400">{ach.timestamp}</div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-cyan-400 text-xs tabular-nums">
                    {ach.metricValue}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Personalized AI Recommendations */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-800 space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-950/80 border border-cyan-800/40 px-2 py-0.5 rounded mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next Career Accelerators</span>
              </div>
              <h2 className="text-lg font-bold text-white">Personalized Recommendations</h2>
              <p className="text-xs text-slate-400 mt-1">
                Curated by Gemini based on your recent project submissions and interest focus.
              </p>
            </div>

            <div className="space-y-4">
              {aiData?.recommendations.map((rec, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-400">
                      {rec.type}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white">{rec.topic}</h3>
                  <p className="text-xs text-slate-300 leading-snug">{rec.reason}</p>

                  <div className="pt-2 border-t border-slate-800 text-[11px] text-cyan-300 flex items-start gap-1.5">
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180 shrink-0 mt-0.5 text-cyan-400" />
                    <span>{rec.suggestedAction}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* University Mentor Contact Card */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-violet-950/40 to-indigo-950/40 border border-violet-800/40 space-y-2 text-xs">
              <div className="font-semibold text-white">Need 1:1 Guidance?</div>
              <p className="text-slate-300 text-[11px]">
                Your assigned mentor <span className="font-semibold text-cyan-400">Priya Sharma</span> reviews submissions and holds office hours every Thursday.
              </p>
              <div className="pt-1 text-[11px] text-violet-300 font-mono">
                Office Hours: Thu 6:00 PM IST · Google Meet
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

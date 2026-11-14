import React from 'react';
import {
  X,
  Calendar,
  Users,
  Video,
  FileQuestion,
  Code2,
  Clock,
  Award,
  Layers,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { Programme } from '../../types';
import { store } from '../../services/store';

interface ProgrammeDetailsModalProps {
  programme: Programme | null;
  onClose: () => void;
  onSelectResource?: (resId: string) => void;
}

export const ProgrammeDetailsModal: React.FC<ProgrammeDetailsModalProps> = ({
  programme,
  onClose,
}) => {
  if (!programme) return null;

  const mentors = store.getUsers('mentor').filter((m) => programme.mentorIds.includes(m.id));
  const mentees = store.getUsers('mentee').filter((m) => m.assignedProgrammes.includes(programme.id));
  const resources = store.getResources(programme.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/80 border border-cyan-800/50 px-2 py-0.5 rounded">
              {programme.code}
            </span>
            <span className="capitalize text-xs font-semibold text-emerald-400">
              {programme.status}
            </span>
            <span className="text-xs text-slate-400">· {programme.domain}</span>
          </div>

          <h2 className="text-2xl font-bold text-white">{programme.title}</h2>
          <p className="text-xs text-slate-300 leading-relaxed">{programme.description}</p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {programme.tags.map((tag) => (
              <span key={tag} className="text-[11px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Assigned Mentors Strip */}
        <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 mb-6 space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-violet-400" />
            <span>Assigned Technical Mentors</span>
          </div>
          <div className="flex flex-wrap gap-4 pt-1">
            {mentors.length > 0 ? (
              mentors.map((m) => (
                <div key={m.id} className="flex items-center gap-3 bg-slate-950/80 p-2 rounded-lg border border-slate-800/80">
                  <img src={m.avatar} alt={m.name} className="w-9 h-9 rounded-full object-cover border border-violet-500/40" />
                  <div>
                    <div className="text-xs font-bold text-white">{m.name}</div>
                    <div className="text-[10px] text-cyan-400">{m.bio?.split('.')[0] || 'Technical Mentor'}</div>
                  </div>
                </div>
              ))
            ) : (
              <span className="text-xs text-slate-500 italic">No mentors allocated yet.</span>
            )}
          </div>
        </div>

        {/* Curriculum Resources */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Curriculum Syllabus ({resources.length} Modules)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              Cohort Completion: {programme.completionRate}%
            </span>
          </div>

          <div className="space-y-2">
            {resources.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-900 text-center text-xs text-slate-500">
                Curriculum resources will be uploaded by the assigned mentor shortly.
              </div>
            ) : (
              resources.map((res) => (
                <div
                  key={res.id}
                  className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center shrink-0">
                      {res.type === 'video' ? (
                        <Video className="w-4 h-4 text-cyan-400" />
                      ) : res.type === 'quiz' ? (
                        <FileQuestion className="w-4 h-4 text-violet-400" />
                      ) : (
                        <Code2 className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{res.title}</div>
                      <div className="text-[11px] text-slate-400">
                        Topic: {res.topic} {res.deadline ? `· Due: ${res.deadline}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 font-mono">
                    <span className="text-xs text-slate-300 font-bold">{res.maxMarks} pts</span>
                    <span className="block text-[10px] uppercase text-slate-500">{res.type}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Enrolled Mentees Sample */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Enrolled IGDTUW Students ({programme.menteeCount} / {programme.maxMentees})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {mentees.map((m) => {
              const prog = store.getMenteeProgress(m.id);
              return (
                <div
                  key={m.id}
                  className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <img src={m.avatar} alt={m.name} className="w-7 h-7 rounded-full object-cover" />
                    <div>
                      <div className="font-semibold text-white">{m.name}</div>
                      <div className="text-[10px] text-violet-400 font-mono">{m.enrollmentNo}</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 font-semibold tabular-nums">
                    {prog.totalPoints} pts
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

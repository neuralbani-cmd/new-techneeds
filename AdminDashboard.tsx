import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  Layers,
  Award,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Key,
  Copy,
  Check,
  ShieldCheck,
  X,
  ExternalLink,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { Programme, User } from '../../types';
import { store } from '../../services/store';

interface AdminDashboardProps {
  onOpenProgrammeDetails: (prog: Programme) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenProgrammeDetails,
}) => {
  const [activeTab, setActiveTab] = useState<'programmes' | 'mentors' | 'mentees'>('programmes');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'upcoming' | 'completed'>('all');

  // Modals
  const [isCreateProgOpen, setIsCreateProgOpen] = useState(false);
  const [editingProg, setEditingProg] = useState<Programme | null>(null);
  const [isAddMentorOpen, setIsAddMentorOpen] = useState(false);
  const [credentialsModal, setCredentialsModal] = useState<{
    mentor: User;
    tempPassword: string;
    loginUrl: string;
  } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // New Programme Form State
  const [progForm, setProgForm] = useState({
    title: '',
    code: '',
    domain: 'Full-Stack & Cloud Engineering',
    track: 'Core Engineering Track',
    description: '',
    startDate: '',
    endDate: '',
    maxMentees: 30,
    tags: 'React, Node.js, Systems',
  });

  // New Mentor Form State
  const [mentorForm, setMentorForm] = useState({
    name: '',
    email: '',
    bio: '',
    phone: '',
    linkedin: '',
    assignedProgrammes: [] as string[],
  });

  const programmes = store.getProgrammes();
  const mentors = store.getUsers('mentor');
  const mentees = store.getUsers('mentee');

  // Statistics
  const totalProgrammes = programmes.length;
  const activeCohorts = programmes.filter((p) => p.status === 'active').length;
  const totalMentors = mentors.length;
  const totalMentees = mentees.length;
  const avgCompletion =
    programmes.length > 0
      ? Math.round(programmes.reduce((acc, p) => acc + p.completionRate, 0) / programmes.length)
      : 82;

  // Filtered Programmes
  const filteredProgrammes = programmes.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.domain.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateProgramme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!progForm.title || !progForm.code) return;

    store.addProgramme({
      title: progForm.title,
      code: progForm.code.toUpperCase(),
      domain: progForm.domain,
      track: progForm.track,
      description: progForm.description,
      status: 'active',
      startDate: progForm.startDate || new Date().toISOString().split('T')[0],
      endDate: progForm.endDate || '2026-06-30',
      mentorIds: [],
      maxMentees: Number(progForm.maxMentees) || 30,
      tags: progForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setIsCreateProgOpen(false);
    setProgForm({
      title: '',
      code: '',
      domain: 'Full-Stack & Cloud Engineering',
      track: 'Core Engineering Track',
      description: '',
      startDate: '',
      endDate: '',
      maxMentees: 30,
      tags: 'React, Node.js, Systems',
    });
  };

  const handleUpdateProgramme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProg) return;

    store.updateProgramme(editingProg.id, {
      title: editingProg.title,
      code: editingProg.code.toUpperCase(),
      domain: editingProg.domain,
      track: editingProg.track,
      description: editingProg.description,
      status: editingProg.status,
      maxMentees: Number(editingProg.maxMentees),
    });

    setEditingProg(null);
  };

  const handleDeleteProgramme = (id: string) => {
    if (window.confirm('Are you sure you want to remove this programme?')) {
      store.deleteProgramme(id);
    }
  };

  const handleAddMentor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorForm.name || !mentorForm.email) return;

    const newMentor = store.addMentor({
      name: mentorForm.name,
      email: mentorForm.email,
      bio: mentorForm.bio,
      phone: mentorForm.phone,
      linkedin: mentorForm.linkedin,
      assignedProgrammes: mentorForm.assignedProgrammes,
      avatar: '/src/assets/images/avatar_mentor_priya_1794399541203.jpg',
    });

    setIsAddMentorOpen(false);
    setMentorForm({
      name: '',
      email: '',
      bio: '',
      phone: '',
      linkedin: '',
      assignedProgrammes: [],
    });

    // Show credentials modal
    setCredentialsModal({
      mentor: newMentor,
      tempPassword: `TN-MNT@${Math.floor(1000 + Math.random() * 9000)}`,
      loginUrl: window.location.origin,
    });
  };

  const handleCopyLink = () => {
    if (!credentialsModal) return;
    const text = `TechNeeds IGDTUW Mentor Access:\nEmail: ${credentialsModal.mentor.email}\nTemp Password: ${credentialsModal.tempPassword}\nPortal: ${credentialsModal.loginUrl}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#11192E] via-[#141C34] to-[#171330] border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-violet-400 bg-violet-950/60 border border-violet-800/40 px-2.5 py-0.5 rounded">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Directorate Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Programme & Cohort Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Oversee university mentorship tracks, allocate industry leaders, and inspect student progress metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreateProgOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-violet-600/20 transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Programme</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Programmes</span>
            <Layers className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">{totalProgrammes}</div>
          <div className="text-[11px] text-slate-500 mt-1">Tracks configured</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Active Cohorts</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">{activeCohorts}</div>
          <div className="text-[11px] text-slate-500 mt-1">In spring session</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Mentors</span>
            <Users className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">{totalMentors}</div>
          <div className="text-[11px] text-slate-500 mt-1">Senior SWEs & Alumnae</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Mentees</span>
            <GraduationCap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">{totalMentees}</div>
          <div className="text-[11px] text-slate-500 mt-1">Enrolled students</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Avg Completion</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">{avgCompletion}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Curriculum velocity</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('programmes')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'programmes'
              ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Programmes & Cohorts ({programmes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mentors')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'mentors'
              ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Mentor Directory ({mentors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mentees')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'mentees'
              ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Enrolled Mentees ({mentees.length})</span>
        </button>
      </div>

      {/* TAB 1: Programmes Management */}
      {activeTab === 'programmes' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search programmes by title, code or domain..."
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-sans"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Status:</span>
              <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
                {(['all', 'active', 'upcoming', 'completed'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                      statusFilter === s
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-[#0F172A] border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#131B2E] border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Programme & Track</th>
                    <th className="py-3.5 px-4">Code</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Assigned Mentors</th>
                    <th className="py-3.5 px-4">Mentees</th>
                    <th className="py-3.5 px-4">Completion</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredProgrammes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-500">
                        No programmes found matching search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredProgrammes.map((prog) => {
                      const assignedMentorObjects = mentors.filter((m) =>
                        prog.mentorIds.includes(m.id)
                      );
                      return (
                        <tr key={prog.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{prog.title}</div>
                            <div className="text-[11px] text-slate-400">{prog.domain}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-cyan-400">
                            {prog.code}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`capitalize font-medium ${
                                prog.status === 'active'
                                  ? 'text-emerald-400'
                                  : prog.status === 'upcoming'
                                  ? 'text-amber-400'
                                  : 'text-slate-400'
                              }`}
                            >
                              {prog.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {assignedMentorObjects.length > 0 ? (
                              <div className="flex items-center gap-1.5">
                                {assignedMentorObjects.map((m) => (
                                  <img
                                    key={m.id}
                                    src={m.avatar}
                                    alt={m.name}
                                    title={m.name}
                                    className="w-6 h-6 rounded-full object-cover border border-slate-700"
                                  />
                                ))}
                                <span className="text-[11px] text-slate-400">
                                  {assignedMentorObjects.map((m) => m.name).join(', ')}
                                </span>
                              </div>
                            ) : (
                              <span className="text-slate-500 italic">Unassigned</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 font-mono tabular-nums">
                            {prog.menteeCount} / {prog.maxMentees}
                          </td>
                          <td className="py-3.5 px-4 font-mono tabular-nums">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-cyan-400 rounded-full"
                                  style={{ width: `${prog.completionRate}%` }}
                                />
                              </div>
                              <span>{prog.completionRate}%</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => onOpenProgrammeDetails(prog)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                                title="View Curriculum & Resources"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingProg(prog)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-violet-400 hover:bg-slate-800 transition-colors"
                                title="Edit Programme"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProgramme(prog.id)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                                title="Delete Programme"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Mentors Directory & Allocation */}
      {activeTab === 'mentors' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              Industry architects and alumnae assigned to guide student cohorts.
            </p>
            <button
              onClick={() => setIsAddMentorOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-violet-600/20 transition-all flex items-center gap-2 self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Mentor</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentors.map((mentor) => {
              const assignedProgs = programmes.filter((p) =>
                mentor.assignedProgrammes.includes(p.id)
              );
              return (
                <div
                  key={mentor.id}
                  className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start gap-3 mb-3">
                      <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-12 h-12 rounded-xl object-cover border border-violet-500/40"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-white truncate">{mentor.name}</h3>
                        <p className="text-xs text-cyan-400 truncate">{mentor.email}</p>
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{mentor.bio}</p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-800/80">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Assigned Programmes
                      </div>
                      <div className="space-y-1.5">
                        {assignedProgs.length > 0 ? (
                          assignedProgs.map((p) => (
                            <div
                              key={p.id}
                              className="flex items-center justify-between text-xs text-slate-300 bg-slate-900/80 p-1.5 rounded-lg border border-slate-800"
                            >
                              <span className="truncate max-w-[180px]">{p.title}</span>
                              <button
                                onClick={() => store.removeMentorFromProgramme(mentor.id, p.id)}
                                className="text-rose-400 hover:text-rose-300 text-[10px] ml-2"
                                title="Remove from this programme"
                              >
                                Unassign
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-slate-500 italic">No programmes assigned yet</div>
                        )}
                      </div>

                      {/* Quick Assign Dropdown */}
                      <div className="mt-3 flex items-center gap-2">
                        <select
                          onChange={(e) => {
                            if (e.target.value) {
                              store.assignMentorToProgramme(mentor.id, e.target.value);
                              e.target.value = '';
                            }
                          }}
                          defaultValue=""
                          className="flex-1 py-1.5 px-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-violet-500"
                        >
                          <option value="" disabled>
                            + Assign to cohort...
                          </option>
                          {programmes
                            .filter((p) => !mentor.assignedProgrammes.includes(p.id))
                            .map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.title} ({p.code})
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <button
                      onClick={() =>
                        setCredentialsModal({
                          mentor,
                          tempPassword: `TN-MNT@${Math.floor(1000 + Math.random() * 9000)}`,
                          loginUrl: window.location.origin,
                        })
                      }
                      className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>Access Credentials</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm(`Remove ${mentor.name} from mentor directory?`)) {
                          store.removeMentor(mentor.id);
                        }
                      }}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Enrolled Mentees Directory */}
      {activeTab === 'mentees' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Active IGDTUW students participating in technical mentorship.
            </p>
          </div>

          <div className="rounded-2xl bg-[#0F172A] border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#131B2E] border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Mentee Name</th>
                    <th className="py-3.5 px-4">Enrollment No</th>
                    <th className="py-3.5 px-4">Department & Year</th>
                    <th className="py-3.5 px-4">Enrolled Cohort</th>
                    <th className="py-3.5 px-4">Leaderboard Points</th>
                    <th className="py-3.5 px-4 text-right">Streak & Badges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {mentees.map((mentee) => {
                    const prog = store.getMenteeProgress(mentee.id);
                    const enrolledProg = programmes.find((p) =>
                      mentee.assignedProgrammes.includes(p.id)
                    );
                    return (
                      <tr key={mentee.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={mentee.avatar}
                              alt={mentee.name}
                              className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <div className="font-semibold text-white">{mentee.name}</div>
                              <div className="text-[11px] text-slate-400">{mentee.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-violet-400">
                          {mentee.enrollmentNo || 'N/A'}
                        </td>
                        <td className="py-3.5 px-4">
                          <div>{mentee.branch}</div>
                          <div className="text-[11px] text-slate-400">{mentee.year}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          {enrolledProg ? (
                            <span className="text-cyan-400">{enrolledProg.title}</span>
                          ) : (
                            <span className="text-slate-500 italic">Unassigned</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-white tabular-nums">
                          {prog.totalPoints} pts
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-300 tabular-nums">
                          {prog.streakDays}d streak · {prog.badges.length} badges
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

      {/* CREATE PROGRAMME MODAL */}
      {isCreateProgOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateProgOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Create New Mentorship Programme</h3>
            <p className="text-xs text-slate-400 mb-6">
              Establish a new cohort for IGDTUW students with syllabus, domain, and seats.
            </p>

            <form onSubmit={handleCreateProgramme} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Programme Title</label>
                <input
                  type="text"
                  required
                  value={progForm.title}
                  onChange={(e) => setProgForm({ ...progForm, title: e.target.value })}
                  placeholder="e.g. Distributed Systems & Cloud Infrastructure '26"
                  className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Programme Code</label>
                  <input
                    type="text"
                    required
                    value={progForm.code}
                    onChange={(e) => setProgForm({ ...progForm, code: e.target.value })}
                    placeholder="e.g. TN-SYS-26"
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white font-mono uppercase focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Max Mentees</label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={progForm.maxMentees}
                    onChange={(e) => setProgForm({ ...progForm, maxMentees: Number(e.target.value) })}
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white font-mono focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Domain</label>
                  <select
                    value={progForm.domain}
                    onChange={(e) => setProgForm({ ...progForm, domain: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Full-Stack & Cloud Engineering">Full-Stack & Cloud Engineering</option>
                    <option value="Machine Learning & Generative AI">Machine Learning & Generative AI</option>
                    <option value="Systems & Infrastructure">Systems & Infrastructure</option>
                    <option value="Cybersecurity & Cryptography">Cybersecurity & Cryptography</option>
                    <option value="Mobile Engineering">Mobile Engineering</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Track</label>
                  <select
                    value={progForm.track}
                    onChange={(e) => setProgForm({ ...progForm, track: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Core Engineering Track">Core Engineering Track</option>
                    <option value="Advanced Research Track">Advanced Research Track</option>
                    <option value="Specialist Track">Specialist Track</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={progForm.description}
                  onChange={(e) => setProgForm({ ...progForm, description: e.target.value })}
                  placeholder="Outline syllabus, weekly goals and expected deliverables..."
                  className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Topic Tags (comma-separated)</label>
                <input
                  type="text"
                  value={progForm.tags}
                  onChange={(e) => setProgForm({ ...progForm, tags: e.target.value })}
                  placeholder="e.g. Distributed Systems, Kafka, Go, Docker"
                  className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateProgOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-md transition-all"
                >
                  Publish Programme
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT PROGRAMME MODAL */}
      {editingProg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingProg(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Edit Programme Details</h3>
            <p className="text-xs text-slate-400 mb-6">Modify programme title, status, and configuration.</p>

            <form onSubmit={handleUpdateProgramme} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Programme Title</label>
                <input
                  type="text"
                  required
                  value={editingProg.title}
                  onChange={(e) => setEditingProg({ ...editingProg, title: e.target.value })}
                  className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={editingProg.status}
                    onChange={(e) =>
                      setEditingProg({
                        ...editingProg,
                        status: e.target.value as 'active' | 'upcoming' | 'completed',
                      })
                    }
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="active">Active</option>
                    <option value="upcoming">Upcoming</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Max Mentees</label>
                  <input
                    type="number"
                    value={editingProg.maxMentees}
                    onChange={(e) =>
                      setEditingProg({ ...editingProg, maxMentees: Number(e.target.value) })
                    }
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white font-mono focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProg.description}
                  onChange={(e) => setEditingProg({ ...editingProg, description: e.target.value })}
                  className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingProg(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl shadow-md transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD MENTOR MODAL */}
      {isAddMentorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddMentorOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Onboard New Mentor</h3>
            <p className="text-xs text-slate-400 mb-6">
              Provision mentor profile and assign initial cohort tracks.
            </p>

            <form onSubmit={handleAddMentor} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={mentorForm.name}
                  onChange={(e) => setMentorForm({ ...mentorForm, name: e.target.value })}
                  placeholder="e.g. Radhika Sharma"
                  className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={mentorForm.email}
                  onChange={(e) => setMentorForm({ ...mentorForm, email: e.target.value })}
                  placeholder="e.g. radhika@techneeds.igdtuw.ac.in"
                  className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Professional Bio</label>
                <textarea
                  rows={2}
                  value={mentorForm.bio}
                  onChange={(e) => setMentorForm({ ...mentorForm, bio: e.target.value })}
                  placeholder="e.g. Staff Engineer @ Google, IGDTUW '20 Alumna"
                  className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Assign Initial Programme</label>
                <select
                  onChange={(e) => {
                    const id = e.target.value;
                    if (id && !mentorForm.assignedProgrammes.includes(id)) {
                      setMentorForm({
                        ...mentorForm,
                        assignedProgrammes: [...mentorForm.assignedProgrammes, id],
                      });
                    }
                  }}
                  defaultValue=""
                  className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="" disabled>Select cohort...</option>
                  {programmes.map((p) => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
                {mentorForm.assignedProgrammes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {mentorForm.assignedProgrammes.map((pid) => {
                      const p = programmes.find((x) => x.id === pid);
                      return (
                        <span
                          key={pid}
                          className="bg-violet-950/80 text-violet-300 border border-violet-800/60 px-2 py-0.5 rounded text-[11px]"
                        >
                          {p?.title || pid}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddMentorOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-md transition-all"
                >
                  Provision Mentor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREDENTIALS GENERATED MODAL */}
      {credentialsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setCredentialsModal(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Key className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Mentor Access Credentials</h3>
            <p className="text-xs text-slate-400 mb-5">
              Copy and share these secure login credentials with the mentor.
            </p>

            <div className="space-y-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800 font-mono text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-sans">Mentor Name</span>
                <span className="text-white font-semibold">{credentialsModal.mentor.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-sans">Login Email</span>
                <span className="text-cyan-400 font-semibold">{credentialsModal.mentor.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-sans">Generated Password</span>
                <span className="text-violet-400 font-bold tracking-wider">{credentialsModal.tempPassword}</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Login Package</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

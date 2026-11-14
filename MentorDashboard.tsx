import React, { useState } from 'react';
import {
  Users,
  Video,
  FileQuestion,
  Code2,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit2,
  ExternalLink,
  Award,
  X,
  Copy,
  Check,
  Eye,
  Send,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import {
  User,
  Programme,
  LearningResource,
  Submission,
  VideoResource,
  QuizResource,
  ProjectResource,
  QuizQuestion,
} from '../../types';
import { store } from '../../services/store';

interface MentorDashboardProps {
  currentUser: User;
}

export const MentorDashboard: React.FC<MentorDashboardProps> = ({
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'mentees' | 'resources' | 'submissions'>('mentees');
  const [menteeSearch, setMenteeSearch] = useState('');
  const [selectedProgrammeFilter, setSelectedProgrammeFilter] = useState<string>('all');

  // Modals
  const [isAddMenteeOpen, setIsAddMenteeOpen] = useState(false);
  const [newMenteeCredentials, setNewMenteeCredentials] = useState<{
    user: User;
    initialPassword: string;
    enrollmentNo: string;
  } | null>(null);

  const [isCreateResourceOpen, setIsCreateResourceOpen] = useState(false);
  const [resourceTypeToCreate, setResourceTypeToCreate] = useState<'video' | 'quiz' | 'project'>('video');
  const [editingResource, setEditingResource] = useState<LearningResource | null>(null);

  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradeScore, setGradeScore] = useState<number>(0);
  const [gradeFeedback, setGradeFeedback] = useState<string>('');

  const [copiedSlip, setCopiedSlip] = useState(false);

  // Forms
  const [menteeForm, setMenteeForm] = useState({
    name: '',
    email: '',
    branch: 'Computer Science & Engineering',
    year: '3rd Year (Batch 2026)',
    programmeId: '',
    interestTags: 'Distributed Systems, TypeScript, React',
  });

  // Resource Creation Form State
  const [videoForm, setVideoForm] = useState({
    programmeId: '',
    title: '',
    topic: '',
    description: '',
    videoUrl: '',
    durationMinutes: 45,
    maxMarks: 50,
    deadline: '',
  });

  const [quizForm, setQuizForm] = useState<{
    programmeId: string;
    title: string;
    topic: string;
    description: string;
    maxMarks: number;
    timeLimitMinutes: number;
    deadline: string;
    questions: QuizQuestion[];
  }>({
    programmeId: '',
    title: '',
    topic: '',
    description: '',
    maxMarks: 100,
    timeLimitMinutes: 20,
    deadline: '',
    questions: [
      {
        id: 'q1',
        question: 'Which consistency model provides the strongest transactional guarantees in distributed databases?',
        options: ['Eventual Consistency', 'Strict Serializability', 'Causal Consistency', 'Read Uncommitted'],
        correctOptionIndex: 1,
        explanation: 'Strict Serializability combines linearizability (real-time ordering) with serializability (transactions appear executed sequentially).',
      },
    ],
  });

  const [projectForm, setProjectForm] = useState({
    programmeId: '',
    title: '',
    topic: '',
    problemStatement: '',
    techStack: 'React, Node.js, WebSockets, Redis, Docker',
    submissionInstructions: 'Submit your GitHub repository link and public live deployment URL.',
    deadline: '',
    maxMarks: 200,
    rubric: 'Architecture (50), Concurrency (50), Clean Code (50), Documentation (50)',
  });

  // Data fetching
  const programmes = store.getProgrammes();
  const assignedProgrammes = programmes.filter((p) =>
    currentUser.assignedProgrammes.includes(p.id)
  );

  const mentees = store.getUsers('mentee');
  const relevantMentees = mentees.filter((m) =>
    m.assignedProgrammes.some((pid) => currentUser.assignedProgrammes.includes(pid))
  );

  const resources = store.getResources();
  const mentorResources = resources.filter((r) =>
    currentUser.assignedProgrammes.includes(r.programmeId)
  );

  const submissions = store.getSubmissions();
  const mentorSubmissions = submissions.filter((s) =>
    currentUser.assignedProgrammes.includes(s.programmeId)
  );
  const pendingSubmissions = mentorSubmissions.filter((s) => s.status === 'pending');

  // Filtered Mentees
  const filteredMentees = relevantMentees.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(menteeSearch.toLowerCase()) ||
      (m.enrollmentNo && m.enrollmentNo.includes(menteeSearch)) ||
      m.email.toLowerCase().includes(menteeSearch.toLowerCase());
    const matchesProg =
      selectedProgrammeFilter === 'all' || m.assignedProgrammes.includes(selectedProgrammeFilter);
    return matchesSearch && matchesProg;
  });

  // Handlers
  const handleAddMenteeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menteeForm.name || !menteeForm.email) return;

    const progId = menteeForm.programmeId || assignedProgrammes[0]?.id || programmes[0]?.id;
    const result = store.addMentee({
      name: menteeForm.name,
      email: menteeForm.email,
      branch: menteeForm.branch,
      year: menteeForm.year,
      programmeId: progId,
      interestTags: menteeForm.interestTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setIsAddMenteeOpen(false);
    setNewMenteeCredentials(result);
    setMenteeForm({
      name: '',
      email: '',
      branch: 'Computer Science & Engineering',
      year: '3rd Year (Batch 2026)',
      programmeId: '',
      interestTags: 'Distributed Systems, TypeScript, React',
    });
  };

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    const pid = videoForm.programmeId || assignedProgrammes[0]?.id || programmes[0]?.id;
    store.addResource({
      type: 'video',
      programmeId: pid,
      title: videoForm.title,
      topic: videoForm.topic || 'Core Engineering Topic',
      description: videoForm.description,
      videoUrl: videoForm.videoUrl || 'https://www.youtube.com/watch?v=G1rOthIU-uo',
      durationMinutes: Number(videoForm.durationMinutes) || 40,
      maxMarks: Number(videoForm.maxMarks) || 50,
      deadline: videoForm.deadline || undefined,
      createdByMentorId: currentUser.id,
      creatorName: currentUser.name,
    });
    setIsCreateResourceOpen(false);
  };

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    const pid = quizForm.programmeId || assignedProgrammes[0]?.id || programmes[0]?.id;
    store.addResource({
      type: 'quiz',
      programmeId: pid,
      title: quizForm.title,
      topic: quizForm.topic || 'Diagnostic Assessment',
      description: quizForm.description,
      maxMarks: Number(quizForm.maxMarks) || 100,
      timeLimitMinutes: Number(quizForm.timeLimitMinutes) || 20,
      deadline: quizForm.deadline || undefined,
      createdByMentorId: currentUser.id,
      creatorName: currentUser.name,
      questions: quizForm.questions,
    });
    setIsCreateResourceOpen(false);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const pid = projectForm.programmeId || assignedProgrammes[0]?.id || programmes[0]?.id;
    store.addResource({
      type: 'project',
      programmeId: pid,
      title: projectForm.title,
      topic: projectForm.topic || 'Capstone Project',
      description: projectForm.problemStatement.slice(0, 160) + '...',
      problemStatement: projectForm.problemStatement,
      techStack: projectForm.techStack.split(',').map((t) => t.trim()),
      submissionInstructions: projectForm.submissionInstructions,
      maxMarks: Number(projectForm.maxMarks) || 200,
      deadline: projectForm.deadline || undefined,
      rubric: projectForm.rubric.split(',').map((r) => r.trim()),
      createdByMentorId: currentUser.id,
      creatorName: currentUser.name,
    });
    setIsCreateResourceOpen(false);
  };

  const handleOpenGrading = (sub: Submission) => {
    setGradingSubmission(sub);
    setGradeScore(sub.score || Math.round(sub.maxMarks * 0.9));
    setGradeFeedback(
      sub.mentorFeedback ||
        'Great work! Clean implementation and robust error handling observed. Keep up the high code quality.'
    );
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    store.gradeSubmission(gradingSubmission.id, gradeScore, gradeFeedback, currentUser.id);
    setGradingSubmission(null);
  };

  const handleAddQuestionToQuiz = () => {
    setQuizForm({
      ...quizForm,
      questions: [
        ...quizForm.questions,
        {
          id: `q_${Date.now()}`,
          question: '',
          options: ['', '', '', ''],
          correctOptionIndex: 0,
          explanation: '',
        },
      ],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#11192E] via-[#141C34] to-[#1A1836] border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-violet-500/40 shadow-lg"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2 py-0.5 rounded mb-1">
              <Code2 className="w-3.5 h-3.5" />
              <span>Mentor Workspace · Microsoft Cloud Systems</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              Welcome back, {currentUser.name}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Supervising {relevantMentees.length} IGDTUW engineers across {assignedProgrammes.length} active cohorts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddMenteeOpen(true)}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4 text-violet-400" />
            <span>Onboard Mentee</span>
          </button>

          <button
            onClick={() => setIsCreateResourceOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-violet-600/20 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Resource</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Assigned Programmes</span>
            <Code2 className="w-4 h-4 text-violet-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums">
            {assignedProgrammes.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Active tracks</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Active Mentees</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
            {relevantMentees.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Students under guidance</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Pending Submissions</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
            {pendingSubmissions.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Awaiting code review</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0F172A] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Published Resources</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            {mentorResources.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Videos, Quizzes & Projects</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('mentees')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'mentees'
              ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Mentee Management ({relevantMentees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'resources'
              ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Curriculum & Learning Resources ({mentorResources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'submissions'
              ? 'bg-violet-600/20 text-violet-300 border border-violet-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Submissions & Grading ({pendingSubmissions.length} Pending)</span>
        </button>
      </div>

      {/* TAB 1: Mentees List & Management */}
      {activeTab === 'mentees' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={menteeSearch}
                onChange={(e) => setMenteeSearch(e.target.value)}
                placeholder="Search mentees by name, enrollment or email..."
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-sans"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Cohort:</span>
              <select
                value={selectedProgrammeFilter}
                onChange={(e) => setSelectedProgrammeFilter(e.target.value)}
                className="py-1.5 px-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-violet-500"
              >
                <option value="all">All Assigned Cohorts</option>
                {assignedProgrammes.map((p) => (
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
                    <th className="py-3.5 px-4">Student Name</th>
                    <th className="py-3.5 px-4">Enrollment No</th>
                    <th className="py-3.5 px-4">Branch & Year</th>
                    <th className="py-3.5 px-4">Cohort Track</th>
                    <th className="py-3.5 px-4">Points</th>
                    <th className="py-3.5 px-4">Streak</th>
                    <th className="py-3.5 px-4 text-right">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredMentees.map((mentee) => {
                    const prog = store.getMenteeProgress(mentee.id);
                    const enrolled = programmes.find((p) =>
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
                          {mentee.enrollmentNo}
                        </td>
                        <td className="py-3.5 px-4">
                          <div>{mentee.branch}</div>
                          <div className="text-[11px] text-slate-400">{mentee.year}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="text-cyan-400 font-medium">
                            {enrolled?.title || 'General Engineering'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-white tabular-nums">
                          {prog.totalPoints} pts
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums text-emerald-400">
                          {prog.streakDays} days
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-slate-300 tabular-nums">
                          {prog.completedResourceIds.length} modules · {prog.badges.length} badges
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

      {/* TAB 2: Learning Resource Management (Videos, Quizzes, Projects) */}
      {activeTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-400">
              Publish learning videos, interactive quizzes with auto-scoring, and production project briefs.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setResourceTypeToCreate('video');
                  setIsCreateResourceOpen(true);
                }}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-1.5"
              >
                <Video className="w-3.5 h-3.5 text-cyan-400" />
                <span>+ Video</span>
              </button>
              <button
                onClick={() => {
                  setResourceTypeToCreate('quiz');
                  setIsCreateResourceOpen(true);
                }}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg text-xs font-medium text-slate-200 flex items-center gap-1.5"
              >
                <FileQuestion className="w-3.5 h-3.5 text-violet-400" />
                <span>+ Quiz</span>
              </button>
              <button
                onClick={() => {
                  setResourceTypeToCreate('project');
                  setIsCreateResourceOpen(true);
                }}
                className="px-3 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-md"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>+ Project</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentorResources.map((res) => (
              <div
                key={res.id}
                className="p-5 rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
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
                    <span className="text-slate-400 text-[11px] font-mono tabular-nums">
                      Max {res.maxMarks} marks
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1.5">{res.title}</h3>
                  <div className="text-[11px] font-semibold text-slate-400 mb-2">
                    Topic: {res.topic}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-3 mb-4">{res.description}</p>

                  {res.type === 'video' && (
                    <div className="text-[11px] text-cyan-400 flex items-center gap-1.5 mb-2 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{res.durationMinutes} mins duration</span>
                    </div>
                  )}

                  {res.type === 'quiz' && (
                    <div className="text-[11px] text-violet-400 flex items-center gap-1.5 mb-2 font-mono">
                      <FileQuestion className="w-3.5 h-3.5" />
                      <span>{res.questions.length} Questions · {res.timeLimitMinutes || 20}m limit</span>
                    </div>
                  )}

                  {res.type === 'project' && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {res.techStack.slice(0, 3).map((t) => (
                        <span key={t} className="text-[10px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    Deadline: {res.deadline || 'Ongoing'}
                  </span>
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete resource "${res.title}"?`)) {
                        store.deleteResource(res.id);
                      }
                    }}
                    className="text-rose-400 hover:text-rose-300 p-1"
                    title="Delete Resource"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Submissions & Grading Management */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Inspect student repository solutions, diagnostic quiz attempts, and assign rubric scores with personalized feedback.
            </p>
          </div>

          <div className="rounded-2xl bg-[#0F172A] border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#131B2E] border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Resource / Assignment</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Submitted At</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Awarded Score</th>
                    <th className="py-3.5 px-4 text-right">Review Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {mentorSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">{sub.menteeName}</div>
                        <div className="text-[11px] text-violet-400 font-mono">
                          {sub.menteeEnrollmentNo}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-200">{sub.resourceTitle}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize font-semibold text-cyan-400">{sub.resourceType}</span>
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
                          <span className="text-slate-500 italic">Ungraded</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleOpenGrading(sub)}
                          className="px-3 py-1.5 bg-violet-600/20 hover:bg-violet-600/40 text-violet-300 border border-violet-500/40 rounded-lg text-xs font-semibold transition-colors"
                        >
                          {sub.status === 'graded' ? 'Update Grade' : 'Grade Solution'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ONBOARD MENTEE MODAL */}
      {isAddMenteeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setIsAddMenteeOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Onboard New IGDTUW Mentee</h3>
            <p className="text-xs text-slate-400 mb-5">
              Generates a unique Enrollment Number and initial password for the student.
            </p>

            <form onSubmit={handleAddMenteeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={menteeForm.name}
                  onChange={(e) => setMenteeForm({ ...menteeForm, name: e.target.value })}
                  placeholder="e.g. Diya Sengupta"
                  className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">IGDTUW Student Email</label>
                <input
                  type="email"
                  required
                  value={menteeForm.email}
                  onChange={(e) => setMenteeForm({ ...menteeForm, email: e.target.value })}
                  placeholder="e.g. diya.sengupta@student.igdtuw.ac.in"
                  className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Branch</label>
                  <select
                    value={menteeForm.branch}
                    onChange={(e) => setMenteeForm({ ...menteeForm, branch: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Information Technology">IT</option>
                    <option value="Artificial Intelligence & Data Science">AI & DS</option>
                    <option value="Electronics & Communication">ECE</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Year</label>
                  <select
                    value={menteeForm.year}
                    onChange={(e) => setMenteeForm({ ...menteeForm, year: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="1st Year (Batch 2028)">1st Year</option>
                    <option value="2nd Year (Batch 2027)">2nd Year</option>
                    <option value="3rd Year (Batch 2026)">3rd Year</option>
                    <option value="4th Year (Batch 2025)">4th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Assign to Cohort</label>
                <select
                  value={menteeForm.programmeId}
                  onChange={(e) => setMenteeForm({ ...menteeForm, programmeId: e.target.value })}
                  className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="">Default: {assignedProgrammes[0]?.title || 'First Track'}</option>
                  {assignedProgrammes.map((p) => (
                    <option key={p.id} value={p.id}>{p.title} ({p.code})</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddMenteeOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-md transition-all"
                >
                  Generate Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MENTEE CREDENTIALS SLIP MODAL */}
      {newMenteeCredentials && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setNewMenteeCredentials(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">Student Enrollment Created!</h3>
            <p className="text-xs text-slate-400 mb-5">
              The student can now log in using this generated Enrollment Number and Password.
            </p>

            <div className="space-y-3 bg-slate-900/90 p-4 rounded-xl border border-slate-800 font-mono text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-sans">Student Name</span>
                <span className="text-white font-semibold">{newMenteeCredentials.user.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-sans">IGDTUW Enrollment No</span>
                <span className="text-cyan-400 font-bold text-sm tracking-wide">{newMenteeCredentials.enrollmentNo}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-sans">Initial Password</span>
                <span className="text-violet-400 font-bold tracking-wider">{newMenteeCredentials.initialPassword}</span>
              </div>
            </div>

            <button
              onClick={() => {
                const text = `Welcome to TechNeeds IGDTUW!\nStudent: ${newMenteeCredentials.user.name}\nEnrollment No: ${newMenteeCredentials.enrollmentNo}\nInitial Password: ${newMenteeCredentials.initialPassword}\nPortal: ${window.location.origin}`;
                navigator.clipboard.writeText(text);
                setCopiedSlip(true);
                setTimeout(() => setCopiedSlip(false), 2000);
              }}
              className="w-full mt-5 py-2.5 px-4 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-md"
            >
              {copiedSlip ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Credentials Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Mentee Credentials Slip</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* CREATE RESOURCE MODAL (Video, Quiz, Project) */}
      {isCreateResourceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateResourceOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Publish New Learning Resource</h3>
            <p className="text-xs text-slate-400 mb-5">
              Select resource format and configure curriculum specifications.
            </p>

            {/* Type Switcher */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800 mb-6 text-xs">
              <button
                type="button"
                onClick={() => setResourceTypeToCreate('video')}
                className={`py-2 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  resourceTypeToCreate === 'video'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video Module</span>
              </button>
              <button
                type="button"
                onClick={() => setResourceTypeToCreate('quiz')}
                className={`py-2 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  resourceTypeToCreate === 'quiz'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileQuestion className="w-3.5 h-3.5" />
                <span>Interactive Quiz</span>
              </button>
              <button
                type="button"
                onClick={() => setResourceTypeToCreate('project')}
                className={`py-2 font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  resourceTypeToCreate === 'project'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Project Spec</span>
              </button>
            </div>

            {/* Form A: Video */}
            {resourceTypeToCreate === 'video' && (
              <form onSubmit={handleCreateVideo} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Video Title</label>
                  <input
                    type="text"
                    required
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                    placeholder="e.g. Masterclass: Event-Driven Microservices with Kafka"
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Related Topic</label>
                    <input
                      type="text"
                      required
                      value={videoForm.topic}
                      onChange={(e) => setVideoForm({ ...videoForm, topic: e.target.value })}
                      placeholder="e.g. High Throughput Streams"
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Duration (minutes)</label>
                    <input
                      type="number"
                      value={videoForm.durationMinutes}
                      onChange={(e) =>
                        setVideoForm({ ...videoForm, durationMinutes: Number(e.target.value) })
                      }
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white font-mono focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Video URL (YouTube or Vimeo)</label>
                  <input
                    type="url"
                    required
                    value={videoForm.videoUrl}
                    onChange={(e) => setVideoForm({ ...videoForm, videoUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Description & Key Takeaways</label>
                  <textarea
                    rows={3}
                    value={videoForm.description}
                    onChange={(e) => setVideoForm({ ...videoForm, description: e.target.value })}
                    placeholder="Summarize architectural concepts covered..."
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateResourceOpen(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-xl shadow-md transition-all"
                  >
                    Publish Video Module
                  </button>
                </div>
              </form>
            )}

            {/* Form B: Quiz Builder */}
            {resourceTypeToCreate === 'quiz' && (
              <form onSubmit={handleCreateQuiz} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Quiz Title</label>
                  <input
                    type="text"
                    required
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                    placeholder="e.g. Distributed Consensus & CAP Theorem Challenge"
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Topic</label>
                    <input
                      type="text"
                      value={quizForm.topic}
                      onChange={(e) => setQuizForm({ ...quizForm, topic: e.target.value })}
                      placeholder="e.g. System Design"
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Max Marks</label>
                    <input
                      type="number"
                      value={quizForm.maxMarks}
                      onChange={(e) => setQuizForm({ ...quizForm, maxMarks: Number(e.target.value) })}
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white font-mono focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Time Limit (mins)</label>
                    <input
                      type="number"
                      value={quizForm.timeLimitMinutes}
                      onChange={(e) =>
                        setQuizForm({ ...quizForm, timeLimitMinutes: Number(e.target.value) })
                      }
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white font-mono focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                {/* Question Builder */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-slate-300">
                      Questions ({quizForm.questions.length})
                    </span>
                    <button
                      type="button"
                      onClick={handleAddQuestionToQuiz}
                      className="text-violet-400 hover:text-violet-300 flex items-center gap-1 font-semibold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Question</span>
                    </button>
                  </div>

                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                    {quizForm.questions.map((q, qIdx) => (
                      <div
                        key={q.id}
                        className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-violet-400">Question {qIdx + 1}</span>
                          {quizForm.questions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setQuizForm({
                                  ...quizForm,
                                  questions: quizForm.questions.filter((_, idx) => idx !== qIdx),
                                });
                              }}
                              className="text-rose-400 text-[10px]"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        <input
                          type="text"
                          required
                          value={q.question}
                          onChange={(e) => {
                            const updated = [...quizForm.questions];
                            updated[qIdx].question = e.target.value;
                            setQuizForm({ ...quizForm, questions: updated });
                          }}
                          placeholder="Enter question statement..."
                          className="w-full py-1.5 px-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                        />

                        <div className="space-y-1.5">
                          <span className="text-[10px] text-slate-400 block">
                            Options (Check radio for correct option):
                          </span>
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct_${q.id}`}
                                checked={q.correctOptionIndex === optIdx}
                                onChange={() => {
                                  const updated = [...quizForm.questions];
                                  updated[qIdx].correctOptionIndex = optIdx;
                                  setQuizForm({ ...quizForm, questions: updated });
                                }}
                                className="accent-violet-500"
                              />
                              <input
                                type="text"
                                required
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...quizForm.questions];
                                  updated[qIdx].options[optIdx] = e.target.value;
                                  setQuizForm({ ...quizForm, questions: updated });
                                }}
                                placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                className="flex-1 py-1 px-2 bg-slate-950 border border-slate-800 rounded text-slate-200"
                              />
                            </div>
                          ))}
                        </div>

                        <input
                          type="text"
                          value={q.explanation}
                          onChange={(e) => {
                            const updated = [...quizForm.questions];
                            updated[qIdx].explanation = e.target.value;
                            setQuizForm({ ...quizForm, questions: updated });
                          }}
                          placeholder="Explanation for correct answer..."
                          className="w-full py-1 px-2 bg-slate-950 border border-slate-800 rounded text-slate-400 text-[11px]"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateResourceOpen(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl shadow-md transition-all"
                  >
                    Publish Diagnostic Quiz
                  </button>
                </div>
              </form>
            )}

            {/* Form C: Project Spec */}
            {resourceTypeToCreate === 'project' && (
              <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Project Title</label>
                  <input
                    type="text"
                    required
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    placeholder="e.g. Distributed Whiteboard Engine with WebSocket Backplane"
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Topic</label>
                    <input
                      type="text"
                      value={projectForm.topic}
                      onChange={(e) => setProjectForm({ ...projectForm, topic: e.target.value })}
                      placeholder="e.g. Capstone Systems Project"
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Max Marks</label>
                    <input
                      type="number"
                      value={projectForm.maxMarks}
                      onChange={(e) =>
                        setProjectForm({ ...projectForm, maxMarks: Number(e.target.value) })
                      }
                      className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Detailed Problem Statement</label>
                  <textarea
                    rows={4}
                    required
                    value={projectForm.problemStatement}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, problemStatement: e.target.value })
                    }
                    placeholder="Detail the technical requirements, architecture constraints, and expected APIs..."
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    value={projectForm.techStack}
                    onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Submission Instructions</label>
                  <input
                    type="text"
                    value={projectForm.submissionInstructions}
                    onChange={(e) =>
                      setProjectForm({ ...projectForm, submissionInstructions: e.target.value })
                    }
                    className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateResourceOpen(false)}
                    className="px-4 py-2 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl shadow-md transition-all"
                  >
                    Publish Project Spec
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* GRADING MODAL */}
      {gradingSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setGradingSubmission(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-white mb-1">Evaluate Assignment Submission</h3>
            <p className="text-xs text-slate-400 mb-5">
              Review code repository and live deployment, assign score, and submit qualitative mentor feedback.
            </p>

            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2 mb-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{gradingSubmission.menteeName}</span>
                <span className="text-violet-400 font-mono">{gradingSubmission.menteeEnrollmentNo}</span>
              </div>
              <div className="text-slate-300 font-medium">{gradingSubmission.resourceTitle}</div>

              {gradingSubmission.projectLinks && (
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">GitHub Repository:</span>
                    <a
                      href={gradingSubmission.projectLinks.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span className="truncate max-w-[240px]">
                        {gradingSubmission.projectLinks.githubUrl}
                      </span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  {gradingSubmission.projectLinks.liveDemoUrl && (
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Live Demo:</span>
                      <a
                        href={gradingSubmission.projectLinks.liveDemoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline flex items-center gap-1 font-mono text-[11px]"
                      >
                        <span className="truncate max-w-[240px]">
                          {gradingSubmission.projectLinks.liveDemoUrl}
                        </span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                  {gradingSubmission.projectLinks.notes && (
                    <div className="text-slate-400 italic text-[11px] pt-1">
                      Notes: "{gradingSubmission.projectLinks.notes}"
                    </div>
                  )}
                </div>
              )}
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Award Score (Max: {gradingSubmission.maxMarks})
                </label>
                <input
                  type="number"
                  min="0"
                  max={gradingSubmission.maxMarks}
                  required
                  value={gradeScore}
                  onChange={(e) => setGradeScore(Number(e.target.value))}
                  className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white font-mono text-base font-bold focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">
                  Qualitative Feedback & Code Review Comments
                </label>
                <textarea
                  rows={4}
                  required
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="Highlight strengths, architecture optimizations, and code styling..."
                  className="w-full py-2 px-3 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Grade & Feedback</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

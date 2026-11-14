import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  GraduationCap,
  ShieldCheck,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  UserPlus,
  User as UserIcon,
  Briefcase,
  Copy,
  Check,
} from 'lucide-react';
import { Role } from '../../types';
import { store } from '../../services/store';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: Role;
  initialMode?: 'signin' | 'signup';
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'mentee',
  initialMode = 'signin',
  onSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>(initialMode);
  const [activeRole, setActiveRole] = useState<Role>(defaultRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  // Sign Up state
  const [signupRole, setSignupRole] = useState<'mentee' | 'mentor'>('mentee');
  const [fullName, setFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [enrollmentInput, setEnrollmentInput] = useState('');
  const [branch, setBranch] = useState('Computer Science & Engineering');
  const [year, setYear] = useState('2nd Year (Batch 2027)');
  const [programmeId, setProgrammeId] = useState('');
  const [bio, setBio] = useState('');
  const [interestTags, setInterestTags] = useState('React, TypeScript, System Design');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [signupSuccessInfo, setSignupSuccessInfo] = useState<{
    name: string;
    role: 'mentee' | 'mentor';
    enrollmentNo?: string;
    email: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const programmes = store.getProgrammes();

  useEffect(() => {
    setAuthMode(initialMode);
    setActiveRole(defaultRole);
    setSignupRole(defaultRole === 'mentor' ? 'mentor' : 'mentee');
    setError(null);
    setSignupSuccessInfo(null);
    setFullName('');
    setSignupEmail('');
    setEnrollmentInput('');
    setSignupPassword('');
    setConfirmPassword('');
    setBio('');
    setProgrammeId(programmes[0]?.id || '');

    if (defaultRole === 'mentee') {
      setIdentifier('04201012023');
      setPassword('mentee123');
    } else if (defaultRole === 'mentor') {
      setIdentifier('priya.sharma@techneeds.igdtuw.ac.in');
      setPassword('mentor123');
    } else {
      setIdentifier('admin@techneeds.igdtuw.ac.in');
      setPassword('admin123');
    }
  }, [defaultRole, initialMode, isOpen]);

  if (!isOpen) return null;

  const handleRoleTabChange = (role: Role) => {
    setActiveRole(role);
    setError(null);
    if (role === 'mentee') {
      setIdentifier('04201012023');
      setPassword('mentee123');
    } else if (role === 'mentor') {
      setIdentifier('priya.sharma@techneeds.igdtuw.ac.in');
      setPassword('mentor123');
    } else {
      setIdentifier('admin@techneeds.igdtuw.ac.in');
      setPassword('admin123');
    }
  };

  const handleModeSwitch = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setError(null);
    setSignupSuccessInfo(null);
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError(
        activeRole === 'mentee'
          ? 'Please enter your IGDTUW Enrollment Number or Email'
          : 'Please enter your registered email'
      );
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = store.login(identifier, activeRole, password);
      setLoading(false);
      if (result.success) {
        onSuccess();
        onClose();
      } else {
        setError(result.error || 'Authentication failed. Please verify credentials.');
      }
    }, 250);
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = store.registerUser({
        name: fullName,
        email: signupEmail,
        password: signupPassword,
        role: signupRole,
        enrollmentNo: signupRole === 'mentee' ? enrollmentInput : undefined,
        branch: signupRole === 'mentee' ? branch : undefined,
        year: signupRole === 'mentee' ? year : undefined,
        programmeId: programmeId || programmes[0]?.id,
        bio: bio.trim() || undefined,
        interestTags:
          signupRole === 'mentee'
            ? interestTags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            : undefined,
      });
      setLoading(false);

      if (result.success && result.user) {
        setSignupSuccessInfo({
          name: result.user.name,
          role: signupRole,
          enrollmentNo: result.enrollmentNo,
          email: result.user.email,
        });
      } else {
        setError(result.error || 'Unable to create account. Please try again.');
      }
    }, 250);
  };

  const handleQuickDemo = (demoType: 'admin' | 'mentor' | 'mentee1' | 'mentee2') => {
    if (demoType === 'admin') {
      setActiveRole('admin');
      setIdentifier('admin@techneeds.igdtuw.ac.in');
      setPassword('admin123');
    } else if (demoType === 'mentor') {
      setActiveRole('mentor');
      setIdentifier('priya.sharma@techneeds.igdtuw.ac.in');
      setPassword('mentor123');
    } else if (demoType === 'mentee1') {
      setActiveRole('mentee');
      setIdentifier('04201012023');
      setPassword('mentee123');
    } else {
      setActiveRole('mentee');
      setIdentifier('04301012023');
      setPassword('mentee123');
    }
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0F172A] border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        {/* Subtle top gradient glow */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Confirmation View after Sign Up */}
        {signupSuccessInfo ? (
          <div className="text-center py-4 space-y-5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">Welcome to TechNeeds, {signupSuccessInfo.name}!</h2>
              <p className="text-xs text-slate-400 mt-1">
                Your {signupSuccessInfo.role === 'mentee' ? 'Student Mentee' : 'Mentor'} account has been created and activated.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left space-y-2.5 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Registered Email</span>
                <span className="text-slate-200 font-medium">{signupSuccessInfo.email}</span>
              </div>

              {signupSuccessInfo.enrollmentNo && (
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">IGDTUW Enrollment No</span>
                    <span className="text-cyan-400 font-mono font-bold text-sm">
                      {signupSuccessInfo.enrollmentNo}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(signupSuccessInfo.enrollmentNo || '');
                      setCopiedId(true);
                      setTimeout(() => setCopiedId(false), 2000);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] flex items-center gap-1"
                  >
                    {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId ? 'Copied' : 'Copy ID'}</span>
                  </button>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                onSuccess();
                onClose();
              }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-600/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Enter {signupSuccessInfo.role === 'mentee' ? 'Student Dashboard' : 'Mentor Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-violet-950/80 border border-violet-700/50 text-cyan-400 mb-3 shadow-inner">
                {authMode === 'signup' ? (
                  <UserPlus className="w-6 h-6 text-cyan-400" />
                ) : activeRole === 'admin' ? (
                  <ShieldCheck className="w-6 h-6 text-violet-400" />
                ) : activeRole === 'mentor' ? (
                  <UserCheck className="w-6 h-6 text-cyan-400" />
                ) : (
                  <GraduationCap className="w-6 h-6 text-indigo-400" />
                )}
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {authMode === 'signup' ? 'Create TechNeeds Account' : 'Sign In to TechNeeds IGDTUW'}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {authMode === 'signup'
                  ? 'Register as a new IGDTUW student mentee or industry mentor'
                  : 'Access your mentorship cohorts, resources & technical intelligence'}
              </p>
            </div>

            {/* Auth Mode Toggle: Sign In vs Sign Up */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-xl mb-5">
              <button
                type="button"
                onClick={() => handleModeSwitch('signin')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  authMode === 'signin'
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => handleModeSwitch('signup')}
                className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                  authMode === 'signup'
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up</span>
              </button>
            </div>

            {authMode === 'signin' ? (
              <>
                {/* Role Selector Tabs for Sign In */}
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl mb-5">
                  <button
                    type="button"
                    onClick={() => handleRoleTabChange('mentee')}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      activeRole === 'mentee'
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Mentee</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleTabChange('mentor')}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      activeRole === 'mentor'
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Mentor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleTabChange('admin')}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      activeRole === 'admin'
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                </div>

                {/* Sign In Form */}
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      {activeRole === 'mentee'
                        ? 'IGDTUW Enrollment Number or Email'
                        : 'Registered Email Address'}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        {activeRole === 'mentee' ? (
                          <GraduationCap className="w-4 h-4" />
                        ) : (
                          <Mail className="w-4 h-4" />
                        )}
                      </div>
                      <input
                        type={activeRole === 'mentee' ? 'text' : 'email'}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder={
                          activeRole === 'mentee'
                            ? 'e.g. 04201012023 or student@igdtuw.ac.in'
                            : 'e.g. mentor@techneeds.igdtuw.ac.in'
                        }
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-sans"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Authenticating...
                      </span>
                    ) : (
                      <>
                        <span>Enter Workspace</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* 1-Click Demo Accounts Section */}
                <div className="mt-5 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400" />
                      1-Click Demo Credentials
                    </span>
                    <span className="text-[10px] text-slate-500">Click to autofill</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleQuickDemo('mentee1')}
                      className="p-2 text-left rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/90 hover:border-slate-700 transition-colors"
                    >
                      <div className="font-semibold text-slate-200">Ananya Verma</div>
                      <div className="text-[10px] text-violet-400 font-mono">04201012023 (Mentee)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemo('mentor')}
                      className="p-2 text-left rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/90 hover:border-slate-700 transition-colors"
                    >
                      <div className="font-semibold text-slate-200">Priya Sharma</div>
                      <div className="text-[10px] text-cyan-400">Mentor (Microsoft)</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemo('admin')}
                      className="p-2 text-left rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/90 hover:border-slate-700 transition-colors"
                    >
                      <div className="font-semibold text-slate-200">Dr. Aruna Sharma</div>
                      <div className="text-[10px] text-emerald-400">Program Director / Admin</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemo('mentee2')}
                      className="p-2 text-left rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/90 hover:border-slate-700 transition-colors"
                    >
                      <div className="font-semibold text-slate-200">Sneha Gupta</div>
                      <div className="text-[10px] text-violet-400 font-mono">04301012023 (Mentee)</div>
                    </button>
                  </div>

                  <p className="text-center text-xs text-slate-400 mt-4">
                    New to TechNeeds?{' '}
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('signup')}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2"
                    >
                      Create an account
                    </button>
                  </p>
                </div>
              </>
            ) : (
              /* SIGN UP FORM */
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5 text-xs">
                {/* Role selector */}
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setSignupRole('mentee');
                      setError(null);
                    }}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      signupRole === 'mentee'
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Student Mentee</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSignupRole('mentor');
                      setError(null);
                    }}
                    className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      signupRole === 'mentor'
                        ? 'bg-violet-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Industry Mentor</span>
                  </button>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Full Name *</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={signupRole === 'mentee' ? 'e.g. Kavya Nair' : 'e.g. Meera Iyer'}
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder={
                        signupRole === 'mentee'
                          ? 'kavya@student.igdtuw.ac.in'
                          : 'meera@techneeds.igdtuw.ac.in'
                      }
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                {signupRole === 'mentee' ? (
                  <>
                    <div>
                      <label className="block font-medium text-slate-300 mb-1">
                        IGDTUW Enrollment Number <span className="text-slate-500">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={enrollmentInput}
                        onChange={(e) => setEnrollmentInput(e.target.value)}
                        placeholder="Leave blank to auto-generate an ID"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block font-medium text-slate-300 mb-1">Branch</label>
                        <select
                          value={branch}
                          onChange={(e) => setBranch(e.target.value)}
                          className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-violet-500"
                        >
                          <option value="Computer Science & Engineering">CSE</option>
                          <option value="Information Technology">IT</option>
                          <option value="Artificial Intelligence & Data Science">AI & DS</option>
                          <option value="Electronics & Communication">ECE</option>
                          <option value="Mechanical & Automation">MAE</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-medium text-slate-300 mb-1">Year</label>
                        <select
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="w-full px-2.5 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-violet-500"
                        >
                          <option value="1st Year (Batch 2028)">1st Year</option>
                          <option value="2nd Year (Batch 2027)">2nd Year</option>
                          <option value="3rd Year (Batch 2026)">3rd Year</option>
                          <option value="4th Year (Batch 2025)">4th Year</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block font-medium text-slate-300 mb-1">Technical Interests</label>
                      <input
                        type="text"
                        value={interestTags}
                        onChange={(e) => setInterestTags(e.target.value)}
                        placeholder="e.g. React, Python, Distributed Systems"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Role & Organization</label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="e.g. Senior Engineer @ Google · IGDTUW Alumna"
                        className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-medium text-slate-300 mb-1">
                    {signupRole === 'mentee' ? 'Select Cohort Programme' : 'Cohort to Mentor'}
                  </label>
                  <select
                    value={programmeId}
                    onChange={(e) => setProgrammeId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white focus:outline-none focus:border-violet-500"
                  >
                    {programmes.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Password *</label>
                    <input
                      type="password"
                      required
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Confirm *</label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
                    />
                  </div>
                </div>

                {error && (
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-xs text-rose-300">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </span>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-400 pt-1">
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('signin')}
                    className="text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2"
                  >
                    Sign in here
                  </button>
                </p>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Code2,
  LogOut,
  Sparkles,
  ChevronDown,
  User as UserIcon,
  BookOpen,
  LayoutDashboard,
  Award,
  ExternalLink,
} from 'lucide-react';
import { User, Role } from '../../types';
import { store } from '../../services/store';

interface NavbarProps {
  currentUser: User | null;
  activeView: string;
  onNavigate: (view: string) => void;
  onOpenLogin: (role?: Role, mode?: 'signin' | 'signup') => void;
  onOpenAIProfile: (userId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeView,
  onNavigate,
  onOpenLogin,
  onOpenAIProfile,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const allUsers = store.getUsers();

  const handleRoleSwitch = (userId: string) => {
    store.switchUser(userId);
    setIsSwitcherOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleLogout = () => {
    store.logout();
    setIsUserMenuOpen(false);
    onNavigate('landing');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 p-0.5 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
              <div className="w-full h-full bg-[#0B0F19] rounded-[7px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white font-sans flex items-center gap-1.5 whitespace-nowrap">
                TechNeeds
                <span className="text-[11px] font-semibold uppercase tracking-wider text-violet-400 bg-violet-950/60 border border-violet-800/50 px-1.5 py-0.5 rounded">
                  IGDTUW
                </span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: 4-5 Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onNavigate('landing')}
            className={`whitespace-nowrap hover:text-white transition-colors ${
              activeView === 'landing' ? 'text-cyan-400 font-semibold' : ''
            }`}
          >
            Overview
          </button>

          {currentUser && (
            <button
              onClick={() => onNavigate('dashboard')}
              className={`whitespace-nowrap hover:text-white transition-colors flex items-center gap-1.5 ${
                activeView === 'dashboard' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-violet-400" />
              <span>Workspace</span>
            </button>
          )}

          {currentUser?.role === 'mentee' && (
            <button
              onClick={() => onOpenAIProfile(currentUser.id)}
              className={`whitespace-nowrap hover:text-white transition-colors flex items-center gap-1.5 ${
                activeView === 'ai-profile' ? 'text-cyan-400 font-semibold' : ''
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>AI Tech Profile</span>
            </button>
          )}

          <a
            href="#programmes"
            onClick={(e) => {
              if (activeView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('programmes')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="whitespace-nowrap shrink-0 hover:text-white transition-colors"
          >
            Programmes
          </a>

          <a
            href="#faqs"
            onClick={(e) => {
              if (activeView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="whitespace-nowrap shrink-0 hover:text-white transition-colors"
          >
            FAQs
          </a>

          <a
            href="#contact"
            onClick={(e) => {
              if (activeView !== 'landing') {
                e.preventDefault();
                onNavigate('landing');
                setTimeout(() => {
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }
            }}
            className="whitespace-nowrap shrink-0 hover:text-white transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action & Role Management */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Quick Demo Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-slate-900 border border-slate-700/80 text-slate-300 hover:text-white hover:border-slate-600 transition-all flex items-center gap-1.5"
              title="Switch demo persona for testing"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="hidden sm:inline">Role:</span>
              <span className="capitalize font-semibold text-violet-300">
                {currentUser?.role || 'Guest'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isSwitcherOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#131B2E] border border-slate-700/90 shadow-2xl p-2 z-50 text-xs">
                <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Switch Demo Persona
                </div>
                <div className="mt-1 space-y-1">
                  {allUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => handleRoleSwitch(u.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                        currentUser?.id === u.id
                          ? 'bg-violet-600/20 text-violet-200 border border-violet-500/30'
                          : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-6 h-6 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-medium text-white truncate max-w-[130px]">{u.name}</div>
                          <div className="text-[10px] text-slate-400 capitalize">{u.role}</div>
                        </div>
                      </div>
                      {currentUser?.id === u.id && (
                        <span className="text-[10px] text-cyan-400 font-semibold">Active</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Login Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-800/80 border border-slate-800 transition-colors focus:outline-none"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border border-violet-500/40"
                />
                <span className="hidden lg:block text-xs font-semibold text-slate-200 truncate max-w-[120px]">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#131B2E] border border-slate-700/90 shadow-2xl p-2 z-50 text-xs">
                  <div className="p-2 border-b border-slate-800">
                    <p className="font-semibold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    {currentUser.enrollmentNo && (
                      <p className="text-[10px] text-violet-400 font-mono mt-0.5">
                        Enrollment: {currentUser.enrollmentNo}
                      </p>
                    )}
                  </div>

                  <div className="py-1 space-y-0.5">
                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left"
                    >
                      <LayoutDashboard className="w-4 h-4 text-cyan-400" />
                      <span>{currentUser.role === 'admin' ? 'Admin Portal' : currentUser.role === 'mentor' ? 'Mentor Workspace' : 'Student Dashboard'}</span>
                    </button>

                    {currentUser.role === 'mentee' && (
                      <button
                        onClick={() => {
                          onOpenAIProfile(currentUser.id);
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors text-left"
                      >
                        <Sparkles className="w-4 h-4 text-violet-400" />
                        <span>AI Technical Profile</span>
                      </button>
                    )}
                  </div>

                  <div className="pt-1 border-t border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenLogin('mentee', 'signin')}
                className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap shrink-0"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenLogin('mentee', 'signup')}
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-lg shadow-md shadow-violet-600/20 transition-all whitespace-nowrap shrink-0"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

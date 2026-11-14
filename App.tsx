/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { store } from './services/store';
import { User, Role, Programme } from './types';
import { Navbar } from './components/common/Navbar';
import { LandingPage } from './components/landing/LandingPage';
import { LoginModal } from './components/auth/LoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { MentorDashboard } from './components/mentor/MentorDashboard';
import { MenteeDashboard } from './components/mentee/MenteeDashboard';
import { AIProfileView } from './components/profile/AIProfileView';
import { ProgrammeDetailsModal } from './components/programmes/ProgrammeDetailsModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(store.getCurrentUser());
  const [activeView, setActiveView] = useState<'landing' | 'dashboard' | 'ai-profile'>('landing');
  const [loginModal, setLoginModal] = useState<{
    isOpen: boolean;
    defaultRole: Role;
    initialMode: 'signin' | 'signup';
  }>({
    isOpen: false,
    defaultRole: 'mentee',
    initialMode: 'signin',
  });
  const [selectedProgramme, setSelectedProgramme] = useState<Programme | null>(null);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<string | null>(null);

  // Subscribe to store updates and enforce mentee-only AI profile access
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const updatedUser = store.getCurrentUser();
      setCurrentUser(updatedUser);
      setActiveView((prev) => {
        if (prev === 'ai-profile' && updatedUser?.role !== 'mentee') {
          return updatedUser ? 'dashboard' : 'landing';
        }
        return prev;
      });
    });
    return () => unsubscribe();
  }, []);

  const handleOpenLogin = (role: Role = 'mentee', mode: 'signin' | 'signup' = 'signin') => {
    setLoginModal({ isOpen: true, defaultRole: role, initialMode: mode });
  };

  const handleLoginSuccess = () => {
    setActiveView('dashboard');
  };

  const handleOpenAIProfile = (userId?: string) => {
    if (!currentUser) {
      handleOpenLogin('mentee', 'signin');
      return;
    }
    if (currentUser.role !== 'mentee') {
      setActiveView('dashboard');
      return;
    }
    const targetId = userId || currentUser.id;
    setSelectedStudentForProfile(targetId);
    setActiveView('ai-profile');
  };

  const handleNavigate = (view: string) => {
    if (view === 'dashboard' && !currentUser) {
      handleOpenLogin('mentee', 'signin');
      return;
    }
    if (view === 'ai-profile' && currentUser?.role !== 'mentee') {
      setActiveView(currentUser ? 'dashboard' : 'landing');
      return;
    }
    setActiveView(view as 'landing' | 'dashboard' | 'ai-profile');
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navigation */}
      <Navbar
        currentUser={currentUser}
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenLogin={handleOpenLogin}
        onOpenAIProfile={handleOpenAIProfile}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeView === 'landing' && (
          <LandingPage
            programmes={store.getProgrammes()}
            onOpenLogin={handleOpenLogin}
            onExploreProgrammes={() => {
              const el = document.getElementById('programmes');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onViewProgrammeDetails={(prog) => setSelectedProgramme(prog)}
          />
        )}

        {activeView === 'dashboard' && currentUser && (
          <>
            {currentUser.role === 'admin' && (
              <AdminDashboard
                onOpenProgrammeDetails={(prog) => setSelectedProgramme(prog)}
              />
            )}

            {currentUser.role === 'mentor' && (
              <MentorDashboard
                currentUser={currentUser}
              />
            )}

            {currentUser.role === 'mentee' && (
              <MenteeDashboard
                currentUser={currentUser}
                onOpenAIProfile={(userId) => handleOpenAIProfile(userId)}
              />
            )}
          </>
        )}

        {activeView === 'ai-profile' && currentUser?.role === 'mentee' && (
          <AIProfileView
            userId={selectedStudentForProfile || currentUser.id}
            onBack={() => setActiveView('dashboard')}
          />
        )}
      </main>

      {/* Authentication Modal (Sign In & Sign Up) */}
      <LoginModal
        isOpen={loginModal.isOpen}
        defaultRole={loginModal.defaultRole}
        initialMode={loginModal.initialMode}
        onClose={() => setLoginModal({ ...loginModal, isOpen: false })}
        onSuccess={handleLoginSuccess}
      />

      {/* Programme Details Curriculum Modal */}
      <ProgrammeDetailsModal
        programme={selectedProgramme}
        onClose={() => setSelectedProgramme(null)}
      />
    </div>
  );
}

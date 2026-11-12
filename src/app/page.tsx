'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProjectHeader } from '@/components/projects/ProjectHeader';
import { ProjectFilters } from '@/components/projects/ProjectFilters';
import { ProjectList } from '@/components/projects/ProjectList';
import { ProposalsView } from '@/components/proposals/ProposalsView';
import { PortfolioView } from '@/components/portfolio/PortfolioView';
import { ClientJobsView } from '@/components/client/ClientJobsView';
import { StudentsView } from '@/components/students/StudentsView';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { NotificationsView } from '@/components/notifications/NotificationsView';
import { MessagesView } from '@/components/messages/MessagesView';
import { HelpView } from '@/components/help/HelpView';

// Modals
import { ApplyModal } from '@/components/modals/ApplyModal';
import { PublishProjectModal } from '@/components/modals/PublishProjectModal';
import { StudentProfileModal } from '@/components/profile/StudentProfileModal';
import { StudentMatchModal } from '@/components/modals/StudentMatchModal';
import { AuthModal } from '@/components/modals/AuthModal';
import { AuthGateway } from '@/components/auth/AuthGateway';

function MainApp() {
  const { activeTab, currentUser } = useApp();

  // If user is not authenticated, show the Auth Gateway screen first
  if (!currentUser) {
    return <AuthGateway />;
  }

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Left Sidebar matching screenshot */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {activeTab === 'find-project' && (
          <div>
            <ProjectHeader />
            <div className="max-w-7xl mx-auto px-6 py-6 w-full">
              <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Left Filter Panel */}
                <ProjectFilters />

                {/* Main Results Grid */}
                <ProjectList />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'find-freelancers' && <StudentsView />}
        {activeTab === 'companies' && <ClientJobsView />}
        {activeTab === 'my-proposals' && <ProposalsView />}
        {activeTab === 'portfolio' && <PortfolioView />}
        {activeTab === 'messages' && <MessagesView />}
        {activeTab === 'notifications' && <NotificationsView />}
        {activeTab === 'admin-dashboard' && <AdminDashboard />}
        {activeTab === 'help' && <HelpView />}
      </main>

      {/* Global Interactive Modals */}
      <ApplyModal />
      <PublishProjectModal />
      <StudentProfileModal />
      <StudentMatchModal />
      <AuthModal />
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

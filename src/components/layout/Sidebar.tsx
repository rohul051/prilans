'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { 
  Compass, 
  Users, 
  Briefcase, 
  FileText, 
  MessageSquare, 
  Bell, 
  Settings, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck, 
  FolderGit2, 
  ChevronDown, 
  CheckCircle2,
  LogIn,
  LogOut
} from 'lucide-react';
import { UserRole } from '@/types';

export const Sidebar: React.FC = () => {
  const { 
    currentUser, 
    activeTab, 
    setActiveTab, 
    unreadNotificationsCount, 
    switchUserRole,
    setIsProfileModalOpen,
    setIsAuthModalOpen,
    signOut,
  } = useApp();

  const handleRoleChange = (role: UserRole) => {
    switchUserRole(role);
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0 overflow-y-auto select-none">
      {/* Brand Header */}
      <div className="p-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('find-project')}>
          <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-lg shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
              <path d="M6 6h10"/>
              <path d="M6 10h10"/>
            </svg>
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-gray-900">
            Prilans<span className="text-blue-600">.</span>
          </span>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="px-5 py-3">
        <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl relative group">
          <div className="flex items-center gap-3">
            <img
              src={currentUser?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser?.name || 'User')}`}
              alt={currentUser?.name || 'User'}
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {currentUser?.name || 'User'}
                </p>
                {currentUser?.verified && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">
                {currentUser?.email || ''}
              </p>
            </div>
            {currentUser?.role === 'student' && (
              <button 
                onClick={() => setIsProfileModalOpen(true)}
                className="text-gray-400 hover:text-gray-600"
                title="Edit Skill Profile"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* User Role Badge & Sign Out */}
          <div className="mt-2.5 pt-2 border-t border-gray-200/60 flex items-center justify-between text-xs">
            <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">
              {currentUser?.role || 'Guest'}
            </span>

            <button
              onClick={signOut}
              className="flex items-center gap-1 text-gray-500 hover:text-red-600 text-[11px] font-medium transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="px-4 py-2 flex-1 space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Menu
          </p>
          <nav className="space-y-1">
            {/* Find Project */}
            <button
              onClick={() => setActiveTab('find-project')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'find-project'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Compass className="w-4 h-4 text-gray-500" />
              <span>Find Project</span>
            </button>

            {/* Find Freelancers / Students */}
            <button
              onClick={() => setActiveTab('find-freelancers')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'find-freelancers'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4 text-gray-500" />
              <span>Find Freelancers</span>
              <span className="ml-auto text-[10px] bg-blue-50 text-blue-600 font-bold px-1.5 py-0.5 rounded">
                Students
              </span>
            </button>

            {/* Companies / My Posted Jobs */}
            <button
              onClick={() => setActiveTab('companies')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'companies'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Briefcase className="w-4 h-4 text-gray-500" />
              <span>Companies & Jobs</span>
            </button>

            {/* My Proposal / Application Status */}
            <button
              onClick={() => setActiveTab('my-proposals')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'my-proposals'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4 text-gray-500" />
              <span>My Proposals</span>
            </button>

            {/* Student Portfolio Management */}
            {currentUser?.role === 'student' && (
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'portfolio'
                    ? 'bg-gray-100 text-gray-900 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FolderGit2 className="w-4 h-4 text-gray-500" />
                <span>My Portfolio</span>
              </button>
            )}

            {/* Messages */}
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'messages'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span>Message</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'notifications'
                  ? 'bg-gray-100 text-gray-900 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Bell className="w-4 h-4 text-gray-500" />
              <span>Notification</span>
              {unreadNotificationsCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Admin Dashboard */}
            <button
              onClick={() => setActiveTab('admin-dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'admin-dashboard'
                  ? 'bg-purple-100 text-purple-950 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              <span>Admin Dashboard</span>
            </button>
          </nav>
        </div>

        {/* Preferences Section */}
        <div>
          <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Preferences
          </p>
          <nav className="space-y-1">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              <span>Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('help')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-gray-500" />
              <span>Help & Guidelines</span>
            </button>
          </nav>
        </div>
      </div>
    </aside>
  );
};


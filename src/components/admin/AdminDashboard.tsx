'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  FileText, 
  Star, 
  Trash2, 
  CheckCircle, 
  AlertTriangle, 
  Search,
  ExternalLink
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    projects, 
    users, 
    proposals, 
    deleteProject, 
    updateStudentProfile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'students' | 'audit'>('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const students = users.filter((u) => u.role === 'student');
  const clients = users.filter((u) => u.role === 'client');

  const handleToggleStudentVerification = async (studentId: string, currentStatus: boolean) => {
    const student = users.find((u) => u.id === studentId);
    if (!student) return;
    await updateStudentProfile({ ...student, verified: !currentStatus });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-purple-950 to-gray-900 text-white p-7 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-purple-400/30">
              Administrative Portal
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight">
            Prilans System Admin Dashboard
          </h2>
          <p className="text-xs text-gray-300 mt-1 max-w-xl">
            Monitor university student talent pipeline, moderate client job postings, verify credentials, and manage live platform operations.
          </p>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold">Total Students</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{students.length}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Registered Student Talent
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold">Total Clients</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{clients.length}</p>
          <span className="text-[11px] text-purple-600 font-semibold mt-1 block">
            Active Job Posters
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold">Total Projects</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{projects.length}</p>
          <span className="text-[11px] text-gray-500 font-semibold mt-1 block">
            Published Marketplace Jobs
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-gray-500 mb-2">
            <span className="text-xs font-semibold">Total Proposals</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{proposals.length}</p>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
            Active Student Bids
          </span>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        {[
          { id: 'overview', label: 'Overview & Controls' },
          { id: 'projects', label: `Moderate Projects (${projects.length})` },
          { id: 'students', label: `Verify Students (${students.length})` },
          { id: 'audit', label: 'Platform Activity Audit' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-gray-900 text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h4 className="font-bold text-gray-900 text-sm mb-1">
              Platform Health & Administration
            </h4>
            <p className="text-xs text-gray-500 mb-6">
              Review marketplace activity, moderate student profiles and client project requests.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div 
                onClick={() => setActiveTab('projects')}
                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900">Moderate Projects</span>
                  <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    {projects.length}
                  </span>
                </div>
                <p className="text-gray-500 text-[11px]">
                  Manage active marketplace job postings, delete spam, or review project scopes.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('students')}
                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900">Verify Students</span>
                  <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {students.length}
                  </span>
                </div>
                <p className="text-gray-500 text-[11px]">
                  Review university credentials, skills profiles, and issue verified student badges.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('audit')}
                className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-gray-900">Activity Stream</span>
                  <span className="text-xs font-extrabold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                    Live
                  </span>
                </div>
                <p className="text-gray-500 text-[11px]">
                  Monitor real-time application updates, bids, and ratings across the network.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Moderate Projects */}
      {activeTab === 'projects' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h4 className="font-bold text-gray-900 text-sm">
              All Published Projects ({projects.length})
            </h4>
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Client</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Budget</th>
                  <th className="p-3.5">Proposals</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {projects
                  .filter((p) => p.title.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/80">
                      <td className="p-3.5 font-bold text-gray-900 max-w-xs truncate">
                        {p.title}
                      </td>
                      <td className="p-3.5 text-gray-600">{p.client.name}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-medium">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-3.5 font-bold text-gray-900">
                        ${p.budget.toFixed(2)}
                      </td>
                      <td className="p-3.5">{p.proposalsCount || 0}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete project: "${p.title}"?`)) {
                              deleteProject(p.id);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete / Moderate"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Students Verification */}
      {activeTab === 'students' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h4 className="font-bold text-gray-900 text-sm">
              Registered University Students ({students.length})
            </h4>
            <p className="text-xs text-gray-400">
              Verify university credentials, examine skill profiles, and issue verification badges.
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {students.map((student) => (
              <div key={student.id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h5 className="font-bold text-gray-900 text-sm">{student.name}</h5>
                      {student.verified && (
                        <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {student.university || 'University Student'}{student.major ? ` • ${student.major}` : ''}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {student.skills.slice(0, 5).map((s) => (
                        <span key={s} className="text-[10px] px-1.5 py-0.2 bg-gray-100 text-gray-600 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-gray-600">
                    Rating: {student.avgRating && student.avgRating > 0 ? `${student.avgRating} ★` : 'New'}
                  </span>
                  <button
                    onClick={() => handleToggleStudentVerification(student.id, student.verified)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      student.verified
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {student.verified ? 'Verified Student ✓' : 'Approve & Verify'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
          <h4 className="font-bold text-gray-900 text-sm">
            Live Platform Audit Stream
          </h4>
          {proposals.length === 0 && projects.length === 0 && users.length === 0 ? (
            <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-400">
              No activity recorded in Firestore yet. User registrations and proposals will appear here in real time.
            </div>
          ) : (
            <div className="space-y-3">
              {proposals.map((prop) => (
                <div key={prop.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs">
                  <span className="font-medium text-gray-800">
                    Application from {prop.studentName} for &quot;{prop.projectTitle}&quot; (Status: {prop.status.replace('_', ' ')})
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {new Date(prop.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {projects.map((proj) => (
                <div key={proj.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs">
                  <span className="font-medium text-gray-800">
                    Project &quot;{proj.title}&quot; published by {proj.client.name} (${proj.budget.toFixed(2)})
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">
                    {new Date(proj.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-xs">
                  <span className="font-medium text-gray-800">
                    User {u.name} active as {u.role}
                  </span>
                  <span className="text-[11px] text-gray-400 font-mono">Firestore</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};


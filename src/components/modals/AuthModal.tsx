'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AuthService } from '@/lib/authService';
import { 
  X, 
  LogIn, 
  UserPlus, 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  AlertCircle, 
  CheckCircle,
  KeyRound,
  Mail,
  Lock,
  User,
  MapPin,
  DollarSign
} from 'lucide-react';
import { ExperienceLevel } from '@/types';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    currentUser, 
    setCurrentUser,
    refreshData 
  } = useApp();

  const [mode, setMode] = useState<'signin' | 'student-signup' | 'client-signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(15);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>('Entry Level');
  const [skills, setSkills] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await AuthService.login(email, password);
      setCurrentUser(user);
      setSuccessMsg(`Welcome back, ${user.name}!`);
      await refreshData();
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setSuccessMsg('');
      }, 1000);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to sign in with Firebase Auth. Please check email/password.');
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const skillsArray = skills.split(',').map((s) => s.trim()).filter(Boolean);
      const user = await AuthService.registerStudent({
        email,
        password,
        name,
        university,
        major,
        hourlyRate,
        skills: skillsArray,
        experienceLevel,
      });

      setCurrentUser(user);
      setSuccessMsg(`Student account created in Firebase! Welcome, ${user.name}`);
      await refreshData();
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setSuccessMsg('');
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error creating student account in Firebase Auth');
    } finally {
      setLoading(false);
    }
  };

  const handleClientSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await AuthService.registerClient({
        email,
        password,
        name,
        country,
      });

      setCurrentUser(user);
      setSuccessMsg(`Client account created in Firebase! Welcome, ${user.name}`);
      await refreshData();
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setSuccessMsg('');
      }, 1200);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error creating employer account in Firebase Auth');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                Firebase Authentication
              </span>
              <h2 className="text-xl font-extrabold text-gray-900">
                {mode === 'signin' && 'Sign In to Prilans'}
                {mode === 'student-signup' && 'Register Student Account'}
                {mode === 'client-signup' && 'Register Client / Employer'}
              </h2>
            </div>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="px-6 pt-4">
          <div className="grid grid-cols-3 p-1 bg-gray-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => { setMode('signin'); setError(''); }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'signin' ? 'bg-white shadow-xs text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('student-signup'); setError(''); }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'student-signup' ? 'bg-white shadow-xs text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Student Join
            </button>
            <button
              onClick={() => { setMode('client-signup'); setError(''); }}
              className={`py-2 rounded-lg transition-all ${
                mode === 'client-signup' ? 'bg-white shadow-xs text-purple-600 font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Client Join
            </button>
          </div>
        </div>

        <div className="p-6 pt-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-100">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form: Sign In */}
          {mode === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 pl-9 pr-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Signing in with Firebase...' : 'Sign In with Firebase Auth'}</span>
              </button>
            </form>
          )}

          {/* Form: Student Sign Up */}
          {mode === 'student-signup' && (
            <form onSubmit={handleStudentSignUp} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Student Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Hourly Rate ($/hr)
                  </label>
                  <input
                    type="number"
                    min="5"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 15)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    minLength={6}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    University / Institution
                  </label>
                  <input
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="e.g. University Name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Department / Major
                  </label>
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="e.g. Computer Science / Software Engineering"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Next.js, Figma, WordPress, Python"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as ExperienceLevel)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="Entry Level">Entry Level</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span>{loading ? 'Creating student in Firebase...' : 'Register Student'}</span>
              </button>
            </form>
          )}

          {/* Form: Client Sign Up */}
          {mode === 'client-signup' && (
            <form onSubmit={handleClientSignUp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Client / Company Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="hiring@company.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    minLength={6}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Country / Location
                </label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Germany, United States, Bangladesh"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Briefcase className="w-4 h-4" />
                <span>{loading ? 'Creating employer in Firebase...' : 'Register Client Account'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


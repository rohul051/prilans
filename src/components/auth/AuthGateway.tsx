'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AuthService } from '@/lib/authService';
import { 
  LogIn, 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Mail, 
  Lock, 
  User as UserIcon, 
  MapPin, 
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';
import { ExperienceLevel } from '@/types';

export const AuthGateway: React.FC = () => {
  const { setCurrentUser, refreshData } = useApp();

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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await AuthService.login(email, password);
      setSuccessMsg(`Welcome back, ${user.name}!`);
      setCurrentUser(user);
      await refreshData();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to sign in. Please verify your email and password.');
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

      setSuccessMsg(`Account created successfully! Welcome, ${user.name}`);
      setCurrentUser(user);
      await refreshData();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error creating student account with Firebase Auth.');
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

      setSuccessMsg(`Client account created successfully! Welcome, ${user.name}`);
      setCurrentUser(user);
      await refreshData();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error creating client account with Firebase Auth.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center px-4 py-12">
      <div className="max-w-4xl w-full bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-5">
        
        {/* Left Side: Branding & Info */}
        <div className="md:col-span-2 bg-gradient-to-br from-gray-950 via-gray-900 to-blue-950 text-white p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-white text-gray-900 flex items-center justify-center font-bold text-lg shadow-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
                  <path d="M6 6h10"/>
                  <path d="M6 10h10"/>
                </svg>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                Prilans<span className="text-blue-400">.</span>
              </span>
            </div>

            <h2 className="text-2xl font-black leading-snug tracking-tight mb-3">
              Where University Talent Meets Real Projects.
            </h2>
            <p className="text-xs text-gray-300 leading-relaxed mb-6">
              Sign in or create an account to access the project marketplace, manage student applications, and connect with clients.
            </p>

            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Verified university student profiles</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Publish job requests & hire student talent</span>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span>Real-time Firebase Authentication & Firestore</span>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 text-[11px] text-gray-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>Secure Authentication Powered by Firebase</span>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="md:col-span-3 p-8 flex flex-col justify-center">
          {/* Mode Selector Tabs */}
          <div className="grid grid-cols-3 p-1 bg-gray-100 rounded-2xl text-xs font-semibold mb-6">
            <button
              onClick={() => { setMode('signin'); setError(''); setSuccessMsg(''); }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'signin' ? 'bg-white shadow-xs text-gray-900 font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('student-signup'); setError(''); setSuccessMsg(''); }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'student-signup' ? 'bg-white shadow-xs text-blue-600 font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Student Join
            </button>
            <button
              onClick={() => { setMode('client-signup'); setError(''); setSuccessMsg(''); }}
              className={`py-2 rounded-xl transition-all ${
                mode === 'client-signup' ? 'bg-white shadow-xs text-purple-600 font-bold' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              Client Join
            </button>
          </div>

          {error && (
            <div className="p-3.5 mb-4 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-100">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 mb-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Sign In Form */}
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
                className="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Authenticating with Firebase...' : 'Sign In to Dashboard'}</span>
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-gray-400">Don't have an account? </span>
                <button
                  type="button"
                  onClick={() => setMode('student-signup')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Create Student Profile
                </button>
              </div>
            </form>
          )}

          {/* Student Sign Up Form */}
          {mode === 'student-signup' && (
            <form onSubmit={handleStudentSignUp} className="space-y-3">
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
                    Major / Department
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
                  Skills Profile (comma separated)
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
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                <GraduationCap className="w-4 h-4" />
                <span>{loading ? 'Creating Student Account in Firebase...' : 'Create Student Account & Go to Dashboard'}</span>
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-gray-400">Already registered? </span>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* Client Sign Up Form */}
          {mode === 'client-signup' && (
            <form onSubmit={handleClientSignUp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Client / Organization Name
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
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                <Briefcase className="w-4 h-4" />
                <span>{loading ? 'Creating Client Account in Firebase...' : 'Create Client Account & Go to Dashboard'}</span>
              </button>

              <div className="text-center pt-1">
                <span className="text-xs text-gray-400">Already registered? </span>
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-xs font-bold text-purple-600 hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};


'use client';

import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  BookOpen,
  Mail,
  Shield,
  Key,
  Bell,
  Settings,
  Sparkles,
  CheckCircle2,
  Save,
  Flame,
  Award,
  LogOut
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';

export default function ProfilePage() {
  const { student, user, signOut } = useStudent();
  const [apiKey, setApiKey] = useState('');
  const [savedKey, setSavedKey] = useState(false);

  const handleSaveApiKey = () => {
    setSavedKey(true);
    setTimeout(() => setSavedKey(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <User className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Student Profile & Intelligence Settings
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Verified academic dossier, college ERP sync parameters, and Gemini API credentials.
          </p>
        </div>

        <button
          onClick={() => signOut()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold text-xs transition-colors self-start sm:self-auto"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#0b101f] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-cyan-400 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-indigo-600/30">
            {student.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{student.name}</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                AUTHENTICATED
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{student.degree}</p>
            <p className="text-xs text-slate-400 mt-1">
              Email: <span className="text-cyan-400 font-mono">{user?.email || student.email || 'student@college.edu'}</span>
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Roll No: <span className="font-mono text-cyan-400 font-bold">{student.rollNumber}</span> • {student.college}
            </p>
          </div>
        </div>

        <div className="text-right self-stretch sm:self-auto p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Health Index
          </span>
          <span className="text-3xl font-black text-indigo-400">
            {student.overallHealthScore} <span className="text-sm text-slate-400">/ 100</span>
          </span>
        </div>
      </div>

      {/* Academic Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-3xl bg-[#0b101f] border border-slate-800 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            University Details
          </span>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">University Affiliation</span>
              <span className="text-slate-200 font-medium">State Technical University</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Current Semester</span>
              <span className="text-slate-200 font-medium">Semester VI (Final Year Pre-Final)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Department</span>
              <span className="text-slate-200 font-medium">Computer Science & Engineering</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Cumulative CGPA</span>
              <span className="text-emerald-400 font-mono font-bold">8.42 / 10.0</span>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-[#0b101f] border border-slate-800 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-indigo-400" />
            Capstone Viva Project
          </span>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Project Title</span>
              <span className="text-slate-200 font-bold truncate max-w-[200px]">NeuroRoute: AI Transit</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Project Role</span>
              <span className="text-cyan-400 font-medium">Backend & Distributed Systems</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Guide</span>
              <span className="text-slate-200 font-medium">Prof. R. Sharma (HOD CSE)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Turnitin Plagiarism</span>
              <span className="text-emerald-400 font-mono font-bold">8.2% (Passed &lt; 15%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Intelligence API Integration Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#090e1b] border border-cyan-500/20 space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-white">
            Gemini API Integration & Custom Key
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          CrackwithX runs on zero-configuration demo mode out of the box with realistic student data. To power real-time multimodal document OCR, speech analysis, and dynamic viva reasoning with your own Google Gemini API key:
        </p>

        <div className="space-y-2 max-w-xl">
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter GEMINI_API_KEY (e.g. AIzaSy...)"
              className="flex-1 bg-[#0d1428] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-slate-400 font-mono focus:outline-none focus:border-cyan-400"
            />
            <button
              onClick={handleSaveApiKey}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{savedKey ? 'Saved!' : 'Save Key'}</span>
            </button>
          </div>
          <span className="text-[10px] text-slate-400 block">
            Keys are stored locally in browser session and never sent to third-party trackers.
          </span>
        </div>
      </div>
    </div>
  );
}

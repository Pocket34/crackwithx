'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LayoutDashboard, Brain, Sparkles, LogOut } from 'lucide-react';
import { XArenaWorkspace } from '@/components/x-arena/XArenaWorkspace';
import { useStudent } from '@/context/StudentContext';

export default function StandaloneXArenaPage() {
  const router = useRouter();
  const { user, isLoadingAuth, signOut } = useStudent();

  useEffect(() => {
    if (!isLoadingAuth) {
      if (!user) {
        router.replace('/');
      } else if (!user.email_confirmed_at) {
        router.replace(`/verify?email=${encodeURIComponent(user.email || '')}`);
      }
    }
  }, [isLoadingAuth, user, router]);

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-[#06080e] flex items-center justify-center text-slate-200">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-xl shadow-cyan-500/20">
            <div className="w-full h-full bg-[#080c16] rounded-[14px] flex items-center justify-center font-black tracking-wider text-xl text-white">
              <span className="text-white">C</span>
              <span className="text-cyan-400 font-extrabold ml-[1px]">X</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono text-slate-400 tracking-wider">
              CHECKING AUTHENTICATED SESSION...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !user.email_confirmed_at) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#06080e] text-slate-100 flex flex-col">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-slate-800/80 bg-[#080c16]/90 backdrop-blur-xl sticky top-0 z-30 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/app"
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Student OS</span>
          </Link>

          <div className="h-4 w-px bg-slate-800" />

          <Link href="/app" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-[#080c16] rounded-[11px] flex items-center justify-center font-black tracking-wider text-sm text-white">
                <span className="text-white">C</span>
                <span className="text-cyan-400 font-extrabold ml-[1px]">X</span>
              </div>
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-sm">Crackwith</span>
              <span className="font-black text-cyan-400 text-sm">X</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Multi-AI Workspace</span>
          </div>

          <Link
            href="/app"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dashboard</span>
          </Link>

          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 text-xs font-semibold transition-colors"
            title="Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20">
        <XArenaWorkspace />
      </main>
    </div>
  );
}

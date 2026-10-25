'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Search,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  X,
  ChevronRight,
  ExternalLink,
  Flame,
  LifeBuoy,
  LogOut
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';

export const Topbar: React.FC<{ onOpenSearch: () => void }> = ({ onOpenSearch }) => {
  const { student, risks, notifications, unreadNotifsCount, markAllNotifsRead, signOut } = useStudent();
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const criticalRisk = risks.find(r => r.severity === 'CRITICAL');

  return (
    <header className="h-16 sticky top-0 z-20 bg-[#080c16]/85 border-b border-slate-800/60 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8">
      {/* Left Search trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 text-slate-400 hover:text-slate-200 transition-all text-xs w-48 sm:w-64 md:w-80"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span className="flex-1 text-left truncate">Search actions, viva, exams...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono border border-slate-700">
            ⌘K
          </kbd>
        </button>

        {/* Live Academic Risk Badge */}
        {criticalRisk && (
          <Link
            href="/app/risk-radar"
            className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs hover:bg-rose-500/20 transition-all animate-pulse"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-medium truncate max-w-[200px]">{criticalRisk.title}</span>
            <span className="text-[10px] bg-rose-500/30 px-1.5 py-0.2 rounded font-semibold text-rose-200">
              Fix
            </span>
          </Link>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Active Student Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Student: <strong className="text-white">{student.name}</strong></span>
        </div>

        {/* Problem solver quick button on mobile */}
        <Link
          href="/app/problem-solver"
          className="lg:hidden flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold"
        >
          <LifeBuoy className="w-3.5 h-3.5 text-rose-400" />
          <span>Help</span>
        </Link>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg shadow-rose-500/50 animate-bounce">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0b101d] border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white">Notifications</span>
                  {unreadNotifsCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      {unreadNotifsCount} new
                    </span>
                  )}
                </div>
                {unreadNotifsCount > 0 && (
                  <button
                    onClick={markAllNotifsRead}
                    className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="divide-y divide-slate-800/60 max-h-80 overflow-y-auto mt-2">
                {notifications.map((n) => (
                  <Link
                    key={n.id}
                    href={n.route || '/app'}
                    onClick={() => setShowNotifMenu(false)}
                    className="py-3 px-2 flex items-start gap-3 hover:bg-slate-800/40 rounded-xl transition-colors block"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        n.type === 'critical'
                          ? 'bg-rose-500 shadow-sm shadow-rose-500'
                          : n.type === 'warning'
                          ? 'bg-amber-400'
                          : 'bg-indigo-400'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200 truncate">
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-2 whitespace-nowrap">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="pt-3 mt-2 border-t border-slate-800 text-center">
                <Link
                  href="/app/tasks"
                  onClick={() => setShowNotifMenu(false)}
                  className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 transition-colors"
                >
                  <span>View all academic tasks</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar */}
        <Link
          href="/app/profile"
          className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 p-[1.5px] hover:scale-105 transition-transform"
          title="Profile & Settings"
        >
          <div className="w-full h-full bg-[#0b101e] rounded-[10px] flex items-center justify-center text-xs font-bold text-white">
            {student.name.charAt(0)}
          </div>
        </Link>

        {/* Quick Logout Button */}
        <button
          onClick={() => signOut()}
          className="w-9 h-9 rounded-xl bg-slate-900/80 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/30 flex items-center justify-center text-slate-400 hover:text-rose-400 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

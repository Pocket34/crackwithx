'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  Zap,
  Radar,
  Brain,
  Microscope,
  Dna,
  ShieldAlert,
  LifeBuoy,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Flame,
  LogOut
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';

const navItems = [
  {
    name: 'Dashboard',
    href: '/app',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: '🧠 X-ARENA',
    href: '/app/x-arena',
    icon: Brain,
    badge: 'MULTI-AI',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    highlight: true,
  },
  {
    name: 'My Tasks',
    href: '/app/tasks',
    icon: CheckSquare,
    badge: '3 pending',
  },
  {
    name: 'Action Engine',
    href: '/app/action-engine',
    icon: Zap,
    badge: 'Notice AI',
    highlight: true,
  },
  {
    name: 'Risk Radar',
    href: '/app/risk-radar',
    icon: Radar,
    badge: 'Critical',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  },
  {
    name: 'AI Examiner',
    href: '/app/ai-examiner',
    icon: Brain,
    badge: 'Hero Viva',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  },
  {
    name: 'Exam Forensics',
    href: '/app/exam-forensics',
    icon: Microscope,
    badge: 'Loss DNA',
  },
  {
    name: 'Project DNA',
    href: '/app/project-dna',
    icon: Dna,
    badge: 'Graph',
  },
  {
    name: 'Opportunity Shield',
    href: '/app/opportunity-shield',
    icon: ShieldAlert,
    badge: 'Verify',
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { student, risks, signOut } = useStudent();
  const criticalCount = risks.filter(r => r.severity === 'CRITICAL').length;

  return (
    <aside className="hidden lg:flex w-72 flex-col fixed inset-y-0 left-0 z-30 bg-[#080c16]/95 border-r border-slate-800/70 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800/60">
        <Link href="/app" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300">
            <div className="w-full h-full bg-[#090d18] rounded-[11px] flex items-center justify-center font-black tracking-wider text-lg text-white">
              <span className="bg-gradient-to-r from-white via-indigo-200 to-cyan-300 bg-clip-text text-transparent">C</span>
              <span className="text-cyan-400 font-extrabold ml-[1px]">X</span>
            </div>
          </div>
          <div>
            <span className="font-bold tracking-tight text-white text-base">Crackwith</span>
            <span className="font-black text-cyan-400 text-base">X</span>
            <span className="block text-[9px] font-medium tracking-widest text-slate-400 uppercase -mt-1">
              STUDENT OS
            </span>
          </div>
        </Link>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Flame className="w-3 h-3 text-amber-400" />
          v1.0
        </span>
      </div>

      {/* Main Problem CTA */}
      <div className="p-4 pb-2">
        <Link
          href="/app/problem-solver"
          className="w-full relative group overflow-hidden rounded-xl p-[1px] flex items-center justify-center block transition-all duration-300"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-indigo-500 to-cyan-500 animate-shimmer" />
          <div className="relative w-full bg-[#0c1222] hover:bg-[#10172e] py-2.5 px-3.5 rounded-[11px] flex items-center justify-between transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 flex items-center justify-center text-rose-400">
                <LifeBuoy className="w-4 h-4 animate-spin" style={{ animationDuration: '10s' }} />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-white tracking-wide">
                  I HAVE A PROBLEM
                </span>
                <span className="block text-[10px] text-slate-400">
                  Instant guidance & letters
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Core Intelligence Modules
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/app/x-arena' && (pathname === '/app/x-arena' || pathname === '/x-arena'));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/20 to-cyan-500/10 text-white border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30'
                      : 'bg-slate-800/70 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                    item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-4 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Student Health Snapshot
        </div>
        
        {/* Academic Health Mini-Card */}
        <Link
          href="/app/risk-radar"
          className="mx-1 p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 block transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-slate-400">Academic Health</span>
            <span className="text-xs font-bold text-indigo-400 group-hover:text-cyan-400 transition-colors">
              {student.overallHealthScore} / 100
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 via-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${student.overallHealthScore}%` }}
            />
          </div>
          {criticalCount > 0 && (
            <div className="mt-2 text-[10px] text-rose-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              <span>{criticalCount} critical risk detected</span>
            </div>
          )}
        </Link>
      </nav>

      {/* User Footer Snapshot with Logout */}
      <div className="p-3 border-t border-slate-800/60 bg-[#070b14]/90 flex items-center justify-between gap-2">
        <Link
          href="/app/profile"
          className="flex-1 min-w-0 flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/50 transition-colors group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-md flex-shrink-0">
            {student.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                {student.name}
              </span>
            </div>
            <span className="block text-[10px] text-slate-400 truncate">
              {student.email || student.degree}
            </span>
          </div>
        </Link>

        <button
          onClick={() => signOut()}
          className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 flex items-center justify-center transition-colors flex-shrink-0"
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

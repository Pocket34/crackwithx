'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CheckSquare,
  Brain,
  Radar,
  Menu,
  X,
  Zap,
  Microscope,
  Dna,
  ShieldAlert,
  LifeBuoy,
  User,
  ChevronRight
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';

export const MobileNav: React.FC = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { risks } = useStudent();
  const criticalCount = risks.filter(r => r.severity === 'CRITICAL').length;

  const bottomItems = [
    { name: 'Home', href: '/app', icon: LayoutDashboard },
    { name: 'Tasks', href: '/app/tasks', icon: CheckSquare },
    { name: 'Viva', href: '/app/ai-examiner', icon: Brain, highlight: true },
    { name: 'Radar', href: '/app/risk-radar', icon: Radar, badge: criticalCount > 0 },
  ];

  const drawerItems = [
    { name: '🧠 X-ARENA (Multi-AI)', href: '/app/x-arena', icon: Brain, desc: 'Ask once. Multiple AI models. One answer.', highlight: true },
    { name: 'Action Engine (Notice AI)', href: '/app/action-engine', icon: Zap, desc: 'Analyze notices, PDFs, WhatsApp' },
    { name: 'Exam Forensics', href: '/app/exam-forensics', icon: Microscope, desc: 'Answer sheet markup & mark loss' },
    { name: 'Project DNA', href: '/app/project-dna', icon: Dna, desc: 'Interactive skill & architecture graph' },
    { name: 'Opportunity Shield', href: '/app/opportunity-shield', icon: ShieldAlert, desc: 'Scam detector & trust audit' },
    { name: 'Student Problem Solver', href: '/app/problem-solver', icon: LifeBuoy, desc: 'Step-by-step resolution & letters', highlight: true },
    { name: 'My Profile & Settings', href: '/app/profile', icon: User, desc: 'Pushkar — B.E. CSE Sem 6' },
  ];

  return (
    <>
      {/* Bottom Nav Bar */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#080c16]/95 border-t border-slate-800/80 backdrop-blur-xl px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
                isActive ? 'text-cyan-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${item.highlight && !isActive ? 'text-indigo-400' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                )}
              </div>
              <span className="text-[10px] mt-0.5">{item.name}</span>
            </Link>
          );
        })}

        {/* More Menu Button */}
        <button
          onClick={() => setMenuOpen(true)}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
            menuOpen ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">More</span>
        </button>
      </nav>

      {/* Drawer Overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end animate-in fade-in duration-200">
          <div className="bg-[#0b101e] border-t border-slate-800 rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-base font-bold text-white">CrackwithX Modules</span>
                <p className="text-xs text-slate-400">Complete student operating system</p>
              </div>
              <button
                onClick={() => setMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2">
              {drawerItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      item.highlight
                        ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                        : 'bg-slate-900/60 border-slate-800/80 text-slate-200 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{item.name}</div>
                        <div className="text-[10px] text-slate-400">{item.desc}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

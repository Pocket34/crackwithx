'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Zap,
  Radar,
  Brain,
  Microscope,
  Dna,
  ShieldAlert,
  LifeBuoy,
  CheckSquare,
  FileText,
  AlertTriangle,
  X
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';

export const CommandPalette: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const { actions, risks } = useStudent();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          setQuery('');
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickLinks = [
    { name: '🧠 X-ARENA (Multi-AI Workspace)', desc: 'Ask once. Multiple AI models (GPT, Gemini, Claude). One better answer.', href: '/app/x-arena', icon: Brain },
    { name: 'Student Action Engine', desc: 'Scan notices, WhatsApp messages, PDFs', href: '/app/action-engine', icon: Zap },
    { name: 'Student Risk Radar', desc: 'Attendance, deadlocks, academic health analysis', href: '/app/risk-radar', icon: Radar },
    { name: 'AI Examiner (Viva Mode)', desc: 'Full-screen mock viva & cross-questioning', href: '/app/ai-examiner', icon: Brain },
    { name: 'Exam Forensics', desc: 'Answer sheet markup & mark loss breakdown', href: '/app/exam-forensics', icon: Microscope },
    { name: 'Project DNA', desc: 'Interactive skill graph & prove-it challenge', href: '/app/project-dna', icon: Dna },
    { name: 'Opportunity Shield', desc: 'Verify internships & detect fake offers', href: '/app/opportunity-shield', icon: ShieldAlert },
    { name: 'Student Problem Solver', desc: 'Generate letters, appeals, and formal paths', href: '/app/problem-solver', icon: LifeBuoy },
    { name: 'My Tasks', desc: 'All actionable deadlines & checklists', href: '/app/tasks', icon: CheckSquare },
  ];

  const filteredLinks = quickLinks.filter(
    (l) => l.name.toLowerCase().includes(query.toLowerCase()) || l.desc.toLowerCase().includes(query.toLowerCase())
  );

  const filteredActions = actions.filter(
    (a) => a.title.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredRisks = risks.filter(
    (r) => r.title.toLowerCase().includes(query.toLowerCase()) || r.reason.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center pt-20 px-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#0b101f] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3">
          <Search className="w-5 h-5 text-indigo-400" />
          <input
            type="text"
            placeholder="Type a module, task, risk, or problem (e.g. 'viva', 'attendance', 'exam form')..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-none text-white text-sm focus:outline-none placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Quick Modules */}
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
              Modules
            </div>
            <div className="space-y-1 mt-1">
              {filteredLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleSelect(item.href)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/70 text-left transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:text-cyan-300">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-white">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {item.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matched Actions */}
          {filteredActions.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                Action Items ({filteredActions.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredActions.map((act) => (
                  <button
                    key={act.id}
                    onClick={() => handleSelect('/app/action-engine')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-800/70 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span className="text-xs text-slate-200 truncate">{act.title}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono ml-2 whitespace-nowrap">
                      {act.deadline}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Risks */}
          {filteredRisks.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                Risk Alerts ({filteredRisks.length})
              </div>
              <div className="space-y-1 mt-1">
                {filteredRisks.map((risk) => (
                  <button
                    key={risk.id}
                    onClick={() => handleSelect(risk.fixActionRoute)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-slate-800/70 text-left transition-colors"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span className="text-xs text-rose-200 truncate">{risk.title}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono ml-2 whitespace-nowrap">
                      {risk.severity}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#090d19] border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Use arrow keys or click to navigate</span>
          <span>Esc to exit</span>
        </div>
      </div>
    </div>
  );
};

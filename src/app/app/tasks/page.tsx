'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckSquare,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Filter,
  Plus,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Check
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';

export const dynamic = 'force-dynamic';

export default function TasksPage() {
  const { actions, updateActionStatus, toggleActionDocument } = useStudent();
  const [filter, setFilter] = useState<'ALL' | 'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filtered = actions.filter((a) => {
    const matchesStatus = filter === 'ALL' || a.status === filter;
    const matchesCat = categoryFilter === 'ALL' || a.category === categoryFilter;
    return matchesStatus && matchesCat;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <CheckSquare className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              My Academic Tasks & Clearances
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Central command for all college deadlines, verification checklists, and administrative submissions.
          </p>
        </div>

        <Link
          href="/app/action-engine"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs transition-colors"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Scan New Notice</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-[#0b101f] border border-slate-800">
        {/* Status Filters */}
        <div className="flex items-center gap-1.5">
          {(['ALL', 'NOT STARTED', 'IN PROGRESS', 'COMPLETED'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === st
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400 mr-1">Category:</span>
          {['ALL', 'EXAM', 'PROJECT', 'SCHOLARSHIP', 'INTERNSHIP'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg ${
                categoryFilter === cat
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-4">
        {filtered.map((act) => {
          const isCompleted = act.status === 'COMPLETED';
          const isCritical = act.priority === 'CRITICAL';

          return (
            <div
              key={act.id}
              className={`p-6 rounded-3xl border transition-all ${
                isCompleted
                  ? 'bg-slate-900/40 border-slate-800 opacity-75'
                  : isCritical
                  ? 'bg-[#0e1322] border-rose-500/40 shadow-xl shadow-rose-950/20'
                  : 'bg-[#0b101f] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                      act.priority === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                        : act.priority === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                    }`}
                  >
                    {act.priority}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {act.category}
                  </span>
                  <span className="text-xs text-slate-400">• Source: {act.source}</span>
                </div>

                {/* Status Switcher Button */}
                <button
                  onClick={() =>
                    updateActionStatus(
                      act.id,
                      act.status === 'COMPLETED'
                        ? 'NOT STARTED'
                        : act.status === 'NOT STARTED'
                        ? 'IN PROGRESS'
                        : 'COMPLETED'
                    )
                  }
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all self-start sm:self-auto ${
                    isCompleted
                      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                      : act.status === 'IN PROGRESS'
                      ? 'bg-amber-600/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {isCompleted && <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />}
                  <span>{act.status}</span>
                </button>
              </div>

              <h3 className="text-base font-bold text-white mt-2">
                {act.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                {act.summary}
              </p>

              {/* Deadline & Warning strip */}
              <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-slate-300">
                  <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span><strong>Deadline:</strong> {act.deadline}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-2 text-rose-300">
                  <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span className="truncate"><strong>Risk:</strong> {act.riskIfMissed}</span>
                </div>
              </div>

              {/* Checklist & Workflow */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Required Documentation ({act.requiredDocuments.filter(d => d.checked).length}/{act.requiredDocuments.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {act.requiredDocuments.map((doc, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleActionDocument(act.id, idx)}
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer group"
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                          doc.checked
                            ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold'
                            : 'bg-slate-800 border-slate-700 group-hover:border-slate-500'
                        }`}
                      >
                        {doc.checked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`truncate ${doc.checked ? 'line-through text-slate-400' : ''}`}>
                        {doc.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

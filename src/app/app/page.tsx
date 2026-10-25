'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Brain,
  ShieldCheck,
  ChevronRight,
  Flame,
  TrendingUp,
  Activity,
  Layers,
  Check,
  ExternalLink,
  ShieldAlert,
  Play
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { formatDeadline } from '@/lib/utils';

export default function DashboardPage() {
  const {
    student,
    actions,
    risks,
    latestVivaReport,
    updateActionStatus,
    toggleActionDocument
  } = useStudent();

  const [activeTab, setActiveTab] = useState<'ACTIONS' | 'TIMELINE'>('ACTIONS');

  // Attention Center items (top 3 critical issues)
  const topIssues = [
    {
      level: 'CRITICAL',
      iconColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      dotColor: 'bg-rose-500',
      title: 'Semester Examination Form',
      subtext: 'Admit Card Risk: Window closes in 44 hours. Library clearance pending.',
      actionLabel: 'Complete Form',
      actionRoute: '/app/action-engine',
    },
    {
      level: 'HIGH',
      iconColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      dotColor: 'bg-amber-500',
      title: 'Attendance Shortfall (CS602)',
      subtext: 'Current: 71.4% (Threshold: 75%). 4 consecutive classes needed.',
      actionLabel: 'Draft Appeal',
      actionRoute: '/app/problem-solver?cat=attendance',
    },
    {
      level: 'PREPARATION',
      iconColor: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      dotColor: 'bg-indigo-400',
      title: 'Final Capstone Viva Defense',
      subtext: 'External examiner scheduled in 4 days. Polish edge cases & DB failover.',
      actionLabel: 'Start Practice',
      actionRoute: '/app/ai-examiner',
    },
  ];

  const pendingActions = actions.filter((a) => a.status !== 'COMPLETED');
  const completedActions = actions.filter((a) => a.status === 'COMPLETED');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header & Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good evening, {student.name} <span className="inline-block animate-wave">👋</span>
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">
              6th Semester CSE
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Let's get your semester under control. Here is your academic intelligence briefing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/app/action-engine"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Upload Notice</span>
          </Link>

          <Link
            href="/app/problem-solver"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-rose-900/20 transition-all hover:scale-[1.02]"
          >
            <span>I Have a Problem</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 2. Top Grid: Central Student Health Score & Attention Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Student Health Score (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-gradient-to-b from-[#0d1326] to-[#090e1a] border border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Overall Academic Health
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                Stable (Action Required)
              </span>
            </div>

            {/* Huge Central Score */}
            <div className="flex items-baseline gap-3 my-3">
              <span className="text-6xl sm:text-7xl font-black tracking-tight text-white">
                {student.overallHealthScore}
              </span>
              <span className="text-xl sm:text-2xl font-semibold text-slate-400">
                / 100
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-6">
              Your overall health is solid, but <strong className="text-rose-400 font-semibold">pending examination registration</strong> and <strong className="text-amber-400 font-semibold">CS602 attendance</strong> pose immediate risks to hall ticket clearance.
            </p>
          </div>

          {/* Metric Sub-bars */}
          <div className="space-y-3 pt-4 border-t border-slate-800/80">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Academics & CGPA</span>
                <span className="font-semibold text-slate-200">{student.stats.academics}%</span>
              </div>
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${student.stats.academics}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Attendance Stability</span>
                <span className={`font-semibold ${student.stats.attendance < 75 ? 'text-amber-400' : 'text-slate-200'}`}>
                  {student.stats.attendance}% (Min 75%)
                </span>
              </div>
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: `${student.stats.attendance}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Deadlines & Clearances</span>
                <span className="font-semibold text-rose-400">{student.stats.deadlines}% (Needs action)</span>
              </div>
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-400 h-full rounded-full" style={{ width: `${student.stats.deadlines}%` }} />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Project & Viva Readiness</span>
                <span className="font-semibold text-cyan-400">{student.stats.projects}%</span>
              </div>
              <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${student.stats.projects}%` }} />
              </div>
            </div>
          </div>

          <Link
            href="/app/risk-radar"
            className="mt-5 text-xs text-indigo-400 hover:text-cyan-300 font-semibold flex items-center justify-between pt-2 group-hover:translate-x-1 transition-transform"
          >
            <span>Explore full Student Risk Radar</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Right: Attention Center (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between rounded-3xl bg-[#0b101f] border border-slate-800 p-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Attention Center
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                  3 Immediate Needs
                </span>
              </div>
              <span className="text-xs text-slate-400">Prioritized by urgency</span>
            </div>

            <div className="space-y-3">
              {topIssues.map((issue, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${issue.dotColor}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                          {issue.title}
                        </h4>
                        <span className={`text-[10px] font-bold px-2 py-0.2 rounded border ${issue.iconColor}`}>
                          {issue.level}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {issue.subtext}
                      </p>
                    </div>
                  </div>

                  <Link
                    href={issue.actionRoute}
                    className="self-end sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors whitespace-nowrap"
                  >
                    <span>{issue.actionLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Hero Banner: Next Viva Trigger */}
          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-indigo-900/40 to-slate-900 border border-indigo-500/30 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Brain className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                  NEXT VIVA DEFENSE • 4 DAYS LEFT
                </span>
                <div className="text-sm font-bold text-white">
                  NeuroRoute: Distributed AI Transit Engine
                </div>
                <span className="text-xs text-slate-400">
                  Difficulty: Intermediate / Expert • Duration: ~15 mins
                </span>
              </div>
            </div>

            <Link
              href="/app/ai-examiner"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 whitespace-nowrap transition-all hover:scale-105"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>START PRACTICE</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Prominent Entry: CrackwithX X-Arena Multi-AI Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0d162e] via-[#0b101f] to-[#120d24] border border-cyan-500/30 relative overflow-hidden group shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                <Brain className="w-5 h-5" />
              </span>
              <h3 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>🧠 X-ARENA</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold uppercase tracking-wider">
                  MULTI-AI
                </span>
              </h3>
            </div>
            <p className="text-sm text-slate-200 font-medium">
              Ask multiple AI models at once.
            </p>
            <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
              CrackwithX compares responses from GPT, Gemini, Claude, and Perplexity, cross-checks agreements, and gives you one student-ready answer.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/app/x-arena"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 whitespace-nowrap"
            >
              <span>TRY X-ARENA</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Today's Actions Workflow Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              Today's Actions & Extracted Deadlines
            </h3>
            <p className="text-xs text-slate-400">
              Extracted directly from official college notices, WhatsApp bulletins, and exam orders.
            </p>
          </div>

          <Link
            href="/app/action-engine"
            className="text-xs font-semibold text-indigo-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>Notice Action Engine</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {actions.map((act) => {
            const isCompleted = act.status === 'COMPLETED';
            const isCritical = act.priority === 'CRITICAL';

            return (
              <div
                key={act.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-900/40 border-slate-800/60 opacity-80'
                    : isCritical
                    ? 'bg-[#0f1424] border-rose-500/30 shadow-lg shadow-rose-950/20'
                    : 'bg-[#0b101e] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Top Title & Priority */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                          act.priority === 'CRITICAL'
                            ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                            : act.priority === 'HIGH'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                            : 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                        }`}
                      >
                        {act.priority}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {act.category}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-1.5 leading-snug">
                      {act.title}
                    </h4>
                  </div>

                  {/* Status Toggle Button */}
                  <button
                    onClick={() =>
                      updateActionStatus(
                        act.id,
                        act.status === 'COMPLETED'
                          ? 'IN PROGRESS'
                          : act.status === 'IN PROGRESS'
                          ? 'COMPLETED'
                          : 'IN PROGRESS'
                      )
                    }
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                      act.status === 'COMPLETED'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : act.status === 'IN PROGRESS'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {act.status === 'COMPLETED' && <Check className="w-3 h-3 text-emerald-400" />}
                    <span>{act.status}</span>
                  </button>
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {act.summary}
                </p>

                {/* Risk Warning alert */}
                <div className="my-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2 text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    <strong className="text-amber-300 font-medium">Risk if missed:</strong> {act.riskIfMissed}
                  </span>
                </div>

                {/* Document Checklist Items */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Required Checklist ({act.requiredDocuments.filter(d => d.checked).length}/{act.requiredDocuments.length})
                  </span>
                  <div className="space-y-1">
                    {act.requiredDocuments.slice(0, 3).map((doc, idx) => (
                      <div
                        key={idx}
                        onClick={() => toggleActionDocument(act.id, idx)}
                        className="flex items-center gap-2 cursor-pointer group text-xs text-slate-300 hover:text-white"
                      >
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${
                            doc.checked
                              ? 'bg-indigo-600 border-indigo-500 text-white'
                              : 'bg-slate-800 border-slate-700 group-hover:border-slate-500'
                          }`}
                        >
                          {doc.checked && <Check className="w-3 h-3" />}
                        </div>
                        <span className={`truncate ${doc.checked ? 'line-through text-slate-400' : ''}`}>
                          {doc.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer: Deadline & Action */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <strong>Due:</strong> {act.deadline}
                  </span>

                  <Link
                    href="/app/action-engine"
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>Manage Workflow</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Cross-Module Intelligence Flow Strip */}
      <div className="rounded-3xl bg-[#090e1b] border border-slate-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Connected Academic Intelligence Flow
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              How CrackwithX bridges information and action across your 7 modules
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/app/exam-forensics"
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                Exam Forensics
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                -4 Marks Loss Pattern
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Forensics detected 31% marks lost to omitted intermediate derivation steps. See exact redlined answer sheet.
            </p>
          </Link>

          <Link
            href="/app/project-dna"
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                Project DNA & Skills
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                5 Demonstrated Nodes
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Interactive architecture graph of NeuroRoute. Backed by 87% Python & 81% GNN AI-evidence scores.
            </p>
          </Link>

          <Link
            href="/app/opportunity-shield"
            className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                Opportunity Shield
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30">
                Trust Score: 24/100
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Flagged WhatsApp ₹45k internship demanding ₹1,499 courier fee. Safe verification checklist available.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

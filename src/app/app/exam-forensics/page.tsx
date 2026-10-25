'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Microscope,
  FileCheck,
  AlertOctagon,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Layers,
  ArrowRight,
  BookOpen,
  PieChart,
  HelpCircle,
  Upload,
  Info
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { DEMO_EXAM_FORENSICS, DEMO_MARK_LOSS_DNA } from '@/services/demoData';

export default function ExamForensicsPage() {
  const { examForensics, markLossDna } = useStudent();
  const [activeTab, setActiveTab] = useState<'SHEET_BREAKDOWN' | 'MARK_LOSS_DNA'>('SHEET_BREAKDOWN');
  const [selectedAnnotationIndex, setSelectedAnnotationIndex] = useState<number>(1);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
              <Microscope className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Exam Forensics & Mark-Loss DNA
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            "Why did I lose marks?" — Forensic autopsy of university answer scripts to reveal recurring score deductions.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('SHEET_BREAKDOWN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'SHEET_BREAKDOWN'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Answer Sheet Redline
          </button>
          <button
            onClick={() => setActiveTab('MARK_LOSS_DNA')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'MARK_LOSS_DNA'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mark-Loss DNA (Aggregate)
          </button>
        </div>
      </div>

      {/* Mode 1: Answer Sheet Markup & Itemized Mark Breakdown */}
      {activeTab === 'SHEET_BREAKDOWN' && (
        <div className="space-y-6">
          {/* Paper Context Strip */}
          <div className="p-4 rounded-2xl bg-[#0b101f] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-slate-400">Exam Subject:</span>
              <strong className="text-white ml-1.5">CS601: Distributed Systems & Cache Architectures</strong>
              <span className="text-slate-400 ml-3">Mid-Term Paper</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {examForensics.questionNumber}
              </span>
              <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30">
                Score: {examForensics.receivedMarks} / {examForensics.expectedMarks}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Annotated Student Answer Sheet (7 cols) */}
            <div className="lg:col-span-7 rounded-3xl bg-[#0a0e1c] border border-slate-800 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Forensic Redlined Answer Script
                </span>
                <span className="text-[10px] text-cyan-400 font-mono">
                  OCR Verified • 4 Mark deductions detected
                </span>
              </div>

              {/* Annotated Text Canvas Simulation */}
              <div className="p-5 rounded-2xl bg-[#060913] border border-slate-800 font-mono text-xs leading-relaxed space-y-4 text-slate-300">
                <div className="text-slate-400 pb-2 border-b border-slate-800/80">
                  // Student Response: Question 4 (b) - AMAT Calculation
                </div>

                <p>
                  To find the average memory access time (AMAT) for the multi-level cache hierarchy:
                  <br />
                  L1 hit time = 1 cycle, L1 miss rate = 5%
                  <br />
                  L2 hit time = 8 cycles, L2 miss rate = 12%
                  <br />
                  Main memory latency = 120 cycles.
                </p>

                {/* Highlight: Correct Section */}
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border-l-4 border-emerald-500 text-emerald-300">
                  AMAT = L1_Hit_Time + (L1_Miss_Rate * L2_Effective_Penalty)
                  <span className="block text-[10px] text-emerald-400 font-sans mt-0.5">
                    ✓ Correct formulation (+4 Marks)
                  </span>
                </div>

                {/* Highlight: Missing Steps deduction */}
                <div
                  onClick={() => setSelectedAnnotationIndex(1)}
                  className={`p-2.5 rounded-lg border-l-4 cursor-pointer transition-all ${
                    selectedAnnotationIndex === 1
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                      : 'bg-amber-500/10 border-amber-500/60 text-amber-300 hover:bg-amber-500/15'
                  }`}
                >
                  [MISSING STEP: Global vs Local L2 Miss Penalty formula omitted]
                  <br />
                  AMAT = 1 + (0.05 * [8 + 14.4]) = 1 + (0.05 * 22.4)
                  <span className="block text-[10px] text-amber-400 font-sans mt-0.5">
                    ⚠️ -2 Marks: Examiner deducted for skipping step-by-step expansion
                  </span>
                </div>

                {/* Highlight: Calculation slip */}
                <div
                  onClick={() => setSelectedAnnotationIndex(2)}
                  className={`p-2.5 rounded-lg border-l-4 cursor-pointer transition-all ${
                    selectedAnnotationIndex === 2
                      ? 'bg-rose-500/20 border-rose-400 text-rose-200'
                      : 'bg-rose-500/10 border-rose-500/60 text-rose-300 hover:bg-rose-500/15'
                  }`}
                >
                  AMAT = 1 + 1.22 = 2.22 cycles (incorrect sum)
                  <span className="block text-[10px] text-rose-400 font-sans mt-0.5">
                    ❌ -1 Mark: Arithmetic error (0.05 * 22.4 = 1.12, not 1.22)
                  </span>
                </div>

                {/* Highlight: Presentation missing */}
                <div
                  onClick={() => setSelectedAnnotationIndex(3)}
                  className={`p-2.5 rounded-lg border-l-4 cursor-pointer transition-all ${
                    selectedAnnotationIndex === 3
                      ? 'bg-slate-700/40 border-slate-400 text-slate-200'
                      : 'bg-slate-800/40 border-slate-600 text-slate-400 hover:bg-slate-800/70'
                  }`}
                >
                  [Omitted conclusion box & relative speedup metric]
                  <span className="block text-[10px] text-slate-400 font-sans mt-0.5">
                    ⚠️ -1 Mark: Did not box final AMAT and compare against baseline cache
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Itemized Mark Ledger & Examiner Advice (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Mark Breakdown Ledger */}
              <div className="rounded-3xl bg-[#0b101f] border border-slate-800 p-6 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Forensic Mark Ledger (10 Marks Total)
                </span>

                <div className="space-y-2">
                  {examForensics.breakdown.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 text-xs"
                    >
                      <span className="text-slate-300">{item.item}</span>
                      <span
                        className={`font-mono font-bold ${
                          item.points > 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {item.points > 0 ? `+${item.points}` : item.points}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-sm">
                  <span className="font-bold text-white">Final Awarded Marks</span>
                  <span className="font-black text-rose-400 font-mono text-base">
                    6.0 / 10.0
                  </span>
                </div>
              </div>

              {/* Targeted AI Remediation Guide */}
              <div className="rounded-3xl bg-[#0e1428] border border-indigo-500/30 p-6 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Targeted Examiner Remediation
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {examForensics.targetedAdvice}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Multi-Paper Mark-Loss DNA */}
      {activeTab === 'MARK_LOSS_DNA' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: DNA Percentage Graph (6 cols) */}
            <div className="lg:col-span-6 rounded-3xl bg-[#0b101f] border border-slate-800 p-6 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                  Cumulative Mark Loss Signature
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Where Your University Marks Actually Disappear
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Synthesized across your last 4 semester theory & mid-term answer sheets.
                </p>
              </div>

              {/* Loss Bars */}
              <div className="space-y-3.5">
                {markLossDna.categories.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">{cat.label}</span>
                      <span className="font-mono font-bold text-white">{cat.percentage}% ({cat.count} occurrences)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${cat.percentage}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <strong className="text-amber-400 block mb-1">Detected Pattern:</strong>
                {markLossDna.patternExplanation}
              </div>
            </div>

            {/* Right: Core Strengths & Critical Remedies (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="rounded-3xl bg-[#090e1b] border border-emerald-500/30 p-6 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Your Demonstrated Academic Strengths
                </span>
                <div className="space-y-2">
                  {markLossDna.coreStrengths.map((str, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      <span>{str}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-[#0e1324] border border-cyan-500/30 p-6 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  Guaranteed +8 Marks Remedial Protocol
                </span>
                <div className="space-y-2.5">
                  {markLossDna.criticalRemedies.map((rem, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{rem}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

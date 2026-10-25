'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  Radar,
  Brain,
  Microscope,
  Dna,
  ShieldAlert,
  LifeBuoy,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileText,
  Clock,
  Layers,
  Flame,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Star
} from 'lucide-react';

export default function LandingPage() {
  const [activeModulePreview, setActiveModulePreview] = useState<number>(0);

  const capabilities = [
    {
      id: 'action-engine',
      title: 'Action Engine',
      tagline: 'Notice → Executable Workflow',
      icon: Zap,
      color: 'from-cyan-500 to-blue-500',
      badge: 'Module 1',
      question: '"What do I need to do?"',
      desc: 'Parses WhatsApp forwards, PDFs, and exam orders. Extracts deadlines, fees, checklists, and consequences into active tasks.',
      previewSnippet: {
        header: '🔴 ACTION REQUIRED: Examination Form (Oct 29)',
        detail: 'Risk: Admit Card debarred if Sem 5 marksheet is missing.',
        action: 'Task state: NOT STARTED → IN PROGRESS → COMPLETED'
      }
    },
    {
      id: 'risk-radar',
      title: 'Risk Radar',
      tagline: '5-Vector Academic Vulnerability Scan',
      icon: Radar,
      color: 'from-rose-500 to-amber-500',
      badge: 'Module 2',
      question: '"What could go wrong?"',
      desc: 'Real-time student health score (82/100). Analyzes attendance, internal marks, pending forms, projects, and finance with one-click fixes.',
      previewSnippet: {
        header: 'ACADEMIC HEALTH: 82 / 100',
        detail: 'CS602 Attendance: 71.4% (Threshold: 75%). 4 classes to recover.',
        action: 'Expandable risk path with [ FIX THIS ] trigger'
      }
    },
    {
      id: 'ai-examiner',
      title: 'AI Examiner (Hero Viva)',
      tagline: 'Full-Screen Viva Simulation & Cross-Questioning',
      icon: Brain,
      color: 'from-indigo-500 to-cyan-400',
      badge: 'Module 3',
      question: '"Do I actually know what I claim to know?"',
      desc: 'Progresses through 6 rounds (Fundamentals, Technical, Architecture, Cross Questioning, Edge Cases, Ownership) with timer, voice input, and Viva Report.',
      previewSnippet: {
        header: 'ROUND 4: "Why did you choose PostgreSQL over MongoDB?"',
        detail: 'AI cross-examines student answer dynamically in real-time.',
        action: 'Generates Viva Report + Identified Weak Areas'
      }
    },
    {
      id: 'exam-forensics',
      title: 'Exam Forensics',
      tagline: 'Answer Script Autopsy & Mark-Loss DNA',
      icon: Microscope,
      color: 'from-violet-500 to-indigo-500',
      badge: 'Module 4',
      question: '"Why did I lose marks?"',
      desc: 'Forensic redline annotations on your answer script (+4 Concept, -2 Missing intermediate steps, -1 Arithmetic slip).',
      previewSnippet: {
        header: 'QUESTION 4: 6 / 10 Marks Awarded',
        detail: 'Mark-Loss DNA: 31% lost to skipped intermediate derivation steps.',
        action: 'Concrete actionable +8 mark exam checklist'
      }
    },
    {
      id: 'project-dna',
      title: 'Project DNA',
      tagline: 'Interactive Architecture Graph & Skill Proof',
      icon: Dna,
      color: 'from-cyan-400 to-emerald-400',
      badge: 'Module 5',
      question: '"What can I actually prove?"',
      desc: 'Interactive nodes of what you built (FastAPI, PyTorch, PostGIS, Next.js). AI-estimated evidence scores and [ PROVE IT ] ownership verification.',
      previewSnippet: {
        header: '5 VERIFIED ARCHITECTURE NODES',
        detail: 'Python: 87% • AI/ML: 81% • Backend: 72% • Git: 90%',
        action: '[ PROVE IT ] matches answers against Git commit SHAs'
      }
    },
    {
      id: 'opportunity-shield',
      title: 'Opportunity Shield',
      tagline: 'Anti-Scam Internship & Job Scanner',
      icon: ShieldAlert,
      color: 'from-amber-500 to-rose-500',
      badge: 'Module 6',
      question: '"Can I trust this opportunity?"',
      desc: 'Detects advance-fee recruitment traps, fake stipend claims, and personal UPI requests. Generates calibrated Trust Scores (e.g. 24/100).',
      previewSnippet: {
        header: 'TRUST SCORE: 24 / 100 (HIGH RISK)',
        detail: 'Flagged: Demand for ₹1,499 "equipment courier insurance".',
        action: 'Safe verification protocol before paying a rupee'
      }
    },
    {
      id: 'problem-solver',
      title: 'Student Problem Solver',
      tagline: 'Conversational Path & 1-Click Letters',
      icon: LifeBuoy,
      color: 'from-rose-500 to-indigo-500',
      badge: 'Module 7',
      question: '"What should I do about my problem?"',
      desc: 'Interactive decision tree covering 11 college emergencies (attendance debar, fee delays, guide dispute). Generates print-ready formal letters & emails.',
      previewSnippet: {
        header: 'PERSONAL ACTION PATH: ATTENDANCE SHORTAGE',
        detail: 'Formal medical condonation letter to HOD & Dean ready in 1 click.',
        action: 'Evidence dossier checklist + polite email templates'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-[#06080e] text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* 1. Top Navbar */}
      <nav className="h-20 border-b border-slate-800/80 bg-[#06080e]/90 backdrop-blur-xl sticky top-0 z-50 px-6 lg:px-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20">
            <div className="w-full h-full bg-[#080c16] rounded-[14px] flex items-center justify-center font-black tracking-wider text-xl text-white">
              <span className="bg-gradient-to-r from-white via-indigo-200 to-cyan-300 bg-clip-text text-transparent">C</span>
              <span className="text-cyan-400 font-extrabold ml-[1px]">X</span>
            </div>
          </div>
          <div>
            <span className="font-extrabold tracking-tight text-white text-lg">Crackwith</span>
            <span className="font-black text-cyan-400 text-lg">X</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase tracking-widest text-slate-400 font-mono">
              STUDENT OS
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#problem" className="hover:text-cyan-400 transition-colors">The Problem</a>
          <a href="#how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</a>
          <a href="#capabilities" className="hover:text-cyan-400 transition-colors">7 Modules</a>
          <a href="#why-different" className="hover:text-cyan-400 transition-colors">Why It's Different</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/app"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            ENTER CRACKWITHX
          </Link>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 px-6 lg:px-12 max-w-7xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>The AI-Powered Student Intelligence & Academic Survival System</span>
        </div>

        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.08]">
            College is complicated. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
              Your next move shouldn't be.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed pt-2">
            An intelligent layer between scattered college information and decisive action. Turns confusing notices into workflows, detects academic debar risks, cross-examines your project viva, and protects you from fake opportunities.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/app"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-indigo-700 hover:from-cyan-400 hover:via-indigo-500 hover:to-indigo-600 text-white font-black text-sm shadow-2xl shadow-indigo-600/40 transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>ENTER CRACKWITHX</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#capabilities"
            className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 text-cyan-400 fill-current" />
            <span>SEE HOW IT WORKS</span>
          </a>
        </div>

        {/* Tagline Ribbon */}
        <div className="pt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400 uppercase tracking-widest">
          <span className="text-cyan-400 font-bold">Understand</span>
          <span>•</span>
          <span className="text-indigo-400 font-bold">Prepare</span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">Prove</span>
          <span>•</span>
          <span className="text-white font-bold">Crack It</span>
        </div>

        {/* Hero Interactive App Preview Box */}
        <div className="mt-12 rounded-3xl bg-[#090d1a] border border-indigo-500/30 p-2 sm:p-4 shadow-2xl shadow-indigo-950/50 relative overflow-hidden">
          <div className="rounded-2xl bg-[#060913] border border-slate-800/80 p-4 sm:p-6 text-left space-y-6">
            {/* Mock Top bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-mono text-slate-400 ml-2">crackwithx.internal/student-os/pushkar</span>
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30">
                LIVE DEMO ACTIVE
              </span>
            </div>

            {/* Quick Hero Dashboard Slice */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Academic Health Index
                </span>
                <span className="text-4xl font-black text-white">82 <span className="text-base text-slate-400">/ 100</span></span>
                <span className="text-[11px] text-amber-400 block mt-2">
                  ⚠️ 1 Critical Risk: Exam form closes in 44h
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Active Capstone Viva
                </span>
                <span className="text-base font-bold text-white block truncate">NeuroRoute: AI Transit</span>
                <span className="text-[11px] text-indigo-300 block mt-2">
                  Round 4: Cross-examining DB choice
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Opportunity Shield
                </span>
                <span className="text-base font-bold text-rose-400 block">Trust Score: 24 / 100</span>
                <span className="text-[11px] text-rose-300 block mt-2">
                  Flagged ₹1,499 fake courier fee
                </span>
              </div>
            </div>

            <div className="text-center pt-2">
              <Link
                href="/app"
                className="text-xs font-bold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5"
              >
                <span>Launch Interactive Demo Profile (Pushkar — B.E. CSE)</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Problem Section */}
      <section id="problem" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 font-mono">
            The Reality of College Life
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Students are drowning in scattered information, but starved for action.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            WhatsApp groups, faculty circulars, PDFs, ERP portals, and recruiter DMs flood students every day. Nobody translates information into what matters for YOU.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#0b101f] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Missed Deadlines & Debar Fines</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Examination notices arrive as 14-page PDF circulars on WhatsApp. Students miss the fine print about library clearance and forfeit their hall tickets.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0b101f] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Viva Freeze & Imposter Panic</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Students build great projects in teams, but freeze when the external examiner asks: "What happens if 10,000 users query this endpoint simultaneously?"
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0b101f] border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Fake Internships & Hidden Fees</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Predatory recruiters exploit student desperation, offering ₹45k/mo stipends while demanding ₹1,499 upfront "equipment insurance" fees over UPI.
            </p>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
            The CrackwithX Operating System
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Six Steps from Information to Action
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            CrackwithX is the intelligent layer transforming confusion into survival and growth.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-center">
          {[
            { step: '01', word: 'UNDERSTAND', desc: 'Notice OCR & Intent', color: 'text-cyan-400' },
            { step: '02', word: 'DETECT', desc: 'Risk Radar Vulnerabilities', color: 'text-rose-400' },
            { step: '03', word: 'ACT', desc: 'Workflows & Letters', color: 'text-amber-400' },
            { step: '04', word: 'PREPARE', desc: 'Mock AI Viva Cross-Exam', color: 'text-indigo-400' },
            { step: '05', word: 'PROVE', desc: 'Project DNA & Skills', color: 'text-emerald-400' },
            { step: '06', word: 'IMPROVE', desc: 'Exam Forensics', color: 'text-violet-400' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#0b101f] border border-slate-800 space-y-2">
              <span className="text-[10px] font-mono text-slate-400 font-bold block">{item.step}</span>
              <strong className={`text-xs sm:text-sm font-black block ${item.color}`}>
                {item.word}
              </strong>
              <span className="text-[10px] text-slate-400 block">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. 7 Core Capabilities Section */}
      <section id="capabilities" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">
            Distinct Interaction Models
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            7 Specialized Modules. Zero Generic Chatbots.
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Every module has its own custom interface tailored to that exact student problem.
          </p>
        </div>

        {/* Tabbed Interactive Capability Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Module Selector List (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              const isSelected = activeModulePreview === idx;
              return (
                <button
                  key={cap.id}
                  onClick={() => setActiveModulePreview(idx)}
                  className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#0f172e] border-indigo-500 shadow-xl shadow-indigo-950/40'
                      : 'bg-[#090d18] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${cap.color} flex items-center justify-center text-slate-950`}>
                      <Icon className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{cap.title}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                          {cap.badge}
                        </span>
                      </div>
                      <span className="text-[11px] text-cyan-300 font-medium block">
                        {cap.question}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90 text-indigo-400' : 'text-slate-400'}`} />
                </button>
              );
            })}
          </div>

          {/* Detailed Preview Card (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl bg-[#0b101f] border border-indigo-500/30 p-6 md:p-8 space-y-6">
            {(() => {
              const active = capabilities[activeModulePreview];
              const Icon = active.icon;
              return (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${active.color} flex items-center justify-center text-slate-950`}>
                        <Icon className="w-6 h-6 stroke-[2.5]" />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                          {active.badge} • {active.tagline}
                        </span>
                        <h3 className="text-xl font-bold text-white">
                          {active.title}
                        </h3>
                      </div>
                    </div>

                    <Link
                      href={`/app/${active.id}`}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <span>Try Live</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {active.desc}
                  </p>

                  {/* Snippet Box */}
                  <div className="p-5 rounded-2xl bg-[#060913] border border-slate-800 font-mono text-xs space-y-3">
                    <div className="text-cyan-400 font-bold">
                      {active.previewSnippet.header}
                    </div>
                    <div className="text-slate-300">
                      {active.previewSnippet.detail}
                    </div>
                    <div className="pt-2 border-t border-slate-800/80 text-[11px] text-emerald-400 font-sans font-medium">
                      ✓ {active.previewSnippet.action}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* 6. Why It's Different Section */}
      <section id="why-different" className="py-20 px-6 lg:px-12 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
            Uncompromising Vision
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why CrackwithX is Not Another Chatbot
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-500/20 space-y-3">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              ❌ WHAT WE ARE NOT
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>• Not a generic ChatGPT prompt wrapper with a prompt box</li>
              <li>• Not an AI summary generator that dumps more paragraphs on you</li>
              <li>• Not a passive study calendar planner that you ignore after day 2</li>
              <li>• Not an isolated collection of random mini-tools</li>
            </ul>
          </div>

          <div className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/20 space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              ✅ WHAT CRACKWITHX ACTUALLY IS
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>• The intelligent action layer between confusing information and what YOU must do</li>
              <li>• One connected nervous system (notice → radar risk → viva prep → exam targets)</li>
              <li>• High-pressure full-screen examination mode testing real project ownership</li>
              <li>• One-click generator of formal printed university applications and emails</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 7. Final Call To Action */}
      <section className="py-20 px-6 lg:px-12 max-w-5xl mx-auto text-center space-y-6">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-b from-[#0e162e] to-[#070b14] border border-cyan-500/30 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Take Control of Your Semester Today.
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Experience the complete student intelligence operating system with verified demo data ready for your inspection.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/app"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-indigo-500 to-indigo-600 hover:scale-105 text-slate-950 font-black text-sm shadow-xl shadow-cyan-500/20 transition-all"
            >
              LAUNCH CRACKWITHX (DEMO PROFILE)
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 text-center text-xs text-slate-400">
        <p>© 2026 CrackwithX — Understand. Prepare. Prove. Crack It.</p>
        <p className="text-[11px] text-slate-400 mt-1">Built for College & University Engineering Students</p>
      </footer>
    </div>
  );
}

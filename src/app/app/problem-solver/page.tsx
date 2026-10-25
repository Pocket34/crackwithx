'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  LifeBuoy,
  DollarSign,
  GraduationCap,
  FileText,
  Clock,
  Home,
  Briefcase,
  Users,
  Building,
  Wrench,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Copy,
  Download,
  Share2,
  Sparkles,
  ChevronRight,
  Check,
  AlertTriangle,
  Send,
  MessageSquare,
  Mail
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { DEMO_PROBLEM_SOLUTIONS } from '@/services/demoData';
import { ProblemSolutionPath } from '@/types';

const categories = [
  { id: 'attendance', label: 'Attendance', icon: Clock, desc: 'Shortage, medical condonation, debar risks', color: 'from-amber-500/20 to-rose-500/10 text-amber-400' },
  { id: 'fees', label: 'College Fees', icon: DollarSign, desc: 'Instalment plans, delayed clearance, fines', color: 'from-emerald-500/20 to-cyan-500/10 text-emerald-400' },
  { id: 'scholarship', label: 'Scholarship', icon: GraduationCap, desc: 'Renewal freeze, income certificate, portal error', color: 'from-indigo-500/20 to-cyan-500/10 text-indigo-400' },
  { id: 'exam', label: 'Exams & Backlogs', icon: FileText, desc: 'Hall ticket blocked, re-evaluation, timetable clashes', color: 'from-rose-500/20 to-purple-500/10 text-rose-400' },
  { id: 'internship', label: 'Internship / NOC', icon: Briefcase, desc: 'College NOC letter, suspicious offer check, credits', color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400' },
  { id: 'documents', label: 'Certificates & Docs', icon: FileText, desc: 'Bonafide, transcripts, migration, no-dues slips', color: 'from-purple-500/20 to-indigo-500/10 text-purple-400' },
  { id: 'hostel', label: 'Hostel & Mess', icon: Home, desc: 'Room allotment disputes, maintenance, curfew fine', color: 'from-blue-500/20 to-slate-500/10 text-blue-400' },
  { id: 'faculty', label: 'Faculty & Lab Guides', icon: Users, desc: 'Guide change request, internal marks dispute', color: 'from-yellow-500/20 to-amber-500/10 text-yellow-400' },
  { id: 'admin', label: 'Administration', icon: Building, desc: 'Dean office delays, registrar window confusion', color: 'from-slate-500/20 to-zinc-500/10 text-slate-400' },
  { id: 'technical', label: 'Technical / Portal', icon: Wrench, desc: 'ERP login locked, fee transaction failed', color: 'from-cyan-500/20 to-emerald-500/10 text-cyan-400' },
  { id: 'other', label: 'Other College Issue', icon: HelpCircle, desc: 'Any unexpected academic emergency', color: 'from-indigo-500/20 to-violet-500/10 text-violet-400' },
];

export default function ProblemSolverPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-slate-400">Loading Problem Solver...</div>}>
      <ProblemSolverContent />
    </React.Suspense>
  );
}

function ProblemSolverContent() {
  const searchParams = useSearchParams();
  const initialCat = searchParams?.get('cat') || 'attendance';

  const { activeProblemSolution, setProblemSolution } = useStudent();
  const [selectedCatId, setSelectedCatId] = useState(initialCat);
  const [conversationalStep, setConversationalStep] = useState<number>(2); // 0: Pick category, 1: Chat questions, 2: Action Path Ready
  const [userChatAnswers, setUserChatAnswers] = useState<Record<string, string>>({
    shortageReason: 'Severe viral fever and stomach infection for 6 days',
    hasMedicalCertificate: 'Yes, registered doctor prescription with hospital bills',
    classesMissed: 'Missed 6 classes in CS602 (Operating Systems)',
  });
  const [activeTab, setActiveTab] = useState<'PATH' | 'LETTERS' | 'CHECKLIST'>('PATH');
  const [copiedDraft, setCopiedDraft] = useState(false);

  const currentSolution: ProblemSolutionPath =
    DEMO_PROBLEM_SOLUTIONS[selectedCatId] || DEMO_PROBLEM_SOLUTIONS['attendance'];

  const handleCopyText = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <LifeBuoy className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Student Problem Solver
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            "What should I do about my college problem?" — From panic to a clear step-by-step path, complete with university-ready application letters and emails.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setConversationalStep(0)}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300"
          >
            Switch Category
          </button>
        </div>
      </div>

      {/* Step 0: Category Grid */}
      {conversationalStep === 0 && (
        <div className="space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-1 mb-6">
            <h2 className="text-xl font-bold text-white">What problem are you facing right now?</h2>
            <p className="text-xs text-slate-400">Select a category to launch the interactive diagnostic flow.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCatId(c.id);
                    setConversationalStep(1);
                  }}
                  className="p-5 rounded-3xl bg-[#0b101f] border border-slate-800 hover:border-slate-700 hover:scale-[1.02] text-left transition-all space-y-3 group"
                >
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center border border-white/5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300">
                      {c.label}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                      {c.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 1: Interactive Conversational Decision Flow (Not a giant form!) */}
      {conversationalStep === 1 && (
        <div className="max-w-2xl mx-auto rounded-3xl bg-[#0b101f] border border-indigo-500/30 p-6 md:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Interactive Diagnostic Flow
              </span>
              <h2 className="text-base font-bold text-white">
                Understanding Your Situation: {categories.find(c => c.id === selectedCatId)?.label}
              </h2>
            </div>
          </div>

          <div className="space-y-4">
            {/* AI Prompt 1 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <span className="text-xs font-bold text-indigo-300">AI Diagnostic Assistant:</span>
              <p className="text-xs text-slate-200 leading-relaxed">
                "What is the primary reason for your attendance shortfall in CS602 (Operating Systems)?"
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                "Severe medical illness / hospitalization",
                "Representing college in sports / tech fest",
                "Late admission / fee clearance delay",
                "Family emergency"
              ].map((ans, i) => (
                <button
                  key={i}
                  onClick={() => setUserChatAnswers(prev => ({ ...prev, shortageReason: ans }))}
                  className={`px-3 py-1.5 rounded-xl text-xs border transition-all ${
                    userChatAnswers.shortageReason === ans
                      ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {ans}
                </button>
              ))}
            </div>

            {/* AI Prompt 2 */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 mt-4">
              <span className="text-xs font-bold text-indigo-300">AI Diagnostic Assistant:</span>
              <p className="text-xs text-slate-200 leading-relaxed">
                "Do you have a medical certificate stamped by a registered medical practitioner (MCI registered)?"
              </p>
            </div>

            <div className="flex gap-2">
              {["Yes, doctor prescription & fitness certificate available", "No, but I can visit the clinic today", "Consulted private doctor only"].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setUserChatAnswers(prev => ({ ...prev, hasMedicalCertificate: opt }))}
                  className={`px-3.5 py-1.5 rounded-xl text-xs border transition-all ${
                    userChatAnswers.hasMedicalCertificate === opt
                      ? 'bg-cyan-600 text-slate-950 font-bold border-cyan-500'
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setConversationalStep(2)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                <span>GENERATE PERSONAL ACTION PATH</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Personal Action Path & 1-Click Generated Formal Documents */}
      {conversationalStep === 2 && currentSolution && (
        <div className="space-y-6">
          {/* Situation Context Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-[#0b101f] to-rose-950/20 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase font-bold">
                  {currentSolution.category} Resolution Path
                </span>
                <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Severity: {currentSolution.severity}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                {currentSolution.problemTitle}
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {currentSolution.understanding}
              </p>
            </div>

            {/* View Switcher: Action Path vs Letters vs Checklist */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-center">
              <button
                onClick={() => setActiveTab('PATH')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'PATH' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Action Path
              </button>
              <button
                onClick={() => setActiveTab('LETTERS')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'LETTERS' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Application & Email
              </button>
              <button
                onClick={() => setActiveTab('CHECKLIST')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'CHECKLIST' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Docs Checklist
              </button>
            </div>
          </div>

          {/* Tab 1: Personal Action Path (Problem -> Understand -> Check -> Documents -> Contact -> What to say) */}
          {activeTab === 'PATH' && (
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Your Executable Action Sequence (Follow In Order)
              </span>

              <div className="space-y-3">
                {currentSolution.actionPath.map((step, idx) => (
                  <div
                    key={step.id}
                    className="p-5 rounded-2xl bg-[#0b101f] border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-cyan-400 font-bold">
                            {step.phase}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-0.5">
                          {step.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-3xl">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    <div className="self-end sm:self-center">
                      <button
                        onClick={() => setActiveTab('LETTERS')}
                        className="text-xs font-bold text-indigo-400 hover:text-cyan-300 flex items-center gap-1 whitespace-nowrap"
                      >
                        <span>View Templates</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: 1-Click Generated Formal University Letters & Emails */}
          {activeTab === 'LETTERS' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Formal Printed Letter */}
              {currentSolution.generatedDrafts.applicationLetter && (
                <div className="rounded-3xl bg-[#0a0e1c] border border-slate-800 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <FileText className="w-4 h-4" />
                      Official University Application (Print Ready)
                    </span>
                    <button
                      onClick={() => handleCopyText(currentSolution.generatedDrafts.applicationLetter || '')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{copiedDraft ? 'Copied!' : 'Copy Letter'}</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#060912] border border-slate-800/80 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[460px] overflow-y-auto">
                    {currentSolution.generatedDrafts.applicationLetter}
                  </div>
                </div>
              )}

              {/* Polite Email to HOD / Dean */}
              {currentSolution.generatedDrafts.emailTemplate && (
                <div className="rounded-3xl bg-[#0a0e1c] border border-slate-800 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      Polite Email to HOD & Subject Teacher
                    </span>
                    <button
                      onClick={() => handleCopyText(currentSolution.generatedDrafts.emailTemplate || '')}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{copiedDraft ? 'Copied!' : 'Copy Email'}</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#060912] border border-slate-800/80 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[460px] overflow-y-auto">
                    {currentSolution.generatedDrafts.emailTemplate}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Required Supporting Dossier Checklist */}
          {activeTab === 'CHECKLIST' && (
            <div className="rounded-3xl bg-[#0b101f] border border-slate-800 p-6 md:p-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Evidence Dossier To Attach With Your Application
              </span>

              <div className="space-y-2.5 max-w-2xl">
                {currentSolution.documentChecklist.map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-3 text-xs text-slate-200"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

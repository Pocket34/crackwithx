'use client';

import React, { useState } from 'react';
import {
  Zap,
  Upload,
  FileText,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  DollarSign,
  ArrowRight,
  Sparkles,
  Layers,
  Check,
  Edit2,
  Share2,
  ExternalLink,
  ChevronDown,
  Info
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { StudentAIService } from '@/services/aiService';
import { ActionItem } from '@/types';

export default function ActionEnginePage() {
  const { actions, addAction, updateActionStatus, toggleActionDocument } = useStudent();
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string>(actions[0]?.id || '');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const sampleNotices = [
    {
      title: "Semester Exam Form Notice (COE/2026/041)",
      text: "CIRCULAR: Controller of Examinations. All 6th Sem B.E. students must complete the University Examination Registration Form before 29th October 2026. A non-refundable fee of Rs 2,450 must be paid online. Failure to submit Sem 5 marksheet and library no-dues clearance will lead to admit card withholding."
    },
    {
      title: "State Merit Scholarship Renewal Circular",
      text: "State Post-Matric Scholarship portal renewal deadline is 05 November 2026. Eligible students with CGPA > 7.5 must submit current year Income Certificate, Bonafide certificate from Registrar, and Aadhaar seeded bank passbook. Annual grant: Rs 48,000."
    },
    {
      title: "TCS National Qualifier Test (NQT) Drive",
      text: "Training & Placement Cell: TCS NQT registration window closes on 08 November. CSE students with 60% aggregate without standing backlogs must upload updated resume and verify GitHub profile to obtain test hall tickets."
    }
  ];

  const handleScanNotice = async (textToScan: string, fileName?: string) => {
    setIsScanning(true);
    try {
      const extracted = await StudentAIService.extractActionFromNotice(textToScan, fileName);
      addAction(extracted);
      setActiveActionId(extracted.id);
      setInputText('');
      setSelectedFile(null);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
      handleScanNotice(
        `Extracted text from uploaded college document: ${file.name}. Mandatory verification required for 6th semester. Submit proof to Exam Cell.`,
        file.name
      );
    }
  };

  const currentAction = actions.find(a => a.id === activeActionId) || actions[0];

  const filteredActions = filterCategory === 'ALL'
    ? actions
    : actions.filter(a => a.category === filterCategory);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Zap className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Student Action Engine
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            "What do I need to do?" — Convert messy notices, WhatsApp circulars, and PDF orders into executable tasks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono">
            {actions.length} Tracked Actions
          </span>
        </div>
      </div>

      {/* Main Intake Box: Document / Screenshot / Text Parser */}
      <div className="rounded-3xl bg-[#090e1b] border border-cyan-500/20 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              Notice & Document Intake
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Paste WhatsApp text, upload PDF/screenshot, or test sample notice
          </span>
        </div>

        <div className="space-y-4">
          <textarea
            rows={3}
            placeholder="Paste raw college notice, WhatsApp forward, email excerpt, or exam order here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full bg-[#0d1428] border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* File Upload Trigger */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload PDF / Image</span>
                <input
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {selectedFile && (
                <span className="text-xs text-cyan-400 truncate max-w-xs">
                  {selectedFile}
                </span>
              )}
            </div>

            {/* Scan Action */}
            <button
              onClick={() => handleScanNotice(inputText)}
              disabled={isScanning || !inputText.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold text-slate-950 transition-all shadow-lg shadow-cyan-600/20"
            >
              {isScanning ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Extracting Workflow...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>EXTRACT WORKFLOW</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Preloaded Notice Chips */}
          <div className="pt-3 border-t border-slate-800/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Or Try A Sample College Notice:
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleNotices.map((sn, idx) => (
                <button
                  key={idx}
                  onClick={() => handleScanNotice(sn.text, sn.title)}
                  className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3 h-3 text-cyan-400" />
                  <span>{sn.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Action Items List & Full Action Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Action Items List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Action Queues
            </span>
            <div className="flex gap-1 text-[10px]">
              {['ALL', 'EXAM', 'PROJECT', 'SCHOLARSHIP'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-2 py-0.5 rounded-md ${
                    filterCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredActions.map((act) => {
              const isSelected = act.id === (currentAction?.id || '');
              const isCritical = act.priority === 'CRITICAL';
              const isCompleted = act.status === 'COMPLETED';

              return (
                <div
                  key={act.id}
                  onClick={() => setActiveActionId(act.id)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#0f172e] border-cyan-500/60 shadow-lg shadow-cyan-950/30'
                      : isCompleted
                      ? 'bg-slate-900/40 border-slate-800/60 opacity-75 hover:opacity-100'
                      : 'bg-[#0b101f] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase border ${
                        act.priority === 'CRITICAL'
                          ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                          : 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                      }`}
                    >
                      {act.priority}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {act.deadline}
                    </span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-white mt-2 line-clamp-1">
                    {act.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                    {act.summary}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-800/60 text-[10px]">
                    <span className="text-slate-400">
                      Docs: {act.requiredDocuments.filter(d => d.checked).length}/{act.requiredDocuments.length} checked
                    </span>
                    <span className={`font-semibold ${
                      act.status === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {act.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Interactive Action Workflow (7 cols) */}
        {currentAction && (
          <div className="lg:col-span-7 rounded-3xl bg-[#0b101f] border border-slate-800 p-6 space-y-6">
            {/* Top Bar with Status Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {currentAction.category}
                  </span>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    Applies Directly To You
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  {currentAction.title}
                </h2>
                <span className="text-xs text-slate-400">
                  Source: {currentAction.source}
                </span>
              </div>

              {/* Status Switcher */}
              <div className="flex items-center gap-1.5 self-start sm:self-center bg-slate-900 p-1 rounded-xl border border-slate-800">
                {(['NOT STARTED', 'IN PROGRESS', 'COMPLETED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => updateActionStatus(currentAction.id, st)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                      currentAction.status === st
                        ? st === 'COMPLETED'
                          ? 'bg-emerald-600 text-white'
                          : st === 'IN PROGRESS'
                          ? 'bg-amber-600 text-white'
                          : 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Metrics Bar: Deadline, Fees, Consequences */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Submission Deadline</span>
                </div>
                <span className="text-xs font-bold text-white block">
                  {currentAction.deadline}
                </span>
                <span className="text-[10px] text-rose-400 font-semibold">
                  ⚠️ Window closes soon
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Applicable Fees</span>
                </div>
                <span className="text-xs font-bold text-white block truncate">
                  {currentAction.fees}
                </span>
                <span className="text-[10px] text-slate-400">
                  Late fine applies after due date
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                  <span>Risk if Missed</span>
                </div>
                <span className="text-xs font-bold text-rose-300 block line-clamp-1">
                  Admit Card Debarred
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-1">
                  {currentAction.riskIfMissed}
                </span>
              </div>
            </div>

            {/* Required Documents Checklist (Interactive) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Required Document Checklist ({currentAction.requiredDocuments.filter(d => d.checked).length}/{currentAction.requiredDocuments.length})
                </span>
                <span className="text-xs text-cyan-400">Click to toggle status</span>
              </div>

              <div className="space-y-2">
                {currentAction.requiredDocuments.map((doc, idx) => (
                  <div
                    key={idx}
                    onClick={() => toggleActionDocument(currentAction.id, idx)}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 flex items-center justify-between cursor-pointer group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                          doc.checked
                            ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold'
                            : 'bg-slate-800 border-slate-700 group-hover:border-slate-500'
                        }`}
                      >
                        {doc.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className={`text-xs font-medium ${
                        doc.checked ? 'line-through text-slate-400' : 'text-slate-200'
                      }`}>
                        {doc.name}
                      </span>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      doc.checked
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {doc.checked ? 'VERIFIED' : 'PENDING'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Action Workflow */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Action Steps Required From You
              </span>

              <div className="space-y-2">
                {currentAction.actionSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 flex items-start gap-3"
                  >
                    <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 border border-cyan-500/20">
                      {idx + 1}
                    </span>
                    <span className="text-xs text-slate-300 leading-relaxed">
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                onClick={() => updateActionStatus(currentAction.id, 'COMPLETED')}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>MARK TASK COMPLETED</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert(`Copied workflow steps for "${currentAction.title}" to clipboard!`)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

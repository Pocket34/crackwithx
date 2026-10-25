'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Search,
  Upload,
  CheckCircle2,
  ExternalLink,
  Lock,
  ArrowRight,
  Info,
  DollarSign,
  Briefcase,
  AlertOctagon,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { StudentAIService } from '@/services/aiService';
import { OpportunityCheckResult } from '@/types';
import { DEMO_OPPORTUNITY_RESULT } from '@/services/demoData';

export default function OpportunityShieldPage() {
  const { opportunityResults, addOpportunityResult } = useStudent();
  const [inputText, setInputText] = useState(DEMO_OPPORTUNITY_RESULT.sourceText);
  const [isScanning, setIsScanning] = useState(false);
  const [scanSteps, setScanSteps] = useState<string[]>([]);
  const [activeResult, setActiveResult] = useState<OpportunityCheckResult>(
    opportunityResults[0] || DEMO_OPPORTUNITY_RESULT
  );

  const sampleScenarios = [
    {
      title: "Suspicious ₹45k Internship (Demands ₹1,499 fee)",
      text: `Congratulations Pushkar! You have been shortlisted for our 3-Month Remote Data Science & AI Internship at CognitiveWave Technologies.
Stipend: ₹ 45,000 / month.
No technical interview required based on your GitHub profile.
To confirm your seat and receive your company work laptop (MacBook Pro M3), you must pay a refundable Courier Insurance & Equipment Security Fee of ₹ 1,499 within 6 hours to UPI ID: hr.cognitivewave@icici.
Offer letter will be emailed immediately after payment screenshot is shared.`
    },
    {
      title: "Legitimate Campus STEP Engineering Intern",
      text: `Google Student Training in Engineering Program (STEP) 2027.
Apply directly via careers.google.com/jobs/results/step-intern-2027.
Requirements: Currently enrolled in 2nd/3rd year Computer Science, proficiency in C++, Java, or Python, solid foundations in Data Structures and Algorithms. Selection involves 2 technical phone screenings with Google Software Engineers. No registration or equipment charges apply.`
    },
    {
      title: "Telegram 'Paid Code Reviewer' Task",
      text: `Hi student! Work from home earning 2000 INR daily by testing and reviewing student apps on Telegram. Immediate joining bonus 500 INR. To activate your task ID, recharge 299 INR to telegram bot wallet for initial verification.`
    }
  ];

  const handleScan = async (textToScan: string) => {
    setIsScanning(true);
    setScanSteps([]);

    const steps = [
      "Deconstructing message structure & linguistic patterns...",
      "Cross-checking corporate registry & official domain DNS...",
      "Analyzing monetary deposit demands & UPI routing...",
      "Evaluating recruitment process realism & interview barriers...",
      "Generating forensic trust score & safety protocol..."
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 400));
      setScanSteps(prev => [...prev, steps[i]]);
    }

    try {
      const result = await StudentAIService.scanOpportunity(textToScan);
      setActiveResult(result);
      addOpportunityResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsScanning(false);
    }
  };

  const isHighRisk = activeResult.trustScore < 50;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Opportunity Shield
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            "Can I trust this internship?" — Anti-scam verification layer detecting fake job offers, upfront fee traps, and predatory recruiters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-mono">
            Safety Shield Active
          </span>
        </div>
      </div>

      {/* Input Scanner Box */}
      <div className="rounded-3xl bg-[#090e1b] border border-amber-500/20 p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Internship / Job Offer Intake
          </span>
          <span className="text-xs text-slate-400">
            Paste WhatsApp text, email, or offer letter
          </span>
        </div>

        <div className="space-y-4">
          <textarea
            rows={4}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste unsolicited recruiter message, LinkedIn DM, offer letter excerpt, or Telegram task..."
            className="w-full bg-[#0d1428] border border-slate-800 rounded-2xl p-4 text-xs sm:text-sm text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-amber-500/50 resize-none font-mono"
          />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">
                Sample Verification Scenarios:
              </span>
            </div>

            <button
              onClick={() => handleScan(inputText)}
              disabled={isScanning || !inputText.trim()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>AUDITING OPPORTUNITY...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4 stroke-[2.5]" />
                  <span>RUN VERIFICATION SCAN</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Preload Chips */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap gap-2">
            {sampleScenarios.map((sc, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(sc.text);
                  handleScan(sc.text);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Briefcase className="w-3 h-3 text-amber-400" />
                <span>{sc.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Animated Scanning Steps Display */}
      {isScanning && (
        <div className="p-6 rounded-3xl bg-[#0b101f] border border-amber-500/40 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <div className="w-3 h-3 rounded-full bg-amber-400 animate-ping" />
            <span>Scanning Opportunity In Realtime...</span>
          </div>

          <div className="space-y-2 font-mono text-xs text-slate-300">
            {scanSteps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Result Grid: Trust Score & Warning Signals */}
      {!isScanning && activeResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Big Trust Gauge (5 cols) */}
          <div className={`lg:col-span-5 rounded-3xl p-6 flex flex-col justify-between border relative overflow-hidden ${
            isHighRisk
              ? 'bg-gradient-to-b from-rose-950/40 via-[#0a0e1c] to-[#090d18] border-rose-500/40'
              : 'bg-gradient-to-b from-emerald-950/30 via-[#0a0e1c] to-[#090d18] border-emerald-500/30'
          }`}>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Opportunity Trust Score
                </span>
                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isHighRisk
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                }`}>
                  {activeResult.riskLevel}
                </span>
              </div>

              {/* Large Circular/Radial Score */}
              <div className="my-6 text-center">
                <div className="inline-flex flex-col items-center justify-center w-36 h-36 rounded-full bg-slate-900 border-4 border-dashed relative">
                  <span className={`text-5xl font-black tracking-tight ${
                    isHighRisk ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {activeResult.trustScore}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">/ 100</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                <strong className={`block ${isHighRisk ? 'text-rose-300' : 'text-emerald-300'}`}>
                  Analysis Summary:
                </strong>
                <p>{activeResult.summary}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-400">
              <strong>Mandatory Protocol:</strong> CrackwithX never declares an offer "definitely a scam" purely on heuristic models. Flags are calibrated as potential warning signs requiring verified confirmation.
            </div>
          </div>

          {/* Right Column: Warning Indicators & Safe Verification Steps (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Warning Indicators */}
            <div className="rounded-3xl bg-[#0b101f] border border-slate-800 p-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Detected Warning Indicators ({activeResult.warningSignals.length})
              </span>

              <div className="space-y-3">
                {activeResult.warningSignals.map((sig, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3"
                  >
                    <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                      sig.severity === 'HIGH' ? 'text-rose-400' : 'text-amber-400'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white">
                          {sig.indicator}
                        </h4>
                        <span className={`text-[9px] font-bold px-2 py-0.2 rounded border ${
                          sig.severity === 'HIGH'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}>
                          {sig.severity} RISK
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {sig.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Safe Verification Actions */}
            <div className="rounded-3xl bg-[#090e1b] border border-cyan-500/20 p-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Recommended Verification Steps (Take Before Responding)
              </span>

              <div className="space-y-2">
                {activeResult.safeVerificationSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-300"
                  >
                    <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>

              {/* Action Bridge to Problem Solver */}
              {isHighRisk && (
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Need help drafting a verification inquiry or reporting this?
                  </span>
                  <Link
                    href="/app/problem-solver?cat=internship"
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>Launch Problem Solver</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

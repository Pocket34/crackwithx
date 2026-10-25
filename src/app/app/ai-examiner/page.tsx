'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Brain,
  Clock,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Mic,
  MicOff,
  Send,
  SkipForward,
  Award,
  Layers,
  FileCode,
  ShieldCheck,
  Zap,
  CornerDownRight,
  Download,
  Flame,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStudent } from '@/context/StudentContext';
import { DEMO_VIVA_QUESTIONS, DEMO_VIVA_REPORT } from '@/services/demoData';
import { StudentAIService } from '@/services/aiService';
import { VivaQuestion, VivaReport } from '@/types';

export default function AiExaminerPage() {
  const { setVivaReport, latestVivaReport } = useStudent();

  // Mode: SETUP | IN_EXAM | REPORT
  const [examState, setExamState] = useState<'SETUP' | 'IN_EXAM' | 'REPORT'>('SETUP');
  const [projectTitle, setProjectTitle] = useState('NeuroRoute: Distributed AI Transit Engine');
  const [repoUrl, setRepoUrl] = useState('https://github.com/pushkar-cse/neuroroute-engine');
  
  // Examination state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<VivaQuestion[]>(DEMO_VIVA_QUESTIONS);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(120);
  const [timerActive, setTimerActive] = useState(false);

  // Active question dynamic evaluation & follow-ups
  const [liveEvaluation, setLiveEvaluation] = useState<{
    scoreOutOfTen: number;
    feedback: string;
    followUpCrossQuestion?: string;
    detectedStrengths: string[];
    detectedWeaknesses: string[];
  } | null>(null);

  const [roundScores, setRoundScores] = useState<{ round: string; score: number }[]>([]);

  const currentQ = questions[currentQuestionIndex] || questions[0];

  // Timer countdown
  useEffect(() => {
    let interval: any;
    if (examState === 'IN_EXAM' && timerActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      // Auto submit or timeout warning
    }
    return () => clearInterval(interval);
  }, [examState, timerActive, secondsRemaining]);

  const startExamination = () => {
    setExamState('IN_EXAM');
    setCurrentQuestionIndex(0);
    setStudentAnswer('');
    setLiveEvaluation(null);
    setRoundScores([]);
    setSecondsRemaining(120);
    setTimerActive(true);
  };

  const fillSampleAnswer = () => {
    if (currentQ.sampleStudentAnswer) {
      setStudentAnswer(currentQ.sampleStudentAnswer);
    }
  };

  const handleToggleVoice = () => {
    setIsRecording(!isRecording);
    if (!isRecording && !studentAnswer) {
      // Voice transcription simulation
      setTimeout(() => {
        fillSampleAnswer();
        setIsRecording(false);
      }, 1200);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!studentAnswer.trim()) return;
    setIsEvaluating(true);
    setTimerActive(false);

    try {
      const evaluation = await StudentAIService.evaluateVivaResponse(
        currentQ,
        studentAnswer,
        currentQuestionIndex + 1
      );

      setLiveEvaluation(evaluation);
      setRoundScores((prev) => [
        ...prev,
        { round: currentQ.round, score: evaluation.scoreOutOfTen },
      ]);

      // If examiner cross-questions, dynamically inject follow-up question
      if (evaluation.followUpCrossQuestion && currentQuestionIndex === 3) {
        const injectedQ: VivaQuestion = {
          id: 99,
          round: "ROUND 4 — CROSS-EXAMINATION DEEP DIVE",
          roundType: "CROSS_EXAM",
          difficulty: "Expert",
          question: evaluation.followUpCrossQuestion,
          contextHint: "Examiner detected theoretical claim; defending operational trade-offs.",
          expectedKeyPoints: ["Decoupled async inference", "In-memory graph weights", "O(1) lookup latency"],
          sampleStudentAnswer: "We pre-calculate graph convolution matrices asynchronously every 30 seconds and cache weights in Redis. Real-time pathfinding simply does an O(1) edge lookup instead of triggering synchronous forward pass computation on the critical path."
        };
        setQuestions((prev) => {
          const updated = [...prev];
          updated.splice(currentQuestionIndex + 1, 0, injectedQ);
          return updated;
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setStudentAnswer('');
      setLiveEvaluation(null);
      setSecondsRemaining(120);
      setTimerActive(true);
    } else {
      finishExamination();
    }
  };

  const finishExamination = () => {
    setExamState('REPORT');
    setVivaReport(DEMO_VIVA_REPORT);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore if canvas fails
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 1. SETUP STAGE */}
      {examState === 'SETUP' && (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Brain className="w-5 h-5" />
                </span>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  AI Examiner & Viva Defense
                </h1>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                "Do I actually understand what I built?" — High-pressure project viva simulator with dynamic cross-questioning.
              </p>
            </div>

            <span className="text-xs px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold font-mono">
              6 Progressive Defense Rounds
            </span>
          </div>

          {/* Project Setup Card */}
          <div className="rounded-3xl bg-[#090e1d] border border-indigo-500/30 p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-2xl space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                  Active Project Under Defense
                </span>
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full bg-[#0d1428] border border-slate-700/80 rounded-2xl p-4 text-base font-bold text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Code Repository / Documentation Dossier
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="flex-1 bg-[#0d1428] border border-slate-700/80 rounded-2xl p-3.5 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <button className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200">
                    Browse
                  </button>
                </div>
              </div>

              {/* 6 Rounds Architecture Breakdown */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Examination Structure & Difficulty Curve
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-cyan-400 font-bold block">ROUND 1</span>
                    <strong className="text-white block mt-0.5">Fundamentals</strong>
                    <span className="text-[10px] text-slate-400">Problem & target users</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-cyan-400 font-bold block">ROUND 2</span>
                    <strong className="text-white block mt-0.5">Technical Stack</strong>
                    <span className="text-[10px] text-slate-400">PostgreSQL, APIs, Models</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                    <span className="text-[10px] text-indigo-400 font-bold block">ROUND 3</span>
                    <strong className="text-white block mt-0.5">Architecture</strong>
                    <span className="text-[10px] text-slate-400">What happens when...</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-rose-500/30">
                    <span className="text-[10px] text-rose-400 font-bold block">ROUND 4</span>
                    <strong className="text-white block mt-0.5">Cross Questioning</strong>
                    <span className="text-[10px] text-slate-400">Follow-ups on your words</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-amber-500/30">
                    <span className="text-[10px] text-amber-400 font-bold block">ROUND 5</span>
                    <strong className="text-white block mt-0.5">Edge Cases</strong>
                    <span className="text-[10px] text-slate-400">DB crash, 10k users</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-indigo-500/30">
                    <span className="text-[10px] text-indigo-400 font-bold block">ROUND 6</span>
                    <strong className="text-white block mt-0.5">Project Ownership</strong>
                    <span className="text-[10px] text-slate-400">Prove your backend code</span>
                  </div>
                </div>
              </div>

              {/* Start CTA */}
              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={startExamination}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>ENTER EXAMINATION MODE</span>
                </button>

                {latestVivaReport && (
                  <button
                    onClick={() => setExamState('REPORT')}
                    className="px-4 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 border border-slate-800"
                  >
                    View Previous Viva Report ({latestVivaReport.overallScore}/100)
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. FULL-SCREEN EXAMINATION INTERFACE */}
      {examState === 'IN_EXAM' && (
        <div className="rounded-3xl bg-[#080d1a] border border-indigo-500/40 p-6 md:p-8 shadow-2xl relative space-y-6">
          {/* Top Examination Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                  AI EXAMINER IN SESSION
                </span>
                <h2 className="text-base font-extrabold text-white">
                  QUESTION {currentQuestionIndex + 1 < 10 ? `0${currentQuestionIndex + 1}` : currentQuestionIndex + 1} / {questions.length < 10 ? `0${questions.length}` : questions.length}
                </h2>
              </div>
            </div>

            {/* Timer & Difficulty Badges */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-xs">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span className={`font-bold ${secondsRemaining < 30 ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
                  {formatTimer(secondsRemaining)}
                </span>
              </div>

              <span className={`text-xs font-bold px-3 py-1.5 rounded-xl border ${
                currentQ.difficulty === 'Expert'
                  ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                  : currentQ.difficulty === 'Intermediate'
                  ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
              }`}>
                {currentQ.difficulty} Level
              </span>

              <button
                onClick={finishExamination}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
              >
                End Exam
              </button>
            </div>
          </div>

          {/* Current Question Block */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                {currentQ.round}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              "{currentQ.question}"
            </h3>

            {currentQ.contextHint && (
              <p className="text-xs text-slate-400 italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                Hint from Examiner: {currentQ.contextHint}
              </p>
            )}
          </div>

          {/* Answer Input Area */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Your Answer (Viva Defense)
              </span>

              <div className="flex items-center gap-2">
                {/* Voice toggle */}
                <button
                  onClick={handleToggleVoice}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                    isRecording
                      ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3 text-cyan-400" />}
                  <span>{isRecording ? 'Listening...' : 'Voice Input'}</span>
                </button>

                {/* Pre-fill button for fast hackathon demo */}
                <button
                  onClick={fillSampleAnswer}
                  className="px-2.5 py-1 rounded-xl bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-300 text-xs font-medium"
                >
                  ⚡ Auto-Fill Student Answer
                </button>
              </div>
            </div>

            <textarea
              rows={4}
              placeholder="State your answer clearly. Explain your technical choices, architectural flow, and database models..."
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              disabled={isEvaluating}
              className="w-full bg-[#0d1428] border border-slate-700 rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          {/* Live Evaluation & Cross-Questioning Result */}
          {liveEvaluation && (
            <div className="p-5 rounded-2xl bg-[#0d1830] border border-indigo-500/40 space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                    Examiner Verdict
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Score: {liveEvaluation.scoreOutOfTen} / 10
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold">
                  Evaluated with Deep Project Context
                </span>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed">
                {liveEvaluation.feedback}
              </p>

              {liveEvaluation.followUpCrossQuestion && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 mt-2">
                  <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
                    <CornerDownRight className="w-4 h-4 text-rose-400" />
                    <span>Cross-Question Triggered from your answer:</span>
                  </div>
                  <p className="text-xs text-rose-100 mt-1 italic font-medium">
                    "{liveEvaluation.followUpCrossQuestion}"
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Controls Bar: Submit, Skip, Next */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={handleNextQuestion}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5"
            >
              <SkipForward className="w-3.5 h-3.5" />
              <span>Skip Question</span>
            </button>

            <div className="flex items-center gap-3">
              {!liveEvaluation ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={isEvaluating || !studentAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  {isEvaluating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Examiner Evaluating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>SUBMIT DEFENSE ANSWER</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <span>
                    {currentQuestionIndex < questions.length - 1 ? 'PROCEED TO NEXT ROUND' : 'GENERATE VIVA REPORT'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. VIVA REPORT & WEAK AREAS */}
      {examState === 'REPORT' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Award className="w-5 h-5" />
                </span>
                <h1 className="text-2xl font-black text-white tracking-tight">
                  Official Viva Defense Report
                </h1>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                Candidate: <strong className="text-white">Pushkar (CS-2022-084)</strong> • Project: <strong className="text-white">{projectTitle}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={startExamination}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retake Viva</span>
              </button>
            </div>
          </div>

          {/* Big Score Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 rounded-3xl bg-gradient-to-b from-[#0e162d] to-[#090d18] border border-indigo-500/30 p-6 flex flex-col justify-between text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Overall Viva Readiness
                </span>
                <div className="my-4">
                  <span className="text-6xl font-black text-white tracking-tight">
                    {DEMO_VIVA_REPORT.overallScore}
                  </span>
                  <span className="text-2xl font-bold text-slate-400 ml-1">
                    / 100
                  </span>
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  VERDICT: READY FOR EXTERNAL EVALUATION
                </span>
              </div>

              <div className="pt-6 border-t border-slate-800/80 text-left">
                <span className="text-xs text-slate-300 leading-relaxed block">
                  "{DEMO_VIVA_REPORT.examinerVerdict}"
                </span>
              </div>
            </div>

            {/* Competency Breakdown (8 cols) */}
            <div className="lg:col-span-8 rounded-3xl bg-[#0b101f] border border-slate-800 p-6 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Evaluated Defense Competencies
              </span>

              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">Technical Understanding</span>
                    <span className="font-mono text-cyan-400 font-bold">{DEMO_VIVA_REPORT.breakdown.technicalUnderstanding}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${DEMO_VIVA_REPORT.breakdown.technicalUnderstanding}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">Project Ownership (Authenticity)</span>
                    <span className="font-mono text-emerald-400 font-bold">{DEMO_VIVA_REPORT.breakdown.projectOwnership}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${DEMO_VIVA_REPORT.breakdown.projectOwnership}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">Concept Clarity</span>
                    <span className="font-mono text-indigo-400 font-bold">{DEMO_VIVA_REPORT.breakdown.conceptClarity}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${DEMO_VIVA_REPORT.breakdown.conceptClarity}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">Architecture & Edge Cases</span>
                    <span className="font-mono text-amber-400 font-bold">{DEMO_VIVA_REPORT.breakdown.architecture}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-400 h-full rounded-full" style={{ width: `${DEMO_VIVA_REPORT.breakdown.architecture}%` }} />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">Communication & Defense Resilience</span>
                    <span className="font-mono text-indigo-300 font-bold">{DEMO_VIVA_REPORT.breakdown.communication}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-300 h-full rounded-full" style={{ width: `${DEMO_VIVA_REPORT.breakdown.communication}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Weak Areas to Revise */}
          <div className="rounded-3xl bg-[#090e1b] border border-rose-500/30 p-6 space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              <h2 className="text-base font-bold text-white">
                WEAK AREAS: Revise These Concepts Before The Real Viva
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEMO_VIVA_REPORT.weakAreas.map((weak, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                    ⚠ {weak.topic}
                  </span>
                  <p className="text-xs text-slate-400">
                    <strong className="text-slate-300">Observation:</strong> {weak.reason}
                  </p>
                  <p className="text-xs text-cyan-300 bg-cyan-950/20 p-2.5 rounded-xl border border-cyan-500/20">
                    <strong>Recommended Revision:</strong> {weak.recommendedRevision}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

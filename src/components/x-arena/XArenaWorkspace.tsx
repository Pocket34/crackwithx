'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Brain,
  Sparkles,
  Zap,
  Cpu,
  Layers,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Code2,
  Mic,
  BookOpen,
  Search,
  Upload,
  RotateCcw,
  ExternalLink,
  Flame,
  FileText,
  Clock,
  Send,
  HelpCircle,
  Share2,
  BookmarkPlus
} from 'lucide-react';
import {
  AVAILABLE_MODELS,
  XArenaService
} from '@/services/xArenaService';
import {
  ModelId,
  StudentMode,
  ModelResponseItem,
  XArenaSynthesis
} from '@/types/xArena';

export const XArenaWorkspace: React.FC = () => {
  // Input state
  const [prompt, setPrompt] = useState('Explain DBMS normalization for my engineering exam.');
  const [selectedModes, setSelectedMode] = useState<StudentMode>('EXAM');
  const [selectedModelIds, setSelectedModelIds] = useState<ModelId[]>(['gpt', 'gemini', 'claude', 'perplexity']);
  const [attachedFileName, setAttachedFileName] = useState<string | null>(null);

  // Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [responses, setResponses] = useState<ModelResponseItem[] | null>(null);
  const [synthesis, setSynthesis] = useState<XArenaSynthesis | null>(null);
  const [expandedModels, setExpandedModels] = useState<Record<string, boolean>>({});

  // Quick Action transformations
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [showMcqs, setShowMcqs] = useState(false);
  const [simplifiedView, setSimplifiedView] = useState(false);
  const [examReadyView, setExamReadyView] = useState(false);

  const samplePrompts = [
    { label: 'Explain DBMS Normalization for Exam', text: 'Explain DBMS normalization (1NF, 2NF, 3NF, BCNF) for my engineering exam with trade-offs.' },
    { label: 'Operating System Deadlocks', text: 'Explain OS deadlock: Coffman conditions, Banker’s algorithm, and RAG single vs multi-instance.' },
    { label: 'PostgreSQL vs MongoDB Comparison', text: 'Compare PostgreSQL with PostGIS vs MongoDB for a real-time transit telemetry backend.' },
    { label: 'Debug Go Concurrency Race', text: 'How do you detect and resolve race conditions in Go worker pools using sync.Mutex vs channels?' },
    { label: 'FastAPI vs Flask for Viva', text: 'Why did we choose FastAPI over Flask for async WebSocket streaming in our project?' },
    { label: 'Calculate AMAT Cache Latency', text: 'Calculate Average Memory Access Time (AMAT) with L1, L2 caches and explain miss penalty.' }
  ];

  const studentModes: { id: StudentMode; label: string; icon: any; desc: string }[] = [
    { id: 'EXAM', label: 'EXAM MODE', icon: GraduationCap, desc: 'Structured rubrics, definitions & markings' },
    { id: 'CODING', label: 'CODING MODE', icon: Code2, desc: 'Correctness, complexity & debugging' },
    { id: 'VIVA', label: 'VIVA MODE', icon: Mic, desc: 'Concise answers & examiner cross-questions' },
    { id: 'STUDY', label: 'STUDY MODE', icon: BookOpen, desc: 'Simple conceptual models & flashcards' },
    { id: 'RESEARCH', label: 'RESEARCH MODE', icon: Search, desc: 'Factual verification & literature references' },
  ];

  const toggleModel = (id: ModelId) => {
    if (selectedModelIds.includes(id)) {
      if (selectedModelIds.length > 1) {
        setSelectedModelIds(prev => prev.filter(m => m !== id));
      }
    } else {
      setSelectedModelIds(prev => [...prev, id]);
    }
  };

  const selectAllModels = () => {
    setSelectedModelIds(['gpt', 'gemini', 'claude', 'perplexity']);
  };

  const toggleExpand = (modelId: string) => {
    setExpandedModels(prev => ({
      ...prev,
      [modelId]: !prev[modelId]
    }));
  };

  const handleAskArena = async (overridePrompt?: string) => {
    const q = overridePrompt || prompt;
    if (!q.trim()) return;

    setIsAnalyzing(true);
    setResponses(null);
    setSynthesis(null);
    setShowFlashcards(false);
    setShowMcqs(false);
    setSimplifiedView(false);
    setExamReadyView(false);

    try {
      const result = await XArenaService.queryMultiAI(
        q,
        selectedModelIds,
        selectedModes,
        attachedFileName || undefined
      );
      setResponses(result.responses);
      setSynthesis(result.synthesis);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFileName(file.name);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500/20 via-indigo-500/20 to-purple-500/20 border border-cyan-500/30 text-cyan-300 shadow-lg shadow-cyan-500/10">
              <Brain className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-1.5">
                  <span>🧠 X-ARENA</span>
                </h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-mono tracking-wider">
                  MULTI-AI WORKSPACE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-cyan-200/90 font-medium mt-0.5">
                "One prompt. Multiple AI perspectives. One better answer."
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Let different AI models think about your question, then let CrackwithX bring the strongest insights together. Cross-checked for student clarity, correctness, and exam relevance.
          </p>
        </div>

        {/* Subtle X Concept Indicator */}
        <div className="hidden lg:flex flex-col items-end text-right font-mono text-[10px] text-slate-400 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
          <span className="text-cyan-400 font-bold">X-Arena Multi-Engine</span>
          <span className="text-slate-300">GPT × Gemini × Claude × Perplexity</span>
          <span className="text-indigo-400 font-semibold mt-0.5">↓ CrackwithX Synthesis Engine</span>
        </div>
      </div>

      {/* 2. Model Selection Area */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[#090d19] border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Select Participating AI Models
            </span>
            <span className="text-[10px] text-slate-400">({selectedModelIds.length} active)</span>
          </div>
          <button
            onClick={selectAllModels}
            className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            [ SELECT ALL ]
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {AVAILABLE_MODELS.map((model) => {
            const isSelected = selectedModelIds.includes(model.id);
            return (
              <button
                key={model.id}
                onClick={() => toggleModel(model.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-[#0f172a] border-cyan-500/50 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                    : 'bg-slate-900/40 border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-cyan-400 shadow-sm shadow-cyan-400' : 'bg-slate-600'}`} />
                    <span className="text-xs font-bold text-white">{model.name}</span>
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${model.badgeColor}`}>
                    {model.statusLabel}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1.5 truncate">
                  {model.tagline}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Special Student Modes */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Special Student Modes (Influences Synthesis)
          </span>
          <span className="text-[11px] text-indigo-400 font-semibold font-mono">
            Active: {selectedModes} MODE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {studentModes.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedModes === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMode(m.id)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-950/80 to-slate-900 border-indigo-500/60 shadow-lg shadow-indigo-950/30 ring-1 ring-indigo-500/40'
                    : 'bg-[#090d18] border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {m.label}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-1 line-clamp-1">
                  {m.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Large Central Prompt Box */}
      <div className="p-6 rounded-3xl bg-[#090e1b] border border-cyan-500/30 shadow-2xl relative overflow-hidden space-y-4">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Enter Your Student Prompt
            </span>

            {attachedFileName && (
              <span className="text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-500/30 px-2.5 py-1 rounded-xl flex items-center gap-1.5 font-mono">
                <FileText className="w-3.5 h-3.5" />
                <span>{attachedFileName}</span>
                <button onClick={() => setAttachedFileName(null)} className="ml-1 text-slate-400 hover:text-white">×</button>
              </span>
            )}
          </div>

          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask anything... (e.g. Explain DBMS normalization, debug code, viva preparation, or engineering problem)"
            className="w-full bg-[#0d1428] border border-slate-700/80 rounded-2xl p-4 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 transition-colors resize-none font-sans"
          />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* File Attachment */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5 text-cyan-400" />
                <span>[ ADD FILE ]</span>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.txt,.sql,.py,.go,.js,.tsx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <span className="text-[11px] text-slate-400">PDF, code files, lecture notes supported</span>
            </div>

            {/* Run Button */}
            <button
              onClick={() => handleAskArena()}
              disabled={isAnalyzing || !prompt.trim()}
              className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-indigo-700 hover:from-cyan-400 hover:via-indigo-500 hover:to-indigo-600 disabled:opacity-50 text-white font-black text-xs tracking-wider shadow-xl shadow-cyan-500/20 transition-all hover:scale-105"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>ANALYZING WITH {selectedModelIds.length} MODELS...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>ASK X-ARENA</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Example prompts underneath */}
        <div className="pt-3 border-t border-slate-800/80">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Or Click An Engineering Example To Try:
          </span>
          <div className="flex flex-wrap gap-2">
            {samplePrompts.map((ex, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(ex.text);
                  handleAskArena(ex.text);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3 h-3 text-cyan-400" />
                <span>{ex.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Loading State */}
      {isAnalyzing && (
        <div className="p-8 rounded-3xl bg-[#0b101f] border border-cyan-500/30 text-center space-y-4 animate-in fade-in duration-200">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto animate-pulse">
            <Brain className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white tracking-wide">
              ANALYZING YOUR QUESTION ACROSS MULTIPLE AI PERSPECTIVES...
            </h3>
            <p className="text-xs text-slate-400">
              Querying {selectedModelIds.join(' • ').toUpperCase()} in parallel $\rightarrow$ Cross-checking agreements $\rightarrow$ Synthesizing student-ready response
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
            {selectedModelIds.map((id) => (
              <div key={id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs text-slate-300">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="font-semibold">{id.toUpperCase()} Thinking...</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. AI Response Comparison Layout */}
      {!isAnalyzing && responses && responses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Individual AI Perspectives ({responses.length} Received)
              </span>
              <span className="text-[10px] text-slate-400">• Click to view full model text</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Mode: {selectedModes}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {responses.map((resp) => {
              const isExpanded = Boolean(expandedModels[resp.modelId]);
              return (
                <div
                  key={resp.modelId}
                  className="p-5 rounded-2xl bg-[#0b101f] border border-slate-800 hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {resp.modelName}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3 h-3" />
                        Response received
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-slate-400">
                      {resp.latencyMs}ms
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {resp.summary}
                  </p>

                  {/* Key Takeaways */}
                  <div className="space-y-1 pt-1">
                    {resp.keyInsights.map((ins, i) => (
                      <div key={i} className="text-[11px] text-slate-400 flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                        <span className="line-clamp-2">{ins}</span>
                      </div>
                    ))}
                  </div>

                  {/* Collapsible toggle */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <button
                      onClick={() => toggleExpand(resp.modelId)}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      <span>{isExpanded ? 'Hide Response' : 'View Full Response'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                    <span className="text-[10px] text-slate-400">
                      Perspective analyzed
                    </span>
                  </div>

                  {/* Expanded Full Response */}
                  {isExpanded && (
                    <div className="p-4 rounded-xl bg-[#060913] border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto animate-in fade-in duration-150">
                      {resp.content}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. Smart Conflict Detection (If Disagreement Detected) */}
      {!isAnalyzing && synthesis && synthesis.conflictDetected && (
        <div className="p-6 rounded-3xl bg-amber-950/20 border border-amber-500/40 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                SMART CONFLICT DETECTION
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white">
                ⚠ Model Disagreement Detected: {synthesis.conflictDetected.topic}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            {synthesis.conflictDetected.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {synthesis.conflictDetected.modelStances.map((stance, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 text-xs">
                <span className="font-bold text-cyan-400 block">{stance.modelName}</span>
                <p className="text-slate-300 leading-snug">{stance.stance}</p>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-2">
            <span className="font-bold">Student Guidance:</span>
            <span>{synthesis.conflictDetected.verificationAdvice}</span>
          </div>
        </div>
      )}

      {/* 8. CRACKWITHX SYNTHESIS ENGINE (THE HERO FINAL ANSWER) */}
      {!isAnalyzing && synthesis && (
        <div className="space-y-6">
          <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-b from-[#0b1428] via-[#090d19] to-[#070b14] border border-cyan-500/40 shadow-2xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top Bar with AI Agreement Indicator */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    CRACKWITHX SYNTHESIS ENGINE
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    ✦ CRACKWITHX FINAL ANSWER
                  </h2>
                </div>
              </div>

              {/* AI Agreement Indicator */}
              <div className="flex items-center gap-3 self-start sm:self-auto">
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-mono">
                    AI Model Agreement
                  </span>
                  <span className="text-xs font-bold text-emerald-400">
                    {synthesis.agreementLevel} ({synthesis.agreementPercentage}%)
                  </span>
                </div>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-xs font-mono">
                  {synthesis.agreementPercentage}%
                </div>
              </div>
            </div>

            {/* Quick Action Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleCopy(synthesis.finalAnswer)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
              >
                {copiedAnswer ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
                <span>{copiedAnswer ? 'Copied!' : 'Copy Answer'}</span>
              </button>

              <button
                onClick={() => setSimplifiedView(!simplifiedView)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  simplifiedView ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                {simplifiedView ? '✓ Simplified View' : 'Simplify (ELI5)'}
              </button>

              <button
                onClick={() => setExamReadyView(!examReadyView)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  examReadyView ? 'bg-indigo-600 text-white border-indigo-500 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                {examReadyView ? '✓ Exam Ready' : 'Make Exam Ready'}
              </button>

              <button
                onClick={() => setShowFlashcards(!showFlashcards)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  showFlashcards ? 'bg-purple-600 text-white border-purple-500 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                Make Short Notes
              </button>

              <button
                onClick={() => setShowMcqs(!showMcqs)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  showMcqs ? 'bg-blue-600 text-white border-blue-500 font-bold' : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                }`}
              >
                Generate MCQs
              </button>
            </div>

            {/* Synthesized Output Display */}
            <div className="p-6 rounded-2xl bg-[#060912] border border-slate-800 text-slate-200 text-xs sm:text-sm leading-relaxed space-y-4 max-h-[550px] overflow-y-auto font-sans">
              {simplifiedView ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 font-semibold">
                    💡 Simplified Summary (Easy Conceptual Breakdown):
                  </div>
                  <p>
                    Think of normalization like cleaning and organizing a messy tool shed. Instead of dumping hammers, nails, paint, and screws into one big box (where items get lost or ruined when you try to change one), you separate them into dedicated labeled containers.
                  </p>
                  <p>
                    In databases:
                    <br />• <strong>1NF:</strong> Don't put multiple items in one cell.
                    <br />• <strong>2NF:</strong> Don't let details depend on only half of the ID key.
                    <br />• <strong>3NF:</strong> Don't link details through third parties.
                    <br />• <strong>BCNF:</strong> Keep every relationship tied strictly to the main ID.
                  </p>
                </div>
              ) : (
                <div className="whitespace-pre-wrap font-sans">
                  {synthesis.finalAnswer}
                </div>
              )}
            </div>

            {/* Short Notes / Flashcards Toggle Drawer */}
            {showFlashcards && synthesis.generatedFlashcards && (
              <div className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3 animate-in fade-in duration-150">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-300 block">
                  Quick Flashcards & Short Notes
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {synthesis.generatedFlashcards.map((fc, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1 text-xs">
                      <strong className="text-cyan-300 block">Q: {fc.question}</strong>
                      <p className="text-slate-300 mt-1">A: {fc.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* MCQs Practice Drawer */}
            {showMcqs && synthesis.mcqs && (
              <div className="p-5 rounded-2xl bg-blue-950/20 border border-blue-500/30 space-y-4 animate-in fade-in duration-150">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300 block">
                  Quick Self-Test MCQs
                </span>
                <div className="space-y-3">
                  {synthesis.mcqs.map((mcq, i) => (
                    <div key={i} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                      <div className="font-semibold text-white">
                        {i + 1}. {mcq.question}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {mcq.options.map((opt, optIdx) => (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-lg border text-left ${
                              optIdx === mcq.correctIndex
                                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold'
                                : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                            }`}
                          >
                            <span className="font-mono mr-1.5">{String.fromCharCode(65 + optIdx)})</span>
                            {opt}
                          </div>
                        ))}
                      </div>
                      <span className="text-[11px] text-slate-400 block pt-1">
                        Explanation: {mcq.explanation}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* WHY THIS ANSWER? SECTION */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 block">
                WHY THIS ANSWER? (MULTI-AI SYNTHESIS TRANSPARENCY)
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-2">
                  <span className="text-slate-400 font-semibold block">
                    Points Supported By Multiple Models:
                  </span>
                  {synthesis.whyThisAnswer.consensusPoints.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <span className="text-slate-400 font-semibold block">
                    Important Differences & Value Added:
                  </span>
                  {synthesis.whyThisAnswer.differencesIdentified.map((pt, i) => (
                    <div key={i} className="flex items-start gap-2 text-slate-300">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {synthesis.whyThisAnswer.missingInfoIdentified.length > 0 && (
                <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <strong className="text-amber-400">Missing Information Identified:</strong>{' '}
                  {synthesis.whyThisAnswer.missingInfoIdentified.join(' ')}
                </div>
              )}
            </div>

            {/* Optional Handoffs To Existing CrackwithX Modules */}
            <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-400">
                Continue with this topic across CrackwithX:
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/app/ai-examiner"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all"
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>START VIVA DEFENSE</span>
                </Link>

                <Link
                  href="/app/project-dna"
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Save to Project DNA</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

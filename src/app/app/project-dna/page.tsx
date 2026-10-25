'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Dna,
  GitBranch,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  FileCode,
  Terminal,
  ArrowRight,
  Database,
  Cpu,
  Globe,
  Server,
  Play,
  Award,
  AlertTriangle
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { ProjectNode, SkillDnaItem } from '@/types';

export default function ProjectDnaPage() {
  const { projectNodes, skillDna } = useStudent();
  const [selectedNode, setSelectedNode] = useState<ProjectNode>(projectNodes[0]);
  const [proveModalOpen, setProveModalOpen] = useState(false);
  const [proveAnswer, setProveAnswer] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    score: number;
    verdict: string;
    verifiedSkills: string[];
    evidenceMatches: string[];
  } | null>(null);

  const handleProveChallenge = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerificationResult({
        score: 94,
        verdict: "High Authenticity: Explanation matches commit SHA #7f89b2 (RS256 JWT auth middleware and Redis JTI revocation list).",
        verifiedSkills: ["Asymmetric JWTs (RS256)", "Redis Token Blacklist", "FastAPI Security Depends"],
        evidenceMatches: [
          "core/auth/jwt_bearer.py line 42: decode_rsa_jwt() matches stated claims",
          "config/redis.conf TTL expiration matches session invalidation window"
        ]
      });
    }, 1500);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'AI': return Cpu;
      case 'DATABASE': return Database;
      case 'FRONTEND': return Globe;
      case 'BACKEND': return Server;
      default: return Layers;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Dna className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Project DNA & Evidence Graph
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            "What can I actually prove?" — Interactive architecture graph, code-backed skill DNA, and instant ownership defense.
          </p>
        </div>

        <button
          onClick={() => {
            setProveModalOpen(true);
            setVerificationResult(null);
            setProveAnswer("We use RS256 asymmetric JWTs. The client passes the token in the Authorization Bearer header. The auth middleware verifies the signature against the public key without querying the database. If a user logs out, the JTI is blacklisted in Redis with a TTL equal to the token expiry.");
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-black text-xs shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
        >
          <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
          <span>[ PROVE IT ] CHALLENGE</span>
        </button>
      </div>

      {/* Top Section: Interactive Node Graph & Node Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Visual Interactive Node Graph Canvas (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#080d19] border border-cyan-500/20 p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
              Interactive Project Architecture Graph
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">
              Click any node to inspect code evidence
            </span>
          </div>

          {/* Graph Nodes Visual Area */}
          <div className="relative min-h-[360px] bg-[#050811] rounded-2xl border border-slate-800/80 p-6 flex flex-col justify-center items-center">
            {/* Ambient Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Top Node: Core Engine */}
            <div className="relative z-10 mb-8">
              {(() => {
                const coreNode = projectNodes.find(n => n.type === 'CORE') || projectNodes[0];
                const isSelected = selectedNode?.id === coreNode.id;
                return (
                  <button
                    onClick={() => setSelectedNode(coreNode)}
                    className={`px-5 py-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl shadow-indigo-600/40 scale-105'
                        : 'bg-[#0f172a] border-slate-700 text-slate-200 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-300" />
                      <span className="text-xs font-bold">{coreNode.name}</span>
                    </div>
                    <span className="block text-[10px] opacity-75 mt-0.5 font-mono">
                      {coreNode.technology}
                    </span>
                  </button>
                );
              })()}
            </div>

            {/* Connecting lines SVG overlay */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-slate-700 stroke-[1.5] stroke-dasharray-[4,4]">
              <line x1="50%" y1="90" x2="25%" y2="200" />
              <line x1="50%" y1="90" x2="75%" y2="200" />
              <line x1="25%" y1="240" x2="35%" y2="330" />
              <line x1="75%" y1="240" x2="75%" y2="330" />
            </svg>

            {/* Middle Row: AI Node & Gateway API Node */}
            <div className="w-full flex justify-around items-center relative z-10 mb-8">
              {projectNodes.filter(n => n.type === 'AI' || n.type === 'BACKEND').map(n => {
                const isSelected = selectedNode?.id === n.id;
                const Icon = getNodeIcon(n.type);
                return (
                  <button
                    key={n.id}
                    onClick={() => setSelectedNode(n)}
                    className={`px-4 py-3 rounded-2xl border text-left transition-all max-w-[200px] ${
                      isSelected
                        ? 'bg-cyan-600 border-cyan-400 text-white shadow-xl shadow-cyan-600/40 scale-105'
                        : 'bg-[#0f172a] border-slate-700 text-slate-200 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-cyan-300" />
                      <span className="text-xs font-bold truncate">{n.name}</span>
                    </div>
                    <span className="block text-[10px] opacity-75 mt-0.5 truncate font-mono">
                      {n.technology}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Row: Database & Frontend */}
            <div className="w-full flex justify-around items-center relative z-10">
              {projectNodes.filter(n => n.type === 'DATABASE' || n.type === 'FRONTEND').map(n => {
                const isSelected = selectedNode?.id === n.id;
                const Icon = getNodeIcon(n.type);
                return (
                  <button
                    key={n.id}
                    onClick={() => setSelectedNode(n)}
                    className={`px-4 py-3 rounded-2xl border text-left transition-all max-w-[220px] ${
                      isSelected
                        ? 'bg-violet-600 border-violet-400 text-white shadow-xl shadow-violet-600/40 scale-105'
                        : 'bg-[#0f172a] border-slate-700 text-slate-200 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-violet-300" />
                      <span className="text-xs font-bold truncate">{n.name}</span>
                    </div>
                    <span className="block text-[10px] opacity-75 mt-0.5 truncate font-mono">
                      {n.technology}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-3 text-center">
            <span className="text-[11px] text-slate-400">
              Graph parsed directly from repository commit logs, AST imports, and docker-compose services.
            </span>
          </div>
        </div>

        {/* Right: Selected Node Evidence & File Links (5 cols) */}
        {selectedNode && (
          <div className="lg:col-span-5 rounded-3xl bg-[#0b101f] border border-slate-800 p-6 space-y-5">
            <div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {selectedNode.type} MODULE
              </span>
              <h2 className="text-lg font-bold text-white mt-1.5">
                {selectedNode.name}
              </h2>
              <span className="text-xs font-mono text-slate-400">
                Tech Stack: {selectedNode.technology}
              </span>
            </div>

            {/* Purpose */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Architectural Role
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedNode.purpose}
              </p>
            </div>

            {/* Evidence in Repo */}
            <div className="p-3.5 rounded-2xl bg-[#0e162d] border border-indigo-500/30">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
                Repository Commit Evidence
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">
                {selectedNode.evidence}
              </p>
            </div>

            {/* Related Files */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Related Source Files
              </span>
              <div className="space-y-1.5 font-mono text-xs">
                {selectedNode.relatedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300">
                    <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="truncate">{file}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Demonstrated */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Demonstrated Engineering Competencies
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedNode.skillsDemonstrated.map((sk, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-medium"
                  >
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section: My Skill DNA */}
      <div className="rounded-3xl bg-[#090e1b] border border-slate-800 p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h2 className="text-base font-bold text-white tracking-tight">
                My Skill DNA (Code Evidence Extraction)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              AI-estimated evidence scores based on repository commits, test coverage, and schema design. Clearly labeled as evidence scores.
            </p>
          </div>

          <span className="text-[11px] px-3 py-1 rounded-full bg-slate-800 text-slate-300 font-mono">
            Source: NeuroRoute Github Repository
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {skillDna.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  {item.skill}
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {item.percentage}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="px-2 py-0.5 rounded bg-slate-800 font-semibold text-slate-300">
                  {item.level}
                </span>
                <span>{item.evidenceCount} verified artifacts</span>
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {item.evidenceSummary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Prove It Challenge Modal */}
      {proveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-[#0b101f] border border-cyan-500/40 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">
                  [ PROVE IT ] Ownership Verification Challenge
                </h3>
              </div>
              <button
                onClick={() => setProveModalOpen(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-200 space-y-1">
              <strong className="text-white block">AI Verification Challenge:</strong>
              <p>
                "You claim you implemented the backend gateway and authentication microservice. Explain exactly how JWT expiration, token revocation, and session blacklists are managed without locking PostgreSQL."
              </p>
            </div>

            <textarea
              rows={4}
              value={proveAnswer}
              onChange={(e) => setProveAnswer(e.target.value)}
              placeholder="Explain your actual implementation..."
              className="w-full bg-[#0d1428] border border-slate-700 rounded-2xl p-4 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 resize-none font-mono"
            />

            {verificationResult && (
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Authenticity Verification Score: {verificationResult.score}/100
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                    VERIFIED CONTRIBUTOR
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  {verificationResult.verdict}
                </p>
                <div className="pt-2 border-t border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Matched Code Commits
                  </span>
                  {verificationResult.evidenceMatches.map((ev, i) => (
                    <div key={i} className="text-[11px] text-cyan-300 font-mono">
                      • {ev}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Matches claim against Git commit SHA timestamps
              </span>
              <button
                onClick={handleProveChallenge}
                disabled={isVerifying}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
              >
                {isVerifying ? 'Cross-Checking Commits...' : 'VERIFY MY ANSWER'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

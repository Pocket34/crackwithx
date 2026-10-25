'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Radar,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  ChevronRight,
  Sparkles,
  Info,
  CheckCircle2,
  TrendingDown,
  Activity,
  Zap,
  Sliders,
  X
} from 'lucide-react';
import { useStudent } from '@/context/StudentContext';
import { RiskRadarItem } from '@/types';

export default function RiskRadarPage() {
  const { student, risks, resolveRisk } = useStudent();
  const [selectedRisk, setSelectedRisk] = useState<RiskRadarItem | null>(risks[0] || null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM'>('ALL');

  const filteredRisks = activeFilter === 'ALL'
    ? risks
    : risks.filter(r => r.severity === activeFilter);

  // SVG Radar coordinates computation for 5 axes
  const categories = [
    { label: 'Attendance', score: student.stats.attendance, angle: -90 },
    { label: 'Academics', score: student.stats.academics, angle: -18 },
    { label: 'Deadlines', score: student.stats.deadlines, angle: 54 },
    { label: 'Projects', score: student.stats.projects, angle: 126 },
    { label: 'Finance', score: student.stats.finance, angle: 198 },
  ];

  const centerX = 160;
  const centerY = 160;
  const maxRadius = 110;

  const getCoordinates = (angleInDegrees: number, score: number) => {
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    const r = (score / 100) * maxRadius;
    const x = centerX + r * Math.cos(angleInRadians);
    const y = centerY + r * Math.sin(angleInRadians);
    return { x, y };
  };

  const polygonPoints = categories
    .map(c => {
      const { x, y } = getCoordinates(c.angle, c.score);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Radar className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Student Risk Radar
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            "What could go wrong?" — Proactive early-warning system mapping academic, attendance, deadline, and financial vulnerabilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            {risks.filter(r => r.severity === 'CRITICAL').length} Critical Risk Active
          </span>
        </div>
      </div>

      {/* Top Visual Radar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Radar SVG (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-[#0b101f] border border-slate-800 p-6 flex flex-col items-center justify-between relative overflow-hidden">
          <div className="w-full flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Health Polygon Scan
            </span>
            <span className="text-xs font-bold text-cyan-400 font-mono">
              Score: {student.overallHealthScore}/100
            </span>
          </div>

          {/* SVG Radar Visualizer */}
          <div className="relative w-80 h-80 flex items-center justify-center my-2">
            <svg className="w-full h-full" viewBox="0 0 320 320">
              {/* Concentric Reference Circles */}
              {[20, 40, 60, 80, 100].map((level) => {
                const r = (level / 100) * maxRadius;
                return (
                  <circle
                    key={level}
                    cx={centerX}
                    cy={centerY}
                    r={r}
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="1"
                    strokeDasharray={level === 100 ? 'none' : '3,3'}
                  />
                );
              })}

              {/* Axis Rays */}
              {categories.map((c, i) => {
                const { x, y } = getCoordinates(c.angle, 100);
                return (
                  <line
                    key={i}
                    x1={centerX}
                    y1={centerY}
                    x2={x}
                    y2={y}
                    stroke="#1e293b"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Dynamic Polygon Area */}
              <polygon
                points={polygonPoints}
                fill="rgba(99, 102, 241, 0.25)"
                stroke="#6366f1"
                strokeWidth="2.5"
                className="transition-all duration-700"
              />

              {/* Category Data Points and Labels */}
              {categories.map((c, i) => {
                const point = getCoordinates(c.angle, c.score);
                const labelPos = getCoordinates(c.angle, 122);
                return (
                  <g key={i}>
                    {/* Circle Node */}
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r="5"
                      fill="#06b6d4"
                      stroke="#06080e"
                      strokeWidth="2"
                    />
                    {/* Label Text */}
                    <text
                      x={labelPos.x}
                      y={labelPos.y + 4}
                      fill="#94a3b8"
                      fontSize="10"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {c.label} ({c.score})
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Sweep radar scanner effect */}
            <div className="absolute inset-0 rounded-full border border-indigo-500/20 pointer-events-none animate-radar-sweep opacity-30 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent" />
          </div>

          <div className="w-full pt-3 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-400">
              Radar scans 5 critical vectors: <strong>Attendance, Academics, Deadlines, Projects & Finance</strong>
            </span>
          </div>
        </div>

        {/* Right: Scores & Risk Explanation (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#0b101f] border border-slate-800 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Vector Analysis & Immediate Alerts
              </span>
              <span className="text-xs text-indigo-400 font-medium">
                Live Analysis
              </span>
            </div>

            {/* Big Insight Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-indigo-950/30 border border-rose-500/30 mb-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Your biggest immediate risk is your pending exam form.
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Without submitting your Sem 5 marksheet and clearing library dues before <strong>Oct 29</strong>, your end-semester admit card will be automatically withheld by the university exam portal.
                  </p>
                  <div className="mt-3">
                    <Link
                      href="/app/action-engine"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-950"
                    >
                      <span>Fix Exam Form Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Vector Progress Bars with Details */}
            <div className="space-y-3">
              {categories.map((c) => (
                <div key={c.label} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-200">{c.label} Vector</span>
                    <span className={`font-mono font-bold ${
                      c.score < 65 ? 'text-rose-400' : c.score < 80 ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {c.score} / 100
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        c.score < 65 ? 'bg-rose-500' : c.score < 80 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Risk Paths Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              Detected Risk Paths & Interventions
            </h2>
            <p className="text-xs text-slate-400">
              Click any risk to view root cause, potential consequences, and one-click remediation.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'] as const).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  activeFilter === f
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Risk Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRisks.map((item) => {
            const isCritical = item.severity === 'CRITICAL';
            const isHigh = item.severity === 'HIGH';
            const isSelected = selectedRisk?.id === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedRisk(item)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#0f172e] border-indigo-500 shadow-xl shadow-indigo-950/40 ring-1 ring-indigo-500/50'
                    : isCritical
                    ? 'bg-[#0e1220] border-rose-500/40 hover:border-rose-500'
                    : 'bg-[#0b101f] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase ${
                          isCritical
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : isHigh
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                        }`}
                      >
                        {item.severity}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white mt-1.5 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-1 rounded bg-slate-900 border border-slate-800 whitespace-nowrap">
                    {item.metricValue}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                  {item.reason}
                </p>

                {/* Consequence Preview */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-300">
                  <strong className="text-rose-400 font-medium">Consequence:</strong> {item.possibleConsequence}
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">
                    Recommended: {item.recommendedAction.slice(0, 40)}...
                  </span>
                  <Link
                    href={item.fixActionRoute}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group"
                  >
                    <span>{item.fixActionLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Expandable Detail Modal / Panel for Selected Risk */}
      {selectedRisk && (
        <div className="p-6 rounded-3xl bg-[#0d1428] border border-indigo-500/30 shadow-2xl space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-bold text-white">
                  Risk Remediation Plan: {selectedRisk.title}
                </h3>
                <span className="text-xs text-slate-400">
                  Category: {selectedRisk.category} • Severity: {selectedRisk.severity}
                </span>
              </div>
            </div>

            <button
              onClick={() => resolveRisk(selectedRisk.id)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Mark Resolved
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                Root Cause & Current Impact
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedRisk.reason}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                Worst-Case Consequence If Inaction Persists
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {selectedRisk.possibleConsequence}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block">
                Prescribed Fix
              </span>
              <p className="text-xs text-white font-medium mt-0.5">
                {selectedRisk.recommendedAction}
              </p>
            </div>

            <Link
              href={selectedRisk.fixActionRoute}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 whitespace-nowrap"
            >
              <span>{selectedRisk.fixActionLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

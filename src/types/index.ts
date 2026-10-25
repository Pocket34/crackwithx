export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TaskStatus = 'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED';

export interface StudentProfile {
  name: string;
  email?: string;
  degree: string;
  semester: number;
  rollNumber: string;
  college: string;
  overallHealthScore: number;
  stats: {
    attendance: number;
    academics: number;
    deadlines: number;
    projects: number;
    finance: number;
  };
}

export interface ActionItem {
  id: string;
  title: string;
  source: string; // e.g. "College Examination Cell Notice", "WhatsApp Batch 2025"
  category: 'EXAM' | 'SCHOLARSHIP' | 'FEE' | 'PROJECT' | 'INTERNSHIP' | 'ADMIN';
  deadline: string; // ISO or readable
  deadlineDate: Date;
  status: TaskStatus;
  priority: Priority;
  appliesToStudent: boolean;
  requiredDocuments: { name: string; checked: boolean }[];
  fees: string;
  riskIfMissed: string;
  summary: string;
  actionSteps: string[];
}

export interface RiskRadarItem {
  id: string;
  title: string;
  category: 'Attendance' | 'Academics' | 'Deadlines' | 'Projects' | 'Finance' | 'Scholarship';
  severity: Priority;
  score: number; // 0 - 100
  metricLabel: string;
  metricValue: string;
  reason: string;
  deadline?: string;
  possibleConsequence: string;
  recommendedAction: string;
  fixActionRoute: string;
  fixActionLabel: string;
}

export interface VivaQuestion {
  id: number;
  round: string; // "ROUND 1 — FUNDAMENTALS", "ROUND 2 — TECHNICAL", etc.
  roundType: 'FUNDAMENTALS' | 'TECHNICAL' | 'ARCHITECTURE' | 'CROSS_EXAM' | 'EDGE_CASES' | 'PROJECT_OWNERSHIP';
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  question: string;
  contextHint?: string;
  expectedKeyPoints: string[];
  sampleStudentAnswer?: string;
  aiFollowUpTrigger?: string;
}

export interface VivaRoundScore {
  roundName: string;
  score: number;
  maxScore: number;
  feedback: string;
}

export interface VivaReport {
  overallScore: number;
  breakdown: {
    technicalUnderstanding: number;
    projectOwnership: number;
    conceptClarity: number;
    architecture: number;
    communication: number;
  };
  roundScores: VivaRoundScore[];
  weakAreas: {
    topic: string;
    reason: string;
    recommendedRevision: string;
  }[];
  examinerVerdict: string;
}

export interface ExamAnswerAnnotation {
  questionNumber: string;
  expectedMarks: number;
  receivedMarks: number;
  breakdown: {
    item: string;
    points: number; // e.g. +4 or -2
    type: 'positive' | 'negative';
  }[];
  annotatedText: string;
  annotations: {
    text: string;
    type: 'correct' | 'missing_step' | 'calculation_error' | 'concept_gap' | 'presentation';
    comment: string;
  }[];
  targetedAdvice: string;
}

export interface MarkLossDna {
  categories: {
    label: string;
    percentage: number;
    color: string;
    count: number;
  }[];
  patternExplanation: string;
  coreStrengths: string[];
  criticalRemedies: string[];
}

export interface ProjectNode {
  id: string;
  name: string;
  type: 'CORE' | 'AI' | 'FRONTEND' | 'BACKEND' | 'DATABASE' | 'INFRA';
  technology: string;
  purpose: string;
  evidence: string;
  relatedFiles: string[];
  skillsDemonstrated: string[];
  dependencies: string[];
  x: number; // for canvas/graph layout
  y: number;
}

export interface SkillDnaItem {
  skill: string;
  percentage: number;
  evidenceCount: number;
  level: 'Foundational' | 'Demonstrated' | 'Advanced' | 'Mastery';
  evidenceSummary: string;
}

export interface OpportunityCheckResult {
  id: string;
  title: string;
  sourceText: string;
  trustScore: number; // 0-100
  riskLevel: 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK' | 'CRITICAL RISK';
  summary: string;
  warningSignals: {
    indicator: string;
    severity: 'HIGH' | 'MEDIUM' | 'LOW';
    detail: string;
  }[];
  positiveSignals: string[];
  safeVerificationSteps: string[];
}

export interface ProblemActionStep {
  id: string;
  phase: 'UNDERSTAND' | 'CHECK' | 'REQUIRED_DOCUMENTS' | 'WHO_TO_CONTACT' | 'WHAT_TO_SAY' | 'APPLICATION_DRAFT' | 'FOLLOW_UP';
  title: string;
  description: string;
  details?: string[];
  templateSnippet?: string;
  contactTarget?: string;
  completed: boolean;
}

export interface ProblemSolutionPath {
  category: string;
  problemTitle: string;
  severity: Priority;
  understanding: string;
  actionPath: ProblemActionStep[];
  generatedDrafts: {
    applicationLetter?: string;
    emailTemplate?: string;
    followUpReminder?: string;
  };
  documentChecklist: string[];
}

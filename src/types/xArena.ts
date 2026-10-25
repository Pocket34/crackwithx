export type StudentMode = 'EXAM' | 'CODING' | 'VIVA' | 'STUDY' | 'RESEARCH';

export type ModelId = 'gpt' | 'gemini' | 'claude' | 'perplexity';

export interface AIModelMeta {
  id: ModelId;
  name: string;
  provider: string;
  tagline: string;
  color: string;
  badgeColor: string;
  isAvailable: boolean; // True if real API key configured, otherwise clearly indicated
  statusLabel: 'Live API' | 'Demo Mode';
}

export interface ModelResponseItem {
  modelId: ModelId;
  modelName: string;
  status: 'pending' | 'success' | 'error' | 'unavailable';
  content: string;
  summary: string;
  keyInsights: string[];
  latencyMs: number;
  tokensCount?: number;
}

export interface ConflictItem {
  topic: string;
  description: string;
  modelStances: {
    modelName: string;
    stance: string;
  }[];
  verificationAdvice: string;
}

export interface XArenaSynthesis {
  finalAnswer: string;
  agreementLevel: 'HIGH' | 'MEDIUM' | 'LOW';
  agreementPercentage: number;
  whyThisAnswer: {
    consensusPoints: string[];
    differencesIdentified: string[];
    missingInfoIdentified: string[];
    recommendedStructure: string;
  };
  conflictDetected?: ConflictItem | null;
  generatedFlashcards?: { question: string; answer: string }[];
  examSummary?: string;
  mcqs?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface XArenaSession {
  id: string;
  prompt: string;
  mode: StudentMode;
  selectedModels: ModelId[];
  attachedFileName?: string;
  responses: ModelResponseItem[];
  synthesis: XArenaSynthesis;
  timestamp: string;
}

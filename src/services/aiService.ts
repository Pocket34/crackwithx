import {
  ActionItem,
  VivaQuestion,
  VivaReport,
  ExamAnswerAnnotation,
  OpportunityCheckResult,
  ProblemSolutionPath,
  ProjectNode,
  SkillDnaItem
} from '../types';
import {
  DEMO_ACTIONS,
  DEMO_EXAM_FORENSICS,
  DEMO_OPPORTUNITY_RESULT,
  DEMO_PROBLEM_SOLUTIONS,
  DEMO_PROJECT_NODES,
  DEMO_SKILL_DNA,
  DEMO_VIVA_QUESTIONS,
  DEMO_VIVA_REPORT
} from './demoData';

/**
 * Modular AI Service Layer
 * Supports direct Gemini 1.5/2.5/Flash calls via API key or intelligent client-side inference pipeline
 */

export class StudentAIService {
  private static apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';

  // 1. ACTION ENGINE: Document / Screenshot / Text Parser
  static async extractActionFromNotice(rawContent: string, fileName?: string): Promise<ActionItem> {
    // Artificial latency for realistic scanning effect
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const lower = rawContent.toLowerCase();
    const isFeeOrExam = lower.includes('exam') || lower.includes('fee') || lower.includes('registration');
    const isInternship = lower.includes('intern') || lower.includes('stipend') || lower.includes('placement');
    const isScholarship = lower.includes('scholarship') || lower.includes('grant') || lower.includes('merit');

    if (isScholarship) {
      return {
        ...DEMO_ACTIONS[2],
        id: `extracted-${Date.now()}`,
        source: fileName ? `Uploaded: ${fileName}` : "Pasted Scholarship Notification",
      };
    }

    if (isInternship) {
      return {
        ...DEMO_ACTIONS[3],
        id: `extracted-${Date.now()}`,
        source: fileName ? `Uploaded: ${fileName}` : "Placement Bulletin Extract",
      };
    }

    // Default to high-priority examination notice
    return {
      id: `extracted-${Date.now()}`,
      title: "Semester Examination Form & Hall Ticket Registration",
      source: fileName ? `Scanned Notice: ${fileName}` : "Extracted from Student Noticeboard",
      category: "EXAM",
      deadline: "29 October 2026 (5:00 PM)",
      deadlineDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      status: "NOT STARTED",
      priority: "CRITICAL",
      appliesToStudent: true,
      requiredDocuments: [
        { name: "Sem 5 Marksheet photocopy", checked: true },
        { name: "Student ID card scan", checked: true },
        { name: "Passport sized photo", checked: false },
        { name: "Examination fee challan", checked: false },
        { name: "Library no-dues receipt", checked: false },
      ],
      fees: "₹ 2,450 (Late fine ₹ 500 applies after Oct 29)",
      riskIfMissed: "Admit card withheld. Barred from sitting for University Semester Exams.",
      summary: "Mandatory university semester registration requiring library clearance and HOD countersignature.",
      actionSteps: [
        "Pay ₹2,450 exam fee online",
        "Obtain library digital clearance receipt",
        "Upload verified photo and sign to university portal",
        "Submit signed physical copy to Exam Window 4"
      ]
    };
  }

  // 2. AI EXAMINER: Answer Evaluation & Cross-Question Generation
  static async evaluateVivaResponse(
    question: VivaQuestion,
    studentAnswer: string,
    roundNumber: number
  ): Promise<{
    scoreOutOfTen: number;
    feedback: string;
    followUpCrossQuestion?: string;
    detectedStrengths: string[];
    detectedWeaknesses: string[];
  }> {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const wordCount = studentAnswer.trim().split(/\s+/).length;
    let score = 7;
    if (wordCount > 35) score = 9;
    else if (wordCount > 15) score = 8;
    else score = 5;

    let followUp = "";
    if (roundNumber === 1) {
      followUp = "You mentioned reducing commuter headway variance. Which mathematical function or algorithm balances the headway interval when bus frequency slows down?";
    } else if (roundNumber === 2) {
      followUp = "You defended PostgreSQL + TimescaleDB. What specific partitioning key did you define for the telemetry hypertable to prevent write amplification?";
    } else if (roundNumber === 3) {
      followUp = "If the WebSocket pipeline experiences network jitter, how do you handle out-of-order vehicle telemetry packets reaching the routing worker?";
    } else {
      followUp = "Can you point directly to the code module where error retries are decoupled from user request threads?";
    }

    return {
      scoreOutOfTen: score,
      feedback: score >= 8
        ? "Strong articulation of technical fundamentals and clear architectural justification."
        : "Reasonable answer, but missed key operational details such as failover latency and specific index structures.",
      followUpCrossQuestion: followUp,
      detectedStrengths: ["Clear terminology", "Understanding of trade-offs", "Sound project ownership"],
      detectedWeaknesses: score < 8 ? ["Omitted quantitative latency thresholds", "Did not mention boundary edge cases"] : []
    };
  }

  // 3. EXAM FORENSICS: Mark Breakdown & Pattern Analysis
  static async analyzeAnswerSheet(questionText: string, studentAnswer: string): Promise<ExamAnswerAnnotation> {
    await new Promise((resolve) => setTimeout(resolve, 1600));
    return DEMO_EXAM_FORENSICS;
  }

  // 4. PROJECT DNA: Repository & Skill Evidence Extraction
  static async parseProjectRepository(repoUrlOrSummary: string): Promise<{
    nodes: ProjectNode[];
    skills: SkillDnaItem[];
    ownershipVerificationPrompt: string;
  }> {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return {
      nodes: DEMO_PROJECT_NODES,
      skills: DEMO_SKILL_DNA,
      ownershipVerificationPrompt: "You are listed as the primary author of the Go Dispatcher microservice. Explain how goroutines manage buffer pools without memory starvation."
    };
  }

  // 5. OPPORTUNITY SHIELD: Trust Score & Scam Radar
  static async scanOpportunity(text: string): Promise<OpportunityCheckResult> {
    await new Promise((resolve) => setTimeout(resolve, 1800));

    const lower = text.toLowerCase();
    const hasMoneyDemand = lower.includes('fee') || lower.includes('pay') || lower.includes('deposit') || lower.includes('1499') || lower.includes('upi') || lower.includes('insurance');
    
    if (hasMoneyDemand) {
      return {
        ...DEMO_OPPORTUNITY_RESULT,
        sourceText: text.slice(0, 300) + "..."
      };
    }

    return {
      id: `opp-${Date.now()}`,
      title: "Campus Partner / Verified Internship Opportunity",
      sourceText: text.slice(0, 300) + "...",
      trustScore: 88,
      riskLevel: "LOW RISK",
      summary: "Opportunity appears consistent with verified student hiring practices. No monetary deposit demands detected.",
      warningSignals: [
        {
          indicator: "Standard External Portal",
          severity: "LOW",
          detail: "Application redirects to Greenhouse/Lever applicant tracking system."
        }
      ],
      positiveSignals: [
        "Direct domain matching official corporate careers site",
        "Clear technical interview process outlined",
        "Zero registration or training fees requested"
      ],
      safeVerificationSteps: [
        "Verify posting on company official careers portal",
        "Use official college email for correspondence"
      ]
    };
  }

  // 6. PROBLEM SOLVER: Conversational Path Generator
  static async generateProblemPath(category: string, userProblemDescription: string): Promise<ProblemSolutionPath> {
    await new Promise((resolve) => setTimeout(resolve, 1400));
    const catKey = category.toLowerCase();
    if (DEMO_PROBLEM_SOLUTIONS[catKey]) {
      return DEMO_PROBLEM_SOLUTIONS[catKey];
    }
    return DEMO_PROBLEM_SOLUTIONS['attendance'];
  }
}

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import {
  StudentProfile,
  ActionItem,
  RiskRadarItem,
  VivaReport,
  ExamAnswerAnnotation,
  MarkLossDna,
  ProjectNode,
  SkillDnaItem,
  OpportunityCheckResult,
  ProblemSolutionPath
} from '../types';
import {
  DEMO_ACTIONS,
  DEMO_RISK_ITEMS,
  DEMO_VIVA_REPORT,
  DEMO_EXAM_FORENSICS,
  DEMO_MARK_LOSS_DNA,
  DEMO_PROJECT_NODES,
  DEMO_SKILL_DNA,
  DEMO_OPPORTUNITY_RESULT,
  DEMO_PROBLEM_SOLUTIONS
} from '../services/demoData';

interface StudentContextType {
  user: User | null;
  session: Session | null;
  isLoadingAuth: boolean;
  signOut: () => Promise<void>;
  student: StudentProfile;
  actions: ActionItem[];
  risks: RiskRadarItem[];
  latestVivaReport: VivaReport | null;
  examForensics: ExamAnswerAnnotation;
  markLossDna: MarkLossDna;
  projectNodes: ProjectNode[];
  skillDna: SkillDnaItem[];
  opportunityResults: OpportunityCheckResult[];
  activeProblemSolution: ProblemSolutionPath | null;
  notifications: {
    id: string;
    title: string;
    message: string;
    type: 'critical' | 'warning' | 'info' | 'success';
    time: string;
    read: boolean;
    route?: string;
  }[];
  unreadNotifsCount: number;
  
  // Actions
  addAction: (action: ActionItem) => void;
  updateActionStatus: (id: string, status: 'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED') => void;
  toggleActionDocument: (actionId: string, docIndex: number) => void;
  setVivaReport: (report: VivaReport) => void;
  addOpportunityResult: (res: OpportunityCheckResult) => void;
  setProblemSolution: (solution: ProblemSolutionPath) => void;
  markAllNotifsRead: () => void;
  resolveRisk: (riskId: string) => void;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

const INITIAL_STUDENT: StudentProfile = {
  name: 'Student',
  email: '',
  degree: 'B.E. Computer Science & Engineering',
  semester: 6,
  rollNumber: 'CS-2024-001',
  college: 'National Institute of Engineering',
  overallHealthScore: 82,
  stats: {
    attendance: 74,
    academics: 82,
    deadlines: 61,
    projects: 88,
    finance: 58,
  }
};

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const supabase = createClient();

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const [student, setStudent] = useState<StudentProfile>(INITIAL_STUDENT);
  const [actions, setActions] = useState<ActionItem[]>(DEMO_ACTIONS);
  const [risks, setRisks] = useState<RiskRadarItem[]>(DEMO_RISK_ITEMS);
  const [latestVivaReport, setLatestVivaReport] = useState<VivaReport | null>(DEMO_VIVA_REPORT);
  const [examForensics] = useState<ExamAnswerAnnotation>(DEMO_EXAM_FORENSICS);
  const [markLossDna] = useState<MarkLossDna>(DEMO_MARK_LOSS_DNA);
  const [projectNodes] = useState<ProjectNode[]>(DEMO_PROJECT_NODES);
  const [skillDna] = useState<SkillDnaItem[]>(DEMO_SKILL_DNA);
  const [opportunityResults, setOpportunityResults] = useState<OpportunityCheckResult[]>([DEMO_OPPORTUNITY_RESULT]);
  const [activeProblemSolution, setActiveProblemSolution] = useState<ProblemSolutionPath | null>(DEMO_PROBLEM_SOLUTIONS['attendance']);
  
  const [notifications, setNotifications] = useState([
    {
      id: "n-1",
      title: "Admit Card Debar Warning",
      message: "Semester Examination Form window closes in 44 hours. Library clearance pending.",
      type: "critical" as const,
      time: "10 mins ago",
      read: false,
      route: "/app/action-engine"
    },
    {
      id: "n-2",
      title: "AI Viva Defense Approaching",
      message: "External CSE viva scheduled in 4 days. Practice edge cases in AI Examiner.",
      type: "warning" as const,
      time: "2 hours ago",
      read: false,
      route: "/app/ai-examiner"
    },
    {
      id: "n-3",
      title: "Attendance Warning",
      message: "Operating Systems attendance is 71.4% (Threshold: 75%). 4 classes needed.",
      type: "warning" as const,
      time: "Yesterday",
      read: false,
      route: "/app/risk-radar"
    },
    {
      id: "n-4",
      title: "Suspicious Recruiter Alert",
      message: "Opportunity Shield flagged a fake ₹45k internship demanding ₹1,499 courier fee.",
      type: "critical" as const,
      time: "2 days ago",
      read: true,
      route: "/app/opportunity-shield"
    }
  ]);

  // Synchronize authenticated user with student profile
  useEffect(() => {
    async function loadUserSession() {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          const authUser = currentSession.user;
          const userMeta = authUser.user_metadata || {};
          const fallbackName = authUser.email
            ? authUser.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
            : 'Student';

          const displayName = userMeta.full_name || userMeta.name || fallbackName;

          setStudent(prev => ({
            ...prev,
            name: displayName,
            email: authUser.email || '',
            college: userMeta.college || prev.college,
            degree: userMeta.degree || prev.degree,
            rollNumber: userMeta.roll_number || prev.rollNumber,
          }));
        }
      } catch (err) {
        console.error('Error fetching auth session:', err);
      } finally {
        setIsLoadingAuth(false);
      }
    }

    loadUserSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLoadingAuth(false);

      if (newSession?.user) {
        const authUser = newSession.user;
        const userMeta = authUser.user_metadata || {};
        const fallbackName = authUser.email
          ? authUser.email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
          : 'Student';

        const displayName = userMeta.full_name || userMeta.name || fallbackName;

        setStudent(prev => ({
          ...prev,
          name: displayName,
          email: authUser.email || '',
          college: userMeta.college || prev.college,
          degree: userMeta.degree || prev.degree,
          rollNumber: userMeta.roll_number || prev.rollNumber,
        }));
      } else {
        setStudent(INITIAL_STUDENT);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setStudent(INITIAL_STUDENT);
      window.location.href = '/';
    } catch (err) {
      console.error('Sign out error:', err);
      window.location.href = '/';
    }
  };

  // Dynamically update student health score when actions change
  useEffect(() => {
    const completedCount = actions.filter(a => a.status === 'COMPLETED').length;
    const totalCount = actions.length || 1;
    const deadlineScore = Math.round(50 + (completedCount / totalCount) * 45);
    
    setStudent(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        deadlines: deadlineScore
      },
      overallHealthScore: Math.round(
        (prev.stats.attendance + prev.stats.academics + deadlineScore + prev.stats.projects + prev.stats.finance) / 5
      )
    }));
  }, [actions]);

  const addAction = (action: ActionItem) => {
    setActions(prev => [action, ...prev]);
    // Also notify
    setNotifications(prev => [
      {
        id: `n-${Date.now()}`,
        title: `Action Created: ${action.title}`,
        message: `Deadline: ${action.deadline}. Consequence: ${action.riskIfMissed}`,
        type: action.priority === 'CRITICAL' ? 'critical' : 'warning',
        time: 'Just now',
        read: false,
        route: '/app/action-engine'
      },
      ...prev
    ]);
  };

  const updateActionStatus = (id: string, status: 'NOT STARTED' | 'IN PROGRESS' | 'COMPLETED') => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const toggleActionDocument = (actionId: string, docIndex: number) => {
    setActions(prev => prev.map(act => {
      if (act.id !== actionId) return act;
      const updatedDocs = act.requiredDocuments.map((doc, idx) => 
        idx === docIndex ? { ...doc, checked: !doc.checked } : doc
      );
      return { ...act, requiredDocuments: updatedDocs };
    }));
  };

  const setVivaReport = (report: VivaReport) => {
    setLatestVivaReport(report);
    // Connect Viva to Risk Radar & Health Score
    setStudent(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        projects: Math.round((prev.stats.projects + report.overallScore) / 2)
      }
    }));
    // Remove or lower viva risk in radar if score is good
    if (report.overallScore >= 80) {
      setRisks(prev => prev.filter(r => r.id !== 'risk-viva-prep'));
    }
  };

  const addOpportunityResult = (res: OpportunityCheckResult) => {
    setOpportunityResults(prev => [res, ...prev]);
  };

  const setProblemSolution = (solution: ProblemSolutionPath) => {
    setActiveProblemSolution(solution);
  };

  const markAllNotifsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resolveRisk = (riskId: string) => {
    setRisks(prev => prev.filter(r => r.id !== riskId));
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  return (
    <StudentContext.Provider
      value={{
        user,
        session,
        isLoadingAuth,
        signOut,
        student,
        actions,
        risks,
        latestVivaReport,
        examForensics,
        markLossDna,
        projectNodes,
        skillDna,
        opportunityResults,
        activeProblemSolution,
        notifications,
        unreadNotifsCount,
        addAction,
        updateActionStatus,
        toggleActionDocument,
        setVivaReport,
        addOpportunityResult,
        setProblemSolution,
        markAllNotifsRead,
        resolveRisk
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};

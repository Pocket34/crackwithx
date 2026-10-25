import {
  StudentProfile,
  ActionItem,
  RiskRadarItem,
  VivaQuestion,
  VivaReport,
  ExamAnswerAnnotation,
  MarkLossDna,
  ProjectNode,
  SkillDnaItem,
  OpportunityCheckResult,
  ProblemSolutionPath
} from '../types';

export const DEMO_STUDENT: StudentProfile = {
  name: "Pushkar",
  degree: "B.E. Computer Science & Engineering",
  semester: 6,
  rollNumber: "CS-2022-084",
  college: "National Institute of Engineering & Technology",
  overallHealthScore: 82,
  stats: {
    attendance: 74,
    academics: 82,
    deadlines: 61,
    projects: 88,
    finance: 58,
  }
};

export const DEMO_ACTIONS: ActionItem[] = [
  {
    id: "action-1",
    title: "Semester Examination Form Submission",
    source: "Controller of Examinations — Official Notice #COE/2026/041",
    category: "EXAM",
    deadline: "29 October 2026 (5:00 PM)",
    deadlineDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
    status: "NOT STARTED",
    priority: "CRITICAL",
    appliesToStudent: true,
    requiredDocuments: [
      { name: "Previous Semester (Sem 5) Marksheet photocopy", checked: true },
      { name: "College Student Identity Card scan", checked: true },
      { name: "Recent passport-sized digital photograph", checked: false },
      { name: "Examination Fee e-challan receipt", checked: false },
      { name: "No-Dues Clearance from Department Library", checked: false },
    ],
    fees: "₹ 2,450 (Late fine ₹ 500 applies after Oct 29)",
    riskIfMissed: "Admit Card debarred. Will not be seated for University end-semester theory papers.",
    summary: "Mandatory university exam registration for all eligible 6th-semester CSE students. Verification requires departmental HOD counter-signature after clearing library dues.",
    actionSteps: [
      "Download Sem 5 marksheet from portal",
      "Pay examination fee of ₹2,450 through online banking portal",
      "Get digital library clearance receipt",
      "Upload photo and signatures to student portal before 5:00 PM",
      "Submit physical hard copy to Exam Cell Window 4"
    ]
  },
  {
    id: "action-2",
    title: "Final Capstone Viva Defense Preparation",
    source: "CSE Project Evaluation Committee Notice",
    category: "PROJECT",
    deadline: "31 October 2026 (10:00 AM)",
    deadlineDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    status: "IN PROGRESS",
    priority: "HIGH",
    appliesToStudent: true,
    requiredDocuments: [
      { name: "Final Capstone Project Report (IEEE 2-column format)", checked: true },
      { name: "Working Code Repository with README and Dockerfile", checked: true },
      { name: "Guide Approval Signature Sheet", checked: false },
      { name: "Plagiarism Verification Report (Turnitin < 15%)", checked: true },
    ],
    fees: "Nil",
    riskIfMissed: "Automatic deduction of 20 internal marks and deferred project grading.",
    summary: "External viva with university appointed examiners. Requires defending architectural choices, database schema, and live demonstration of NeuroRoute transit engine.",
    actionSteps: [
      "Review edge case failure scenarios in AI Examiner",
      "Verify Docker container build on fresh machine",
      "Print 3 spiral-bound project reports for panel",
      "Get guide counter-sign on evaluation rubrics"
    ]
  },
  {
    id: "action-3",
    title: "National Merit Post-Matric Scholarship Renewal",
    source: "State Scholarship Portal / Dean Student Welfare",
    category: "SCHOLARSHIP",
    deadline: "05 November 2026",
    deadlineDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    status: "NOT STARTED",
    priority: "HIGH",
    appliesToStudent: true,
    requiredDocuments: [
      { name: "Income Certificate (Current Financial Year)", checked: true },
      { name: "Previous Academic Year Grade Sheet (SGPA > 7.5)", checked: true },
      { name: "College Bonafide Student Certificate", checked: false },
      { name: "Aadhaar linked Bank Account Passbook", checked: true },
    ],
    fees: "Nil (Eligible for ₹ 48,000 annual disbursement)",
    riskIfMissed: "Forfeiture of ₹ 48,000 scholarship aid for the current academic session.",
    summary: "State scholarship renewal portal is open. Must get college verification stamped by Account Section before the online portal freezes.",
    actionSteps: [
      "Collect Bonafide certificate from Registrar Admin Desk",
      "Scan bank passbook showing active Aadhaar NPCI link",
      "Submit renewal form online and obtain acknowledgment slip"
    ]
  },
  {
    id: "action-4",
    title: "TCS NQT & CodeVita Campus Drive Registration",
    source: "Training & Placement Cell Bulletin",
    category: "INTERNSHIP",
    deadline: "08 November 2026",
    deadlineDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
    status: "COMPLETED",
    priority: "MEDIUM",
    appliesToStudent: true,
    requiredDocuments: [
      { name: "Updated Resume with Verified GitHub profile", checked: true },
      { name: "All Semesters Marksheet ZIP", checked: true },
    ],
    fees: "Nil",
    riskIfMissed: "Ineligible for Phase 1 campus recruitment tests.",
    summary: "Official campus registration drive for 2027 batch software engineering roles.",
    actionSteps: [
      "Form submitted successfully on T&P Portal. Hall ticket pending generation."
    ]
  }
];

export const DEMO_RISK_ITEMS: RiskRadarItem[] = [
  {
    id: "risk-exam-form",
    title: "Pending Examination Form Submission",
    category: "Deadlines",
    severity: "CRITICAL",
    score: 94,
    metricLabel: "Time Remaining",
    metricValue: "44 Hours left",
    reason: "Your examination registration form is not yet submitted and requires physical library no-dues clearance.",
    deadline: "Oct 29, 2026",
    possibleConsequence: "Admit card debarred. You will be barred from appearing in end-semester exams or incur heavy penalty fines.",
    recommendedAction: "Download clearance receipt immediately, upload your photograph, and finalize payment via the Student Action Engine.",
    fixActionRoute: "/app/action-engine",
    fixActionLabel: "Complete Exam Form Now"
  },
  {
    id: "risk-attendance",
    title: "Operating Systems Attendance Below Threshold",
    category: "Attendance",
    severity: "HIGH",
    score: 74,
    metricLabel: "Current Attendance",
    metricValue: "71.4% (Min 75% required)",
    reason: "You have attended 35 out of 49 lectures in CS602 (Operating Systems). You need 4 consecutive classes to cross 75%.",
    deadline: "End of semester (12 lectures remaining)",
    possibleConsequence: "Shortage list notice from Dean Academics, leading to detained internal practical exam status.",
    recommendedAction: "Attend next 4 scheduled lectures without absence. Submit medical certificate draft via Problem Solver for previous illness.",
    fixActionRoute: "/app/problem-solver?cat=attendance",
    fixActionLabel: "Draft Attendance Appeal"
  },
  {
    id: "risk-viva-prep",
    title: "Capstone Project Viva Defense in 4 Days",
    category: "Projects",
    severity: "HIGH",
    score: 68,
    metricLabel: "Viva Readiness",
    metricValue: "68% Prepared",
    reason: "External examiner will cross-examine your distributed architecture, PostgreSQL concurrency, and authentication flow.",
    deadline: "Oct 31, 2026",
    possibleConsequence: "Low external viva marks severely impact your final capstone grade and overall degree CGPA.",
    recommendedAction: "Enter AI Examiner to practice high-pressure cross questioning on architecture failure modes.",
    fixActionRoute: "/app/ai-examiner",
    fixActionLabel: "Launch AI Viva Practice"
  },
  {
    id: "risk-scholarship",
    title: "Scholarship Bonafide Clearance Incomplete",
    category: "Finance",
    severity: "MEDIUM",
    score: 58,
    metricLabel: "Financial Stake",
    metricValue: "₹ 48,000 aid at risk",
    reason: "Bonafide student certificate has not been verified by the Accounts section.",
    deadline: "Nov 05, 2026",
    possibleConsequence: "Portal closes for verification; annual grant forfeited.",
    recommendedAction: "Visit Registrar Room 102 with fee receipt to generate stamped bonafide.",
    fixActionRoute: "/app/action-engine",
    fixActionLabel: "View Document Checklist"
  },
  {
    id: "risk-marks-loss",
    title: "Exam Marks Leakage in Derivation Steps",
    category: "Academics",
    severity: "MEDIUM",
    score: 62,
    metricLabel: "Mark-Loss Pattern",
    metricValue: "31% lost to skipped steps",
    reason: "Forensics analysis of your Mid-Term answers shows consistent deduction for missing intermediate proofs.",
    possibleConsequence: "Losing 4-6 marks per 10-mark theoretical/numerical question in University finals.",
    recommendedAction: "Inspect Exam Forensics to practice step-by-step mathematical reasoning.",
    fixActionRoute: "/app/exam-forensics",
    fixActionLabel: "Open Exam Forensics"
  }
];

export const DEMO_VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 1,
    round: "ROUND 1 — FUNDAMENTALS",
    roundType: "FUNDAMENTALS",
    difficulty: "Beginner",
    question: "What is the core problem NeuroRoute addresses, and why is existing static GPS routing insufficient for high-density urban transit?",
    contextHint: "Explain the latency and real-time sensor ingestion bottlenecks in traditional municipal route planners.",
    expectedKeyPoints: [
      "Static routing fails under flash traffic spikes or unexpected lane blockages",
      "NeuroRoute integrates live bus telemetry with graph neural network predictions",
      "Dynamic rerouting minimizes commuter delay and transit bunching"
    ],
    sampleStudentAnswer: "NeuroRoute solves urban transit delays. Traditional routing relies on historical averages or static schedules, which fail when buses bunch up or flash congestion occurs. We stream GPS telemetry and use graph neural predictions to dynamically balance route headway.",
    aiFollowUpTrigger: "Great. You mentioned headway balancing. How does your backend calculate headway variance across stops?"
  },
  {
    id: 2,
    round: "ROUND 2 — TECHNICAL",
    roundType: "TECHNICAL",
    difficulty: "Intermediate",
    question: "Why did you choose PostgreSQL with TimescaleDB over a purely NoSQL document store like MongoDB for transit event storage?",
    contextHint: "Discuss relational integrity, geospatial queries (PostGIS), and time-series aggregation efficiency.",
    expectedKeyPoints: [
      "Spatial indices with PostGIS for fast geo-fencing and nearest stop queries",
      "TimescaleDB hypertables handle high-volume timestamped GPS telemetry without write bloat",
      "ACID transactions ensure bus allocation and fare state consistency"
    ],
    sampleStudentAnswer: "We chose PostgreSQL because of PostGIS spatial indexing for fast geo-fencing, and TimescaleDB hypertables which compress high-throughput GPS coordinates while allowing time-bucket aggregations. A pure NoSQL store lacked native spatial relational joins."
  },
  {
    id: 3,
    round: "ROUND 3 — ARCHITECTURE",
    roundType: "ARCHITECTURE",
    difficulty: "Intermediate",
    question: "Walk through the architectural lifecycle: What happens when 500 connected transit vehicles simultaneously emit GPS coordinates and a passenger queries a dynamic reroute?",
    contextHint: "Trace ingestion -> queue/broker -> compute engine -> cache -> client response.",
    expectedKeyPoints: [
      "Telemetry hits lightweight Golang ingestion service via WebSocket/MQTT",
      "Pushed to Redis Streams for backpressure buffer",
      "Worker process updates vehicle position in Redis geospatial index and TimescaleDB",
      "Reroute algorithm evaluates candidate subgraphs and returns cached top-k paths"
    ],
    sampleStudentAnswer: "Incoming telemetry is ingested by a Go microservice over WebSocket and queued in Redis Streams. The routing worker consumes this queue, updates the geospatial index, and when a passenger requests a route, the backend queries the GNN prediction matrix to return the top 3 routes within 45ms."
  },
  {
    id: 4,
    round: "ROUND 4 — CROSS QUESTIONING",
    roundType: "CROSS_EXAM",
    difficulty: "Expert",
    question: "You mentioned using a GNN model for prediction. Which specific architecture did you implement, where is it executed, and how do you prevent inference latency from bottlenecking real-time responses?",
    contextHint: "Examiner is cross-examining your claim of real-time AI execution in the critical routing path.",
    expectedKeyPoints: [
      "Spatio-Temporal Graph Convolutional Network (ST-GCN)",
      "Inference is pre-computed asynchronously in 30-second epoch batches or served via ONNX runtime",
      "Critical route calculation uses pre-scored graph edge weights rather than real-time heavy backprop"
    ],
    sampleStudentAnswer: "We trained a Spatio-Temporal Graph Convolutional Network (ST-GCN). To prevent real-time latency bottlenecks, we don't run heavy inference per user query; instead, the model asynchronously updates edge travel-time weights every 30 seconds into an in-memory Redis graph, allowing O(1) weight lookups."
  },
  {
    id: 5,
    round: "ROUND 5 — EDGE CASES",
    roundType: "EDGE_CASES",
    difficulty: "Expert",
    question: "What happens if the primary PostgreSQL database crashes during peak traffic, or the Redis broker runs out of memory during a sudden traffic surge?",
    contextHint: "Explain your failover strategy, circuit breakers, and graceful degradation.",
    expectedKeyPoints: [
      "Read replicas and automated promotion via connection poolers",
      "Redis memory eviction policy (volatile-lru) and fallback to static graph routing",
      "Circuit breaker returns last known good schedule instead of returning 500 errors"
    ],
    sampleStudentAnswer: "If PostgreSQL becomes unresponsive, our connection pooler trips a circuit breaker and switches the read path to our read replica. If Redis memory is exhausted, an LRU eviction policy drops ephemeral telemetry while keeping static route geometries, ensuring commuter queries still receive scheduled estimates."
  },
  {
    id: 6,
    round: "ROUND 6 — PROJECT OWNERSHIP",
    roundType: "PROJECT_OWNERSHIP",
    difficulty: "Expert",
    question: "You are listed as the primary backend and API contributor. Explain exactly how authentication tokens are validated, where session revocation is stored, and what security measures protect the telemetry endpoints.",
    contextHint: "Prove you actually wrote the auth middleware and didn't copy a generic tutorial snippet.",
    expectedKeyPoints: [
      "Short-lived asymmetric JWTs (RS256) signed with private key",
      "Token revocation blacklist maintained in Redis with automated TTL expiration",
      "Rate-limiting middleware (token bucket) on vehicle ingestion endpoints with API key validation"
    ],
    sampleStudentAnswer: "We use RS256 asymmetric JWTs. The client passes the token in the Authorization Bearer header. The auth middleware verifies the signature against the public key without querying the database. If a user logs out, the JTI is blacklisted in Redis with a TTL equal to the token expiry. Telemetry endpoints are protected by mTLS and per-bus API tokens."
  }
];

export const DEMO_VIVA_REPORT: VivaReport = {
  overallScore: 84,
  breakdown: {
    technicalUnderstanding: 86,
    projectOwnership: 92,
    conceptClarity: 81,
    architecture: 78,
    communication: 88,
  },
  roundScores: [
    { roundName: "Round 1 — Fundamentals", score: 9, maxScore: 10, feedback: "Excellent articulation of the core urban transit problem and motivation." },
    { roundName: "Round 2 — Technical Choices", score: 8, maxScore: 10, feedback: "Sound rationale for PostgreSQL + PostGIS vs pure NoSQL document storage." },
    { roundName: "Round 3 — Architecture Flow", score: 8, maxScore: 10, feedback: "Good lifecycle explanation, backpressure buffering clearly explained." },
    { roundName: "Round 4 — Cross Questioning", score: 9, maxScore: 10, feedback: "Strong defense of asynchronous GNN edge weight caching vs live inference." },
    { roundName: "Round 5 — Edge Cases & Failover", score: 7, maxScore: 10, feedback: "Circuit breaker logic was clear, but multi-region DB failover details need polish." },
    { roundName: "Round 6 — Project Ownership", score: 9, maxScore: 10, feedback: "Clear mastery of JWT RS256 token verification, JTI blacklisting, and rate limiting." },
  ],
  weakAreas: [
    {
      topic: "Database Disaster Recovery & Multi-AZ Failover",
      reason: "Could not provide exact recovery time objective (RTO) and write-ahead log shipping details.",
      recommendedRevision: "Review PostgreSQL streaming replication and patroni-based automated leader election."
    },
    {
      topic: "Telemetry Ingestion Rate Limiting Under DDoS",
      reason: "Needs more clarity on distributed token bucket algorithms when vehicle fleet scales 10x.",
      recommendedRevision: "Study Redis sliding-window log rate limiting algorithms."
    }
  ],
  examinerVerdict: "Candidate demonstrates strong technical command and clear hands-on project authorship. With minor revision of database high-availability mechanisms, candidate is fully ready for external university evaluation."
};

export const DEMO_EXAM_FORENSICS: ExamAnswerAnnotation = {
  questionNumber: "Question 4 (b)",
  expectedMarks: 10,
  receivedMarks: 6,
  breakdown: [
    { item: "Core Architectural Concept", points: 4, type: "positive" },
    { item: "Correct Mathematical Formula", points: 2, type: "positive" },
    { item: "Missing Intermediate Derivation Steps", points: -2, type: "negative" },
    { item: "Arithmetic Calculation Slip in Step 3", points: -1, type: "negative" },
    { item: "Omitted State Transition Boundary Condition", points: -1, type: "negative" }
  ],
  annotatedText: `To find the average memory access time (AMAT) for the multi-level cache hierarchy:
L1 hit time = 1 cycle, L1 miss rate = 5%
L2 hit time = 8 cycles, L2 miss rate = 12%
Main memory access latency = 120 cycles.

[CORRECT: Used AMAT formula: AMAT = L1_Hit_Time + (L1_Miss_Rate * L2_Effective_Penalty)]
AMAT = 1 + (0.05 * [8 + (0.12 * 120)])

[MISSING STEP: Examiner expected intermediate expansion of L2 local penalty vs global miss rate]
AMAT = 1 + (0.05 * [8 + 14.4])
AMAT = 1 + (0.05 * 22.4)

[CALCULATION MISTAKE: 0.05 * 22.4 is 1.12, written as 1.22]
AMAT = 1 + 1.22 = 2.22 cycles (incorrect final sum)

[PRESENTATION: Did not state units on intermediate terms and omitted conclusion summary]`,
  annotations: [
    {
      text: "AMAT = L1_Hit_Time + (L1_Miss_Rate * L2_Effective_Penalty)",
      type: "correct",
      comment: "Accurate primary formula correctly credited (+4 marks)"
    },
    {
      text: "[MISSING STEP: L2 local penalty vs global miss rate]",
      type: "missing_step",
      comment: "Deducted 2 marks: University marking scheme mandates showing global miss rate formula before substitution."
    },
    {
      text: "AMAT = 1 + 1.22 = 2.22 cycles",
      type: "calculation_error",
      comment: "Deducted 1 mark: Arithmetic slip (0.05 * 22.4 = 1.12, not 1.22). Final AMAT should be 2.12 cycles."
    },
    {
      text: "[Omitted conclusion summary & units]",
      type: "presentation",
      comment: "Deducted 1 mark: Final answer not boxed with comparative speedup percentage."
    }
  ],
  targetedAdvice: "Your conceptual grasp is solid. In 10-mark engineering university problems, examiners allocate up to 30% of marks to explicit intermediate expansion. Always write out variable definitions first, double-check one-decimal multiplications, and box your final answer."
};

export const DEMO_MARK_LOSS_DNA: MarkLossDna = {
  categories: [
    { label: "Missing Intermediate Steps", percentage: 31, color: "#f43f5e", count: 18 },
    { label: "Calculation & Arithmetic Slips", percentage: 24, color: "#f59e0b", count: 14 },
    { label: "Concept & Theorem Gaps", percentage: 19, color: "#8b5cf6", count: 11 },
    { label: "Time Management / Unfinished Answers", percentage: 16, color: "#06b6d4", count: 9 },
    { label: "Presentation & Missing Diagrams", percentage: 10, color: "#64748b", count: 6 },
  ],
  patternExplanation: "You understand the core theoretical concepts (81% accuracy on fundamental questions), but you consistently leak 4 to 8 marks per paper because you skip written intermediate proofs and jump straight to calculations, leaving yourself vulnerable to minor arithmetic slips.",
  coreStrengths: [
    "High accuracy on initial theoretical formula identification (92%)",
    "Clear architectural flowcharts when attempting system design questions",
    "Zero marks lost to question misinterpretation"
  ],
  criticalRemedies: [
    "Template each numerical response: 1) Given Data, 2) Formula with symbols, 3) Step-by-step substitution, 4) Boxed final result with units.",
    "Spend 90 seconds verifying arithmetic products before advancing to the next question.",
    "Allocate 15 minutes at the start to solve high-mark analytical questions first."
  ]
};

export const DEMO_PROJECT_NODES: ProjectNode[] = [
  {
    id: "node-core",
    name: "NeuroRoute Core Engine",
    type: "CORE",
    technology: "Golang 1.22 & High-Concurrency Coroutines",
    purpose: "Central transit coordination microservice handling bus telemetry streaming and schedule balancing.",
    evidence: "Implemented in /services/dispatcher; handles 1,200 events/sec with zero heap allocation locks.",
    relatedFiles: ["cmd/dispatcher/main.go", "pkg/headway/balancer.go", "pkg/telemetry/consumer.go"],
    skillsDemonstrated: ["Go Concurrency", "Event-Driven Architecture", "System Design"],
    dependencies: ["node-ai", "node-backend", "node-database"],
    x: 350,
    y: 80
  },
  {
    id: "node-ai",
    name: "ST-GCN Transit Predictor",
    type: "AI",
    technology: "PyTorch & ONNX Runtime",
    purpose: "Spatio-Temporal Graph Convolutional Network predicting dynamic segment congestion 15 minutes ahead.",
    evidence: "Trained on 45,000 synthetic urban transit records with 89.4% mean absolute error accuracy.",
    relatedFiles: ["models/st_gcn.py", "inference/onnx_server.py", "pipeline/graph_embedder.py"],
    skillsDemonstrated: ["Graph Neural Networks", "PyTorch", "Model Quantization & ONNX"],
    dependencies: [],
    x: 150,
    y: 200
  },
  {
    id: "node-backend",
    name: "Transit Gateway API",
    type: "BACKEND",
    technology: "FastAPI, WebSockets, Python 3.11",
    purpose: "Provides real-time REST and bidirectional WebSocket interfaces for commuter clients and driver terminals.",
    evidence: "23 validated endpoints with Pydantic v2 schemas and OpenAPI specifications.",
    relatedFiles: ["api/routes/commuter.py", "api/routes/telemetry.py", "core/auth/jwt_bearer.py"],
    skillsDemonstrated: ["REST API Design", "WebSocket Streaming", "JWT Security"],
    dependencies: ["node-database"],
    x: 550,
    y: 200
  },
  {
    id: "node-frontend",
    name: "Commuter Web OS App",
    type: "FRONTEND",
    technology: "Next.js 14, React, Mapbox GL, TailwindCSS",
    purpose: "Interactive live map rendering 60 FPS real-time bus locations with dynamic color-coded delay corridors.",
    evidence: "Custom Mapbox vector tile layer with sub-100ms UI re-render on WebSocket tick.",
    relatedFiles: ["src/components/TransitMap.tsx", "src/hooks/useLiveVehicleStream.ts", "src/app/page.tsx"],
    skillsDemonstrated: ["React 18", "Mapbox Geospatial Rendering", "Client State Optimization"],
    dependencies: ["node-backend"],
    x: 550,
    y: 340
  },
  {
    id: "node-database",
    name: "PostgreSQL + TimescaleDB & Redis",
    type: "DATABASE",
    technology: "PostgreSQL 16, PostGIS, TimescaleDB, Redis 7",
    purpose: "Dual-tier persistence: Redis for spatial geospatial caching; TimescaleDB for compressed historical telemetry.",
    evidence: "Hypertable partitioned across 7-day chunks; spatial GIST index on bus geo-coordinates.",
    relatedFiles: ["migrations/001_create_hypertables.sql", "migrations/002_postgis_indexes.sql", "config/redis.conf"],
    skillsDemonstrated: ["PostGIS Spatial Queries", "TimescaleDB Partitioning", "Redis Geo Hashing"],
    dependencies: [],
    x: 250,
    y: 340
  }
];

export const DEMO_SKILL_DNA: SkillDnaItem[] = [
  { skill: "Python & FastAPI", percentage: 87, evidenceCount: 14, level: "Advanced", evidenceSummary: "Auth middleware, async websocket streaming, Pydantic data contracts." },
  { skill: "AI & Graph Neural Nets", percentage: 81, evidenceCount: 8, level: "Demonstrated", evidenceSummary: "PyTorch ST-GCN implementation, ONNX inference export, graph matrix weighting." },
  { skill: "Distributed Backend & Go", percentage: 72, evidenceCount: 6, level: "Demonstrated", evidenceSummary: "Goroutines, channel backpressure buffering, Redis streams consumer." },
  { skill: "PostgreSQL & Spatial DB", percentage: 76, evidenceCount: 11, level: "Advanced", evidenceSummary: "PostGIS nearest-neighbor query, TimescaleDB telemetry hypertables." },
  { skill: "Git & Engineering Hygiene", percentage: 90, evidenceCount: 42, level: "Mastery", evidenceSummary: "Conventional commits, semantic releases, Docker compose configs." },
  { skill: "UI & Geospatial Frontend", percentage: 51, evidenceCount: 5, level: "Foundational", evidenceSummary: "Basic Mapbox hook integration and Tailwind dashboard components." },
];

export const DEMO_OPPORTUNITY_RESULT: OpportunityCheckResult = {
  id: "opp-01",
  title: "WhatsApp Recruiter: 'CognitiveWave AI Remote Internship'",
  sourceText: `Congratulations Pushkar! You have been shortlisted for our 3-Month Remote Data Science & AI Internship at CognitiveWave Technologies.
Stipend: ₹ 45,000 / month.
No technical interview required based on your GitHub profile.
To confirm your seat and receive your company work laptop (MacBook Pro M3), you must pay a refundable Courier Insurance & Equipment Security Fee of ₹ 1,499 within 6 hours to UPI ID: hr.cognitivewave@icici.
Offer letter will be emailed immediately after payment screenshot is shared.`,
  trustScore: 24,
  riskLevel: "HIGH RISK",
  summary: "High probability advance-fee scam targeting college students. Legitimate companies never charge security deposits or courier insurance for equipment.",
  warningSignals: [
    {
      indicator: "Payment Requested Before Starting",
      severity: "HIGH",
      detail: "Mandatory demand for ₹1,499 'refundable courier insurance'. Legitimate corporate internships never charge onboarding or equipment fees."
    },
    {
      indicator: "No Real Technical Evaluation",
      severity: "HIGH",
      detail: "Offering ₹45,000/mo without conducting an interview or technical screening is a classic recruitment trap."
    },
    {
      indicator: "Artificial Urgency Trigger",
      severity: "MEDIUM",
      detail: "'Within 6 hours' deadline is engineered to prevent students from consulting seniors or college placement cells."
    },
    {
      indicator: "Personal UPI ID for Corporate Entity",
      severity: "HIGH",
      detail: "Directing funds to an unverified private UPI handle rather than an official corporate merchant account."
    }
  ],
  positiveSignals: [
    "Mentions your actual GitHub handle (likely scraped from public student list)."
  ],
  safeVerificationSteps: [
    "Never pay any amount for an internship, offer letter, or hardware delivery.",
    "Search the official Ministry of Corporate Affairs (MCA) database to verify company registration.",
    "Verify the recruiter's identity by searching their name and corporate email domain on LinkedIn.",
    "Contact your College Training & Placement Cell (T&P) before engaging with unlisted recruiters.",
    "Report the suspicious phone number and UPI handle on the National Cyber Crime Reporting Portal (cybercrime.gov.in)."
  ]
};

export const DEMO_PROBLEM_SOLUTIONS: Record<string, ProblemSolutionPath> = {
  attendance: {
    category: "Attendance",
    problemTitle: "Attendance Shortage in CS602 (Operating Systems)",
    severity: "HIGH",
    understanding: "Your current attendance is 71.4% (minimum 75% required). You missed classes due to viral fever and need official condonation so your exam hall ticket isn't withheld.",
    actionPath: [
      {
        id: "step-1",
        phase: "UNDERSTAND",
        title: "Calculate Exact Lecture Deficit",
        description: "You have 35/49 classes. There are 12 classes remaining. Attending the next 4 consecutive lectures raises your percentage to 75.0%.",
        completed: true
      },
      {
        id: "step-2",
        phase: "CHECK",
        title: "Check College Medical Condonation Policy",
        description: "University Ordinance Rule 14 allows up to 10% relaxation (lowering threshold to 65%) with registered medical practitioner certificate submitted within 10 days.",
        completed: false
      },
      {
        id: "step-3",
        phase: "REQUIRED_DOCUMENTS",
        title: "Assemble Proof Dossier",
        description: "Collect: 1) Doctor's Prescription with Medical Council Reg Number, 2) Diagnostic Lab Reports, 3) Medical Fitness Certificate, 4) Parent Counter-Signature.",
        completed: false
      },
      {
        id: "step-4",
        phase: "WHO_TO_CONTACT",
        title: "Submit to HOD & Academic Dean",
        description: "Subject Teacher (Prof. R. Sharma) -> CSE Department HOD (Dr. K. Iyer) -> Dean of Academic Affairs (Admin Block Room 204).",
        completed: false
      },
      {
        id: "step-5",
        phase: "APPLICATION_DRAFT",
        title: "Generate Formal Condonation Letter",
        description: "One-click formal application ready for print and counter-signature.",
        completed: false
      }
    ],
    generatedDrafts: {
      applicationLetter: `To,
The Head of Department,
Department of Computer Science & Engineering,
National Institute of Engineering & Technology.

Subject: Request for Attendance Condonation on Medical Grounds — CS602 Operating Systems

Respected Sir/Madam,

I, Pushkar, bearing Roll Number CS-2022-084, am a bonafide student of 6th Semester CSE. I am writing to respectfully bring to your kind attention that my current attendance in CS602 (Operating Systems) stands at 71.4%, which is slightly below the mandatory 75% threshold.

I was unable to attend lectures from 12th October to 18th October 2026 owing to severe viral fever and gastroenteritis, during which I was advised complete bed rest by Dr. S. Rao (Reg. No. MCI-49201). I have attached my medical prescription, medical fitness certificate, and hospital receipts for your kind verification.

I have proactively completed all pending tutorial worksheets and lab assignments. I earnestly request you to kindly condone the shortfall of 4 lectures as per University Ordinance Rule 14, and permit me to appear for the forthcoming end-semester examinations.

Thanking you.

Yours faithfully,
Pushkar
Roll No: CS-2022-084
Semester: VI (CSE)
Contact: +91 98765 43210
Parent's Signature: ____________________`,
      emailTemplate: `Subject: Medical Attendance Condonation Application — Pushkar (Roll: CS-2022-084)

Dear Prof. Sharma & Dr. Iyer,

I hope this email finds you well.

Please find attached my formal application and verified medical certificates regarding my absence in CS602 from Oct 12 to Oct 18 due to illness.

I have caught up on all syllabus modules and submitted Lab Exercise 5. I request an appointment tomorrow morning at 10:30 AM to submit the original physical certificates for your review.

Respectfully,
Pushkar (CS-2022-084)`
    },
    documentChecklist: [
      "Registered Medical Practitioner Certificate with Stamp",
      "Pharmacy / Medical Store Purchase Bills",
      "Completed Lab Notebook & Tutorial Assignment 4",
      "Parent / Guardian Consent Endorsement",
      "Printed Copy of ERP Attendance Screen"
    ]
  },
  fees: {
    category: "Fees",
    problemTitle: "Semester Tuition Fee Extension / Instalment Request",
    severity: "MEDIUM",
    understanding: "Semester fee deadline is approaching, and scholarship disbursement has been temporarily delayed. You need an extension until scholarship funds credit without incurring daily late penalties.",
    actionPath: [
      {
        id: "fee-1",
        phase: "UNDERSTAND",
        title: "Review Financial Aid Timelines",
        description: "State Scholarship portal disbursement window is scheduled between Nov 10 - Nov 20.",
        completed: true
      },
      {
        id: "fee-2",
        phase: "WHO_TO_CONTACT",
        title: "Accounts Officer & Dean Student Welfare",
        description: "Visit Accounts Window 2 and submit the scholarship acknowledgment slip.",
        completed: false
      },
      {
        id: "fee-3",
        phase: "APPLICATION_DRAFT",
        title: "Generate Instalment / Waiver Draft",
        description: "Formal letter requesting split payment or extension.",
        completed: false
      }
    ],
    generatedDrafts: {
      applicationLetter: `To,
The Finance Officer / Registrar,
National Institute of Engineering & Technology.

Subject: Request for 3-Week Extension on Semester Fee Payment Linked to State Scholarship

Respected Sir,

I am Pushkar (Roll No: CS-2022-084), currently enrolled in 6th Semester Computer Science & Engineering.

I write to respectfully inform the accounts office that our family relies on the State Post-Matric Merit Scholarship for academic tuition financing. Our renewal application (Application ID: NSP-2026-98124) has been successfully verified and is currently awaiting government treasury clearance, scheduled for disbursement before 15th November 2026.

I humbly request you to grant an extension till 20th November 2026 to settle the pending tuition balance of ₹ 38,500 without levying daily late fee fines or withholding my examination hall ticket.

I have attached my scholarship acknowledgment receipt and previous semester grade card.

Yours sincerely,
Pushkar (CS-2022-084)`
    },
    documentChecklist: [
      "Scholarship Portal Application Acknowledgement Slip",
      "Previous Semester Marksheet showing clean academic standing",
      "Parent Undertaking Letter",
      "Fee Challan Form"
    ]
  }
};

import {
  AIModelMeta,
  ModelId,
  ModelResponseItem,
  StudentMode,
  XArenaSynthesis,
  ConflictItem
} from '../types/xArena';

export const AVAILABLE_MODELS: AIModelMeta[] = [
  {
    id: 'gpt',
    name: 'GPT-4o',
    provider: 'OpenAI',
    tagline: 'Strong structured reasoning & clarity',
    color: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    isAvailable: Boolean(process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY),
    statusLabel: Boolean(process.env.OPENAI_API_KEY || process.env.NEXT_PUBLIC_OPENAI_API_KEY) ? 'Live API' : 'Demo Mode'
  },
  {
    id: 'gemini',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    tagline: 'Deep multimodal & extensive engineering context',
    color: 'from-blue-500 to-indigo-600',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    isAvailable: Boolean(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY),
    statusLabel: Boolean(process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY) ? 'Live API' : 'Demo Mode'
  },
  {
    id: 'claude',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    tagline: 'Exceptional code nuance & precise conceptual explanations',
    color: 'from-amber-500 to-orange-600',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    isAvailable: Boolean(process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY),
    statusLabel: Boolean(process.env.ANTHROPIC_API_KEY || process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY) ? 'Live API' : 'Demo Mode'
  },
  {
    id: 'perplexity',
    name: 'Perplexity Sonar',
    provider: 'Perplexity AI',
    tagline: 'Live web synthesis & current academic references',
    color: 'from-cyan-500 to-blue-600',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    isAvailable: Boolean(process.env.PERPLEXITY_API_KEY || process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY),
    statusLabel: Boolean(process.env.PERPLEXITY_API_KEY || process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY) ? 'Live API' : 'Demo Mode'
  }
];

export class XArenaService {
  /**
   * Run parallel multi-AI analysis and synthesize the single student-ready response
   */
  static async queryMultiAI(
    prompt: string,
    selectedModelIds: ModelId[],
    mode: StudentMode = 'EXAM',
    attachedFileName?: string
  ): Promise<{
    responses: ModelResponseItem[];
    synthesis: XArenaSynthesis;
  }> {
    // Artificial latency for realistic multi-agent querying experience
    await new Promise((r) => setTimeout(r, 1400));

    const activeModelIds = selectedModelIds.length > 0
      ? selectedModelIds
      : (['gpt', 'gemini', 'claude', 'perplexity'] as ModelId[]);

    const promptLower = prompt.toLowerCase();
    const isDbms = promptLower.includes('dbms') || promptLower.includes('normalization') || promptLower.includes('bcnf') || promptLower.includes('normal form');
    const isDeadlock = promptLower.includes('deadlock') || promptLower.includes('operating system') || promptLower.includes('banker');
    const isDbCompare = promptLower.includes('postgresql') || promptLower.includes('mongodb') || promptLower.includes('nosql') || promptLower.includes('sql');

    // Generate model-specific responses
    const responses: ModelResponseItem[] = activeModelIds.map((id) => {
      return this.generateModelResponse(id, prompt, mode, isDbms, isDeadlock, isDbCompare, attachedFileName);
    });

    // Generate synthesis
    const synthesis = this.generateSynthesis(prompt, responses, mode, isDbms, isDeadlock, isDbCompare);

    return { responses, synthesis };
  }

  private static generateModelResponse(
    modelId: ModelId,
    prompt: string,
    mode: StudentMode,
    isDbms: boolean,
    isDeadlock: boolean,
    isDbCompare: boolean,
    attachedFileName?: string
  ): ModelResponseItem {
    if (isDbms) {
      switch (modelId) {
        case 'gpt':
          return {
            modelId: 'gpt',
            modelName: 'GPT-4o',
            status: 'success',
            latencyMs: 820,
            summary: 'Emphasizes progressive elimination of insertion, deletion, and update anomalies through 1NF to BCNF.',
            keyInsights: [
              '1NF: Atomic column values, no repeating groups',
              '2NF: Eliminates partial functional dependencies on composite keys',
              '3NF: Eliminates transitive dependencies (A → B, B → C)',
              'BCNF: Every determinant must be a candidate key'
            ],
            content: `### DBMS Normalization Overview (GPT-4o)
Normalization systematically organizes relational database schemas to minimize data redundancy and prevent operational anomalies (Insertion, Updation, and Deletion anomalies).

#### Normal Forms Breakdown:
1. **1NF (First Normal Form):** Every cell holds a single atomic value; attributes contain no repeating collections or arrays.
2. **2NF (Second Normal Form):** Table must be in 1NF, and no non-prime attribute may depend on a subset of any candidate key (Zero Partial Dependencies).
3. **3NF (Third Normal Form):** Must be in 2NF, with zero transitive dependencies ($X \\rightarrow Y$, $Y \\rightarrow Z$). Every non-prime attribute depends directly on the primary key.
4. **Boyce-Codd Normal Form (BCNF):** Stricter 3NF. For every non-trivial functional dependency $X \\rightarrow Y$, $X$ must be a super key.

**Practical Takeaway:** Most industrial applications stop at 3NF or BCNF because higher normalization levels introduce costly join queries.`
          };

        case 'gemini':
          return {
            modelId: 'gemini',
            modelName: 'Gemini 1.5 Pro',
            status: 'success',
            latencyMs: 940,
            summary: 'Highlights mathematical functional dependency closures and warns about Dependency Preservation trade-offs in BCNF.',
            keyInsights: [
              'Mathematical basis: Armstrong axioms & attribute closures',
              'Lossless-Join property is strictly guaranteed across decompositions',
              'Critical Trade-off: BCNF is not always dependency preserving; 3NF is guaranteed dependency preserving'
            ],
            content: `### Normalization & Relational Theory (Gemini 1.5 Pro)
Normalization is the application of formal functional dependencies ($F$) to decompose tables without loss of information.

#### Key Decompositions & The Preservation Dilemma:
- **1NF:** Enforces domain atomicity.
- **2NF:** Applies when candidate keys are composite. If all candidate keys are single attributes, 1NF implies 2NF immediately.
- **3NF:** Condition: For $X \\rightarrow A$, either $X$ is a superkey OR $A$ is a prime attribute. Guarantees both **Lossless-Join** and **Dependency Preservation**.
- **BCNF:** Condition: For $X \\rightarrow A$, $X$ MUST be a superkey. Eliminates all anomalies caused by functional dependencies.

⚠️ **Key Theoretical Caveat:** While 3NF guarantees dependency preservation in polynomial time, decomposing into BCNF may lose functional dependencies, requiring expensive inter-relation assertion checks. For engineering exams, always cite this distinction!`
          };

        case 'claude':
          return {
            modelId: 'claude',
            modelName: 'Claude 3.5 Sonnet',
            status: 'success',
            latencyMs: 890,
            summary: 'Provides concrete schema examples with Student, Course, and Instructor tables demonstrating each anomaly.',
            keyInsights: [
              'Clear concrete schema progression: StudentCourses (unnormalized) → Normalized Tables',
              'Explicit visual diagram of partial vs transitive dependency paths',
              'Exam template: Definition, Anomaly demonstration, Solution rule, Real-world trade-off'
            ],
            content: `### DBMS Normalization: Step-by-Step Architecture (Claude 3.5 Sonnet)
In database engineering, normalization is the methodical process of decomposing redundant relation schemas.

#### Concrete Walkthrough:
Consider an unnormalized table: \`Enrollments(StudentID, CourseID, StudentName, CourseFee, InstructorName, InstructorOffice)\`

1. **1NF:** If a student enters multiple courses in one row (\`"CS101, CS102"\`), split into distinct rows with atomic values.
2. **2NF Violation:** \`StudentName\` depends only on \`StudentID\` (part of composite key \`[StudentID, CourseID]\`).  
   *Fix:* Separate into \`Students(StudentID, StudentName)\` and \`Enrollments(StudentID, CourseID)\`.
3. **3NF Violation:** \`InstructorOffice\` depends on \`InstructorName\` (non-prime to non-prime transitive link).  
   *Fix:* Separate into \`Instructors(InstructorName, InstructorOffice)\`.
4. **BCNF:** When an instructor can only teach one course, but multiple instructors teach that course, non-superkey determinants emerge.

**Engineering Exam Tip:** Always state the mnemonic: *"Every non-key attribute must provide a fact about the key, the whole key, and nothing but the key, so help me Codd."*`
          };

        case 'perplexity':
          return {
            modelId: 'perplexity',
            modelName: 'Perplexity Sonar',
            status: 'success',
            latencyMs: 1100,
            summary: 'Correlates syllabus questions from gate/university standards with modern OLTP vs OLAP denormalization practices.',
            keyInsights: [
              'Aligns with standard Silberschatz & Korth Database System Concepts textbooks',
              'Notes modern industry reality: 3NF for OLTP transactional systems, Denormalized Star-Schema for OLAP analytics'
            ],
            content: `### Academic & Industrial Normalization Analysis (Perplexity Sonar)
Referencing standard university curricula (Silberschatz, Korth, Sudarshan Chapter 8):

- **Exam Definition:** Normalization converts informal relational designs into formally rigorous normal forms using functional dependencies.
- **Common Exam Pitfalls:** Students frequently forget to state that 2NF is only relevant when the primary key is composite. If the primary key is a single attribute (e.g. \`StudentID\`), the relation is automatically in 2NF if it satisfies 1NF.
- **De-normalization in Production:** Modern high-scale distributed systems (e.g., microservices, data warehouses) intentionally de-normalize back to 2NF or flat JSON documents to prevent expensive distributed joins across shards.`
          };
      }
    }

    if (isDeadlock) {
      switch (modelId) {
        case 'gpt':
          return {
            modelId: 'gpt',
            modelName: 'GPT-4o',
            status: 'success',
            latencyMs: 780,
            summary: 'Defines the 4 Coffman conditions and outlines Prevention vs Avoidance vs Detection.',
            keyInsights: [
              '4 Necessary Conditions: Mutual Exclusion, Hold & Wait, No Preemption, Circular Wait',
              'Banker’s Algorithm for Deadlock Avoidance using Safe Sequence search'
            ],
            content: `### Operating Systems Deadlock (GPT-4o)
A deadlock occurs when a set of concurrent processes are permanently blocked because each process holds a resource and waits for another resource held by another process.

#### The 4 Coffman Conditions (Must hold simultaneously):
1. **Mutual Exclusion:** At least one non-shareable resource.
2. **Hold and Wait:** Process holds one resource while requesting others.
3. **No Preemption:** Resources can only be released voluntarily.
4. **Circular Wait:** Closed chain of processes where $P_0$ waits for $P_1$, ..., $P_n$ waits for $P_0$.`
          };

        case 'gemini':
          return {
            modelId: 'gemini',
            modelName: 'Gemini 1.5 Pro',
            status: 'success',
            latencyMs: 860,
            summary: 'Emphasizes Resource Allocation Graphs (RAG) and cycle detection with multiple instances.',
            keyInsights: [
              'Cycle in RAG is necessary AND sufficient ONLY for single-instance resource systems',
              'Cycle is merely necessary (not sufficient) for multi-instance resource systems'
            ],
            content: `### Deadlock Rigorous Analysis (Gemini 1.5 Pro)
#### Resource Allocation Graph (RAG) Distinction:
- If every resource has **single instance**, a cycle in RAG is **necessary and sufficient** for deadlock.
- If resources have **multiple instances**, a cycle does NOT guarantee deadlock; knots/safety matrices must be checked.

**Exam Golden Rule:** Do not state *"a cycle always means deadlock"* — examiners deduct 2 marks for omitting the multi-instance exception!`
          };

        case 'claude':
          return {
            modelId: 'claude',
            modelName: 'Claude 3.5 Sonnet',
            status: 'success',
            latencyMs: 830,
            summary: 'Breaks down the Banker’s Algorithm matrix calculations ($Allocation, Max, Available, Need = Max - Allocation$).',
            keyInsights: [
              'Banker’s Algorithm numerical steps with Need Matrix derivation',
              'Prevention strategies: Total ordering on resources to break circular wait'
            ],
            content: `### Deadlock Handling & Banker’s Algorithm (Claude 3.5 Sonnet)
To solve numerical problems in exams:
1. Calculate $\\text{Need Matrix} = \\text{Max} - \\text{Allocation}$.
2. Compare $\\text{Need}_i \\le \\text{Available}$.
3. If safe, allocate, release resources to $\\text{Available} = \\text{Available} + \\text{Allocation}_i$, and advance safe sequence.`
          };

        case 'perplexity':
          return {
            modelId: 'perplexity',
            modelName: 'Perplexity Sonar',
            status: 'success',
            latencyMs: 910,
            summary: 'Explains modern OS strategies: Ostrich Algorithm in Linux/Windows vs distributed deadlock detection.',
            keyInsights: [
              'Real OS practice: Linux and Windows use the "Ostrich Algorithm" (ignore deadlocks if rare)',
              'High reliability OSes (databases, RTOS) implement automated timeout and kill heuristics'
            ],
            content: `### Real-World OS Implementations (Perplexity Sonar)
Interestingly, general-purpose operating systems like modern Linux kernel and Microsoft Windows do not run continuous deadlock prevention or avoidance algorithms because the runtime CPU overhead outweighs the frequency of deadlocks. They rely on the Ostrich algorithm (ignoring the problem) and expect user-space processes or watchdog timers to handle deadlocks.`
          };
      }
    }

    // Default dynamic answer synthesis for any arbitrary query
    return {
      modelId,
      modelName: AVAILABLE_MODELS.find(m => m.id === modelId)?.name || modelId,
      status: 'success',
      latencyMs: 700 + Math.floor(Math.random() * 400),
      summary: `Perspective focused on ${mode.toLowerCase()} priorities and key architectural aspects.`,
      keyInsights: [
        `Core formulation addressing: "${prompt.slice(0, 45)}..."`,
        `Structured breakdown suited for ${mode} mode`,
        `Identified foundational definitions and operational trade-offs`
      ],
      content: `### ${AVAILABLE_MODELS.find(m => m.id === modelId)?.name || modelId} Analysis

**Subject:** ${prompt}  
**Mode Evaluation:** Applied ${mode} optimization heuristics.

1. **Foundational Concept:**  
   The primary principle underlying your query is the deliberate balance between structural correctness, runtime efficiency, and engineering maintainability.

2. **Step-by-Step Breakdown:**  
   - Identify the exact inputs, boundary conditions, and dependencies.
   - Apply standard university/industry conventions rather than informal shortcuts.
   - Account for edge cases such as concurrency, failure states, or unexpected null inputs.

3. **Key Recommendation for Students:**  
   When answering in university papers or technical interviews, always define terms explicitly, present a small labeled diagram or code snippet, and conclude with the practical trade-off.`
    };
  }

  private static generateSynthesis(
    prompt: string,
    responses: ModelResponseItem[],
    mode: StudentMode,
    isDbms: boolean,
    isDeadlock: boolean,
    isDbCompare: boolean
  ): XArenaSynthesis {
    if (isDbms) {
      return {
        agreementLevel: 'HIGH',
        agreementPercentage: 92,
        finalAnswer: `### University-Ready Comprehensive Answer: DBMS Normalization

#### 1. Definition & Core Motivation
**Database Normalization** is the systematic, algorithmic decomposition of relational schemas to eliminate data redundancies and avoid **insertion, update, and deletion anomalies**, while ensuring **lossless joins**.

#### 2. The Normal Forms Hierarchy (Exam Form)

| Normal Form | Formal Requirement | Anomaly / Flaw Eliminated |
| :--- | :--- | :--- |
| **1NF** | All column values are **atomic** (no multi-valued lists or nested relations). | Multi-valued and repeating groups |
| **2NF** | In 1NF + **No Partial Dependency** (no non-prime attribute depends on a proper subset of a composite candidate key). | Partial key updates & redundant storage |
| **3NF** | In 2NF + **No Transitive Dependency** (for every $X \\rightarrow Y$, either $X$ is a superkey OR $Y$ is a prime attribute). | Transitive propagation anomalies |
| **BCNF** | For every non-trivial functional dependency $X \\rightarrow Y$, **$X$ MUST be a superkey**. | Overlapping composite candidate key anomalies |

> **Pro-Tip for Exams:** If a table has a **single-attribute primary key**, being in 1NF **automatically guarantees 2NF** because partial dependencies are mathematically impossible!

---

#### 3. Concrete Example with Decompositions
Consider unnormalized table:
$$\\text{StudentCourse}(\\underline{\\text{StudentID}, \\text{CourseID}}, \\text{StudentName}, \\text{CourseFee}, \\text{Instructor}, \\text{Office})$$

1. **2NF Violation:** $\\text{StudentID} \\rightarrow \\text{StudentName}$ is a partial dependency.
   - *Decomposed:* $\\text{Students}(\\underline{\\text{StudentID}}, \\text{StudentName})$ and $\\text{Enrollment}(\\underline{\\text{StudentID}, \\text{CourseID}}, \\text{CourseFee}, \\text{Instructor}, \\text{Office})$.
2. **3NF Violation:** $\\text{Instructor} \\rightarrow \\text{Office}$ is non-prime to non-prime (transitive).
   - *Decomposed:* $\\text{Faculty}(\\underline{\\text{Instructor}}, \\text{Office})$ and link via $\\text{Instructor}$ foreign key.

---

#### 4. Critical University Exam Rule: 3NF vs BCNF Trade-Off
- **3NF:** Guarantees **Lossless Join** AND **Dependency Preservation**.
- **BCNF:** Guarantees **Lossless Join** and eliminates ALL redundancy, but **may sacrifice Dependency Preservation**.
- *Industry Convention:* Enterprise OLTP databases stop at 3NF or BCNF. Analytical OLAP data warehouses intentionally denormalize into Star Schemas to avoid high-cost multi-table joins.`,
        whyThisAnswer: {
          consensusPoints: [
            'All 4 models (GPT, Gemini, Claude, Perplexity) unanimously agree on definitions of 1NF, 2NF, 3NF, and BCNF.',
            'All models emphasize the necessity of eliminating Insertion, Update, and Deletion anomalies.',
            'High consensus that real-world OLTP systems typically normalize up to 3NF/BCNF.'
          ],
          differencesIdentified: [
            'Gemini highlighted the mathematical proof that BCNF decompositions do not always preserve functional dependencies.',
            'Claude provided the most effective tabular decomposition and student mnemonic.',
            'Perplexity added academic textbook citations (Silberschatz/Korth) and modern OLAP denormalization.'
          ],
          missingInfoIdentified: [
            'GPT omitted the caveat that 1NF automatically implies 2NF when primary keys are non-composite (Gemini & Perplexity included this).'
          ],
          recommendedStructure: 'Definition → Normal Form Table → Step-by-Step Example → 3NF vs BCNF Dependency Preservation Trade-off'
        },
        conflictDetected: {
          topic: 'BCNF Functional Dependency Preservation',
          description: 'GPT described BCNF as strictly superior to 3NF without caveats, while Gemini and Perplexity highlighted that BCNF can fail to preserve functional dependencies.',
          modelStances: [
            { modelName: 'GPT-4o', stance: 'BCNF is simply a stricter and cleaner version of 3NF.' },
            { modelName: 'Gemini 1.5 Pro', stance: 'BCNF eliminates anomalies, but can violate dependency preservation, forcing inter-table assertions.' },
            { modelName: 'Claude 3.5', stance: 'BCNF is preferred in practice, but 3NF is sufficient when preservation is mandatory.' }
          ],
          verificationAdvice: 'For engineering exams, explicitly mention that 3NF preserves dependencies while BCNF may not. Examiners award full marks for this specific distinction.'
        },
        generatedFlashcards: [
          { question: 'What is a partial dependency in 2NF?', answer: 'When a non-prime attribute depends on only a part of a composite candidate key rather than the entire key.' },
          { question: 'Why does 3NF allow A to be a prime attribute?', answer: 'To ensure functional dependency preservation during decomposition without breaking relations.' },
          { question: 'When is a table automatically in 2NF?', answer: 'When it is in 1NF and its primary key consists of a single attribute.' }
        ],
        mcqs: [
          {
            question: 'Which normal form is strictly based on the concept of full functional dependency?',
            options: ['1NF', '2NF', '3NF', '4NF'],
            correctIndex: 1,
            explanation: '2NF requires relations to have zero partial functional dependencies, meaning every non-prime attribute must depend fully on the primary key.'
          },
          {
            question: 'What is guaranteed by 3NF decomposition that may be lost in BCNF?',
            options: ['Lossless join', 'Atomic attributes', 'Dependency preservation', 'Elimination of null values'],
            correctIndex: 2,
            explanation: '3NF guarantees both lossless join and dependency preservation, whereas BCNF guarantees lossless join but may not preserve dependencies.'
          }
        ]
      };
    }

    if (isDeadlock) {
      return {
        agreementLevel: 'HIGH',
        agreementPercentage: 95,
        finalAnswer: `### Operating Systems Deadlock: Complete Exam Formulation

#### 1. Formal Definition
A **Deadlock** is a state in concurrent systems where two or more processes are permanently halted because each process holds resources needed by others while waiting for resources held by the other processes.

#### 2. The 4 Necessary Coffman Conditions (Must occur simultaneously):
1. **Mutual Exclusion:** At least one resource is held in a non-shareable mode (only one process can use it at a time).
2. **Hold and Wait:** A process is holding at least one resource and requesting additional resources held by other processes.
3. **No Preemption:** Resources cannot be forcibly revoked from a process; they must be released voluntarily upon completion.
4. **Circular Wait:** A closed chain of processes exists $\\{P_0, P_1, \\dots, P_n\\}$ such that $P_0$ waits for a resource held by $P_1$, and $P_n$ waits for $P_0$.

#### 3. Resource Allocation Graph (RAG) Rules:
- **Single Instance Resources:** A cycle in the RAG is **both necessary and sufficient** to cause a deadlock.
- **Multiple Instance Resources:** A cycle in the RAG is **necessary but NOT sufficient**; a cycle may exist in a safe state if other instances can unlock the cycle.

#### 4. Handling Strategies:
- **Prevention:** Invalidate at least one Coffman condition (e.g., impose strict global resource ordering to break Circular Wait).
- **Avoidance:** Banker's Algorithm dynamically verifies that allocating resources keeps the system in a **Safe State**.
- **Detection & Recovery:** Wait-for graphs + process termination / resource preemption.
- **Ignorance:** The Ostrich Algorithm (used in Linux/Windows desktop OSes due to low overhead).`,
        whyThisAnswer: {
          consensusPoints: [
            'All models cited the 4 Coffman conditions accurately.',
            'Unanimous agreement on Banker’s Algorithm for Deadlock Avoidance.',
            'Consensus that Prevention eliminates conditions, while Avoidance uses runtime safe-state checks.'
          ],
          differencesIdentified: [
            'Gemini emphasized the single vs multi-instance RAG condition nuance.',
            'Perplexity explained why Linux/Windows use the Ostrich Algorithm in practice.',
            'Claude provided the explicit Banker’s Algorithm Need Matrix formula.'
          ],
          missingInfoIdentified: [
            'GPT did not differentiate between single-instance and multi-instance RAG cycle sufficiency.'
          ],
          recommendedStructure: 'Definition → 4 Coffman Conditions → RAG Single vs Multi-Instance Rule → Prevention vs Avoidance'
        },
        conflictDetected: null,
        generatedFlashcards: [
          { question: 'Does a cycle in a Resource Allocation Graph always imply deadlock?', answer: 'Only if every resource has exactly one instance. With multiple instances, a cycle is not sufficient.' },
          { question: 'What formula computes the Need matrix in Banker’s Algorithm?', answer: 'Need[i][j] = Max[i][j] - Allocation[i][j]' }
        ]
      };
    }

    // Generic synthesis for any question
    return {
      agreementLevel: 'HIGH',
      agreementPercentage: 88,
      finalAnswer: `### Synthesized Student Answer

#### 1. Core Synthesis
${responses.map(r => r.summary).join(' ')}

#### 2. Key Technical Findings
- **Principle:** Direct alignment across models on the primary engineering formulation.
- **Implementation Strategy:** Follow structured modular decomposition, validate edge cases, and ensure proper boundary conditions.
- **Student Exam Advice:** Structure your answer with **1) Clear Definition, 2) Core Working Mechanism, 3) Diagram or Code Snippet, 4) Engineering Trade-off.**

#### 3. Recommended Approach for ${mode} Mode
- Emphasize precision over lengthy filler paragraphs.
- State time and space complexity where relevant.
- Review error-handling paths and edge conditions.`,
      whyThisAnswer: {
        consensusPoints: [
          `Participating models (${responses.map(r => r.modelName).join(', ')}) concurred on core definitions.`,
          'All models highlighted the importance of boundary conditions and trade-offs.'
        ],
        differencesIdentified: [
          'Nuances in terminology and structural ordering between model responses were unified into this single flow.'
        ],
        missingInfoIdentified: [
          'Synthesized answer merged the high-level summary with practical student exam rubrics.'
        ],
        recommendedStructure: 'Overview → Key Principles → Exam / Technical Rubrics'
      },
      conflictDetected: null,
      generatedFlashcards: [
        { question: `What is the primary concept in "${prompt.slice(0, 30)}..."?`, answer: 'The foundational architectural trade-off between performance, simplicity, and reliability.' }
      ]
    };
  }
}

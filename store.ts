import {
  User,
  Programme,
  LearningResource,
  Submission,
  StudentProgress,
  AchievementBadge,
  ResourceCreationData,
} from '../types';

const STORAGE_KEY_USERS = 'techneeds_users_v1';
const STORAGE_KEY_PROGRAMMES = 'techneeds_programmes_v1';
const STORAGE_KEY_RESOURCES = 'techneeds_resources_v1';
const STORAGE_KEY_SUBMISSIONS = 'techneeds_submissions_v1';
const STORAGE_KEY_PROGRESS = 'techneeds_progress_v1';
const STORAGE_KEY_AUTH = 'techneeds_auth_session_v1';

// Seeded Initial Users
const SEED_USERS: User[] = [
  {
    id: 'user_admin_1',
    name: 'Dr. Aruna Sharma',
    email: 'admin@techneeds.igdtuw.ac.in',
    role: 'admin',
    avatar: '/src/assets/images/avatar_admin_neha_1794399541322.jpg',
    bio: 'Dean of Academic Computing & Technical Mentorship Directorate, IGDTUW.',
    assignedProgrammes: ['prog_fsw_1', 'prog_aiml_2', 'prog_sys_3'],
    phone: '+91 98110 23410',
    linkedin: 'https://linkedin.com/in/aruna-sharma-igdtuw',
  },
  {
    id: 'user_mentor_1',
    name: 'Priya Sharma',
    email: 'priya.sharma@techneeds.igdtuw.ac.in',
    role: 'mentor',
    avatar: '/src/assets/images/avatar_mentor_priya_1794399541203.jpg',
    bio: 'Senior Software Engineer @ Microsoft Cloud Systems. IGDTUW Alumna 2021. Mentor for Distributed Systems & Full-Stack.',
    assignedProgrammes: ['prog_fsw_1', 'prog_sys_3'],
    phone: '+91 98711 55432',
    github: 'https://github.com/priyasharma-msft',
    linkedin: 'https://linkedin.com/in/priya-sharma-dev',
  },
  {
    id: 'user_mentor_2',
    name: 'Tanvi Kapoor',
    email: 'tanvi.kapoor@techneeds.igdtuw.ac.in',
    role: 'mentor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    bio: 'AI Research Engineer @ Adobe MDSR Labs. Specializes in LLMs, Multimodal Diffusion, and High-Performance ML Pipelines.',
    assignedProgrammes: ['prog_aiml_2'],
    phone: '+91 98102 77419',
    github: 'https://github.com/tanvikapoor-ai',
    linkedin: 'https://linkedin.com/in/tanvi-kapoor-ai',
  },
  {
    id: 'user_mentee_1',
    name: 'Ananya Verma',
    email: 'ananya.verma@student.igdtuw.ac.in',
    role: 'mentee',
    enrollmentNo: '04201012023',
    avatar: '/src/assets/images/avatar_student_ananya_1794399540199.jpg',
    branch: 'Computer Science & Engineering',
    year: '3rd Year (Batch 2026)',
    bio: 'Aspiring distributed systems engineer. Building high-throughput event queues, microservices, and modern web applications.',
    interestTags: ['Distributed Systems', 'TypeScript', 'Node.js', 'Redis', 'Docker'],
    assignedProgrammes: ['prog_fsw_1'],
    github: 'https://github.com/ananya-verma-tech',
    linkedin: 'https://linkedin.com/in/ananya-verma-igdtuw',
  },
  {
    id: 'user_mentee_2',
    name: 'Sneha Gupta',
    email: 'sneha.gupta@student.igdtuw.ac.in',
    role: 'mentee',
    enrollmentNo: '04301012023',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    branch: 'Information Technology',
    year: '3rd Year (Batch 2026)',
    bio: 'Full-stack developer fascinated by scalable cloud infra and real-time collaborative web canvases.',
    interestTags: ['React', 'Next.js', 'PostgreSQL', 'Cloud Architecture'],
    assignedProgrammes: ['prog_fsw_1'],
    github: 'https://github.com/snehagupta-it',
    linkedin: 'https://linkedin.com/in/sneha-gupta-it',
  },
  {
    id: 'user_mentee_3',
    name: 'Riya Malhotra',
    email: 'riya.malhotra@student.igdtuw.ac.in',
    role: 'mentee',
    enrollmentNo: '07801012023',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    branch: 'Artificial Intelligence & Data Science',
    year: '2nd Year (Batch 2027)',
    bio: 'Passionate about deep learning, model quantization, and autonomous agent architectures.',
    interestTags: ['PyTorch', 'Computer Vision', 'LangChain', 'Python'],
    assignedProgrammes: ['prog_aiml_2'],
    github: 'https://github.com/riyamalhotra-ai',
    linkedin: 'https://linkedin.com/in/riya-malhotra-ai',
  },
  {
    id: 'user_mentee_4',
    name: 'Ishita Roy',
    email: 'ishita.roy@student.igdtuw.ac.in',
    role: 'mentee',
    enrollmentNo: '09101012023',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    branch: 'Electronics & Communication',
    year: '3rd Year (Batch 2026)',
    bio: 'Embedded systems engineer bridging IoT telemetry with distributed cloud pipelines.',
    interestTags: ['Rust', 'Embedded C', 'WebSockets', 'MQTT'],
    assignedProgrammes: ['prog_fsw_1'],
    github: 'https://github.com/ishitaroy-eng',
    linkedin: 'https://linkedin.com/in/ishita-roy-eng',
  },
];

// Seeded Programmes
const SEED_PROGRAMMES: Programme[] = [
  {
    id: 'prog_fsw_1',
    title: 'Full-Stack Web & Cloud Systems Cohort 2026',
    code: 'TN-FSW-26',
    description: 'Comprehensive 12-week fellowship building production-grade web applications, distributed APIs, microservices, and containerized deployments on cloud.',
    domain: 'Full-Stack & Cloud Engineering',
    track: 'Core Engineering Track',
    status: 'active',
    startDate: '2026-01-15',
    endDate: '2026-04-30',
    mentorIds: ['user_mentor_1'],
    maxMentees: 40,
    menteeCount: 28,
    completionRate: 84,
    tags: ['React 19', 'Node.js', 'Redis', 'Docker', 'System Design'],
  },
  {
    id: 'prog_aiml_2',
    title: 'Applied AI & Deep Learning Systems Fellowship',
    code: 'TN-AIML-26',
    description: 'Intensive engineering program covering transformer architectures, retrieval-augmented generation (RAG), model fine-tuning, and production ML serving.',
    domain: 'Machine Learning & Generative AI',
    track: 'Advanced Research Track',
    status: 'active',
    startDate: '2026-02-01',
    endDate: '2026-05-15',
    mentorIds: ['user_mentor_2'],
    maxMentees: 35,
    menteeCount: 24,
    completionRate: 79,
    tags: ['PyTorch', 'Transformers', 'FastAPI', 'Vector Databases', 'RAG'],
  },
  {
    id: 'prog_sys_3',
    title: 'Systems Programming & Distributed Databases',
    code: 'TN-SYS-25',
    description: 'Advanced low-level programming covering concurrency models, storage engine internals (LSM Trees / B-Trees), and consensus algorithms (Raft).',
    domain: 'Systems & Infrastructure',
    track: 'Specialist Track',
    status: 'upcoming',
    startDate: '2026-06-01',
    endDate: '2026-08-30',
    mentorIds: ['user_mentor_1'],
    maxMentees: 25,
    menteeCount: 16,
    completionRate: 0,
    tags: ['Go / Rust', 'Distributed Consensus', 'LSM-Trees', 'gRPC'],
  },
];

// Seeded Learning Resources
const SEED_RESOURCES: LearningResource[] = [
  {
    id: 'res_vid_1',
    programmeId: 'prog_fsw_1',
    programmeTitle: 'Full-Stack Web & Cloud Systems Cohort 2026',
    title: 'Distributed Caching Strategies: In-Memory Architectures with Redis',
    topic: 'System Architecture & Backend',
    description: 'Deep dive into Cache-Aside, Write-Through, Write-Behind patterns, TTL invalidation storms, and distributed locks using Redis Redlock algorithm.',
    type: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=G1rOthIU-uo',
    durationMinutes: 42,
    maxMarks: 50,
    createdAt: '2026-02-10T10:00:00Z',
    createdByMentorId: 'user_mentor_1',
    creatorName: 'Priya Sharma',
    deadline: '2026-03-25',
  },
  {
    id: 'res_vid_2',
    programmeId: 'prog_fsw_1',
    programmeTitle: 'Full-Stack Web & Cloud Systems Cohort 2026',
    title: 'Modern Event-Driven Microservices with Kafka & WebSockets',
    topic: 'Real-Time Systems',
    description: 'Architecting horizontally scalable event streams, consumer groups, partition keys, and maintaining bi-directional client state over WebSockets.',
    type: 'video',
    videoUrl: 'https://www.youtube.com/watch?v=R873BlNVUB4',
    durationMinutes: 48,
    maxMarks: 50,
    createdAt: '2026-02-18T10:00:00Z',
    createdByMentorId: 'user_mentor_1',
    creatorName: 'Priya Sharma',
    deadline: '2026-03-28',
  },
  {
    id: 'res_quiz_1',
    programmeId: 'prog_fsw_1',
    programmeTitle: 'Full-Stack Web & Cloud Systems Cohort 2026',
    title: 'System Design & CAP Theorem Diagnostic Challenge',
    topic: 'Distributed Systems Principles',
    description: 'Test your grasp of Consistency models, PACELC theorem, partitioning strategies, and database sharding trade-offs under high concurrency.',
    type: 'quiz',
    deadline: '2026-03-20',
    maxMarks: 100,
    timeLimitMinutes: 20,
    createdAt: '2026-02-14T10:00:00Z',
    createdByMentorId: 'user_mentor_1',
    creatorName: 'Priya Sharma',
    questions: [
      {
        id: 'q1',
        question: 'According to the CAP Theorem, in the presence of a network partition (P), what trade-off must a distributed system make?',
        options: [
          'Choose between Availability (A) and Consistency (C)',
          'Sacrifice Latency (L) to retain Persistence (P)',
          'Increase Bandwidth to guarantee Zero Packet Loss',
          'Switch to single-node synchronous lock escalation',
        ],
        correctOptionIndex: 0,
        explanation: 'In a distributed network where network partitions are inevitable, a system must decide whether to continue serving potentially stale reads (Availability) or reject requests until data converges (Consistency).',
      },
      {
        id: 'q2',
        question: 'Which caching strategy writes data simultaneously to both the cache and the backing database before acknowledging completion?',
        options: [
          'Write-Behind (Write-Back)',
          'Write-Through',
          'Cache-Aside (Lazy Loading)',
          'Refresh-Ahead',
        ],
        correctOptionIndex: 1,
        explanation: 'Write-Through writes directly to both the cache and persistent storage synchronously, preventing cache drift at the cost of higher write latency.',
      },
      {
        id: 'q3',
        question: 'What is the primary benefit of Consistent Hashing over naive modulo-based hashing (hash(key) % N) when distributing keys across servers?',
        options: [
          'It eliminates cryptographic collision attacks',
          'Adding or removing a server only relocates K/N keys on average rather than reshuffling all keys',
          'It guarantees microsecond serialization times',
          'It removes the need for virtual nodes',
        ],
        correctOptionIndex: 1,
        explanation: 'Consistent hashing maps both servers and keys to an abstract ring, ensuring minimal key redistribution when cluster topology changes.',
      },
      {
        id: 'q4',
        question: 'In PostgreSQL and relational databases, what does the WAL (Write-Ahead Logging) mechanism guarantee?',
        options: [
          'Real-time indexing without B-Tree rebalancing',
          'Durability and Atomicity by ensuring changes are written to log on disk before data pages are flushed',
          'Automatic zero-downtime cross-region replication',
          'Complete immunity against memory starvation',
        ],
        correctOptionIndex: 1,
        explanation: 'WAL ensures that transactions are recorded sequentially in durable storage before being written to disk data files, enabling safe crash recovery.',
      },
    ],
  },
  {
    id: 'res_proj_1',
    programmeId: 'prog_fsw_1',
    programmeTitle: 'Full-Stack Web & Cloud Systems Cohort 2026',
    title: 'Distributed Real-Time Collaborative Whiteboard & Job Queue',
    topic: 'Capstone Project',
    description: 'Build and deploy a full-stack real-time collaboration engine supporting concurrent multi-user editing, cursor broadcasts, and asynchronous background thumbnail rendering via a distributed worker queue.',
    type: 'project',
    deadline: '2026-03-31',
    maxMarks: 200,
    createdAt: '2026-02-12T10:00:00Z',
    createdByMentorId: 'user_mentor_1',
    creatorName: 'Priya Sharma',
    problemStatement: `Develop a high-performance distributed whiteboard service:
1. Client: React with canvas rendering, real-time pointer synchronization, undo/redo stacks.
2. Server: Node.js WebSocket gateway maintaining room state and handling heartbeat pings.
3. Queue: Background job queue (BullMQ/Redis or in-memory equivalent) that takes SVG/canvas snapshots and converts them to downloadable PNG assets.
4. Deployment: Dockerized container specification ready for cloud deployment.`,
    techStack: ['React', 'TypeScript', 'Node.js', 'WebSockets', 'Redis', 'Docker'],
    submissionInstructions: 'Submit your public GitHub repository containing clear README instructions, architectural diagram, test suite, and a live demo URL (Vercel, Render, or Cloud Run).',
    rubric: [
      'Architecture & Clean Separation of Concerns (50 marks)',
      'Concurrency & Real-time State Synchronization (50 marks)',
      'Asynchronous Worker Queue Implementation (50 marks)',
      'Code Quality, Test Coverage & Documentation (50 marks)',
    ],
  },
];

// Seeded Submissions
const SEED_SUBMISSIONS: Submission[] = [
  {
    id: 'sub_1',
    menteeId: 'user_mentee_1',
    menteeName: 'Ananya Verma',
    menteeEnrollmentNo: '04201012023',
    resourceId: 'res_proj_1',
    resourceTitle: 'Distributed Real-Time Collaborative Whiteboard & Job Queue',
    resourceType: 'project',
    programmeId: 'prog_fsw_1',
    submittedAt: '2026-02-28T14:30:00Z',
    status: 'graded',
    score: 192,
    maxMarks: 200,
    mentorFeedback: 'Outstanding architectural implementation, Ananya! Your WebSocket heartbeat protocol and Redis worker queue integration were immaculate. Minor suggestion: consider adding exponential backoff to your client reconnection logic.',
    gradedByMentorId: 'user_mentor_1',
    gradedAt: '2026-03-01T11:00:00Z',
    projectLinks: {
      githubUrl: 'https://github.com/ananya-verma-tech/distributed-canvas-engine',
      liveDemoUrl: 'https://distributed-canvas-demo.app',
      notes: 'Added custom CRDT conflict-free resolution for simultaneous freehand drawing strokes.',
    },
  },
  {
    id: 'sub_2',
    menteeId: 'user_mentee_1',
    menteeName: 'Ananya Verma',
    menteeEnrollmentNo: '04201012023',
    resourceId: 'res_quiz_1',
    resourceTitle: 'System Design & CAP Theorem Diagnostic Challenge',
    resourceType: 'quiz',
    programmeId: 'prog_fsw_1',
    submittedAt: '2026-02-25T16:20:00Z',
    status: 'graded',
    score: 100,
    maxMarks: 100,
    mentorFeedback: 'Flawless score! 4/4 questions answered correctly in under 9 minutes.',
    gradedByMentorId: 'user_mentor_1',
    gradedAt: '2026-02-25T16:25:00Z',
    quizAnswers: { q1: 0, q2: 1, q3: 1, q4: 1 },
  },
  {
    id: 'sub_3',
    menteeId: 'user_mentee_2',
    menteeName: 'Sneha Gupta',
    menteeEnrollmentNo: '04301012023',
    resourceId: 'res_proj_1',
    resourceTitle: 'Distributed Real-Time Collaborative Whiteboard & Job Queue',
    resourceType: 'project',
    programmeId: 'prog_fsw_1',
    submittedAt: '2026-03-02T09:15:00Z',
    status: 'pending',
    maxMarks: 200,
    projectLinks: {
      githubUrl: 'https://github.com/snehagupta-it/collab-board-v1',
      liveDemoUrl: 'https://sneha-collab-board.vercel.app',
      notes: 'Implemented canvas rendering with Fabric.js and Redis pub/sub backplane.',
    },
  },
];

// Seeded Student Progress & Gamification
const SEED_PROGRESS: Record<string, StudentProgress> = {
  user_mentee_1: {
    menteeId: 'user_mentee_1',
    totalPoints: 842,
    rank: 1,
    streakDays: 14,
    completedResourceIds: ['res_vid_1', 'res_vid_2', 'res_quiz_1', 'res_proj_1'],
    badges: [
      {
        id: 'b1',
        name: 'Systems Architect',
        category: 'Architecture',
        description: 'Scored 95%+ on distributed systems capstone project.',
        icon: 'Layers',
        unlockedAt: '2026-03-01',
      },
      {
        id: 'b2',
        name: 'Sprint Master',
        category: 'Velocity',
        description: 'Maintained 14-day continuous learning streak.',
        icon: 'Zap',
        unlockedAt: '2026-03-05',
      },
      {
        id: 'b3',
        name: 'Perfect Diagnostic',
        category: 'Mastery',
        description: 'Achieved 100% on the CAP Theorem Challenge.',
        icon: 'Award',
        unlockedAt: '2026-02-25',
      },
      {
        id: 'b4',
        name: 'Community Trailblazer',
        category: 'Impact',
        description: 'Top ranked engineer in IGDTUW Cohort 2026.',
        icon: 'Sparkles',
        unlockedAt: '2026-03-01',
      },
    ],
  },
  user_mentee_2: {
    menteeId: 'user_mentee_2',
    totalPoints: 670,
    rank: 2,
    streakDays: 9,
    completedResourceIds: ['res_vid_1', 'res_quiz_1'],
    badges: [
      {
        id: 'b2',
        name: 'Sprint Master',
        category: 'Velocity',
        description: 'Maintained 7+ day continuous learning streak.',
        icon: 'Zap',
        unlockedAt: '2026-02-28',
      },
      {
        id: 'b5',
        name: 'Frontend Explorer',
        category: 'UI/UX',
        description: 'Completed advanced UI canvas rendering modules.',
        icon: 'Palette',
        unlockedAt: '2026-02-20',
      },
    ],
  },
  user_mentee_3: {
    menteeId: 'user_mentee_3',
    totalPoints: 590,
    rank: 3,
    streakDays: 11,
    completedResourceIds: ['res_vid_1'],
    badges: [
      {
        id: 'b6',
        name: 'AI Pioneer',
        category: 'Machine Learning',
        description: 'Mastered vector database embeddings & RAG.',
        icon: 'Cpu',
        unlockedAt: '2026-02-24',
      },
    ],
  },
  user_mentee_4: {
    menteeId: 'user_mentee_4',
    totalPoints: 510,
    rank: 4,
    streakDays: 6,
    completedResourceIds: ['res_vid_1'],
    badges: [
      {
        id: 'b7',
        name: 'Hardware Sync',
        category: 'IoT',
        description: 'Integrated WebSockets with hardware sensors.',
        icon: 'Cpu',
        unlockedAt: '2026-02-18',
      },
    ],
  },
};

// Store Service
class DataStore {
  private users: User[] = [];
  private programmes: Programme[] = [];
  private resources: LearningResource[] = [];
  private submissions: Submission[] = [];
  private progress: Record<string, StudentProgress> = {};
  private currentUser: User | null = null;
  private listeners: Array<() => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEY_USERS);
      this.users = storedUsers ? JSON.parse(storedUsers) : SEED_USERS;

      const storedProgs = localStorage.getItem(STORAGE_KEY_PROGRAMMES);
      this.programmes = storedProgs ? JSON.parse(storedProgs) : SEED_PROGRAMMES;

      const storedResources = localStorage.getItem(STORAGE_KEY_RESOURCES);
      this.resources = storedResources ? JSON.parse(storedResources) : SEED_RESOURCES;

      const storedSubmissions = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
      this.submissions = storedSubmissions ? JSON.parse(storedSubmissions) : SEED_SUBMISSIONS;

      const storedProgress = localStorage.getItem(STORAGE_KEY_PROGRESS);
      this.progress = storedProgress ? JSON.parse(storedProgress) : SEED_PROGRESS;

      const storedAuth = localStorage.getItem(STORAGE_KEY_AUTH);
      if (storedAuth) {
        this.currentUser = JSON.parse(storedAuth);
      } else {
        // Default to Mentee (Ananya Verma) for demonstration
        this.currentUser = this.users.find((u) => u.role === 'mentee') || this.users[3];
      }
    } catch (e) {
      console.warn('LocalStorage error, using memory seeds', e);
      this.users = [...SEED_USERS];
      this.programmes = [...SEED_PROGRAMMES];
      this.resources = [...SEED_RESOURCES];
      this.submissions = [...SEED_SUBMISSIONS];
      this.progress = { ...SEED_PROGRESS };
      this.currentUser = this.users[3];
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEY_PROGRAMMES, JSON.stringify(this.programmes));
      localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(this.resources));
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(this.submissions));
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(this.progress));
      if (this.currentUser) {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_AUTH);
      }
    } catch (e) {
      console.error('Failed to persist to localStorage', e);
    }
    this.notify();
  }

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  // Auth Operations
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  login(
    identifier: string,
    role: User['role'],
    password?: string
  ): { success: boolean; user?: User; error?: string } {
    let matched: User | undefined;
    const cleanId = identifier.trim().toLowerCase();

    if (role === 'mentee') {
      matched = this.users.find(
        (u) =>
          u.role === 'mentee' &&
          (u.enrollmentNo?.toLowerCase() === cleanId || u.email.toLowerCase() === cleanId)
      );
    } else {
      matched = this.users.find(
        (u) => u.role === role && u.email.toLowerCase() === cleanId
      );
    }

    if (!matched) {
      return {
        success: false,
        error: 'Account not found. Please check your credentials or sign up as a new user.',
      };
    }

    if (matched.password && password !== undefined && matched.password !== password) {
      return {
        success: false,
        error: 'Incorrect password. Please try again.',
      };
    }

    this.currentUser = matched;
    this.persist();
    return { success: true, user: matched };
  }

  registerUser(data: {
    name: string;
    email: string;
    password: string;
    role: 'mentee' | 'mentor';
    enrollmentNo?: string;
    branch?: string;
    year?: string;
    programmeId?: string;
    bio?: string;
    interestTags?: string[];
  }): { success: boolean; user?: User; enrollmentNo?: string; error?: string } {
    const cleanEmail = data.email.trim().toLowerCase();
    const existingEmail = this.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existingEmail) {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in instead.',
      };
    }

    if (data.role === 'mentee') {
      let enrollmentNo = data.enrollmentNo?.trim();
      if (enrollmentNo) {
        const existingEnrollment = this.users.find(
          (u) => u.enrollmentNo?.toLowerCase() === enrollmentNo!.toLowerCase()
        );
        if (existingEnrollment) {
          return {
            success: false,
            error: 'This IGDTUW Enrollment Number is already registered. Please sign in.',
          };
        }
      } else {
        const existingCount = this.users.filter((u) => u.role === 'mentee').length;
        const seq = String(100 + existingCount + 1).padStart(3, '0');
        enrollmentNo = `0${seq}01012026`;
      }

      const defaultProgId = data.programmeId || this.programmes[0]?.id;
      const newMentee: User = {
        id: `user_mentee_${Date.now()}`,
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        role: 'mentee',
        enrollmentNo,
        branch: data.branch || 'Computer Science & Engineering',
        year: data.year || '2nd Year (Batch 2027)',
        avatar: '/src/assets/images/avatar_student_ananya_1794399540199.jpg',
        bio: data.bio?.trim() || 'TechNeeds IGDTUW Student Engineer',
        interestTags:
          data.interestTags && data.interestTags.length > 0
            ? data.interestTags
            : ['Web Development', 'Data Structures', 'Algorithms'],
        assignedProgrammes: defaultProgId ? [defaultProgId] : [],
      };

      this.users.push(newMentee);
      this.progress[newMentee.id] = {
        menteeId: newMentee.id,
        totalPoints: 100,
        rank: Object.keys(this.progress).length + 1,
        streakDays: 1,
        completedResourceIds: [],
        badges: [
          {
            id: `b_welcome_${Date.now()}`,
            name: 'Cohort Initiate',
            category: 'Onboarding',
            description: 'Joined the TechNeeds IGDTUW technical mentorship ecosystem.',
            icon: 'Sparkles',
            unlockedAt: new Date().toISOString().split('T')[0],
          },
        ],
      };

      if (defaultProgId) {
        const prog = this.programmes.find((p) => p.id === defaultProgId);
        if (prog) prog.menteeCount += 1;
      }

      this.recalculateLeaderboard();
      this.currentUser = newMentee;
      this.persist();
      return { success: true, user: newMentee, enrollmentNo };
    }

    // Mentor registration
    const assignedProgIds = data.programmeId ? [data.programmeId] : [];
    const newMentor: User = {
      id: `user_mentor_${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim(),
      password: data.password,
      role: 'mentor',
      avatar: '/src/assets/images/avatar_mentor_priya_1794399541203.jpg',
      bio: data.bio?.trim() || 'Technical Mentor · TechNeeds IGDTUW',
      assignedProgrammes: assignedProgIds,
    };

    this.users.push(newMentor);
    if (data.programmeId) {
      const prog = this.programmes.find((p) => p.id === data.programmeId);
      if (prog && !prog.mentorIds.includes(newMentor.id)) {
        prog.mentorIds.push(newMentor.id);
      }
    }

    this.currentUser = newMentor;
    this.persist();
    return { success: true, user: newMentor };
  }

  switchUser(userId: string) {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      this.currentUser = user;
      this.persist();
    }
  }

  logout() {
    this.currentUser = null;
    this.persist();
  }

  // Users
  getUsers(role?: User['role']): User[] {
    if (role) return this.users.filter((u) => u.role === role);
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  addMentor(mentorData: Omit<User, 'id' | 'role'>): User {
    const newMentor: User = {
      ...mentorData,
      id: `user_mentor_${Date.now()}`,
      role: 'mentor',
      avatar: mentorData.avatar || '/src/assets/images/avatar_mentor_priya_1794399541203.jpg',
      assignedProgrammes: mentorData.assignedProgrammes || [],
    };
    this.users.push(newMentor);
    this.persist();
    return newMentor;
  }

  removeMentor(mentorId: string) {
    this.users = this.users.filter((u) => u.id !== mentorId);
    // Remove from assigned programmes
    this.programmes.forEach((p) => {
      p.mentorIds = p.mentorIds.filter((id) => id !== mentorId);
    });
    this.persist();
  }

  assignMentorToProgramme(mentorId: string, programmeId: string) {
    const mentor = this.users.find((u) => u.id === mentorId);
    const prog = this.programmes.find((p) => p.id === programmeId);
    if (mentor && prog) {
      if (!mentor.assignedProgrammes.includes(programmeId)) {
        mentor.assignedProgrammes.push(programmeId);
      }
      if (!prog.mentorIds.includes(mentorId)) {
        prog.mentorIds.push(mentorId);
      }
      this.persist();
    }
  }

  removeMentorFromProgramme(mentorId: string, programmeId: string) {
    const mentor = this.users.find((u) => u.id === mentorId);
    const prog = this.programmes.find((p) => p.id === programmeId);
    if (mentor) {
      mentor.assignedProgrammes = mentor.assignedProgrammes.filter((id) => id !== programmeId);
    }
    if (prog) {
      prog.mentorIds = prog.mentorIds.filter((id) => id !== mentorId);
    }
    this.persist();
  }

  addMentee(menteeData: {
    name: string;
    email: string;
    branch: string;
    year: string;
    programmeId: string;
    bio?: string;
    interestTags?: string[];
  }): { user: User; initialPassword: string; enrollmentNo: string } {
    // Generate unique sequential IGDTUW Enrollment Number
    const existingCount = this.users.filter((u) => u.role === 'mentee').length;
    const seq = String(100 + existingCount + 1).padStart(3, '0');
    const enrollmentNo = `0${seq}01012024`;
    const initialPassword = `TN@${Math.floor(1000 + Math.random() * 9000)}`;

    const newMentee: User = {
      id: `user_mentee_${Date.now()}`,
      name: menteeData.name,
      email: menteeData.email,
      password: initialPassword,
      role: 'mentee',
      enrollmentNo,
      branch: menteeData.branch,
      year: menteeData.year,
      avatar: '/src/assets/images/avatar_student_ananya_1794399540199.jpg',
      bio: menteeData.bio || 'TechNeeds IGDTUW Mentee',
      interestTags: menteeData.interestTags || ['Web Development', 'Algorithms'],
      assignedProgrammes: menteeData.programmeId ? [menteeData.programmeId] : [],
    };

    this.users.push(newMentee);

    // Initialize progress record
    this.progress[newMentee.id] = {
      menteeId: newMentee.id,
      totalPoints: 100, // Initial welcome points
      rank: Object.keys(this.progress).length + 1,
      streakDays: 1,
      completedResourceIds: [],
      badges: [
        {
          id: 'b_welcome',
          name: 'Cohort Initiate',
          category: 'Onboarding',
          description: 'Successfully joined TechNeeds IGDTUW mentorship ecosystem.',
          icon: 'Sparkles',
          unlockedAt: new Date().toISOString().split('T')[0],
        },
      ],
    };

    // Update programme mentee count
    if (menteeData.programmeId) {
      const prog = this.programmes.find((p) => p.id === menteeData.programmeId);
      if (prog) prog.menteeCount += 1;
    }

    this.recalculateLeaderboard();
    this.persist();
    return { user: newMentee, initialPassword, enrollmentNo };
  }

  // Programmes
  getProgrammes(): Programme[] {
    return this.programmes;
  }

  getProgrammeById(id: string): Programme | undefined {
    return this.programmes.find((p) => p.id === id);
  }

  addProgramme(progData: Omit<Programme, 'id' | 'menteeCount' | 'completionRate'>): Programme {
    const newProg: Programme = {
      ...progData,
      id: `prog_${Date.now()}`,
      menteeCount: 0,
      completionRate: 0,
    };
    this.programmes.push(newProg);
    this.persist();
    return newProg;
  }

  updateProgramme(id: string, updates: Partial<Programme>) {
    const index = this.programmes.findIndex((p) => p.id === id);
    if (index !== -1) {
      this.programmes[index] = { ...this.programmes[index], ...updates };
      this.persist();
    }
  }

  deleteProgramme(id: string) {
    this.programmes = this.programmes.filter((p) => p.id !== id);
    // Remove references
    this.resources = this.resources.filter((r) => r.programmeId !== id);
    this.persist();
  }

  // Resources
  getResources(programmeId?: string, type?: LearningResource['type']): LearningResource[] {
    let list = this.resources;
    if (programmeId) list = list.filter((r) => r.programmeId === programmeId);
    if (type) list = list.filter((r) => r.type === type);
    return list;
  }

  getResourceById(id: string): LearningResource | undefined {
    return this.resources.find((r) => r.id === id);
  }

  addResource(resource: ResourceCreationData): LearningResource {
    const prog = this.programmes.find((p) => p.id === resource.programmeId);
    const newResource = {
      ...resource,
      id: `res_${Date.now()}`,
      createdAt: new Date().toISOString(),
      programmeTitle: prog?.title || 'TechNeeds Programme',
    } as LearningResource;
    this.resources.unshift(newResource);
    this.persist();
    return newResource;
  }

  updateResource(id: string, updates: Partial<LearningResource>) {
    const index = this.resources.findIndex((r) => r.id === id);
    if (index !== -1) {
      this.resources[index] = { ...this.resources[index], ...updates } as LearningResource;
      this.persist();
    }
  }

  deleteResource(id: string) {
    this.resources = this.resources.filter((r) => r.id !== id);
    this.persist();
  }

  // Submissions
  getSubmissions(filter?: {
    menteeId?: string;
    mentorId?: string;
    resourceId?: string;
    programmeId?: string;
    status?: 'pending' | 'graded';
  }): Submission[] {
    let list = this.submissions;
    if (filter?.menteeId) list = list.filter((s) => s.menteeId === filter.menteeId);
    if (filter?.resourceId) list = list.filter((s) => s.resourceId === filter.resourceId);
    if (filter?.programmeId) list = list.filter((s) => s.programmeId === filter.programmeId);
    if (filter?.status) list = list.filter((s) => s.status === filter.status);
    return list;
  }

  submitProject(submissionData: {
    menteeId: string;
    resourceId: string;
    githubUrl: string;
    liveDemoUrl?: string;
    notes?: string;
  }): Submission {
    const mentee = this.users.find((u) => u.id === submissionData.menteeId);
    const resource = this.resources.find((r) => r.id === submissionData.resourceId);

    const newSub: Submission = {
      id: `sub_${Date.now()}`,
      menteeId: submissionData.menteeId,
      menteeName: mentee?.name || 'IGDTUW Mentee',
      menteeEnrollmentNo: mentee?.enrollmentNo || '04201012023',
      resourceId: submissionData.resourceId,
      resourceTitle: resource?.title || 'Technical Project',
      resourceType: 'project',
      programmeId: resource?.programmeId || 'prog_fsw_1',
      submittedAt: new Date().toISOString(),
      status: 'pending',
      maxMarks: resource?.maxMarks || 200,
      projectLinks: {
        githubUrl: submissionData.githubUrl,
        liveDemoUrl: submissionData.liveDemoUrl,
        notes: submissionData.notes,
      },
    };

    // Remove any previous pending submission for same resource
    this.submissions = this.submissions.filter(
      (s) => !(s.menteeId === submissionData.menteeId && s.resourceId === submissionData.resourceId)
    );
    this.submissions.unshift(newSub);
    this.persist();
    return newSub;
  }

  submitQuiz(submissionData: {
    menteeId: string;
    resourceId: string;
    answers: Record<string, number>;
  }): Submission {
    const mentee = this.users.find((u) => u.id === submissionData.menteeId);
    const resource = this.resources.find((r) => r.id === submissionData.resourceId);

    let score = 0;
    const maxMarks = resource?.maxMarks || 100;

    if (resource && resource.type === 'quiz') {
      const qList = resource.questions;
      let correct = 0;
      qList.forEach((q) => {
        if (submissionData.answers[q.id] === q.correctOptionIndex) {
          correct++;
        }
      });
      score = Math.round((correct / qList.length) * maxMarks);
    }

    const newSub: Submission = {
      id: `sub_${Date.now()}`,
      menteeId: submissionData.menteeId,
      menteeName: mentee?.name || 'IGDTUW Mentee',
      menteeEnrollmentNo: mentee?.enrollmentNo || '04201012023',
      resourceId: submissionData.resourceId,
      resourceTitle: resource?.title || 'Diagnostic Quiz',
      resourceType: 'quiz',
      programmeId: resource?.programmeId || 'prog_fsw_1',
      submittedAt: new Date().toISOString(),
      status: 'graded',
      score,
      maxMarks,
      gradedAt: new Date().toISOString(),
      mentorFeedback: `Automated Diagnostic Assessment: ${score}/${maxMarks} marks awarded based on correct options.`,
      quizAnswers: submissionData.answers,
    };

    this.submissions.unshift(newSub);

    // Update mentee progress points & streak
    this.awardPoints(submissionData.menteeId, score, submissionData.resourceId);
    this.persist();
    return newSub;
  }

  gradeSubmission(
    submissionId: string,
    score: number,
    feedback: string,
    mentorId: string
  ): Submission | null {
    const sub = this.submissions.find((s) => s.id === submissionId);
    if (!sub) return null;

    sub.score = score;
    sub.mentorFeedback = feedback;
    sub.status = 'graded';
    sub.gradedByMentorId = mentorId;
    sub.gradedAt = new Date().toISOString();

    // Award points to student
    this.awardPoints(sub.menteeId, score, sub.resourceId);
    this.persist();
    return sub;
  }

  markVideoCompleted(menteeId: string, resourceId: string) {
    const prog = this.getMenteeProgress(menteeId);
    if (!prog.completedResourceIds.includes(resourceId)) {
      prog.completedResourceIds.push(resourceId);
      prog.totalPoints += 50; // Video completion points
      this.recalculateLeaderboard();
      this.persist();
    }
  }

  private awardPoints(menteeId: string, points: number, resourceId: string) {
    const prog = this.getMenteeProgress(menteeId);
    prog.totalPoints += points;
    if (!prog.completedResourceIds.includes(resourceId)) {
      prog.completedResourceIds.push(resourceId);
    }
    this.recalculateLeaderboard();
  }

  private recalculateLeaderboard() {
    const sorted = Object.values(this.progress).sort((a, b) => b.totalPoints - a.totalPoints);
    sorted.forEach((p, idx) => {
      p.rank = idx + 1;
    });
  }

  // Progress & Leaderboard
  getMenteeProgress(menteeId: string): StudentProgress {
    if (!this.progress[menteeId]) {
      this.progress[menteeId] = {
        menteeId,
        totalPoints: 300,
        rank: Object.keys(this.progress).length + 1,
        streakDays: 4,
        completedResourceIds: [],
        badges: [],
      };
    }
    return this.progress[menteeId];
  }

  getLeaderboard(programmeId?: string) {
    let mentees = this.users.filter((u) => u.role === 'mentee');
    if (programmeId) {
      mentees = mentees.filter((m) => m.assignedProgrammes.includes(programmeId));
    }

    const board = mentees.map((m) => {
      const prog = this.getMenteeProgress(m.id);
      return {
        user: m,
        points: prog.totalPoints,
        rank: prog.rank,
        streak: prog.streakDays,
        completedCount: prog.completedResourceIds.length,
        badgesCount: prog.badges.length,
      };
    });

    return board.sort((a, b) => b.points - a.points).map((item, idx) => ({ ...item, rank: idx + 1 }));
  }

  // Reset to initial demo data
  resetDemoData() {
    localStorage.removeItem(STORAGE_KEY_USERS);
    localStorage.removeItem(STORAGE_KEY_PROGRAMMES);
    localStorage.removeItem(STORAGE_KEY_RESOURCES);
    localStorage.removeItem(STORAGE_KEY_SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEY_PROGRESS);
    localStorage.removeItem(STORAGE_KEY_AUTH);
    this.init();
    this.persist();
  }
}

export const store = new DataStore();

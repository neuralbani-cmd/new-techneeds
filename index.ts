export type Role = 'admin' | 'mentor' | 'mentee';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatar: string;
  enrollmentNo?: string;
  branch?: string;
  year?: string;
  bio?: string;
  interestTags?: string[];
  assignedProgrammes: string[];
  phone?: string;
  github?: string;
  linkedin?: string;
}

export interface Programme {
  id: string;
  title: string;
  code: string;
  description: string;
  domain: string;
  track: string;
  status: 'active' | 'upcoming' | 'completed';
  startDate: string;
  endDate: string;
  mentorIds: string[];
  maxMentees: number;
  menteeCount: number;
  completionRate: number;
  tags: string[];
}

export type ResourceType = 'video' | 'quiz' | 'project';

export interface BaseResource {
  id: string;
  programmeId: string;
  programmeTitle?: string;
  title: string;
  topic: string;
  description: string;
  type: ResourceType;
  deadline?: string;
  maxMarks: number;
  createdAt: string;
  createdByMentorId: string;
  creatorName: string;
}

export interface VideoResource extends BaseResource {
  type: 'video';
  videoUrl: string;
  durationMinutes: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface QuizResource extends BaseResource {
  type: 'quiz';
  questions: QuizQuestion[];
  timeLimitMinutes?: number;
}

export interface ProjectResource extends BaseResource {
  type: 'project';
  problemStatement: string;
  techStack: string[];
  submissionInstructions: string;
  rubric: string[];
}

export type LearningResource = VideoResource | QuizResource | ProjectResource;

export type ResourceCreationData =
  | Omit<VideoResource, 'id' | 'createdAt'>
  | Omit<QuizResource, 'id' | 'createdAt'>
  | Omit<ProjectResource, 'id' | 'createdAt'>;

export interface ProjectLinks {
  githubUrl: string;
  liveDemoUrl?: string;
  notes?: string;
}

export interface Submission {
  id: string;
  menteeId: string;
  menteeName: string;
  menteeEnrollmentNo: string;
  resourceId: string;
  resourceTitle: string;
  resourceType: ResourceType;
  programmeId: string;
  submittedAt: string;
  status: 'pending' | 'graded';
  score?: number;
  maxMarks: number;
  mentorFeedback?: string;
  gradedByMentorId?: string;
  gradedAt?: string;
  projectLinks?: ProjectLinks;
  quizAnswers?: Record<string, number>;
}

export interface AchievementBadge {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

export interface StudentProgress {
  menteeId: string;
  totalPoints: number;
  rank: number;
  streakDays: number;
  completedResourceIds: string[];
  badges: AchievementBadge[];
}

export interface AISkillBadge {
  title: string;
  category: string;
  level: string;
  description: string;
}

export interface AIRecommendation {
  topic: string;
  type: string;
  reason: string;
  suggestedAction: string;
}

export interface AIAchievement {
  title: string;
  timestamp: string;
  metricValue: string;
}

export interface AIProfileData {
  technicalIdentity: string;
  performanceSummary: string;
  skillBadges: AISkillBadge[];
  recommendations: AIRecommendation[];
  achievements: AIAchievement[];
  generatedAt: string;
  model: string;
  isDemo: boolean;
}

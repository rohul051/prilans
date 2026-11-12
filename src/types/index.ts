export type UserRole = 'student' | 'client' | 'admin';

export type ExperienceLevel = 'Entry Level' | 'Intermediate' | 'Expert';

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  technologies: string[];
  createdAt: string;
}

export interface Review {
  id: string;
  fromUserId: string;
  fromUserName: string;
  fromUserRole: UserRole;
  toUserId: string;
  projectId: string;
  projectTitle: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  university?: string;
  major?: string;
  bio: string;
  hourlyRate?: number;
  skills: string[];
  experienceLevel: ExperienceLevel;
  portfolio: PortfolioItem[];
  reviews: Review[];
  avgRating: number;
  totalReviews: number;
  location: string;
  verified: boolean;
  hiredCount?: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  experienceLevel: ExperienceLevel;
  projectType: 'Hourly' | 'Fixed Price';
  budget: number;
  budgetUnit: 'hour' | 'project';
  skillsRequired: string[];
  client: {
    id: string;
    name: string;
    email: string;
    country: string;
    verified: boolean;
    viewsCount: number;
    hiredCount: number;
  };
  proposalsCount: number;
  status: 'open' | 'in_progress' | 'completed' | 'closed';
  createdAt: string;
  timeAgo?: string;
  location: string;
}

export type ApplicationStatus = 'pending' | 'under_review' | 'shortlisted' | 'accepted' | 'rejected' | 'completed';

export interface Proposal {
  id: string;
  projectId: string;
  projectTitle: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentEmail: string;
  studentUniversity?: string;
  studentSkills: string[];
  studentExperienceLevel: ExperienceLevel;
  bidAmount: number;
  bidType: 'Hourly' | 'Fixed Price';
  estimatedDays: number;
  coverLetter: string;
  portfolioLink?: string;
  status: ApplicationStatus;
  submittedAt: string;
  clientFeedback?: string;
  studentReviewSubmitted?: boolean;
  clientReviewSubmitted?: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  type: 'proposal' | 'status_update' | 'review' | 'system';
}

export interface FilterState {
  searchQuery: string;
  locationQuery: string;
  category: string;
  experienceLevels: ExperienceLevel[];
  projectType: 'Hourly' | 'Fixed Price' | 'Any';
  budgetRange: string;
  proposalsRange: string;
  onlyRecommended: boolean;
  sortBy: 'newest' | 'highest_budget' | 'lowest_budget' | 'most_proposals';
}


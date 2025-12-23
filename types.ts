
export enum UserRole {
  JOBSEEKER = 'jobseeker',
  RECRUITER = 'recruiter',
  ADMIN = 'admin'
}

export enum ApplicationStatus {
  APPLIED = 'Applied',
  SHORTLISTED = 'Shortlisted',
  INTERVIEW = 'Interview',
  SELECTED = 'Selected',
  REJECTED = 'Rejected'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  resume?: string; // URL or base64
  avatar?: string; // base64 data url
  skills: string[];
  bio?: string;
  createdAt: string;
}

export interface Company {
  id: string;
  name: string;
  location: string;
  website: string;
  description: string;
  logo: string;
  recruiterId: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  salary: number;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  companyId: string;
  createdAt: string;
  active: boolean;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  status: ApplicationStatus;
  appliedAt: string;
  resumeUrl: string;
  coverLetter?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

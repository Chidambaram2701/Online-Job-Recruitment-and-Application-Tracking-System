
import { User, Job, Application, Company, UserRole, ApplicationStatus } from '../types';

const KEYS = {
  USERS: 'hireai_users',
  JOBS: 'hireai_jobs',
  COMPANIES: 'hireai_companies',
  APPLICATIONS: 'hireai_applications',
  SESSION: 'hireai_session'
};

// Seed initial data if empty
const seedData = () => {
  if (!localStorage.getItem(KEYS.USERS)) {
    const admin: User = {
      id: 'admin-1',
      name: 'System Admin',
      email: 'admin@hireai.com',
      role: UserRole.ADMIN,
      skills: [],
      createdAt: new Date().toISOString()
    };
    const recruiter: User = {
      id: 'rec-1',
      name: 'John Recruiter',
      email: 'john@techcorp.com',
      role: UserRole.RECRUITER,
      skills: [],
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(KEYS.USERS, JSON.stringify([admin, recruiter]));
    
    const techCorp: Company = {
      id: 'comp-1',
      name: 'TechCorp Solutions',
      location: 'San Francisco, CA',
      website: 'https://techcorp.io',
      description: 'Leading AI software solutions provider.',
      logo: 'https://picsum.photos/seed/tech/200',
      recruiterId: recruiter.id
    };
    localStorage.setItem(KEYS.COMPANIES, JSON.stringify([techCorp]));

    const jobs: Job[] = [
      {
        id: 'job-1',
        title: 'Senior Frontend Engineer',
        description: 'We are looking for a React expert with deep knowledge of TypeScript and Tailwind CSS.',
        skillsRequired: ['React', 'TypeScript', 'Tailwind', 'Unit Testing'],
        salary: 140000,
        type: 'Full-time',
        companyId: techCorp.id,
        createdAt: new Date().toISOString(),
        active: true
      },
      {
        id: 'job-2',
        title: 'Backend Developer (Node.js)',
        description: 'Scale our APIs and manage MongoDB clusters.',
        skillsRequired: ['Node.js', 'Express', 'MongoDB', 'Redis'],
        salary: 130000,
        type: 'Remote',
        companyId: techCorp.id,
        createdAt: new Date().toISOString(),
        active: true
      }
    ];
    localStorage.setItem(KEYS.JOBS, JSON.stringify(jobs));
  }
};

seedData();

export const StorageService = {
  getUsers: (): User[] => JSON.parse(localStorage.getItem(KEYS.USERS) || '[]'),
  setUsers: (users: User[]) => localStorage.setItem(KEYS.USERS, JSON.stringify(users)),
  
  getJobs: (): Job[] => JSON.parse(localStorage.getItem(KEYS.JOBS) || '[]'),
  setJobs: (jobs: Job[]) => localStorage.setItem(KEYS.JOBS, JSON.stringify(jobs)),
  
  getCompanies: (): Company[] => JSON.parse(localStorage.getItem(KEYS.COMPANIES) || '[]'),
  setCompanies: (companies: Company[]) => localStorage.setItem(KEYS.COMPANIES, JSON.stringify(companies)),
  
  getApplications: (): Application[] => JSON.parse(localStorage.getItem(KEYS.APPLICATIONS) || '[]'),
  setApplications: (apps: Application[]) => localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(apps)),
  
  getSession: (): User | null => JSON.parse(localStorage.getItem(KEYS.SESSION) || 'null'),
  setSession: (user: User | null) => localStorage.setItem(KEYS.SESSION, JSON.stringify(user))
};

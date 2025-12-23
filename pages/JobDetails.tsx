
import React, { useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { Job, Company, User, Application, ApplicationStatus, UserRole } from '../types';
import { GeminiService } from '../services/geminiService';

interface JobDetailsProps {
  jobId: string;
  currentUser: User | null;
  navigateTo: (page: string) => void;
}

const JobDetails: React.FC<JobDetailsProps> = ({ jobId, currentUser, navigateTo }) => {
  const [job, setJob] = useState<Job | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{ score: number; reasons: string[]; advice: string } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const jobs = StorageService.getJobs();
    const companies = StorageService.getCompanies();
    const foundJob = jobs.find(j => j.id === jobId);
    
    if (foundJob) {
      setJob(foundJob);
      const foundCompany = companies.find(c => c.id === foundJob.companyId);
      if (foundCompany) setCompany(foundCompany);

      if (currentUser) {
        const apps = StorageService.getApplications();
        const existingApp = apps.find(a => a.jobId === jobId && a.userId === currentUser.id);
        if (existingApp) setHasApplied(true);
      }
    }
  }, [jobId, currentUser]);

  const handleApply = () => {
    if (!currentUser) {
      navigateTo('login');
      return;
    }
    if (currentUser.role !== UserRole.JOBSEEKER) {
      alert('Only Job Seekers can apply for jobs.');
      return;
    }
    
    setIsApplying(true);
    // Simulate API call
    setTimeout(() => {
      const newApp: Application = {
        id: `app-${Date.now()}`,
        jobId: jobId,
        userId: currentUser.id,
        status: ApplicationStatus.APPLIED,
        appliedAt: new Date().toISOString(),
        resumeUrl: currentUser.resume || 'https://example.com/resume.pdf'
      };
      const apps = StorageService.getApplications();
      StorageService.setApplications([...apps, newApp]);
      setHasApplied(true);
      setIsApplying(false);
    }, 1000);
  };

  const handleAiAnalyze = async () => {
    if (!currentUser || !job) return;
    setIsAnalyzing(true);
    const mockResumeText = `Candidate ${currentUser.name}. Skills: ${currentUser.skills.join(', ')}. Bio: ${currentUser.bio || 'Experienced professional.'}`;
    const analysis = await GeminiService.analyzeJobMatching(mockResumeText, job.description);
    setAiAnalysis(analysis);
    setIsAnalyzing(false);
  };

  if (!job || !company) return <div className="p-20 text-center">Job not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => navigateTo('jobs')}
          className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Back to Jobs
        </button>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center border overflow-hidden mr-6">
                <img src={company.logo} alt={company.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
                <p className="text-gray-600">{company.name} • {company.location} • {job.type}</p>
              </div>
            </div>
            <div>
              {hasApplied ? (
                <div className="bg-green-50 text-green-700 px-6 py-3 rounded-xl font-bold flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Already Applied
                </div>
              ) : (
                <button 
                  onClick={handleApply}
                  disabled={isApplying}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-8 py-3 rounded-xl font-bold shadow-lg transition-all"
                >
                  {isApplying ? 'Processing...' : 'Apply Now'}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 py-6 border-y border-gray-50">
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Salary Range</p>
              <p className="font-bold text-gray-900">${(job.salary / 1000).toFixed(0)}k - ${((job.salary + 30000) / 1000).toFixed(0)}k</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Posted On</p>
              <p className="font-bold text-gray-900">{new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Experience</p>
              <p className="font-bold text-gray-900">3-5 Years</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Location</p>
              <p className="font-bold text-gray-900">{job.type === 'Remote' ? 'Anywhere' : company.location}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Job Description</h2>
            <div className="text-gray-600 leading-relaxed space-y-4">
              <p>{job.description}</p>
              <p>Join our dynamic team at {company.name} where we value innovation and collaboration. As a {job.title}, you will play a critical role in shaping the future of our products.</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map(skill => (
                <span key={skill} className="px-4 py-2 bg-blue-50 text-blue-700 font-medium rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {currentUser && currentUser.role === UserRole.JOBSEEKER && (
            <div className="mt-12 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-2 bg-white rounded-lg shadow-sm mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">AI Match Insight</h3>
                    <p className="text-sm text-gray-500">Analyze how well you fit this role</p>
                  </div>
                </div>
                {!aiAnalysis && (
                  <button 
                    onClick={handleAiAnalyze}
                    disabled={isAnalyzing}
                    className="px-4 py-2 bg-white border border-blue-200 text-blue-600 text-sm font-bold rounded-lg hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
                  </button>
                )}
              </div>

              {aiAnalysis && (
                <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center mb-6">
                    <div className="relative w-20 h-20">
                      <svg className="w-20 h-20">
                        <circle className="text-blue-100" strokeWidth="5" stroke="currentColor" fill="transparent" r="30" cx="40" cy="40" />
                        <circle 
                          className="text-blue-600" 
                          strokeWidth="5" 
                          strokeDasharray={188.4} 
                          strokeDashoffset={188.4 - (188.4 * aiAnalysis.score) / 100} 
                          strokeLinecap="round" 
                          stroke="currentColor" 
                          fill="transparent" 
                          r="30" 
                          cx="40" 
                          cy="40" 
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center font-bold text-lg">{aiAnalysis.score}%</span>
                    </div>
                    <div className="ml-6">
                      <p className="font-bold text-gray-900">Gemini Match Score</p>
                      <p className="text-sm text-gray-600">{aiAnalysis.advice}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {aiAnalysis.reasons.map((reason, idx) => (
                      <div key={idx} className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <p className="text-sm text-gray-700">{reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">About {company.name}</h2>
          <div className="flex flex-wrap items-center gap-6 mb-6">
            <div className="flex items-center text-gray-500">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              {company.location}
            </div>
            <div className="flex items-center text-gray-500">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
              {company.website.replace('https://', '')}
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">{company.description}</p>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;

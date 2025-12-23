
import React, { useState, useMemo } from 'react';
import { StorageService } from '../services/storageService';
import { User, Job, Company, Application, ApplicationStatus, UserRole } from '../types';
import { GeminiService } from '../services/geminiService';

interface RecruiterDashboardProps {
  user: User;
  navigateTo: (page: string, id?: string) => void;
}

const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ user, navigateTo }) => {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applicants'>('jobs');
  const [isCreatingJob, setIsCreatingJob] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', description: '', salary: 80000, type: 'Full-time', skills: '' });
  const [isGeneratingJd, setIsGeneratingJd] = useState(false);
  
  // Make applications stateful to ensure UI updates immediately
  const [allApplications, setAllApplications] = useState<Application[]>(StorageService.getApplications());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const companies = StorageService.getCompanies();
  const myCompany = companies.find(c => c.recruiterId === user.id);
  
  const allJobs = StorageService.getJobs();
  const myJobs = allJobs.filter(j => j.companyId === myCompany?.id);
  
  const filteredApplicants = useMemo(() => {
    return allApplications
      .filter(app => myJobs.some(j => j.id === app.jobId))
      .map(app => {
        const job = myJobs.find(j => j.id === app.jobId);
        const candidate = StorageService.getUsers().find(u => u.id === app.userId);
        return { ...app, job, candidate };
      });
  }, [allApplications, myJobs]);

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myCompany) return;
    
    const job: Job = {
      id: `job-${Date.now()}`,
      title: newJob.title,
      description: newJob.description,
      salary: Number(newJob.salary),
      skillsRequired: newJob.skills.split(',').map(s => s.trim()),
      type: newJob.type as any,
      companyId: myCompany.id,
      createdAt: new Date().toISOString(),
      active: true
    };
    
    StorageService.setJobs([...allJobs, job]);
    setIsCreatingJob(false);
    setNewJob({ title: '', description: '', salary: 80000, type: 'Full-time', skills: '' });
  };

  const handleGenerateJd = async () => {
    if (!newJob.title || !myCompany) return;
    setIsGeneratingJd(true);
    const jd = await GeminiService.generateJobDescription(newJob.title, myCompany.name, newJob.skills.split(','));
    setNewJob({ ...newJob, description: jd });
    setIsGeneratingJd(false);
  };

  const updateAppStatus = (appId: string, status: ApplicationStatus) => {
    const updated = allApplications.map(app => app.id === appId ? { ...app, status } : app);
    StorageService.setApplications(updated);
    setAllApplications(updated);
    
    // Show brief feedback
    const candidateName = filteredApplicants.find(a => a.id === appId)?.candidate?.name || 'Candidate';
    setStatusMessage(`Status for ${candidateName} updated to ${status}`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const getStatusStyles = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPLIED: return 'bg-blue-50 text-blue-600 border-blue-100';
      case ApplicationStatus.SHORTLISTED: return 'bg-teal-50 text-teal-600 border-teal-100';
      case ApplicationStatus.INTERVIEW: return 'bg-orange-50 text-orange-600 border-orange-100';
      case ApplicationStatus.SELECTED: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case ApplicationStatus.REJECTED: return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (!myCompany) return <div className="p-20 text-center">No company profile found for this recruiter.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Toast Notification */}
      {statusMessage && (
        <div className="fixed top-20 right-4 z-[100] animate-in slide-in-from-right-10 duration-300">
          <div className="bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-sm font-medium">{statusMessage}</span>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recruiter Hub</h1>
          <p className="text-gray-500">Managing talent for <span className="text-blue-600 font-semibold">{myCompany.name}</span></p>
        </div>
        <button 
          onClick={() => setIsCreatingJob(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition-all flex items-center group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Post New Job
        </button>
      </div>

      <div className="flex border-b border-gray-200 mb-8">
        <button 
          onClick={() => setActiveTab('jobs')}
          className={`px-8 py-4 font-bold text-sm border-b-2 transition-all ${activeTab === 'jobs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          My Listings ({myJobs.length})
        </button>
        <button 
          onClick={() => setActiveTab('applicants')}
          className={`px-8 py-4 font-bold text-sm border-b-2 transition-all ${activeTab === 'applicants' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Applicants ({filteredApplicants.length})
        </button>
      </div>

      {activeTab === 'jobs' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myJobs.map(job => (
            <div key={job.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${job.active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {job.active ? 'Active' : 'Closed'}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-6 line-clamp-2">{job.description}</p>
              <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-50">
                <span className="text-gray-400 font-medium">{filteredApplicants.filter(a => a.jobId === job.id).length} Candidates</span>
                <button 
                  onClick={() => navigateTo('job-details', job.id)}
                  className="text-blue-600 font-bold hover:underline"
                >
                  Manage Listing
                </button>
              </div>
            </div>
          ))}
          {myJobs.length === 0 && <div className="col-span-full py-20 text-center text-gray-500 bg-white rounded-2xl border border-dashed">You haven't posted any jobs yet.</div>}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Candidate</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Applied For</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Current Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredApplicants.map(app => (
                <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold mr-3 border border-blue-100 overflow-hidden">
                        {app.candidate?.avatar ? (
                          <img src={app.candidate.avatar} className="w-full h-full object-cover" />
                        ) : (
                          app.candidate?.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900">{app.candidate?.name}</div>
                        <div className="text-xs text-gray-500">{app.candidate?.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{app.job?.title}</div>
                    <div className="text-xs text-gray-500">Applied {new Date(app.appliedAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyles(app.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current mr-2 opacity-60" />
                      {app.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <select 
                      onChange={(e) => updateAppStatus(app.id, e.target.value as ApplicationStatus)}
                      value={app.status}
                      className="text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 font-medium text-gray-700 hover:border-blue-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all cursor-pointer"
                    >
                      <option value={ApplicationStatus.APPLIED}>Mark as Applied</option>
                      <option value={ApplicationStatus.SHORTLISTED}>Shortlist</option>
                      <option value={ApplicationStatus.INTERVIEW}>Schedule Interview</option>
                      <option value={ApplicationStatus.SELECTED}>Hire Candidate</option>
                      <option value={ApplicationStatus.REJECTED}>Reject</option>
                    </select>
                  </td>
                </tr>
              ))}
              {filteredApplicants.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center text-gray-500">No applicants yet. Share your job listings to start receiving talent.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isCreatingJob && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Post a New Job</h2>
              <button onClick={() => setIsCreatingJob(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <form onSubmit={handleCreateJob} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Job Title</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={newJob.title}
                    onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                    placeholder="e.g. Senior Frontend Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Job Type</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={newJob.type}
                    onChange={(e) => setNewJob({...newJob, type: e.target.value})}
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Remote</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Required Skills (comma separated)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  value={newJob.skills}
                  onChange={(e) => setNewJob({...newJob, skills: e.target.value})}
                  placeholder="React, TypeScript, Figma..."
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide">Description</label>
                  <button 
                    type="button"
                    onClick={handleGenerateJd}
                    disabled={isGeneratingJd || !newJob.title}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center disabled:opacity-50 transition-all"
                  >
                    <div className={`w-4 h-4 mr-1 ${isGeneratingJd ? 'animate-spin' : ''}`}>
                      <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    {isGeneratingJd ? 'Gemini is writing...' : 'AI Generate JD'}
                  </button>
                </div>
                <textarea 
                  required
                  rows={6}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all"
                  value={newJob.description}
                  onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                  placeholder="Describe the role, responsibilities, and requirements..."
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setIsCreatingJob(false)}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;

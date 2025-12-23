
import React, { useMemo, useState, useEffect } from 'react';
import { StorageService } from '../services/storageService';
import { User, Application, Job, ApplicationStatus } from '../types';

interface UserDashboardProps {
  user: User;
  onUpdateUser?: (user: User) => void;
  navigateTo: (page: string, id?: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, onUpdateUser, navigateTo }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  
  // Form states
  const [editName, setEditName] = useState(user.name);
  const [editEmail, setEditEmail] = useState(user.email);
  const [editBio, setEditBio] = useState(user.bio || '');
  const [editSkills, setEditSkills] = useState<string[]>(user.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Keep form in sync if user prop changes externally
  useEffect(() => {
    setEditName(user.name);
    setEditEmail(user.email);
    setEditBio(user.bio || '');
    setEditSkills(user.skills || []);
  }, [user]);

  const applications = StorageService.getApplications().filter(a => a.userId === user.id);
  const jobs = StorageService.getJobs();
  const companies = StorageService.getCompanies();

  const appData = useMemo(() => {
    return applications.map(app => {
      const job = jobs.find(j => j.id === app.jobId);
      const company = companies.find(c => c.id === job?.companyId);
      return { ...app, job, company };
    });
  }, [applications, jobs, companies]);

  const stats = {
    total: applications.length,
    shortlisted: applications.filter(a => a.status === ApplicationStatus.SHORTLISTED).length,
    selected: applications.filter(a => a.status === ApplicationStatus.SELECTED).length,
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File is too large. Please select a file smaller than 5MB.");
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const updatedUser: User = { ...user, resume: base64String };
      setTimeout(() => {
        if (onUpdateUser) onUpdateUser(updatedUser);
        setIsUploading(false);
      }, 1000);
    };

    reader.onerror = () => {
      alert("Error reading file.");
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert("Please select an image file.");
      return;
    }

    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const updatedUser: User = { ...user, avatar: base64String };
      setTimeout(() => {
        if (onUpdateUser) onUpdateUser(updatedUser);
        setIsUploadingAvatar(false);
      }, 800);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !editSkills.includes(trimmed)) {
      setEditSkills([...editSkills, trimmed]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setEditSkills(editSkills.filter(s => s !== skillToRemove));
  };

  const handleSaveProfile = () => {
    if (!editName.trim() || !editEmail.trim()) {
      alert("Name and Email are required.");
      return;
    }

    const updatedUser: User = {
      ...user,
      name: editName,
      email: editEmail,
      bio: editBio,
      skills: editSkills
    };

    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }
    setIsEditingProfile(false);
  };

  const handleCancelEdit = () => {
    setEditName(user.name);
    setEditEmail(user.email);
    setEditBio(user.bio || '');
    setEditSkills(user.skills || []);
    setIsEditingProfile(false);
  };

  const getStatusBadgeStyles = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPLIED: return 'bg-blue-50 text-blue-600 border-blue-100';
      case ApplicationStatus.SHORTLISTED: return 'bg-teal-50 text-teal-600 border-teal-100';
      case ApplicationStatus.INTERVIEW: return 'bg-orange-50 text-orange-600 border-orange-100';
      case ApplicationStatus.SELECTED: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case ApplicationStatus.REJECTED: return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Career Hub</h1>
            <p className="text-gray-500">Track your applications and professional growth.</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-100 transition-colors">
              <p className="text-sm text-gray-400 mb-1">Applications</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-teal-100 transition-colors">
              <p className="text-sm text-gray-400 mb-1">Shortlisted</p>
              <p className="text-3xl font-bold text-teal-600">{stats.shortlisted}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-emerald-100 transition-colors">
              <p className="text-sm text-gray-400 mb-1">Hired</p>
              <p className="text-3xl font-bold text-emerald-600">{stats.selected}</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-6">Application Journey</h2>
          <div className="space-y-4">
            {appData.length > 0 ? appData.map(app => (
              <div 
                key={app.id} 
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-blue-100 hover:shadow-md transition-all group"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border overflow-hidden mr-4 transition-transform group-hover:scale-105">
                    <img src={app.company?.logo} alt={app.company?.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{app.job?.title}</h3>
                    <p className="text-sm text-gray-500">{app.company?.name} • Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <span className={`px-4 py-1 rounded-full text-xs font-bold border transition-colors ${getStatusBadgeStyles(app.status)}`}>
                    {app.status}
                  </span>
                  <button 
                    onClick={() => navigateTo('job-details', app.jobId)}
                    className="text-gray-300 hover:text-blue-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </div>
              </div>
            )) : (
              <div className="bg-white p-16 rounded-3xl text-center border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-blue-50 text-blue-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-500 mb-8 max-w-xs mx-auto">Your dream job is just a search away. Start exploring opportunities today.</p>
                <button 
                  onClick={() => navigateTo('jobs')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all"
                >
                  Browse Jobs
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-24">
            {!isEditingProfile ? (
              <>
                <div className="text-center mb-8 relative">
                  <div className="relative inline-block group">
                    <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 font-bold text-3xl overflow-hidden border-2 border-white shadow-md relative transition-transform hover:scale-105">
                      {user.avatar ? (
                        <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                      ) : (
                        user.name.charAt(0)
                      )}
                      {isUploadingAvatar && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                          <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-4 right-0 bg-white p-2 rounded-full shadow-lg border border-gray-100 cursor-pointer hover:bg-gray-50 transition-all hover:scale-110 active:scale-95">
                      <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
                    </label>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mt-2">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>

                {user.bio && (
                  <div className="mb-8">
                    <h4 className="font-bold text-gray-900 mb-2 text-xs uppercase tracking-widest text-gray-400">About</h4>
                    <p className="text-sm text-gray-600 italic leading-relaxed bg-gray-50/50 p-4 rounded-xl border border-gray-100/50">"{user.bio}"</p>
                  </div>
                )}
                
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900 text-xs uppercase tracking-widest text-gray-400">Expertise</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user.skills && user.skills.length > 0 ? user.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-blue-50/50 text-blue-600 text-xs font-semibold rounded-lg border border-blue-100">
                        {skill}
                      </span>
                    )) : (
                      <p className="text-xs text-gray-400">No skills added yet.</p>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="font-bold text-gray-900 text-xs uppercase tracking-widest text-gray-400 mb-4">Documents</h4>
                  <div className={`bg-gray-50 p-4 rounded-xl border border-dashed transition-all ${user.resume ? 'border-green-200 bg-green-50/30' : 'border-gray-300'} flex items-center justify-between relative`}>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className={`w-5 h-5 mr-2 ${user.resume ? 'text-green-500' : 'text-red-400'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 18h12V6h-4V2H4v16zm2-14h4v4h4v8H6V4z"/>
                      </svg>
                      <span className="truncate max-w-[120px] font-medium">
                        {user.resume ? 'resume_latest.pdf' : 'No resume found'}
                      </span>
                    </div>
                    
                    <label className="cursor-pointer">
                      <span className={`text-xs font-bold transition-colors ${isUploading ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'}`}>
                        {isUploading ? 'Uploading...' : user.resume ? 'Update' : 'Upload'}
                      </span>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept=".pdf,.doc,.docx" 
                        disabled={isUploading}
                        onChange={handleFileUpload}
                      />
                    </label>
                  </div>
                </div>

                <button 
                  onClick={() => setIsEditingProfile(true)}
                  className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-md active:scale-95"
                >
                  Manage Profile
                </button>
              </>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">Edit Profile</h3>
                  <button onClick={handleCancelEdit} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1.5 tracking-wide">Bio</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-none transition-all"
                    placeholder="Tell us about your professional journey..."
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">Skills & Expertise</label>
                  <div className="flex gap-2 mb-3">
                    <input 
                      type="text" 
                      className="flex-grow px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
                      placeholder="e.g. React"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    />
                    <button 
                      onClick={handleAddSkill}
                      className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all text-sm active:scale-95"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                    {editSkills.map(skill => (
                      <span key={skill} className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200">
                        {skill}
                        <button onClick={() => handleRemoveSkill(skill)} className="ml-2 text-gray-400 hover:text-red-500 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 space-y-3">
                  <button 
                    onClick={handleSaveProfile}
                    className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 active:scale-95"
                  >
                    Save Profile
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    className="w-full py-3.5 bg-white text-gray-500 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;


import React, { useState, useMemo } from 'react';
import { StorageService } from '../services/storageService';
import { Job, Company } from '../types';

interface JobBoardProps {
  navigateTo: (page: string, id?: string) => void;
}

const JobBoard: React.FC<JobBoardProps> = ({ navigateTo }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  
  const jobs = StorageService.getJobs().filter(j => j.active);
  const companies = StorageService.getCompanies();

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const company = companies.find(c => c.id === job.companyId);
      const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company?.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'All' || job.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [jobs, companies, searchTerm, typeFilter]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Opportunities</h1>
          <p className="text-gray-500">Find the perfect role from over {jobs.length} open positions</p>
        </div>
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by title or company..."
              className="pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>
          <select 
            className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? filteredJobs.map(job => {
          const company = companies.find(c => c.id === job.companyId);
          return (
            <div 
              key={job.id} 
              className="group bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-pointer"
              onClick={() => navigateTo('job-details', job.id)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center border overflow-hidden">
                  <img src={company?.logo} alt={company?.name} className="w-full h-full object-cover" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  job.type === 'Remote' ? 'bg-purple-50 text-purple-600' : 
                  job.type === 'Full-time' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
                }`}>
                  {job.type}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">{job.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{company?.name} • {company?.location}</p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {job.skillsRequired.slice(0, 3).map(skill => (
                  <span key={skill} className="px-2 py-1 bg-gray-50 text-gray-500 text-xs rounded-md">
                    {skill}
                  </span>
                ))}
                {job.skillsRequired.length > 3 && (
                  <span className="px-2 py-1 bg-gray-50 text-gray-400 text-xs rounded-md">+{job.skillsRequired.length - 3}</span>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <p className="text-sm font-semibold text-gray-900">
                  ${(job.salary / 1000).toFixed(0)}k <span className="text-gray-400 font-normal">/ year</span>
                </p>
                <button className="text-blue-600 font-medium text-sm flex items-center group-hover:translate-x-1 transition-transform">
                  View Details
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">No jobs found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobBoard;

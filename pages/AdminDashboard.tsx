
import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { User, Job, Company, UserRole } from '../types';

interface AdminDashboardProps {
  user: User;
  navigateTo: (page: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, navigateTo }) => {
  const [users, setUsers] = useState<User[]>(StorageService.getUsers());
  const [jobs, setJobs] = useState<Job[]>(StorageService.getJobs());
  const [companies, setCompanies] = useState<Company[]>(StorageService.getCompanies());

  const deleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      const updated = users.filter(u => u.id !== userId);
      StorageService.setUsers(updated);
      setUsers(updated);
    }
  };

  const toggleJobStatus = (jobId: string) => {
    const updated = jobs.map(j => j.id === jobId ? { ...j, active: !j.active } : j);
    StorageService.setJobs(updated);
    setJobs(updated);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-400 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-gray-900">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-400 mb-1">Active Jobs</p>
          <p className="text-3xl font-bold text-blue-600">{jobs.filter(j => j.active).length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-400 mb-1">Companies</p>
          <p className="text-3xl font-bold text-indigo-600">{companies.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">Recent Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map(u => (
                  <tr key={u.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-bold text-gray-900">{u.name}</div>
                      <div className="text-gray-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-bold capitalize ${
                        u.role === UserRole.ADMIN ? 'bg-purple-50 text-purple-600' :
                        u.role === UserRole.RECRUITER ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button 
                        onClick={() => deleteUser(u.id)}
                        disabled={u.role === UserRole.ADMIN}
                        className="text-red-600 hover:text-red-900 disabled:opacity-30"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50 flex justify-between items-center">
            <h2 className="font-bold text-gray-900">Job Oversight</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobs.map(j => (
                  <tr key={j.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-bold text-gray-900">{j.title}</div>
                      <div className="text-gray-500">{companies.find(c => c.id === j.companyId)?.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${j.active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        {j.active ? 'Visible' : 'Hidden'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button 
                        onClick={() => toggleJobStatus(j.id)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        {j.active ? 'Hide' : 'Publish'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

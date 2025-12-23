
import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { User, UserRole } from '../types';

interface RegisterProps {
  onRegister: (user: User) => void;
  navigateTo: (page: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, navigateTo }) => {
  const [role, setRole] = useState<UserRole>(UserRole.JOBSEEKER);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', skills: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: `user-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: role,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      createdAt: new Date().toISOString()
    };
    
    const users = StorageService.getUsers();
    StorageService.setUsers([...users, newUser]);
    
    // If recruiter, auto-create a sample company
    if (role === UserRole.RECRUITER) {
      const companies = StorageService.getCompanies();
      StorageService.setCompanies([...companies, {
        id: `comp-${Date.now()}`,
        name: `${formData.name}'s New Startup`,
        location: 'Remote',
        website: 'https://new-startup.io',
        description: 'A growing company looking for great talent.',
        logo: 'https://picsum.photos/seed/new/200',
        recruiterId: newUser.id
      }]);
    }
    
    onRegister(newUser);
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Join HireAI</h1>
          <p className="text-gray-500">Create your account to get started</p>
        </div>

        <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
          <button 
            onClick={() => setRole(UserRole.JOBSEEKER)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === UserRole.JOBSEEKER ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            Job Seeker
          </button>
          <button 
            onClick={() => setRole(UserRole.RECRUITER)}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === UserRole.RECRUITER ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            Recruiter
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="name@mail.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Min. 8 characters"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Skills / Expertise (comma separated)</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="React, Design, Python..."
              value={formData.skills}
              onChange={(e) => setFormData({...formData, skills: e.target.value})}
            />
          </div>
          
          <p className="text-xs text-gray-400">
            By clicking Register, you agree to our Terms of Service and Privacy Policy.
          </p>

          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg"
          >
            Register Account
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account? <button onClick={() => navigateTo('login')} className="font-bold text-blue-600 hover:underline">Sign In</button>
        </p>
      </div>
    </div>
  );
};

export default Register;

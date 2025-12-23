
import React, { useState } from 'react';
import { StorageService } from '../services/storageService';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  navigateTo: (page: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, navigateTo }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = StorageService.getUsers();
    const user = users.find(u => u.email === email);
    
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials. Try admin@hireai.com or john@techcorp.com');
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center">
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl w-full max-w-md">
        <div className="text-center mb-10">
          <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">H</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500">Sign in to your HireAI account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-bold text-gray-700">Password</label>
              <a href="#" className="text-sm font-bold text-blue-600 hover:underline">Forgot?</a>
            </div>
            <input 
              type="password" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Sign In
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Don't have an account? <button onClick={() => navigateTo('register')} className="font-bold text-blue-600 hover:underline">Register now</button>
        </p>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-center text-xs text-gray-400 mb-4 uppercase tracking-widest font-bold">Demo Accounts</p>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => { setEmail('admin@hireai.com'); setPassword('password'); }}
              className="text-xs bg-gray-50 p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              Admin Demo
            </button>
            <button 
              onClick={() => { setEmail('john@techcorp.com'); setPassword('password'); }}
              className="text-xs bg-gray-50 p-2 rounded-lg hover:bg-gray-100 text-gray-600"
            >
              Recruiter Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;


import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  navigateTo: (page: string) => void;
  currentPage: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, navigateTo, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = (page: string) => `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    currentPage === page ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
  }`;

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer" 
              onClick={() => navigateTo('home')}
            >
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">HireAI</span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              <button onClick={() => navigateTo('home')} className={linkClass('home')}>Home</button>
              <button onClick={() => navigateTo('jobs')} className={linkClass('jobs')}>Browse Jobs</button>
              {user && <button onClick={() => navigateTo('dashboard')} className={linkClass('dashboard')}>Dashboard</button>}
            </div>
          </div>
          
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right mr-2">
                  <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
                {user.avatar ? (
                  <img src={user.avatar} className="h-10 w-10 rounded-full border border-gray-200 object-cover" alt={user.name} />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {user.name.charAt(0)}
                  </div>
                )}
                <button 
                  onClick={onLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-all ml-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={() => navigateTo('login')}
                  className="text-gray-600 hover:text-blue-600 px-4 py-2 text-sm font-medium"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigateTo('register')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium shadow-sm transition-all"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden bg-white border-b border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button onClick={() => { navigateTo('home'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Home</button>
            <button onClick={() => { navigateTo('jobs'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Browse Jobs</button>
            {user && <button onClick={() => { navigateTo('dashboard'); setIsOpen(false); }} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-50">Dashboard</button>}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 px-4">
            {user ? (
              <button onClick={() => { onLogout(); setIsOpen(false); }} className="block w-full text-center py-2 text-base font-medium text-red-600">Logout</button>
            ) : (
              <div className="space-y-2">
                <button onClick={() => { navigateTo('login'); setIsOpen(false); }} className="block w-full text-center py-2 text-base font-medium text-gray-700">Sign In</button>
                <button onClick={() => { navigateTo('register'); setIsOpen(false); }} className="block w-full text-center py-3 text-base font-medium text-white bg-blue-600 rounded-lg">Register</button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

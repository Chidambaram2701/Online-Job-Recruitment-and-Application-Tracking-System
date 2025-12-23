
import React, { useState, useEffect } from 'react';
import { StorageService } from './services/storageService';
import { User, UserRole } from './types';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import JobBoard from './pages/JobBoard';
import JobDetails from './pages/JobDetails';
import UserDashboard from './pages/UserDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import AdminDashboard from './pages/AdminDashboard';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  useEffect(() => {
    const session = StorageService.getSession();
    if (session) setCurrentUser(session);
  }, []);

  const handleLogin = (user: User) => {
    StorageService.setSession(user);
    setCurrentUser(user);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    StorageService.setSession(null);
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleUpdateUser = (updatedUser: User) => {
    // Update local storage users list
    const allUsers = StorageService.getUsers();
    const newUsers = allUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
    StorageService.setUsers(newUsers);
    
    // Update session and state
    StorageService.setSession(updatedUser);
    setCurrentUser(updatedUser);
  };

  const navigateTo = (page: string, id: string | null = null) => {
    setCurrentPage(page);
    setSelectedJobId(id);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home navigateTo={navigateTo} />;
      case 'login':
        return <Login onLogin={handleLogin} navigateTo={navigateTo} />;
      case 'register':
        return <Register onRegister={handleLogin} navigateTo={navigateTo} />;
      case 'jobs':
        return <JobBoard navigateTo={navigateTo} />;
      case 'job-details':
        return selectedJobId ? <JobDetails jobId={selectedJobId} currentUser={currentUser} navigateTo={navigateTo} /> : <JobBoard navigateTo={navigateTo} />;
      case 'dashboard':
        if (!currentUser) return <Login onLogin={handleLogin} navigateTo={navigateTo} />;
        if (currentUser.role === UserRole.JOBSEEKER) return <UserDashboard user={currentUser} onUpdateUser={handleUpdateUser} navigateTo={navigateTo} />;
        if (currentUser.role === UserRole.RECRUITER) return <RecruiterDashboard user={currentUser} navigateTo={navigateTo} />;
        if (currentUser.role === UserRole.ADMIN) return <AdminDashboard user={currentUser} navigateTo={navigateTo} />;
        return <Home navigateTo={navigateTo} />;
      default:
        return <Home navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        user={currentUser} 
        onLogout={handleLogout} 
        navigateTo={navigateTo} 
        currentPage={currentPage}
      />
      <main className="flex-grow pt-16">
        {renderPage()}
      </main>
      <footer className="bg-white border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} HireAI - Smart Recruitment Platform. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;


import React from 'react';

interface HomeProps {
  navigateTo: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ navigateTo }) => {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-20 lg:pt-32 lg:pb-32">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center -mx-4">
            <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
              <div className="max-w-lg">
                <span className="inline-block py-1 px-3 mb-4 text-xs font-semibold text-blue-600 bg-blue-50 rounded-full uppercase tracking-wider">
                  The Intelligent ATS for Teams
                </span>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Hire Smarter, <span className="text-blue-600 underline decoration-blue-200 decoration-8 underline-offset-4">Not Harder</span>
                </h1>
                <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                  Connect top talent with innovative companies. Our AI-powered recruitment engine helps you find the perfect match in seconds.
                </p>
                <div className="flex flex-wrap -mx-2">
                  <button 
                    onClick={() => navigateTo('jobs')}
                    className="w-full sm:w-auto px-8 py-4 mb-2 sm:mb-0 sm:mr-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg transition-all"
                  >
                    Browse Jobs
                  </button>
                  <button 
                    onClick={() => navigateTo('register')}
                    className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-gray-900 bg-white border border-gray-200 hover:border-gray-300 rounded-xl shadow-sm transition-all"
                  >
                    Post a Job
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 px-4">
              <div className="relative">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse"></div>
                <div className="absolute -bottom-8 right-0 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-pulse delay-700"></div>
                <img 
                  src="https://picsum.photos/seed/hiring/800/600" 
                  alt="Recruitment" 
                  className="relative rounded-2xl shadow-2xl border-4 border-white"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 hidden sm:block">
                  <div className="flex items-center space-x-4 mb-2">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">AI Match Success!</p>
                      <p className="text-xs text-gray-500">98% Fit for Senior dev</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-12 bg-white border-y">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap -mx-4 text-center">
            <div className="w-1/2 md:w-1/4 px-4 mb-8 md:mb-0">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">12k+</h3>
              <p className="text-gray-500 font-medium">Active Jobs</p>
            </div>
            <div className="w-1/2 md:w-1/4 px-4 mb-8 md:mb-0">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">45k+</h3>
              <p className="text-gray-500 font-medium">Job Seekers</p>
            </div>
            <div className="w-1/2 md:w-1/4 px-4">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">3.5k+</h3>
              <p className="text-gray-500 font-medium">Companies</p>
            </div>
            <div className="w-1/2 md:w-1/4 px-4">
              <h3 className="text-4xl font-bold text-blue-600 mb-2">8k+</h3>
              <p className="text-gray-500 font-medium">Successful Hires</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything you need to hire efficiently</h2>
            <p className="text-gray-600">Our platform handles the entire recruitment cycle from job posting to candidate onboarding.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Matching</h3>
              <p className="text-gray-600">Gemini AI analyzes resumes against job descriptions to score and rank candidates automatically.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">One-Click Apply</h3>
              <p className="text-gray-600">Job seekers can apply to multiple roles with a single click using their stored profile and resume.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
              <p className="text-gray-600">Track application status, interview schedules, and hiring velocity in a clean dashboard.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

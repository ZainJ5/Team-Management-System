import React, { useState, useEffect } from 'react';
import SignUp from '../components/SignUpForm';
import Login from '../components/LoginForm';
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth() {
  const [activeTab, setActiveTab] = useState('login');
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-100 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-4xl"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Team <span className="text-amber-600">Management</span>
          </h1>
          <p className="mt-2 text-gray-600 text-lg font-medium">
            Streamline collaboration and boost productivity
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
          <div className="hidden md:block w-2/5 bg-gradient-to-br from-navy-800 to-navy-600 p-10 text-white relative">
            <div className="h-full flex flex-col justify-between">
              <div>
                <h2 className="text-3xl text-amber-600 font-extrabold mb-6">Welcome Aboard!</h2>
                <p className=" mb-4 text-black font-medium">
                  Empower your team with our platform's powerful features:
                </p>
                <ul className="space-y-4 text-gray-600">
                  {[
                    'Task Assignment & Tracking', 
                    'Team Collaboration', 
                    'Team Management', 
                    'Team Creation'
                  ].map((item, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
                      className="flex items-center"
                    >
                      <svg className="w-5 h-5 mr-3 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-8">
                <p className="text-sm text-gray-800 italic font-medium">
                  "Unleash your team's potential with tools designed for success."
                </p>
              </div>
            </div>
            
            <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-amber-600 opacity-30"></div>
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-navy-400 opacity-10"></div>
          </div>

          <div className="w-full md:w-3/5 p-10">
            <div className="flex space-x-2 mb-8">
              <TabButton 
                active={activeTab === 'login'} 
                onClick={() => setActiveTab('login')}
                label="Sign In"
              />
              <TabButton 
                active={activeTab === 'signup'} 
                onClick={() => setActiveTab('signup')}
                label="Create Account"
              />
            </div>

            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: activeTab === 'login' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeTab === 'login' ? 20 : -20 }}
                  transition={{ duration: 0.3 }}
                  className="w-full"
                >
                  {activeTab === 'login' ? (
                    <div>
                      <Login />
                      <div className="mt-6 text-center">
                        <p className="text-gray-600 font-medium">
                          Don't have an account?{' '}
                          <button
                            onClick={() => setActiveTab('signup')}
                            className="font-semibold text-amber-600 hover:text-amber-700 focus:outline-none transition-colors"
                          >
                            Create an account
                          </button>
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <SignUp />
                      <div className="mt-6 text-center">
                        <p className="text-gray-600 font-medium">
                          Already have an account?{' '}
                          <button
                            onClick={() => setActiveTab('login')}
                            className="font-semibold text-amber-600 hover:text-amber-700 focus:outline-none transition-colors"
                          >
                            Sign in
                          </button>
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="text-center mt-6 text-gray-500 text-sm font-medium">
          © {new Date().getFullYear()} Team Management App. All rights reserved.
        </div>
      </motion.div>
    </div>
  );
}

const TabButton = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300 ${
      active
        ? 'bg-amber-600 text-white shadow-lg'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    {label}
  </button>
);
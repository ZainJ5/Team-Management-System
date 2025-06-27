import React from 'react';

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-white shadow-lg border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="bg-amber-600 p-2 rounded-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
              <p className="text-sm text-gray-600">Welcome, {user?.name || user?.email || 'User'}!</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
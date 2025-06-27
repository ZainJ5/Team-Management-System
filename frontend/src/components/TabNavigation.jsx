import React from 'react';

export default function TabNavigation({ activeTab, onTabChange }) {
  const tabs = ['overview', 'teams', 'tasks'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex space-x-1 bg-amber-100 p-1 rounded-xl">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold capitalize transition-all ${
              activeTab === tab
                ? 'bg-white text-amber-600 shadow-md'
                : 'text-amber-700 hover:text-amber-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
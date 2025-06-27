import React from 'react';

export default function TeamGrid({ 
  teams, 
  loading, 
  user, 
  onCreateTeam, 
  onDeleteTeam, 
  onAddMember, 
  onViewTasks 
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-xl border border-amber-200 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 715.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 919.288 0M15 7a3 3 0 11-6 0 3 3 0 616 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No teams yet</h3>
        <p className="text-gray-600 mb-4">Create your first team to start collaborating</p>
        <button
          onClick={onCreateTeam}
          className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold"
        >
          Create Your First Team
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {teams.map((team) => (
        <div key={team.id} className="bg-white rounded-2xl p-6 shadow-xl border border-amber-200 hover:shadow-2xl transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{team.name || `Team #${team.id}`}</h3>
              <p className="text-gray-600 text-sm">{team.description || 'No description'}</p>
              <p className="text-xs text-gray-500 mt-1">
                {team.member_count || 0} member{team.member_count !== 1 ? 's' : ''}
              </p>
              <p className="text-xs text-gray-500">
                Created by: {team.creator_name || `User #${team.created_by}`}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onAddMember(team.id)}
                className="p-2 text-amber-600 hover:bg-amber-100 rounded-lg transition-colors"
                title="Add Member"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </button>
              {team.created_by === user.id && (
                <button
                  onClick={() => onDeleteTeam(team.id)}
                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                  title="Delete Team"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => onViewTasks(team)}
            className="w-full py-2 px-4 bg-amber-100 text-amber-700 rounded-lg hover:bg-amber-200 transition-colors font-semibold"
          >
            View Tasks
          </button>
        </div>
      ))}
    </div>
  );
}
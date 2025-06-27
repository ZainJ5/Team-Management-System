import React from 'react';

export default function TaskGrid({ tasks, selectedTeam, user, onCompleteTask, onCreateTask }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!selectedTeam) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a team to view tasks</h3>
        <p className="text-gray-600">Choose a team from the dropdown above to see its tasks</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No tasks in this team</h3>
        <p className="text-gray-600 mb-4">Create your first task to get started</p>
        <button
          onClick={onCreateTask}
          className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold"
        >
          Create Task
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <div key={task.id} className={`bg-white rounded-2xl p-6 shadow-xl border border-amber-200 ${task.completed ? 'opacity-75' : ''}`}>
          <div className="flex justify-between items-start mb-3">
            <h3 className={`text-lg font-bold flex-1 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ml-2 ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
          </div>
          <p className="text-gray-600 mb-4 text-sm">{task.description}</p>
          
          <div className="text-xs text-gray-500 mb-4">
            <p>Created by: {task.creator_name || `User #${task.created_by}`}</p>
            {task.assigned_user_name && (
              <p>Assigned to: {task.assigned_user_name}</p>
            )}
            {task.due_date && (
              <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
            )}
          </div>

          {!task.completed && task.assigned_to === user.id && (
            <button
              onClick={() => onCompleteTask(task.id)}
              className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Mark Complete
            </button>
          )}
          {task.completed && (
            <div className="w-full py-2 px-4 bg-green-100 text-green-700 rounded-lg text-center font-semibold">
              ✓ Completed
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
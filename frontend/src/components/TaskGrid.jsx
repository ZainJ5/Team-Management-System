import React from 'react';

export default function TaskGrid({ tasks, selectedTeam, user, onCompleteTask, onDeleteTask, onCreateTask }) {
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
      <div className="text-center py-8 sm:py-12 px-4">
        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Select a team to view tasks</h3>
        <p className="text-sm sm:text-base text-gray-600 px-4">Choose a team from the dropdown above to see its tasks</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No tasks in this team</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 px-4">Create your first task to get started</p>
        <button
          onClick={onCreateTask}
          className="px-4 py-2 sm:px-6 sm:py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold text-sm sm:text-base"
        >
          Create Task
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      {tasks.map((task) => (
        <div key={task.id} className={`bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 shadow-md sm:shadow-lg md:shadow-xl border border-amber-200 ${task.completed ? 'opacity-75' : ''} break-words`}>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 gap-2">
            <h3 className={`text-sm sm:text-base md:text-lg font-bold flex-1 leading-tight break-words ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
              {task.title}
            </h3>
            <div className="flex items-center justify-between sm:justify-end space-x-1 sm:space-x-2 flex-shrink-0">
              <span className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-semibold border ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              {task.created_by === user.id && (
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors flex-shrink-0"
                  title="Delete task"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed break-words">{task.description}</p>
          
          <div className="text-xs text-gray-500 mb-3 sm:mb-4 space-y-1">
            <p className="break-words">Created by: {task.creator_name || `User #${task.created_by}`}</p>
            {task.assigned_user_name && (
              <p className="break-words">Assigned to: {task.assigned_user_name}</p>
            )}
            {task.due_date && (
              <p>Due: {new Date(task.due_date).toLocaleDateString()}</p>
            )}
          </div>

          {!task.completed && task.assigned_to === user.id && (
            <button
              onClick={() => onCompleteTask(task.id)}
              className="w-full py-2 px-3 sm:px-4 bg-green-600 text-white rounded-md sm:rounded-lg hover:bg-green-700 transition-colors font-semibold text-xs sm:text-sm"
            >
              Mark Complete
            </button>
          )}
          {task.completed && (
            <div className="w-full py-2 px-3 sm:px-4 bg-green-100 text-green-700 rounded-md sm:rounded-lg text-center font-semibold text-xs sm:text-sm">
              ✓ Completed
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
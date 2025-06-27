import React from 'react';
import Modal from './Model';
import Input from './Input';

export default function CreateTaskModal({ 
  isOpen, 
  onClose, 
  taskForm, 
  setTaskForm, 
  onSubmit,
  teams,
  users 
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
    >
      <form onSubmit={onSubmit}>
        <Input
          label="Task Title"
          name="title"
          value={taskForm.title}
          onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
          placeholder="Enter task title"
          required
        />
        <Input
          label="Description"
          type="textarea"
          name="description"
          value={taskForm.description}
          onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
          placeholder="Describe the task"
        />
        <Input
          label="Team"
          type="select"
          name="team_id"
          value={taskForm.team_id}
          onChange={(e) => setTaskForm({ ...taskForm, team_id: e.target.value })}
          options={[
            { value: '', label: 'Select Team' },
            ...teams.map(team => ({ value: team.id, label: team.name || `Team #${team.id}` }))
          ]}
          required
        />
        <Input
          label="Priority"
          type="select"
          name="priority"
          value={taskForm.priority}
          onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
          options={[
            { value: 'low', label: 'Low Priority' },
            { value: 'medium', label: 'Medium Priority' },
            { value: 'high', label: 'High Priority' }
          ]}
        />
        <Input
          label="Assign To"
          type="select"
          name="assigned_to"
          value={taskForm.assigned_to}
          onChange={(e) => setTaskForm({ ...taskForm, assigned_to: e.target.value })}
          options={[
            { value: '', label: 'Assign to myself' },
            ...users.map(userItem => ({ 
              value: userItem.id, 
              label: `${userItem.name} (${userItem.email})` 
            }))
          ]}
        />
        <Input
          label="Due Date"
          type="date"
          name="due_date"
          value={taskForm.due_date}
          onChange={(e) => setTaskForm({ ...taskForm, due_date: e.target.value })}
        />
        <button
          type="submit"
          className="w-full py-3 px-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
        >
          Create Task
        </button>
      </form>
    </Modal>
  );
}
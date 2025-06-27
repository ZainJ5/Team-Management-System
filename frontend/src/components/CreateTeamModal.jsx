import React from 'react';
import Modal from './Model';
import Input from './Input';

export default function CreateTeamModal({ 
  isOpen, 
  onClose, 
  teamForm, 
  setTeamForm, 
  onSubmit 
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Team"
    >
      <form onSubmit={onSubmit}>
        <Input
          label="Team Name"
          name="name"
          value={teamForm.name}
          onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })}
          placeholder="Enter team name"
          required
        />
        <Input
          label="Description"
          type="textarea"
          name="description"
          value={teamForm.description}
          onChange={(e) => setTeamForm({ ...teamForm, description: e.target.value })}
          placeholder="Describe your team's purpose"
        />
        <button
          type="submit"
          className="w-full py-3 px-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
        >
          Create Team
        </button>
      </form>
    </Modal>
  );
}
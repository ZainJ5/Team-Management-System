import React from 'react';
import Modal from './Model';
import Input from './Input';

export default function AddMemberModal({ 
  isOpen, 
  onClose, 
  memberForm, 
  setMemberForm, 
  onSubmit,
  availableUsers 
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Team Member"
    >
      <form onSubmit={onSubmit}>
        <Input
          label="Select User"
          type="select"
          name="user_id"
          value={memberForm.user_id}
          onChange={(e) => setMemberForm({ ...memberForm, user_id: e.target.value })}
          options={[
            { value: '', label: availableUsers.length > 0 ? 'Select a user' : 'No available users' },
            ...availableUsers.map(userItem => ({ 
              value: userItem.id, 
              label: `${userItem.name} (${userItem.email})` 
            }))
          ]}
          required
          disabled={availableUsers.length === 0}
        />
        {availableUsers.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">All users are already members of this team.</p>
        )}
        <button
          type="submit"
          disabled={availableUsers.length === 0 || !memberForm.user_id}
          className="w-full py-3 px-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Member
        </button>
      </form>
    </Modal>
  );
}
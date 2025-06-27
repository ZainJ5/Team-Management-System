import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p>Welcome, {user?.name || user?.email || 'User'}!</p>
      <button 
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
}
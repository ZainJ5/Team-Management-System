import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import axios from 'axios';
import toast from 'react-hot-toast';

import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import TabNavigation from '../components/TabNavigation';
import StatsCards from '../components/StatsCards';
import RecentActivity from '../components/RecentActivity';
import TeamGrid from '../components/TeamGrid';
import TaskGrid from '../components/TaskGrid';
import CreateTeamModal from '../components/CreateTeamModal';
import CreateTaskModal from '../components/CreateTaskModal';
import AddMemberModal from '../components/AddMemberModal';

export default function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [userStats, setUserStats] = useState({
    teams: 0,
    total_tasks: 0,
    active_tasks: 0,
    completed_tasks: 0
  });
  const [loading, setLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  
  const [teamForm, setTeamForm] = useState({ name: '', description: '' });
  const [taskForm, setTaskForm] = useState({ 
    title: '', 
    description: '', 
    team_id: '', 
    assigned_to: '',
    priority: 'medium',
    due_date: ''
  });
  const [memberForm, setMemberForm] = useState({ team_id: '', user_id: '' });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && !authLoading) {
      fetchTeams();
      fetchUsers();
      fetchUserActivity();
      fetchUserStats();
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (selectedTeam) {
      fetchTasks(selectedTeam.id);
    }
  }, [selectedTeam]);

  useEffect(() => {
    if (showAddMemberModal && memberForm.team_id) {
      fetchAvailableUsers(memberForm.team_id);
    }
  }, [showAddMemberModal, memberForm.team_id]);

  const handleApiError = (error, defaultMessage) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login again.');
      logout();
      return;
    }
    toast.error(error.response?.data?.error || defaultMessage);
  };

  const fetchUserActivity = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/tasks/user-activity`);
      setUserActivity(response.data);
    } catch (error) {
      handleApiError(error, 'Failed to fetch user activity');
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/tasks/user-stats`);
      setUserStats(response.data);
    } catch (error) {
      handleApiError(error, 'Failed to fetch user stats');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/users`);
      setUsers(response.data);
    } catch (error) {
      handleApiError(error, 'Failed to fetch users');
    }
  };

  const fetchAvailableUsers = async (teamId) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/teams/available-users/${teamId}`);
      setAvailableUsers(response.data);
    } catch (error) {
      handleApiError(error, 'Failed to fetch available users');
    }
  };

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/teams/allteams`);
      setTeams(response.data);
    } catch (error) {
      handleApiError(error, 'Failed to fetch teams');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (teamId) => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/tasks/teamtasks/${teamId}/${user.id}`);
      setTasks(response.data);
    } catch (error) {
      handleApiError(error, 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTeam = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/teams/createteam`, {
        user_id: user.id,
        name: teamForm.name,
        description: teamForm.description
      });
      toast.success('Team created successfully!');
      setShowCreateTeamModal(false);
      setTeamForm({ name: '', description: '' });
      fetchTeams();
      fetchUserStats();
    } catch (error) {
      handleApiError(error, 'Failed to create team');
    }
  };

  const deleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team? This will also delete all tasks in this team.')) {
      try {
        await axios.post(`${import.meta.env.VITE_BASE_URL}/api/teams/deleteteam/${teamId}`, {
          user_id: user.id
        });
        toast.success('Team deleted successfully!');
        fetchTeams();
        fetchUserActivity();
        fetchUserStats();
        if (selectedTeam?.id === teamId) {
          setSelectedTeam(null);
          setTasks([]);
        }
      } catch (error) {
        handleApiError(error, 'Failed to delete team');
      }
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/tasks/createtask`, {
        created_by: user.id,
        assigned_to: taskForm.assigned_to ? parseInt(taskForm.assigned_to) : user.id,
        team_id: parseInt(taskForm.team_id),
        title: taskForm.title,
        description: taskForm.description,
        priority: taskForm.priority,
        due_date: taskForm.due_date || null
      });
      toast.success('Task created successfully!');
      setShowCreateTaskModal(false);
      setTaskForm({ title: '', description: '', team_id: '', assigned_to: '', priority: 'medium', due_date: '' });
      fetchUserActivity();
      fetchUserStats();
      if (selectedTeam) {
        fetchTasks(selectedTeam.id);
      }
    } catch (error) {
      handleApiError(error, 'Failed to create task');
    }
  };

  const completeTask = async (taskId) => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/tasks/completetask/${taskId}`, {
        user_id: user.id
      });
      toast.success('Task completed!');
      fetchUserActivity();
      fetchUserStats();
      if (selectedTeam) {
        fetchTasks(selectedTeam.id);
      }
    } catch (error) {
      handleApiError(error, 'Failed to complete task');
    }
  };

  const deleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/tasks/deletetask/${taskId}`);
        toast.success('Task deleted successfully!');
        fetchUserActivity();
        fetchUserStats();
        if (selectedTeam) {
          fetchTasks(selectedTeam.id);
        }
      } catch (error) {
        handleApiError(error, 'Failed to delete task');
      }
    }
  };

  const addMember = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/teams/addmember`, {
        team_id: parseInt(memberForm.team_id),
        user_id: parseInt(memberForm.user_id)
      });
      toast.success('Member added successfully!');
      setShowAddMemberModal(false);
      setMemberForm({ team_id: '', user_id: '' });
      setAvailableUsers([]);
      fetchTeams();
    } catch (error) {
      handleApiError(error, 'Failed to add member');
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleCreateTeam = () => {
    setShowCreateTeamModal(true);
  };

  const handleAddMember = (teamId) => {
    setMemberForm({ ...memberForm, team_id: teamId });
    setShowAddMemberModal(true);
  };

  const handleViewTasks = (team) => {
    setSelectedTeam(team);
    setActiveTab('tasks');
  };

  const handleCreateTask = () => {
    setShowCreateTaskModal(true);
  };

  const handleCloseCreateTaskModal = () => {
    setShowCreateTaskModal(false);
    setTaskForm({ title: '', description: '', team_id: '', assigned_to: '', priority: 'medium', due_date: '' });
  };

  const handleCloseAddMemberModal = () => {
    setShowAddMemberModal(false);
    setMemberForm({ team_id: '', user_id: '' });
    setAvailableUsers([]);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <Navbar user={user} onLogout={handleLogout} />
      
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {activeTab === 'overview' && (
          <div>
            <StatsCards userStats={userStats} />
            <RecentActivity userActivity={userActivity} user={user} />
          </div>
        )}

        {activeTab === 'teams' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Teams</h2>
              <button
                onClick={handleCreateTeam}
                className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Create Team</span>
              </button>
            </div>
            <TeamGrid
              teams={teams}
              loading={loading}
              user={user}
              onCreateTeam={handleCreateTeam}
              onDeleteTeam={deleteTeam}
              onAddMember={handleAddMember}
              onViewTasks={handleViewTasks}
            />
          </div>
        )}

{activeTab === 'tasks' && (
  <div>
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
      <div className="min-w-0 flex-1">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Tasks</h2>
        {selectedTeam && (
          <p className="text-sm sm:text-base text-gray-600 truncate">Team: {selectedTeam.name || `Team #${selectedTeam.id}`}</p>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
        <select
          onChange={(e) => {
            const team = teams.find(t => t.id === parseInt(e.target.value));
            setSelectedTeam(team);
          }}
          value={selectedTeam?.id || ''}
          className="w-full sm:w-auto px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-sm sm:text-base"
        >
          <option value="">Select Team</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>{team.name || `Team #${team.id}`}</option>
          ))}
        </select>
        <button
          onClick={handleCreateTask}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-semibold flex items-center justify-center space-x-2 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Create Task</span>
        </button>
      </div>
    </div>
    <TaskGrid
      tasks={tasks}
      selectedTeam={selectedTeam}
      user={user}
      onCompleteTask={completeTask}
      onDeleteTask={deleteTask}
      onCreateTask={handleCreateTask}
    />
  </div>
)}
      </div>

      <Footer />

      <CreateTeamModal
        isOpen={showCreateTeamModal}
        onClose={() => setShowCreateTeamModal(false)}
        teamForm={teamForm}
        setTeamForm={setTeamForm}
        onSubmit={createTeam}
      />

      <CreateTaskModal
        isOpen={showCreateTaskModal}
        onClose={handleCloseCreateTaskModal}
        taskForm={taskForm}
        setTaskForm={setTaskForm}
        onSubmit={createTask}
        teams={teams}
        users={users}
      />

      <AddMemberModal
        isOpen={showAddMemberModal}
        onClose={handleCloseAddMemberModal}
        memberForm={memberForm}
        setMemberForm={setMemberForm}
        onSubmit={addMember}
        availableUsers={availableUsers}
      />
    </div>
  );
}
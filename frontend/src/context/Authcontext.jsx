import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/auth/me`);
          setUser(response.data);
        } catch (error) {
          console.error('Authentication error:', error);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/login`, { email, password });
      localStorage.setItem('authToken', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name, email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/auth/register`, { name, email, password });
      localStorage.setItem('authToken', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
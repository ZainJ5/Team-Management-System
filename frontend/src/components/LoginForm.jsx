import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({...form, [name]: value});
  }

  async function submitForm(e) {
    e.preventDefault();
    setLoading(true);
    
    try {
      await login(form.email, form.password);
      toast.success('Logged in successfully!', {
        style: {
          background: '#1f2937',
          color: '#fff',
          border: '1px solid #fbbf24'
        }
      });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Please check your credentials.', {
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          border: '1px solid #b91c1c'
        }
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Login</h2>
      
      <form onSubmit={submitForm}>
        <div className="mb-5">
          <label className="block mb-2 text-sm font-semibold text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-gray-50 text-gray-900"
            required
          />
        </div>
        
        <div className="mb-5">
          <label className="block mb-2 text-sm font-semibold text-gray-700">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-gray-50 text-gray-900"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* <div className="mb-6 text-sm text-right">
          <a href="" className="text-amber-600 hover:text-amber-700 font-semibold">Forgot password?</a>
        </div> */}
        
        <button 
          type="submit" 
          className="w-full py-3 px-4 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
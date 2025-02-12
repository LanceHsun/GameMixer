// pages/admin/pages/LoginPage/index.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, error: authError, isAuthenticated } = useAuth();

  // 监听认证状态变化
  useEffect(() => {
    console.log('Auth state changed:', { isAuthenticated });
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || '/admin/dashboard';
      console.log('Redirecting to:', from);
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Submitting login with:', credentials);
      await login(credentials.username, credentials.password);
      console.log('Login successful');
    } catch (error) {
      console.error('Login submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF6F0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm">
        {/* Logo & Header */}
        <div>
          <img
            src={process.env.PUBLIC_URL + "/images/Game-mixer-logo.avif"}
            alt="Game Mixer Logo"
            className="mx-auto h-16 w-16 p-2 bg-[#FFD200] rounded-lg"
          />
          <h2 className="mt-6 text-center text-3xl font-bold text-[#2C2C2C]">
            Admin Login
          </h2>
        </div>

        {/* Error Message */}
        {authError && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {authError}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[#2C2C2C]">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                         shadow-sm focus:outline-none focus:ring-[#FFD200] focus:border-[#FFD200]
                         text-[#2C2C2C]"
                value={credentials.username}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2C2C2C]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md 
                         shadow-sm focus:outline-none focus:ring-[#FFD200] focus:border-[#FFD200]
                         text-[#2C2C2C]"
                value={credentials.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md
                     shadow-sm text-[#2C2C2C] font-medium bg-[#FFD200] 
                     hover:bg-[#FFE566] focus:outline-none focus:ring-2 
                     focus:ring-offset-2 focus:ring-[#FFD200] transition-colors
                     ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#2C2C2C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
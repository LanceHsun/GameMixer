// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    try {
      const response = await authAPI.login(username, password);
      console.log('Login response:', response);
      
      // 保存 token
      localStorage.setItem('adminToken', response.token);
      
      // 创建用户对象
      const userObj = {
        username,
        // 从 token 中解析更多用户信息，如果需要的话
        email: response.email 
      };
      
      // 设置用户状态
      setUser(userObj);
      setError(null);
      
      console.log('Authentication successful, user:', userObj);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
      throw error;
    }
  };

  // 添加 logout 函数
  const logout = () => {
    localStorage.removeItem('adminToken');
    setUser(null);
    setError(null);
    console.log('Logged out successfully');
  };

  // 初始化认证状态
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('adminToken');
      console.log('Initializing auth with token:', token);
      
      if (token) {
        try {
          // 如果需要验证 token 或获取用户信息
          const userObj = {
            // 可以从 token 中解析用户信息，或者调用 API 获取用户信息
            username: 'admin' // 临时用户对象
          };
          setUser(userObj);
        } catch (err) {
          console.error('Auth initialization error:', err);
          localStorage.removeItem('adminToken');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // 监听认证状态变化
  useEffect(() => {
    console.log('Auth state updated:', { user, loading, error });
  }, [user, loading, error]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
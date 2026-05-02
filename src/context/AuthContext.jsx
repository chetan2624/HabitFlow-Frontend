import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/signup', { name, email, password });
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } finally {
      setLoading(false);
    }
  };

  const updateOnboarding = async (userType) => {
    setLoading(true);
    try {
      const res = await api.put('/auth/onboarding', { userType });
      const updatedUser = { ...user, userType: res.data.userType };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateOnboarding, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

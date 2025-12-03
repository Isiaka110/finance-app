// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, email, role }
  const [loading, setLoading] = useState(true);

  // Check for stored token on mount (Basic token validation logic)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // In a real app, you'd verify the token or call a /api/auth/me endpoint
      // For this skeleton, we'll assume a token means a user, but it's best to verify.
      // For simplicity, we are getting user data back on login/register:
      // We will rely on the `api` interceptor to send the token.
      
      // *** Simplified: Just check if token exists ***
      // To properly get user data from a token, you'd need an endpoint like:
      // api.get('/auth/user').then(res => setUser(res.data.user)).catch(() => localStorage.removeItem('token'));
      
      // Setting a placeholder user based on the presence of a token for initial load:
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if(storedUser) {
        setUser(storedUser);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const register = async (userData) => {
    // userData includes { name, email, password, affiliation }
    const res = await api.post('/auth/register', userData);
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data.user;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = { user, loading, login, register, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context easily
export const useAuth = () => useContext(AuthContext);
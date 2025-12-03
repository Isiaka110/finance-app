// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Requires the user to be logged in AND have a specific role
const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading user session...</div>; // Or a proper spinner
  }

  // 1. Check if user is logged in
  if (!user) {
    // If not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // 2. Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If logged in but lacks role, redirect to unauthorized page (or their own dashboard)
    // Redirecting to the correct dashboard path is a good approach here
    let redirectPath = '/';
    if (user.role === 'editor') redirectPath = '/editor-dashboard';
    else if (user.role === 'reviewer') redirectPath = '/reviewer-dashboard';
    // Add more role checks as needed
    return <Navigate to={redirectPath} replace />;
  }

  // If authenticated and authorized, render the child component
  return <Outlet />;
};

export default ProtectedRoute;
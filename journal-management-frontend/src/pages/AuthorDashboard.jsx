// src/pages/AuthorDashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AuthorDashboard = () => {
  const { user, logout } = useAuth();
  
  if (!user) return null; // Should be handled by ProtectedRoute

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.name} ({user.role})</h1>
      <p>This is your central hub for managing submissions.</p>
      
      <h3>Actions:</h3>
      <ul>
        <li><Link to="/submit">🚀 New Manuscript Submission</Link></li>
        <li><Link to="/my-submissions">View/Track My Submissions</Link></li>
        <li><button onClick={logout}>Log Out</button></li>
      </ul>
      
      {/* Placeholder for submission list */}
      <h2>My Submissions</h2>
      <p>Display a list of submissions here, filtered by `submittedBy` ID.</p>
    </div>
  );
};

export default AuthorDashboard;
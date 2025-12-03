// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import Pages (Skeletons to be created next)
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AuthorDashboard from './pages/AuthorDashboard';
import EditorDashboard from './pages/EditorDashboard';
import SubmissionPage from './pages/SubmissionPage';
import PublicArticles from './pages/PublicArticles'; // Matches /api/articles public endpoint

// Helper to redirect logged-in users from auth pages to their dashboard
const AuthRedirect = () => {
  const { user } = useAuth();
  if (user) {
    if (user.role === 'editor') return <Navigate to="/editor-dashboard" replace />;
    // Add more role checks (reviewer, admin)
    return <Navigate to="/author-dashboard" replace />; // Default for author/reader
  }
  return <Outlet />;
};

const App = () => {
  const { loading } = useAuth();

  if (loading) return <div>Loading Application...</div>;

  return (
    <Router>
      {/* Header/Navigation component would go here */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<PublicArticles />} />

        <Route element={<AuthRedirect />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Routes - Role Based */}

        {/* Author/Reader Routes */}
        <Route element={<ProtectedRoute allowedRoles={['author', 'reader', 'editor', 'reviewer', 'admin']} />}>
          <Route path="/author-dashboard" element={<AuthorDashboard />} />
          <Route path="/submit" element={<SubmissionPage />} />
        </Route>

        {/* Editor/Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['editor', 'admin']} />}>
          <Route path="/editor-dashboard" element={<EditorDashboard />} />
          {/* Add /editor/submissions, /editor/assignments routes */}
        </Route>

        {/* Fallback */}
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
};

export default App;
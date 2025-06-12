import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Layout
import Layout from '../components/Layout/Layout';

// Common Pages
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/common/Profile';
import NotFound from '../pages/NotFound';

// Admin Pages
import UserManagement from '../pages/admin/UserManagement';
import ProjectList from '../pages/admin/ProjectList';


const AppRoutes: React.FC = () => {
  const { currentUser } = useApp();

  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login\" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Common Routes */}
        <Route index element={<Navigate to="/dashboard\" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        {/* Admin Routes */}
        {currentUser.role === 'admin' && (
          <>
             <Route path="/users" element={<UserManagement />} />
            <Route path="/projects" element={<ProjectList />} />
          </>
        )}

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<Navigate to="/dashboard\" replace />} />
      <Route path="/register" element={<Navigate to="/dashboard\" replace />} />
    </Routes>
  );
};

export default AppRoutes;
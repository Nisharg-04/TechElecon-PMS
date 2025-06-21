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
import Notifications from '../pages/common/Notifications';
import Settings from '../pages/common/Settings';
import NotFound from '../pages/NotFound';

// Admin Pages
import UserManagement from '../pages/admin/UserManagement';
import ProjectList from '../pages/admin/ProjectList';
import TaskManagement from '../pages/admin/TaskManagement';
import Performance from '../pages/admin/Performance';
import AttendanceLogs from '../pages/admin/AttendanceLogs';
import Reports from '../pages/admin/Reports';
import ActivityLogs from '../pages/admin/ActivityLogs';
import SprintManagement from '../pages/admin/SprintManagement';

// Employee Pages
import MyProjects from '../pages/employee/MyProjects';
import MyTasks from '../pages/employee/MyTasks';
import KanbanBoard from '../pages/employee/KanbanBoard';
import Attendance from '../pages/employee/Attendance';
import MyPerformance from '../pages/employee/MyPerformance';
import MyActivity from '../pages/employee/MyActivity';

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
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
       

        {/* Admin Routes */}
        {currentUser.role === 'admin' && (
          <>
             <Route path="/users" element={<UserManagement />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/tasks" element={<TaskManagement />} />
            <Route path="/sprints" element={<SprintManagement />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/attendance-logs" element={<AttendanceLogs />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/activity-logs" element={<ActivityLogs />} />
          </>
        )}

        {/* Employee Routes */}
        {currentUser.role === 'employee' && (
          <>
            <Route path="/my-projects" element={<MyProjects />} />
            <Route path="/my-tasks" element={<MyTasks />} />
            <Route path="/kanban" element={<KanbanBoard />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/my-performance" element={<MyPerformance />} />
            <Route path="/my-activity" element={<MyActivity />} />
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
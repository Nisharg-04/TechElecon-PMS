import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  CheckSquare,
  BarChart3,
  Clock,
  Bell,
  Settings,
  LogOut,
  User,
  Calendar,
  Activity,
  FileText,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Sidebar: React.FC = () => {
  const { currentUser, logout, sidebarOpen, setSidebarOpen } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminRoutes = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/users', icon: Users, label: 'User Management' },
    { path: '/projects', icon: FolderOpen, label: 'Projects' },
    
  ];

  const employeeRoutes = [

  ];

  const commonRoutes = [
    { path: '/notifications', icon: Bell, label: 'Notifications' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const routes = currentUser?.role === 'admin' ? adminRoutes : employeeRoutes;

  return (
    <motion.div
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      className={`fixed left-0 top-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-40 transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 min-h-16 max-h-16">
        {sidebarOpen && (
          <div className="flex items-center space-x-2">
            <div className="w-10 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">TEPL</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">Tech Elecon PVT LTD</span>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {routes.map((route) => (
          <NavLink
            key={route.path}
            to={route.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`
            }
          >
            <route.icon className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium">{route.label}</span>}
          </NavLink>
        ))}

        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4  flex-1 space-y-2 ">
          {commonRoutes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`  
              }
            >
              <route.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{route.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {sidebarOpen && currentUser && (
          <div className="flex items-center space-x-3 mb-4">
            <img
              src={currentUser.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop`}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
              </p>
            </div>
          </div>
        )}
        
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
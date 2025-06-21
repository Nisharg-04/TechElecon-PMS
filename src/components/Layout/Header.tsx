import React from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Menu,
  Settings,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { 
    currentUser, 
    theme, 
    toggleTheme, 
    sidebarOpen, 
    setSidebarOpen,
    notifications 
  } = useApp();

  const unreadNotifications = notifications.filter(n => 
    !n.isRead && n.userId === currentUser?.id
  ).length;

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      className={`fixed top-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-30 transition-all duration-300 ${
        sidebarOpen ? 'left-64' : 'left-16'
      }`}
    >
      <div className="flex items-center justify-between h-full px-6">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects, tasks..."
              className="pl-10 pr-4 py-2 w-80 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </motion.button>

          {/* Notifications */}
          <Link
            to="/notifications"
            className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {unreadNotifications > 9 ? '9+' : unreadNotifications}
              </span>
            )}
          </Link>

          {/* Settings */}
          <Link
            to="/settings"
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </Link>

          {/* Profile */}
          {currentUser && (
            <Link
              to="/profile"
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <img
                src={currentUser.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&fit=crop`}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentUser.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                </p>
              </div>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Moon, Sun, Bell, Eye, Lock, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useApp();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    taskUpdates: true,
    projectUpdates: false,
    mentions: true
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showOnlineStatus: true,
    allowDirectMessages: true
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Customize your experience and preferences
        </p>
      </motion.div>

      {/* Appearance Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
              <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Appearance
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Customize how the app looks and feels
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Theme</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Choose between light and dark theme
                </p>
              </div>
              <Button
                onClick={toggleTheme}
                variant="outline"
                className="flex items-center space-x-2"
              >
                {theme === 'light' ? (
                  <>
                    <Moon className="w-4 h-4" />
                    <span>Dark Mode</span>
                  </>
                ) : (
                  <>
                    <Sun className="w-4 h-4" />
                    <span>Light Mode</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg mr-3">
              <Bell className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage how you receive notifications
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive notifications via email
                </p>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                  className="sr-only"
                />
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.email ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <div className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.email ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Push Notifications</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive push notifications in your browser
                </p>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                  className="sr-only"
                />
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.push ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <div className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.push ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Task Updates</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified when tasks are updated
                </p>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.taskUpdates}
                  onChange={(e) => setNotifications({...notifications, taskUpdates: e.target.checked})}
                  className="sr-only"
                />
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.taskUpdates ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <div className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.taskUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Project Updates</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get notified about project changes
                </p>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={notifications.projectUpdates}
                  onChange={(e) => setNotifications({...notifications, projectUpdates: e.target.checked})}
                  className="sr-only"
                />
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  notifications.projectUpdates ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <div className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications.projectUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </label>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Privacy Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg mr-3">
              <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Privacy & Security
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Control your privacy and security settings
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Profile Visibility</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Make your profile visible to other team members
                </p>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={privacy.profileVisible}
                  onChange={(e) => setPrivacy({...privacy, profileVisible: e.target.checked})}
                  className="sr-only"
                />
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy.profileVisible ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <div className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.profileVisible ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Online Status</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Show when you're online to other users
                </p>
              </div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={privacy.showOnlineStatus}
                  onChange={(e) => setPrivacy({...privacy, showOnlineStatus: e.target.checked})}
                  className="sr-only"
                />
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacy.showOnlineStatus ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <div className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacy.showOnlineStatus ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </label>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Security Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center mb-6">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg mr-3">
              <Lock className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Security Actions
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your account security
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button variant="outline" fullWidth>
              Change Password
            </Button>
            <Button variant="outline" fullWidth>
              Two-Factor Authentication
            </Button>
            <Button variant="outline" fullWidth>
              Download Account Data
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Settings;
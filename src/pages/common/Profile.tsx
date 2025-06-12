import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, MapPin, Edit3, Save, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';

const Profile: React.FC = () => {
  const { currentUser, updateUser } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    department: currentUser?.department || '',
    position: currentUser?.position || ''
  });

  if (!currentUser) return null;

  const handleSave = () => {
    updateUser(currentUser.id, formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser.name,
      email: currentUser.email,
      department: currentUser.department || '',
      position: currentUser.position || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your account information and preferences
          </p>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant={isEditing ? "outline" : "primary"}
        >
          {isEditing ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 text-center">
            <div className="relative inline-block mb-4">
              <img
                src={currentUser.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop`}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full object-cover mx-auto"
              />
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {currentUser.name}
            </h3>
            
            <Badge variant={currentUser.role === 'admin' ? 'primary' : 'secondary'} className="mb-4">
              {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
            </Badge>
            
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center justify-center">
                <Mail className="w-4 h-4 mr-2" />
                {currentUser.email}
              </div>
              <div className="flex items-center justify-center">
                <Calendar className="w-4 h-4 mr-2" />
                Joined {new Date(currentUser.joinDate).toLocaleDateString()}
              </div>
              {currentUser.department && (
                <div className="flex items-center justify-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {currentUser.department}
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Personal Information
            </h3>
            
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {currentUser.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {currentUser.email}
                  </div>
                )}
              </div>

              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Department
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Development, Design, QA"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {currentUser.department || 'Not specified'}
                  </div>
                )}
              </div>

              {/* Position */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Position
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="e.g., Senior Developer, Designer"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {currentUser.position || 'Not specified'}
                  </div>
                )}
              </div>

              {/* Role (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Role
                </label>
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                  {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex space-x-4">
                  <Button onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Account Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Account Statistics
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {currentUser.isActive ? 'Active' : 'Inactive'}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Account Status</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                {Math.floor((Date.now() - new Date(currentUser.joinDate).getTime()) / (1000 * 60 * 60 * 24))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Days with us</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {currentUser.lastLogin ? new Date(currentUser.lastLogin).toLocaleDateString() : 'Never'}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Last Login</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Profile;
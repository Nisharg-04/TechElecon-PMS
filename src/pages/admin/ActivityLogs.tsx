import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Search, Filter, Calendar, User, FolderOpen, CheckSquare } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Common/Card';
import Badge from '../../components/Common/Badge';

const ActivityLogs: React.FC = () => {
  const { activityLogs, users, projects, tasks } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterUser, setFilterUser] = useState('');

  const filteredLogs = activityLogs.filter(log => {
    const user = users.find(u => u.id === log.userId);
    const matchesSearch = log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesAction = filterAction === 'all' || log.action === filterAction;
    const matchesUser = !filterUser || log.userId === filterUser;
    
    return matchesSearch && matchesAction && matchesUser;
  });

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getUserAvatar = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop`;
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE_PROJECT':
      case 'UPDATE_PROJECT':
        return <FolderOpen className="w-4 h-4" />;
      case 'CREATE_TASK':
      case 'UPDATE_TASK':
      case 'ASSIGN_TASK':
        return <CheckSquare className="w-4 h-4" />;
      case 'CREATE_USER':
      case 'UPDATE_USER':
        return <User className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE_PROJECT':
      case 'CREATE_TASK':
      case 'CREATE_USER':
        return 'success';
      case 'UPDATE_PROJECT':
      case 'UPDATE_TASK':
      case 'UPDATE_USER':
        return 'info';
      case 'ASSIGN_TASK':
        return 'warning';
      case 'DELETE_PROJECT':
      case 'DELETE_TASK':
      case 'DELETE_USER':
        return 'error';
      default:
        return 'secondary';
    }
  };

  const actionTypes = [
    'CREATE_PROJECT',
    'UPDATE_PROJECT',
    'CREATE_TASK',
    'UPDATE_TASK',
    'ASSIGN_TASK',
    'CREATE_USER',
    'UPDATE_USER'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Activity Logs
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track all system activities and user actions
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6" hover>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activityLogs.length}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6" hover>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <FolderOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Project Actions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activityLogs.filter(log => log.entityType === 'project').length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6" hover>
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <CheckSquare className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Task Actions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activityLogs.filter(log => log.entityType === 'task').length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6" hover>
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">User Actions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {activityLogs.filter(log => log.entityType === 'user').length}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Actions</option>
                {actionTypes.map(action => (
                  <option key={action} value={action}>
                    {action.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <select
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Users</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Activity Timeline
          </h3>
          
          <div className="space-y-4">
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex-shrink-0">
                  <img
                    src={getUserAvatar(log.userId)}
                    alt={getUserName(log.userId)}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3 mb-1">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {getUserName(log.userId)}
                    </p>
                    <Badge variant={getActionColor(log.action)} size="sm">
                      <div className="flex items-center space-x-1">
                        {getActionIcon(log.action)}
                        <span>{log.action.replace('_', ' ').toLowerCase()}</span>
                      </div>
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {log.description}
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <Activity className="w-3 h-3 mr-1" />
                      {log.entityType}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No activities found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default ActivityLogs;
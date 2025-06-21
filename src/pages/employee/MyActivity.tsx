import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, Filter, CheckSquare, FolderOpen, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Common/Card';
import Badge from '../../components/Common/Badge';

const MyActivity: React.FC = () => {
  const { currentUser, activityLogs, tasks, projects } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'task' | 'project'>('all');
  const [filterDate, setFilterDate] = useState('');

  // Get activities for current user
  const userActivities = activityLogs.filter(log => log.userId === currentUser?.id);

  const filteredActivities = userActivities.filter(log => {
    const matchesType = filterType === 'all' || log.entityType === filterType;
    const matchesDate = !filterDate || log.timestamp.startsWith(filterDate);
    return matchesType && matchesDate;
  });

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'CREATE_PROJECT':
      case 'UPDATE_PROJECT':
        return <FolderOpen className="w-4 h-4" />;
      case 'CREATE_TASK':
      case 'UPDATE_TASK':
      case 'ASSIGN_TASK':
        return <CheckSquare className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'CREATE_PROJECT':
      case 'CREATE_TASK':
        return 'success';
      case 'UPDATE_PROJECT':
      case 'UPDATE_TASK':
        return 'info';
      case 'ASSIGN_TASK':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  const getRelatedEntity = (log: any) => {
    if (log.entityType === 'task' && log.entityId) {
      const task = tasks.find(t => t.id === log.entityId);
      return task ? task.title : 'Unknown Task';
    }
    if (log.entityType === 'project' && log.entityId) {
      const project = projects.find(p => p.id === log.entityId);
      return project ? project.name : 'Unknown Project';
    }
    return null;
  };

  // Calculate activity stats
  const today = new Date().toISOString().split('T')[0];
  const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const thisMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const todayActivities = userActivities.filter(log => log.timestamp.startsWith(today)).length;
  const weekActivities = userActivities.filter(log => log.timestamp >= thisWeek).length;
  const monthActivities = userActivities.filter(log => log.timestamp >= thisMonth).length;

  const taskActivities = userActivities.filter(log => log.entityType === 'task').length;
  const projectActivities = userActivities.filter(log => log.entityType === 'project').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Activity
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your recent activities and contributions
        </p>
      </motion.div>

      {/* Activity Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{userActivities.length}</p>
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
                <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{todayActivities}</p>
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
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Week</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{weekActivities}</p>
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
                <CheckSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{taskActivities}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6" hover>
            <div className="flex items-center">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <FolderOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Projects</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{projectActivities}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Activities</option>
                <option value="task">Task Activities</option>
                <option value="project">Project Activities</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Activity Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Activity Timeline
          </h3>
          
          <div className="space-y-4">
            {filteredActivities.map((log, index) => {
              const relatedEntity = getRelatedEntity(log);
              
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className={`p-2 rounded-lg ${
                      log.entityType === 'task' ? 'bg-blue-100 dark:bg-blue-900/30' :
                      log.entityType === 'project' ? 'bg-green-100 dark:bg-green-900/30' :
                      'bg-gray-100 dark:bg-gray-700'
                    }`}>
                      {getActivityIcon(log.action)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <Badge variant={getActivityColor(log.action)} size="sm">
                        <div className="flex items-center space-x-1">
                          {getActivityIcon(log.action)}
                          <span>{log.action.replace('_', ' ').toLowerCase()}</span>
                        </div>
                      </Badge>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-900 dark:text-white mb-1">
                      {log.description}
                    </p>
                    
                    {relatedEntity && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Related to: {relatedEntity}
                      </p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No activities found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your filter criteria to see more activities.
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default MyActivity;
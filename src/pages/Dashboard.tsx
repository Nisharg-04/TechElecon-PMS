import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FolderOpen, 
  CheckSquare, 
  Clock,
  TrendingUp,
  Calendar,
  Bell,
  Activity
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import Card from '../components/Common/Card';
import Badge from '../components/Common/Badge';

const Dashboard: React.FC = () => {
  const { currentUser, users, projects, tasks, notifications } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  // Calculate stats
  const stats = {
    totalUsers: users.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalTasks: isAdmin ? tasks.length : tasks.filter(t => t.assignedTo === currentUser?.id).length,
    completedTasks: isAdmin 
      ? tasks.filter(t => t.status === 'done').length 
      : tasks.filter(t => t.assignedTo === currentUser?.id && t.status === 'done').length,
    pendingTasks: isAdmin
      ? tasks.filter(t => t.status !== 'done').length
      : tasks.filter(t => t.assignedTo === currentUser?.id && t.status !== 'done').length,
    unreadNotifications: notifications.filter(n => !n.isRead && n.userId === currentUser?.id).length
  };

  const recentTasks = isAdmin 
    ? tasks.slice(0, 5)
    : tasks.filter(t => t.assignedTo === currentUser?.id).slice(0, 5);

  const recentProjects = isAdmin
    ? projects.slice(0, 3)
    : projects.filter(p => p.teamMembers.includes(currentUser?.id || '')).slice(0, 3);

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'success';
      case 'in-progress': return 'primary';
      case 'review': return 'warning';
      default: return 'secondary';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white"
      >
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {currentUser?.name}! 👋
        </h1>
        <p className="text-blue-100">
          {isAdmin 
            ? 'Here\'s an overview of your team\'s progress today.'
            : 'Here\'s what you need to focus on today.'
          }
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6" hover>
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeProjects}</p>
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTasks}</p>
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
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedTasks}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {isAdmin ? 'Recent Tasks' : 'My Tasks'}
              </h3>
              <Badge variant="info">{recentTasks.length} Tasks</Badge>
            </div>
            
            <div className="space-y-4">
              {recentTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {task.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {projects.find(p => p.id === task.projectId)?.name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={getPriorityColor(task.priority)} size="sm">
                      {task.priority}
                    </Badge>
                    <Badge variant={getTaskStatusColor(task.status)} size="sm">
                      {task.status}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Side Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-6"
        >
          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pending Tasks</span>
                <Badge variant="warning">{stats.pendingTasks}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Notifications</span>
                <Badge variant="error">{stats.unreadNotifications}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</span>
                <Badge variant="success">
                  {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                </Badge>
              </div>
            </div>
          </Card>

          {/* Recent Projects */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {isAdmin ? 'Recent Projects' : 'My Projects'}
            </h3>
            <div className="space-y-3">
              {recentProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm mb-1">
                    {project.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <Badge variant={project.status === 'active' ? 'success' : 'secondary'} size="sm">
                      {project.status}
                    </Badge>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
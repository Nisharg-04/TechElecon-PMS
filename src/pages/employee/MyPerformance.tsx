import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, CheckCircle, Target, Award } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Common/Card';
import Badge from '../../components/Common/Badge';

const MyPerformance: React.FC = () => {
  const { currentUser, tasks, attendance } = useApp();

  // Get user's tasks
  const userTasks = tasks.filter(task => task.assignedTo === currentUser?.id);
  const completedTasks = userTasks.filter(task => task.status === 'done');
  const inProgressTasks = userTasks.filter(task => task.status === 'in-progress');
  const overdueTasks = userTasks.filter(task => {
    const deadline = new Date(task.deadline);
    const now = new Date();
    return deadline < now && task.status !== 'done';
  });

  // Calculate performance metrics
  const totalTasks = userTasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;
  const totalEstimatedHours = userTasks.reduce((sum, task) => sum + task.estimatedHours, 0);
  const totalActualHours = userTasks.reduce((sum, task) => sum + (task.actualHours || 0), 0);
  const avgCompletionTime = completedTasks.length > 0 
    ? completedTasks.reduce((sum, task) => sum + (task.actualHours || 0), 0) / completedTasks.length 
    : 0;

  // Get attendance data
  const userAttendance = attendance.filter(record => record.userId === currentUser?.id);
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyAttendance = userAttendance.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === thisMonth && recordDate.getFullYear() === thisYear;
  });

  const totalWorkingDays = monthlyAttendance.length;
  const presentDays = monthlyAttendance.filter(r => r.status === 'present').length;
  const attendanceRate = totalWorkingDays > 0 ? (presentDays / totalWorkingDays) * 100 : 0;

  // Performance by priority
  const tasksByPriority = {
    critical: userTasks.filter(t => t.priority === 'critical'),
    high: userTasks.filter(t => t.priority === 'high'),
    medium: userTasks.filter(t => t.priority === 'medium'),
    low: userTasks.filter(t => t.priority === 'low')
  };

  const completedByPriority = {
    critical: completedTasks.filter(t => t.priority === 'critical').length,
    high: completedTasks.filter(t => t.priority === 'high').length,
    medium: completedTasks.filter(t => t.priority === 'medium').length,
    low: completedTasks.filter(t => t.priority === 'low').length
  };

  const getPerformanceLevel = (rate: number) => {
    if (rate >= 90) return { level: 'Excellent', color: 'success' };
    if (rate >= 75) return { level: 'Good', color: 'info' };
    if (rate >= 60) return { level: 'Average', color: 'warning' };
    return { level: 'Needs Improvement', color: 'error' };
  };

  const performanceLevel = getPerformanceLevel(completionRate);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Performance
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your productivity and performance metrics
        </p>
      </motion.div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Award className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Performance Level
            </h3>
            <Badge variant={performanceLevel.color as any} className="text-lg px-4 py-2">
              {performanceLevel.level}
            </Badge>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Based on your task completion rate of {Math.round(completionRate)}%
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6" hover>
            <div className="flex items-center">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(completionRate)}%
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
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasks Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {completedTasks.length}/{totalTasks}
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
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Time/Task</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {avgCompletionTime.toFixed(1)}h
                </p>
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
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(attendanceRate)}%
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Task Status Breakdown
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completed</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(completedTasks.length / totalTasks) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
                    {completedTasks.length}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">In Progress</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(inProgressTasks.length / totalTasks) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
                    {inProgressTasks.length}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-400">Overdue</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-red-600 h-2 rounded-full"
                      style={{ width: `${(overdueTasks.length / totalTasks) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
                    {overdueTasks.length}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Priority Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Performance by Priority
            </h3>
            
            <div className="space-y-4">
              {Object.entries(tasksByPriority).map(([priority, tasks]) => {
                const completed = completedByPriority[priority as keyof typeof completedByPriority];
                const rate = tasks.length > 0 ? (completed / tasks.length) * 100 : 0;
                
                return (
                  <div key={priority} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={
                          priority === 'critical' ? 'error' :
                          priority === 'high' ? 'warning' :
                          priority === 'medium' ? 'info' : 'secondary'
                        } 
                        size="sm"
                      >
                        {priority}
                      </Badge>
                      <span className="text-gray-600 dark:text-gray-400">
                        {completed}/{tasks.length}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            priority === 'critical' ? 'bg-red-600' :
                            priority === 'high' ? 'bg-orange-600' :
                            priority === 'medium' ? 'bg-blue-600' : 'bg-gray-600'
                          }`}
                          style={{ width: `${rate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
                        {Math.round(rate)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Time Tracking */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Time Tracking Summary
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {totalEstimatedHours}h
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Estimated Hours</p>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {totalActualHours}h
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Actual Hours</p>
            </div>
            
            <div className="text-center">
              <div className={`text-3xl font-bold mb-2 ${
                totalActualHours <= totalEstimatedHours ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {totalEstimatedHours > 0 ? Math.round((totalActualHours / totalEstimatedHours) * 100) : 0}%
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Time Efficiency</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default MyPerformance;
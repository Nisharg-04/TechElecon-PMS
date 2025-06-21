import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Clock, CheckCircle, Users, Target } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Common/Card';
import Badge from '../../components/Common/Badge';

const Performance: React.FC = () => {
  const { users, tasks, projects } = useApp();

  // Calculate performance metrics for each employee
  const employeePerformance = users
    .filter(user => user.role === 'employee')
    .map(user => {
      const userTasks = tasks.filter(task => task.assignedTo === user.id);
      const completedTasks = userTasks.filter(task => task.status === 'done');
      const totalHours = userTasks.reduce((sum, task) => sum + (task.actualHours || 0), 0);
      const avgCompletionTime = completedTasks.length > 0 
        ? totalHours / completedTasks.length 
        : 0;
      
      return {
        ...user,
        totalTasks: userTasks.length,
        completedTasks: completedTasks.length,
        completionRate: userTasks.length > 0 ? (completedTasks.length / userTasks.length) * 100 : 0,
        totalHours,
        avgCompletionTime
      };
    });

  // Overall stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'done').length;
  const overallCompletionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const activeProjects = projects.filter(project => project.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Performance Analytics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor team performance and productivity metrics
        </p>
      </motion.div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Team Members</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {users.filter(u => u.role === 'employee').length}
                </p>
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
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(overallCompletionRate)}%
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
                <Target className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeProjects}</p>
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
                <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTasks}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Employee Performance Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Employee Performance
            </h3>
            <Badge variant="info">{employeePerformance.length} Employees</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Employee</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Total Tasks</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Completed</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Completion Rate</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Total Hours</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Avg. Time/Task</th>
                </tr>
              </thead>
              <tbody>
                {employeePerformance.map((employee, index) => (
                  <motion.tr
                    key={employee.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <img
                          src={employee.avatar || `https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&fit=crop`}
                          alt={employee.name}
                          className="w-10 h-10 rounded-full object-cover mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{employee.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{employee.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900 dark:text-white">{employee.department}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900 dark:text-white">{employee.totalTasks}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900 dark:text-white">{employee.completedTasks}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${Math.min(employee.completionRate, 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {Math.round(employee.completionRate)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900 dark:text-white">{employee.totalHours}h</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-gray-900 dark:text-white">
                        {employee.avgCompletionTime > 0 ? `${employee.avgCompletionTime.toFixed(1)}h` : 'N/A'}
                      </p>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Performers
            </h3>
            <div className="space-y-3">
              {employeePerformance
                .sort((a, b) => b.completionRate - a.completionRate)
                .slice(0, 3)
                .map((employee, index) => (
                  <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3 ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{employee.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{employee.department}</p>
                      </div>
                    </div>
                    <Badge variant="success">{Math.round(employee.completionRate)}%</Badge>
                  </div>
                ))}
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Department Overview
            </h3>
            <div className="space-y-3">
              {Array.from(new Set(users.filter(u => u.role === 'employee').map(u => u.department)))
                .filter(dept => dept)
                .map(department => {
                  const deptEmployees = employeePerformance.filter(emp => emp.department === department);
                  const avgCompletion = deptEmployees.length > 0 
                    ? deptEmployees.reduce((sum, emp) => sum + emp.completionRate, 0) / deptEmployees.length 
                    : 0;
                  
                  return (
                    <div key={department} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{department}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{deptEmployees.length} employees</p>
                      </div>
                      <Badge variant="info">{Math.round(avgCompletion)}%</Badge>
                    </div>
                  );
                })}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Performance;
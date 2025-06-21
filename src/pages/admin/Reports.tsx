import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';

const Reports: React.FC = () => {
  const { users, projects, tasks, attendance } = useApp();
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const reportTypes = [
    { id: 'overview', name: 'Project Overview', icon: BarChart3 },
    { id: 'performance', name: 'Team Performance', icon: TrendingUp },
    { id: 'attendance', name: 'Attendance Report', icon: Calendar },
    { id: 'tasks', name: 'Task Analysis', icon: FileText }
  ];

  const generateOverviewReport = () => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const teamMembers = users.filter(u => u.role === 'employee').length;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      teamMembers,
      projectCompletionRate: totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0,
      taskCompletionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    };
  };

  const generatePerformanceReport = () => {
    return users
      .filter(user => user.role === 'employee')
      .map(user => {
        const userTasks = tasks.filter(task => task.assignedTo === user.id);
        const completedTasks = userTasks.filter(task => task.status === 'done');
        const totalHours = userTasks.reduce((sum, task) => sum + (task.actualHours || 0), 0);
        
        return {
          ...user,
          totalTasks: userTasks.length,
          completedTasks: completedTasks.length,
          completionRate: userTasks.length > 0 ? (completedTasks.length / userTasks.length) * 100 : 0,
          totalHours
        };
      })
      .sort((a, b) => b.completionRate - a.completionRate);
  };

  const generateAttendanceReport = () => {
    const filteredAttendance = attendance.filter(record => {
      const recordDate = new Date(record.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      return recordDate >= startDate && recordDate <= endDate;
    });

    const totalRecords = filteredAttendance.length;
    const presentRecords = filteredAttendance.filter(r => r.status === 'present').length;
    const lateRecords = filteredAttendance.filter(r => r.status === 'late').length;
    const absentRecords = filteredAttendance.filter(r => r.status === 'absent').length;
    const avgHours = filteredAttendance.reduce((sum, r) => sum + (r.totalHours || 0), 0) / totalRecords || 0;

    return {
      totalRecords,
      presentRecords,
      lateRecords,
      absentRecords,
      avgHours,
      attendanceRate: totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0
    };
  };

  const generateTaskReport = () => {
    const tasksByStatus = {
      todo: tasks.filter(t => t.status === 'todo').length,
      'in-progress': tasks.filter(t => t.status === 'in-progress').length,
      review: tasks.filter(t => t.status === 'review').length,
      done: tasks.filter(t => t.status === 'done').length
    };

    const tasksByPriority = {
      low: tasks.filter(t => t.priority === 'low').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      high: tasks.filter(t => t.priority === 'high').length,
      critical: tasks.filter(t => t.priority === 'critical').length
    };

    const overdueTasks = tasks.filter(task => {
      const deadline = new Date(task.deadline);
      const now = new Date();
      return deadline < now && task.status !== 'done';
    }).length;

    return {
      tasksByStatus,
      tasksByPriority,
      overdueTasks,
      totalTasks: tasks.length
    };
  };

  const renderOverviewReport = () => {
    const data = generateOverviewReport();
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Project Statistics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Projects</span>
                <span className="font-medium text-gray-900 dark:text-white">{data.totalProjects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Active</span>
                <span className="font-medium text-gray-900 dark:text-white">{data.activeProjects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completed</span>
                <span className="font-medium text-gray-900 dark:text-white">{data.completedProjects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                <Badge variant="success">{Math.round(data.projectCompletionRate)}%</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Task Statistics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Tasks</span>
                <span className="font-medium text-gray-900 dark:text-white">{data.totalTasks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completed</span>
                <span className="font-medium text-gray-900 dark:text-white">{data.completedTasks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Pending</span>
                <span className="font-medium text-gray-900 dark:text-white">{data.totalTasks - data.completedTasks}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
                <Badge variant="info">{Math.round(data.taskCompletionRate)}%</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Team Overview</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Team Members</span>
                <span className="font-medium text-gray-900 dark:text-white">{data.teamMembers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Active Projects</span>
                <span className="font-medium text-gray-900 dark:text-white">{data.activeProjects}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg Tasks/Member</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {data.teamMembers > 0 ? Math.round(data.totalTasks / data.teamMembers) : 0}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  const renderPerformanceReport = () => {
    const data = generatePerformanceReport();
    
    return (
      <Card className="p-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Team Performance Rankings</h4>
        <div className="space-y-4">
          {data.map((employee, index) => (
            <div key={employee.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-500' : 'bg-blue-500'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">{employee.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{employee.department}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900 dark:text-white">
                  {employee.completedTasks}/{employee.totalTasks} tasks
                </p>
                <Badge variant="success">{Math.round(employee.completionRate)}%</Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  };

  const renderAttendanceReport = () => {
    const data = generateAttendanceReport();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Attendance Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Records</span>
              <span className="font-medium text-gray-900 dark:text-white">{data.totalRecords}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Present</span>
              <Badge variant="success">{data.presentRecords}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Late</span>
              <Badge variant="warning">{data.lateRecords}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Absent</span>
              <Badge variant="error">{data.absentRecords}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Attendance Rate</span>
              <Badge variant="info">{Math.round(data.attendanceRate)}%</Badge>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Working Hours</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Average Hours/Day</span>
              <span className="font-medium text-gray-900 dark:text-white">{data.avgHours.toFixed(1)}h</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Working Days</span>
              <span className="font-medium text-gray-900 dark:text-white">{data.presentRecords}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Hours</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {(data.avgHours * data.presentRecords).toFixed(1)}h
              </span>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderTaskReport = () => {
    const data = generateTaskReport();
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Tasks by Status</h4>
          <div className="space-y-3">
            {Object.entries(data.tasksByStatus).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 capitalize">{status.replace('-', ' ')}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(count / data.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Tasks by Priority</h4>
          <div className="space-y-3">
            {Object.entries(data.tasksByPriority).map(([priority, count]) => (
              <div key={priority} className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400 capitalize">{priority}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        priority === 'critical' ? 'bg-red-600' :
                        priority === 'high' ? 'bg-orange-600' :
                        priority === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                      }`}
                      style={{ width: `${(count / data.totalTasks) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white w-8">{count}</span>
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between">
                <span className="text-red-600 dark:text-red-400">Overdue Tasks</span>
                <Badge variant="error">{data.overdueTasks}</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  const renderReportContent = () => {
    switch (selectedReport) {
      case 'overview':
        return renderOverviewReport();
      case 'performance':
        return renderPerformanceReport();
      case 'attendance':
        return renderAttendanceReport();
      case 'tasks':
        return renderTaskReport();
      default:
        return renderOverviewReport();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Generate comprehensive reports and insights
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </motion.div>

      {/* Report Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6">
          <div className="flex flex-wrap gap-4">
            {reportTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedReport === type.id ? 'primary' : 'outline'}
                onClick={() => setSelectedReport(type.id)}
                className="flex items-center"
              >
                <type.icon className="w-4 h-4 mr-2" />
                {type.name}
              </Button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Date Range Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date Range:</span>
            </div>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <span className="text-gray-500">to</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </Card>
      </motion.div>

      {/* Report Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {renderReportContent()}
      </motion.div>
    </div>
  );
};

export default Reports;
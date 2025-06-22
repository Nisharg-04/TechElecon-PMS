import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Calendar, Play, Square, BarChart3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const Attendance: React.FC = () => {
  const { currentUser, attendance, clockIn, clockOut } = useApp();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Get user's attendance records
  const userAttendance = attendance.filter(record => record.userId === currentUser?.id);
  
  // Get today's attendance
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = userAttendance.find(record => record.date === today);

  // Calculate stats
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlyAttendance = userAttendance.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate.getMonth() === thisMonth && recordDate.getFullYear() === thisYear;
  });

  const totalWorkingDays = monthlyAttendance.length;
  const presentDays = monthlyAttendance.filter(r => r.status === 'present').length;
  const totalHours = monthlyAttendance.reduce((sum, r) => sum + (r.totalHours || 0), 0);
  const avgHours = totalWorkingDays > 0 ? totalHours / totalWorkingDays : 0;
  const attendanceRate = totalWorkingDays > 0 ? (presentDays / totalWorkingDays) * 100 : 0;

  const handleClockIn = () => {
    if (currentUser) {
      clockIn(currentUser.id);
    }
  };

  const handleClockOut = () => {
    if (currentUser) {
      clockOut(currentUser.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'success';
      case 'late': return 'warning';
      case 'absent': return 'error';
      case 'half-day': return 'info';
      default: return 'secondary';
    }
  };

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };


  const barData = monthlyAttendance.map(record => ({
    date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    hours: record.totalHours || 0
  }));

  const statusCounts: Record<string, number> = {};
  monthlyAttendance.forEach(r => {
    statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
  });
  const pieData = Object.entries(statusCounts).map(([status, value]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value
  }));
  const pieColors = ['#22c55e', '#facc15', '#ef4444', '#38bdf8', '#a3a3a3'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Attendance Tracker
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your daily attendance and working hours
        </p>
      </motion.div>

      {/* Current Time & Clock In/Out */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-8 text-center bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="mb-6">
            <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {formatTime(currentTime)}
            </div>
            <div className="text-lg text-gray-600 dark:text-gray-400">
              {currentTime.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            {!todayAttendance ? (
              <Button onClick={handleClockIn} size="lg" className="flex items-center">
                <Play className="w-5 h-5 mr-2" />
                Clock In
              </Button>
            ) : !todayAttendance.clockOut ? (
              <Button onClick={handleClockOut} size="lg" variant="outline" className="flex items-center">
                <Square className="w-5 h-5 mr-2" />
                Clock Out
              </Button>
            ) : (
              <div className="text-center">
                <Badge variant="success" className="text-lg px-4 py-2">
                  Day Complete
                </Badge>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Total hours: {todayAttendance.totalHours}h
                </p>
              </div>
            )}
          </div>

          {todayAttendance && (
            <div className="mt-6 grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Clock In</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {todayAttendance.clockIn}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">Clock Out</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {todayAttendance.clockOut || 'Not clocked out'}
                </p>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Monthly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6" hover>
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Working Days</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalWorkingDays}</p>
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
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Clock className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Hours</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalHours.toFixed(1)}h</p>
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
                <BarChart3 className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Hours/Day</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{avgHours.toFixed(1)}h</p>
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
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Attendance Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{attendanceRate.toFixed(1)}%</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Attendance Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart: Hours per Day */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hours Worked per Day</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="hours" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        {/* Pie Chart: Status Distribution */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Attendance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Recent Attendance
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Clock In</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Clock Out</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Total Hours</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                </tr>
              </thead>
              <tbody>
                {userAttendance
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 10)
                  .map((record, index) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="py-4 px-4">
                        <p className="text-gray-900 dark:text-white">
                          {new Date(record.date).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-900 dark:text-white">{record.clockIn}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-900 dark:text-white">
                          {record.clockOut || 'Not clocked out'}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-900 dark:text-white">
                          {record.totalHours ? `${record.totalHours}h` : 'N/A'}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={getStatusColor(record.status)}>
                          {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                        </Badge>
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
          </div>

          {userAttendance.length === 0 && (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No attendance records
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Start tracking your attendance by clocking in.
              </p>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default Attendance;
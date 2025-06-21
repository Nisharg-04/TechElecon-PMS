import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Plus, Edit3, Trash2, Search, Filter, Play, Square, CheckCircle, Calendar, Target, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import Modal from '../../components/Common/Modal';

const SprintManagement: React.FC = () => {
  const { sprints, projects, tasks, users, addSprint, updateSprint, deleteSprint, startSprint, completeSprint } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'planning' | 'active' | 'completed' | 'cancelled'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectId: '',
    startDate: '',
    endDate: '',
    goal: '',
    taskIds: [] as string[]
  });

  const filteredSprints = sprints.filter(sprint => {
    const matchesSearch = sprint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sprint.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || sprint.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSprint) {
      updateSprint(editingSprint.id, formData);
    } else {
      addSprint({
        ...formData,
        status: 'planning',
        createdBy: '1' // Current admin user
      });
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      projectId: '',
      startDate: '',
      endDate: '',
      goal: '',
      taskIds: []
    });
    setEditingSprint(null);
    setIsModalOpen(false);
  };

  const handleEdit = (sprint: any) => {
    setEditingSprint(sprint);
    setFormData({
      name: sprint.name,
      description: sprint.description,
      projectId: sprint.projectId,
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      goal: sprint.goal,
      taskIds: sprint.taskIds
    });
    setIsModalOpen(true);
  };

  const handleDelete = (sprintId: string) => {
    if (window.confirm('Are you sure you want to delete this sprint?')) {
      deleteSprint(sprintId);
    }
  };

  const handleStart = (sprintId: string) => {
    if (window.confirm('Are you sure you want to start this sprint?')) {
      startSprint(sprintId);
    }
  };

  const handleComplete = (sprintId: string) => {
    if (window.confirm('Are you sure you want to complete this sprint?')) {
      completeSprint(sprintId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'completed': return 'primary';
      case 'planning': return 'warning';
      case 'cancelled': return 'error';
      default: return 'secondary';
    }
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const getSprintTasks = (taskIds: string[]) => {
    return tasks.filter(task => taskIds.includes(task.id));
  };

  const getCompletedTasks = (taskIds: string[]) => {
    return getSprintTasks(taskIds).filter(task => task.status === 'done');
  };

  const calculateProgress = (taskIds: string[]) => {
    const sprintTasks = getSprintTasks(taskIds);
    const completedTasks = getCompletedTasks(taskIds);
    return sprintTasks.length > 0 ? (completedTasks.length / sprintTasks.length) * 100 : 0;
  };

  const availableTasks = tasks.filter(task => 
    formData.projectId ? task.projectId === formData.projectId : true
  );

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
            Sprint Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Plan, track, and manage development sprints
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Sprint
        </Button>
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
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sprints</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{sprints.length}</p>
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
                <Play className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sprints.filter(s => s.status === 'active').length}
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
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sprints.filter(s => s.status === 'completed').length}
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
                <Calendar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Planning</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {sprints.filter(s => s.status === 'planning').length}
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
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search sprints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Sprints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSprints.map((sprint, index) => {
          const progress = calculateProgress(sprint.taskIds);
          const sprintTasks = getSprintTasks(sprint.taskIds);
          const completedTasks = getCompletedTasks(sprint.taskIds);

          return (
            <motion.div
              key={sprint.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="p-6" hover>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                      <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{sprint.name}</h3>
                      <Badge variant={getStatusColor(sprint.status)} size="sm">
                        {sprint.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {sprint.status === 'planning' && (
                      <Button size="sm" variant="ghost" onClick={() => handleStart(sprint.id)}>
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                    {sprint.status === 'active' && (
                      <Button size="sm" variant="ghost" onClick={() => handleComplete(sprint.id)}>
                        <Square className="w-4 h-4" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(sprint)}>
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(sprint.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {sprint.description}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Progress</span>
                    <span className="font-medium text-gray-900 dark:text-white">{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Target className="w-4 h-4 mr-1" />
                      {completedTasks.length}/{sprintTasks.length} tasks
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(sprint.endDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">Project:</p>
                    <p>{getProjectName(sprint.projectId)}</p>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <p className="font-medium">Goal:</p>
                    <p className="line-clamp-2">{sprint.goal}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Sprint Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={editingSprint ? 'Edit Sprint' : 'Create New Sprint'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sprint Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Project
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value, taskIds: [] })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              required
            >
              <option value="">Select Project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sprint Goal
            </label>
            <textarea
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="What do you want to achieve in this sprint?"
              required
            />
          </div>

          {formData.projectId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tasks ({formData.taskIds.length} selected)
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg p-2">
                {availableTasks.map(task => (
                  <label key={task.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded">
                    <input
                      type="checkbox"
                      checked={formData.taskIds.includes(task.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({ ...formData, taskIds: [...formData.taskIds, task.id] });
                        } else {
                          setFormData({ ...formData, taskIds: formData.taskIds.filter(id => id !== task.id) });
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">{task.title}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <Button type="submit" fullWidth>
              {editingSprint ? 'Update Sprint' : 'Create Sprint'}
            </Button>
            <Button type="button" variant="outline" fullWidth onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SprintManagement;
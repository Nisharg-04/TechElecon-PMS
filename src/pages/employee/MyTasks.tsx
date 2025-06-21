import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Search, Filter, Calendar, Clock, Edit3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Badge from '../../components/Common/Badge';
import Modal from '../../components/Common/Modal';

const MyTasks: React.FC = () => {
  const { currentUser, tasks, projects, updateTask, addComment } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in-progress' | 'review' | 'done'>('all');
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [comment, setComment] = useState('');

  // Get tasks assigned to current user
  const myTasks = tasks.filter(task => task.assignedTo === currentUser?.id);

  const filteredTasks = myTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
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

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : 'Unknown Project';
  };

  const handleStatusUpdate = (taskId: string, newStatus: string) => {
    updateTask(taskId, { status: newStatus });
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleAddComment = () => {
    if (comment.trim() && selectedTask) {
      addComment({
        taskId: selectedTask.id,
        userId: currentUser?.id || '',
        content: comment
      });
      setComment('');
    }
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date() && selectedTask?.status !== 'done';
  };

  const taskStats = {
    total: myTasks.length,
    todo: myTasks.filter(t => t.status === 'todo').length,
    inProgress: myTasks.filter(t => t.status === 'in-progress').length,
    review: myTasks.filter(t => t.status === 'review').length,
    done: myTasks.filter(t => t.status === 'done').length,
    overdue: myTasks.filter(t => isOverdue(t.deadline)).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Tasks
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your assigned tasks and track progress
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4" hover>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{taskStats.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4" hover>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-500">{taskStats.todo}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">To Do</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4" hover>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4" hover>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{taskStats.review}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Review</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-4" hover>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{taskStats.done}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Done</p>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-4" hover>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{taskStats.overdue}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Overdue</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
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
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tasks List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="p-6">
          <div className="space-y-4">
            {filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                onClick={() => handleTaskClick(task)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{task.title}</h3>
                      <Badge variant={getStatusColor(task.status)} size="sm">
                        {task.status}
                      </Badge>
                      <Badge variant={getPriorityColor(task.priority)} size="sm">
                        {task.priority}
                      </Badge>
                      {isOverdue(task.deadline) && (
                        <Badge variant="error" size="sm">Overdue</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {task.description}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <CheckSquare className="w-4 h-4 mr-1" />
                        {getProjectName(task.projectId)}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Due: {new Date(task.deadline).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {task.estimatedHours}h estimated
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {task.status !== 'done' && (
                      <div className="flex space-x-1">
                        {task.status === 'todo' && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(task.id, 'in-progress');
                            }}
                          >
                            Start
                          </Button>
                        )}
                        {task.status === 'in-progress' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(task.id, 'review');
                            }}
                          >
                            Submit for Review
                          </Button>
                        )}
                        {task.status === 'review' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStatusUpdate(task.id, 'done');
                            }}
                          >
                            Mark Done
                          </Button>
                        )}
                      </div>
                    )}
                    <Button size="sm" variant="ghost">
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <CheckSquare className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No tasks found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You don't have any tasks matching your search criteria.
              </p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Task Detail Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedTask?.title}
        size="lg"
      >
        {selectedTask && (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Badge variant={getStatusColor(selectedTask.status)}>
                {selectedTask.status}
              </Badge>
              <Badge variant={getPriorityColor(selectedTask.priority)}>
                {selectedTask.priority}
              </Badge>
              {isOverdue(selectedTask.deadline) && (
                <Badge variant="error">Overdue</Badge>
              )}
            </div>

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
              <p className="text-gray-600 dark:text-gray-400">{selectedTask.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Project</h4>
                <p className="text-gray-600 dark:text-gray-400">{getProjectName(selectedTask.projectId)}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Deadline</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {new Date(selectedTask.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Estimated Hours</h4>
                <p className="text-gray-600 dark:text-gray-400">{selectedTask.estimatedHours}h</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Actual Hours</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedTask.actualHours || 0}h
                </p>
              </div>
            </div>

            {selectedTask.tags && selectedTask.tags.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTask.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Add Comment</h4>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <Button onClick={handleAddComment}>Add</Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyTasks;
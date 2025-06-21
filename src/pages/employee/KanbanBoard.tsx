import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Common/Card';
import Badge from '../../components/Common/Badge';
import Button from '../../components/Common/Button';

const KanbanBoard: React.FC = () => {
  const { currentUser, tasks, projects, updateTask } = useApp();

  // Get tasks assigned to current user
  const myTasks = tasks.filter(task => task.assignedTo === currentUser?.id);

  const columns = [
    { id: 'todo', title: 'To Do', color: 'bg-gray-100 dark:bg-gray-700' },
    { id: 'in-progress', title: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/30' },
    { id: 'review', title: 'Review', color: 'bg-yellow-100 dark:bg-yellow-900/30' },
    { id: 'done', title: 'Done', color: 'bg-green-100 dark:bg-green-900/30' }
  ];

  const getTasksByStatus = (status: string) => {
    return myTasks.filter(task => task.status === status);
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
    return project ? project.name : 'Unknown';
  };

  const onDragEnd = (result: import('react-beautiful-dnd').DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId) return;
    // Only update status if column changed
    const newStatus = destination.droppableId as 'todo' | 'in-progress' | 'review' | 'done';
    updateTask(draggableId, { status: newStatus });
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Kanban Board
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Drag and drop tasks to update their status
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {columns.map((column, index) => (
          <motion.div
            key={column.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="p-4" hover>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {getTasksByStatus(column.id).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{column.title}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Kanban Board */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column) => (
              <div key={column.id} className="space-y-4">
                <div className={`p-4 rounded-lg ${column.color}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {column.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" size="sm">
                        {getTasksByStatus(column.id).length}
                      </Badge>
                      <Button size="sm" variant="ghost">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[200px] space-y-3 p-2 rounded-lg transition-colors ${snapshot.isDraggingOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                    >
                      {getTasksByStatus(column.id).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transition-all duration-200 ${snapshot.isDragging ? 'rotate-3 scale-105' : ''}`}
                            >
                              <Card className={`p-4 cursor-grab active:cursor-grabbing ${snapshot.isDragging ? 'shadow-lg' : ''}`}>
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between">
                                    <h4 className="font-medium text-gray-900 dark:text-white text-sm line-clamp-2">
                                      {task.title}
                                    </h4>
                                    <Button size="sm" variant="ghost">
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </div>

                                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {task.description}
                                  </p>

                                  <div className="flex items-center justify-between">
                                    <Badge variant={getPriorityColor(task.priority)} size="sm">
                                      {task.priority}
                                    </Badge>
                                    {isOverdue(task.deadline) && task.status !== 'done' && (
                                      <Badge variant="error" size="sm">
                                        Overdue
                                      </Badge>
                                    )}
                                  </div>

                                  <div className="text-xs text-gray-500 dark:text-gray-500">
                                    <p className="truncate">{getProjectName(task.projectId)}</p>
                                    <p>Due: {new Date(task.deadline).toLocaleDateString()}</p>
                                  </div>

                                  {task.tags && task.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {task.tags.slice(0, 2).map((tag, tagIndex) => (
                                        <span
                                          key={tagIndex}
                                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded text-gray-600 dark:text-gray-400"
                                        >
                                          {tag}
                                        </span>
                                      ))}
                                      {task.tags.length > 2 && (
                                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded text-gray-600 dark:text-gray-400">
                                          +{task.tags.length - 2}
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500">
                                    <span>{task.estimatedHours}h</span>
                                    <span>
                                      {task.actualHours ? `${task.actualHours}h logged` : 'No time logged'}
                                    </span>
                                  </div>
                                </div>
                              </Card>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </motion.div>

      {/* Empty State */}
      {myTasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tasks assigned
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              You don't have any tasks assigned to you yet.
            </p>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default KanbanBoard;
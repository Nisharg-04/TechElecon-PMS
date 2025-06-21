export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  avatar?: string;
  joinDate: string;
  isActive: boolean;
  lastLogin?: string;
  department?: string;
  position?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on-hold' | 'cancelled';
  startDate: string;
  endDate: string;
  deadline: string;
  progress: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  teamMembers: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  projectId: string;
  sprintId?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  deadline: string;
  estimatedHours: number;
  actualHours?: number;
  tags: string[];
  attachments?: string[];
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  description: string;
  entityType: 'project' | 'task' | 'user' | 'system' | 'sprint';
  entityId?: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Attendance {
  id: string;
  userId: string;
  date: string;
  clockIn: string;
  clockOut?: string;
  totalHours?: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
}

export interface Sprint {
  id: string;
  name: string;
  description: string;
  projectId: string;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  goal: string;
  taskIds: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface Performance {
  userId: string;
  period: string;
  tasksCompleted: number;
  tasksAssigned: number;
  averageCompletionTime: number;
  onTimeDelivery: number;
  qualityScore: number;
  totalHours: number;
}
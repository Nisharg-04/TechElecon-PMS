import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Project, Task, Comment, ActivityLog, Notification, Attendance, Sprint } from '../types';
import toast from 'react-hot-toast';

// Import mock data
import usersData from '../data/users.json';
import projectsData from '../data/projects.json';
import tasksData from '../data/tasks.json';
import commentsData from '../data/comments.json';
import notificationsData from '../data/notifications.json';
import attendanceData from '../data/attendance.json';
import activityLogsData from '../data/activityLogs.json';
import sprintsData from '../data/sprints.json';

interface AppContextType {
  // Auth
  currentUser: User | null;
  login: (email: string, password: string, role: 'admin' | 'employee') => boolean;
  logout: () => void;
  
  // Users
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  
  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  
  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  
  // Comments
  comments: Comment[];
  addComment: (comment: Omit<Comment, 'id'>) => void;
  
  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  
  // Attendance
  attendance: Attendance[];
  clockIn: (userId: string) => void;
  clockOut: (userId: string) => void;
  
  // Activity Logs
  activityLogs: ActivityLog[];
  addActivityLog: (log: Omit<ActivityLog, 'id'>) => void;
  
  // Sprints
  sprints: Sprint[];
  addSprint: (sprint: Omit<Sprint, 'id'>) => void;
  updateSprint: (id: string, sprint: Partial<Sprint>) => void;
  deleteSprint: (id: string) => void;
  startSprint: (id: string) => void;
  completeSprint: (id: string) => void;
  
  // UI State
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  // Auth state
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Data state
  const [users, setUsers] = useState<User[]>(usersData as User[]);
  const [projects, setProjects] = useState<Project[]>(projectsData as Project[]);
  const [tasks, setTasks] = useState<Task[]>(tasksData as Task[]);
  const [comments, setComments] = useState<Comment[]>(commentsData as Comment[]);
  const [notifications, setNotifications] = useState<Notification[]>(notificationsData as Notification[]);
  const [attendance, setAttendance] = useState<Attendance[]>(attendanceData as Attendance[]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(activityLogsData as ActivityLog[]);
  const [sprints, setSprints] = useState<Sprint[]>(sprintsData as Sprint[]);
  
  // UI state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Auth functions
  const login = (email: string, password: string, role: 'admin' | 'employee'): boolean => {
    const user = users.find(u => u.email === email && u.role === role);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      toast.success(`Welcome back, ${user.name}!`);
      return true;
    }
    toast.error('Invalid credentials');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    toast.success('Logged out successfully');
  };

  // Initialize current user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // User functions
  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = { ...user, id: Date.now().toString() };
    setUsers(prev => [...prev, newUser]);
    toast.success('User added successfully');
  };

  const updateUser = (id: string, updatedUser: Partial<User>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updatedUser } : user
    ));
    
    // Update current user if it's the same user
    if (currentUser?.id === id) {
      const updated = { ...currentUser, ...updatedUser };
      setCurrentUser(updated);
      localStorage.setItem('currentUser', JSON.stringify(updated));
    }
    
    toast.success('User updated successfully');
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    toast.success('User deleted successfully');
  };

  // Project functions
  const addProject = (project: Omit<Project, 'id'>) => {
    const newProject = { 
      ...project, 
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setProjects(prev => [...prev, newProject]);
    toast.success('Project created successfully');
  };

  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === id ? { ...project, ...updatedProject, updatedAt: new Date().toISOString() } : project
    ));
    toast.success('Project updated successfully');
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(project => project.id !== id));
    setTasks(prev => prev.filter(task => task.projectId !== id));
    toast.success('Project deleted successfully');
  };

  // Task functions
  const addTask = (task: Omit<Task, 'id'>) => {
    const newTask = { 
      ...task, 
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    toast.success('Task created successfully');
  };

  const updateTask = (id: string, updatedTask: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updatedTask, updatedAt: new Date().toISOString() } : task
    ));
    toast.success('Task updated successfully');
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    setComments(prev => prev.filter(comment => comment.taskId !== id));
    toast.success('Task deleted successfully');
  };

  // Comment functions
  const addComment = (comment: Omit<Comment, 'id'>) => {
    const newComment = { 
      ...comment, 
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setComments(prev => [...prev, newComment]);
    toast.success('Comment added successfully');
  };

  // Notification functions
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  // Attendance functions
  const clockIn = (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().split(' ')[0];
    
    const existingAttendance = attendance.find(a => a.userId === userId && a.date === today);
    if (existingAttendance) {
      toast.error('Already clocked in today');
      return;
    }

    const newAttendance: Attendance = {
      id: Date.now().toString(),
      userId,
      date: today,
      clockIn: now,
      status: 'present'
    };

    setAttendance(prev => [...prev, newAttendance]);
    toast.success('Clocked in successfully');
  };

  const clockOut = (userId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date().toTimeString().split(' ')[0];
    
    const todayAttendance = attendance.find(a => a.userId === userId && a.date === today);
    if (!todayAttendance) {
      toast.error('No clock-in record found for today');
      return;
    }

    if (todayAttendance.clockOut) {
      toast.error('Already clocked out');
      return;
    }

    const clockInTime = new Date(`${today}T${todayAttendance.clockIn}`);
    const clockOutTime = new Date(`${today}T${now}`);
    const totalHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);

    setAttendance(prev => prev.map(a => 
      a.id === todayAttendance.id 
        ? { ...a, clockOut: now, totalHours: Math.round(totalHours * 100) / 100 }
        : a
    ));
    toast.success('Clocked out successfully');
  };

  // Activity log functions
  const addActivityLog = (log: Omit<ActivityLog, 'id'>) => {
    const newLog = { 
      ...log, 
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Sprint functions
  const addSprint = (sprint: Omit<Sprint, 'id'>) => {
    const newSprint = {
      ...sprint,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSprints(prev => [...prev, newSprint]);
    toast.success('Sprint created successfully');
  };

  const updateSprint = (id: string, updatedSprint: Partial<Sprint>) => {
    setSprints(prev => prev.map(sprint =>
      sprint.id === id ? { ...sprint, ...updatedSprint, updatedAt: new Date().toISOString() } : sprint
    ));
    toast.success('Sprint updated successfully');
  };

  const deleteSprint = (id: string) => {
    setSprints(prev => prev.filter(sprint => sprint.id !== id));
    toast.success('Sprint deleted successfully');
  };

  const startSprint = (id: string) => {
    setSprints(prev => prev.map(sprint =>
      sprint.id === id ? { 
        ...sprint, 
        status: 'active', 
        startedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } : sprint
    ));
    toast.success('Sprint started successfully');
  };

  const completeSprint = (id: string) => {
    setSprints(prev => prev.map(sprint =>
      sprint.id === id ? { 
        ...sprint, 
        status: 'completed', 
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } : sprint
    ));
    toast.success('Sprint completed successfully');
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value: AppContextType = {
    // Auth
    currentUser,
    login,
    logout,
    
    // Users
    users,
    addUser,
    updateUser,
    deleteUser,
    
    // Projects
    projects,
    addProject,
    updateProject,
    deleteProject,
    
    // Tasks
    tasks,
    addTask,
    updateTask,
    deleteTask,
    
    // Comments
    comments,
    addComment,
    
    // Notifications
    notifications,
    markNotificationRead,
    
    // Attendance
    attendance,
    clockIn,
    clockOut,
    
    // Activity Logs
    activityLogs,
    addActivityLog,
    
    // Sprints
    sprints,
    addSprint,
    updateSprint,
    deleteSprint,
    startSprint,
    completeSprint,
    
    // UI State
    theme,
    toggleTheme,
    sidebarOpen,
    setSidebarOpen
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
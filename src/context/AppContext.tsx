import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import  { User, Project, Task } from '../types';
import toast from 'react-hot-toast';


import usersData from '../data/users.json';
import projectsData from '../data/projects.json';
import tasksData from '../data/tasks.json';



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
  
  tasks: Task[];
  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  
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


  
  // UI state
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
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
    
    tasks,
    // UI State
    theme,
    toggleTheme,
    sidebarOpen,
    setSidebarOpen
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
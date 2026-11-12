'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  User, 
  Project, 
  Proposal, 
  Notification, 
  Review, 
  PortfolioItem, 
  FilterState, 
  ApplicationStatus,
  UserRole
} from '@/types';
import { DataService } from '@/lib/dataService';
import { AuthService } from '@/lib/authService';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  projects: Project[];
  proposals: Proposal[];
  notifications: Notification[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  
  // Switch current user / role / auth
  setCurrentUser: (user: User | null) => void;
  switchUserRole: (role: UserRole) => void;
  signOut: () => Promise<void>;
  
  // Actions
  applyForProject: (proposal: Omit<Proposal, 'id' | 'submittedAt' | 'status'>) => Promise<boolean>;
  publishProject: (project: Omit<Project, 'id' | 'createdAt' | 'proposalsCount' | 'status'>) => Promise<boolean>;
  updateProposalStatus: (proposalId: string, status: ApplicationStatus, feedback?: string) => Promise<void>;
  updateStudentProfile: (updatedData: Partial<User>) => Promise<void>;
  addPortfolioItem: (item: Omit<PortfolioItem, 'id' | 'createdAt'>) => Promise<void>;
  deletePortfolioItem: (itemId: string) => Promise<void>;
  submitReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  
  // Modals & triggers
  selectedProjectForApply: Project | null;
  setSelectedProjectForApply: (project: Project | null) => void;
  selectedProjectForMatch: Project | null;
  setSelectedProjectForMatch: (project: Project | null) => void;
  isPublishModalOpen: boolean;
  setIsPublishModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  
  // Computed helpers
  filteredProjects: Project[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const defaultFilters: FilterState = {
  searchQuery: '',
  locationQuery: '',
  category: 'All',
  experienceLevels: [],
  projectType: 'Any',
  budgetRange: 'Any',
  proposalsRange: 'Any',
  onlyRecommended: false,
  sortBy: 'newest',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<string>('find-project');
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Modals state
  const [selectedProjectForApply, setSelectedProjectForApply] = useState<Project | null>(null);
  const [selectedProjectForMatch, setSelectedProjectForMatch] = useState<Project | null>(null);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const refreshData = useCallback(async () => {
    try {
      const [loadedUsers, loadedProjects, loadedProposals] = await Promise.all([
        DataService.getUsers(),
        DataService.getProjects(),
        DataService.getProposals(),
      ]);

      setUsers(loadedUsers);
      setProjects(loadedProjects);
      setProposals(loadedProposals);

      setCurrentUser((prev) => {
        if (prev) {
          const updated = loadedUsers.find((u) => u.id === prev.id);
          return updated || prev;
        }
        return null;
      });
    } catch (e) {
      console.error('Error refreshing Firestore data:', e);
    }
  }, []);

  // Initial load and real-time Firestore listeners
  useEffect(() => {
    refreshData();

    // Clean any old demo local storage keys
    if (typeof window !== 'undefined') {
      localStorage.removeItem('prilans_firebase_config');
      localStorage.removeItem('prilans_projects_v1');
      localStorage.removeItem('prilans_users_v1');
      localStorage.removeItem('prilans_proposals_v1');
      localStorage.removeItem('prilans_notifications_v1');
    }

    // Set up pure real-time Firestore listeners
    const unsubProjects = DataService.subscribeToProjects((liveProjects) => {
      setProjects(liveProjects);
    });

    const unsubUsers = DataService.subscribeToUsers((liveUsers) => {
      setUsers(liveUsers);
    });

    const unsubProposals = DataService.subscribeToProposals((liveProps) => {
      setProposals(liveProps);
    });

    const unsubAuth = AuthService.onAuthState(async (fbUser) => {
      if (fbUser) {
        const user = await DataService.getUserById(fbUser.uid);
        if (user) {
          setCurrentUser(user);
        }
      }
    });

    return () => {
      if (unsubProjects) unsubProjects();
      if (unsubUsers) unsubUsers();
      if (unsubProposals) unsubProposals();
      if (unsubAuth) unsubAuth();
    };
  }, [refreshData]);

  // Load user notifications when currentUser changes
  useEffect(() => {
    if (currentUser) {
      DataService.getNotifications(currentUser.id).then(setNotifications);
    }
  }, [currentUser]);

  // Quick switch role if user exists in Firestore
  const switchUserRole = (role: UserRole) => {
    const target = users.find((u) => u.role === role);
    if (target) {
      setCurrentUser(target);
    }
  };

  const signOut = async () => {
    await AuthService.logout();
    setCurrentUser(null);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Actions writing directly to Firebase Firestore
  const applyForProject = async (
    proposalData: Omit<Proposal, 'id' | 'submittedAt' | 'status'>
  ): Promise<boolean> => {
    const newProposal: Proposal = {
      ...proposalData,
      id: `prop-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    await DataService.applyForProject(newProposal);
    return true;
  };

  const publishProject = async (
    projectData: Omit<Project, 'id' | 'createdAt' | 'proposalsCount' | 'status'>
  ): Promise<boolean> => {
    const newProject: Project = {
      ...projectData,
      id: `proj-${Date.now()}`,
      proposalsCount: 0,
      status: 'open',
      createdAt: new Date().toISOString(),
      timeAgo: 'Just now',
    };

    await DataService.addProject(newProject);
    return true;
  };

  const updateProposalStatus = async (
    proposalId: string, 
    status: ApplicationStatus, 
    feedback?: string
  ) => {
    await DataService.updateProposalStatus(proposalId, status, feedback);
  };

  const updateStudentProfile = async (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updated: User = { ...currentUser, ...updatedData };
    await DataService.updateUser(updated);
    setCurrentUser(updated);
  };

  const addPortfolioItem = async (item: Omit<PortfolioItem, 'id' | 'createdAt'>) => {
    if (!currentUser) return;
    const newItem: PortfolioItem = {
      ...item,
      id: `port-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    const updatedPortfolio = [newItem, ...(currentUser.portfolio || [])];
    await updateStudentProfile({ portfolio: updatedPortfolio });
  };

  const deletePortfolioItem = async (itemId: string) => {
    if (!currentUser) return;
    const updatedPortfolio = (currentUser.portfolio || []).filter((p) => p.id !== itemId);
    await updateStudentProfile({ portfolio: updatedPortfolio });
  };

  const submitReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
    const newReview: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    await DataService.submitReview(newReview);
  };

  const deleteProject = async (projectId: string) => {
    await DataService.deleteProject(projectId);
  };

  const markNotificationAsRead = async (id: string) => {
    await DataService.markNotificationRead(id);
    if (currentUser) {
      const notifs = await DataService.getNotifications(currentUser.id);
      setNotifications(notifs);
    }
  };

  // Filter & Search Logic
  const filteredProjects = projects.filter((project) => {
    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const matchTitle = project.title.toLowerCase().includes(q);
      const matchDesc = project.description.toLowerCase().includes(q);
      const matchCategory = project.category.toLowerCase().includes(q);
      const matchSkills = (project.skillsRequired || []).some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchDesc && !matchCategory && !matchSkills) {
        return false;
      }
    }

    // Location query
    if (filters.locationQuery.trim()) {
      const loc = filters.locationQuery.toLowerCase().trim();
      const matchLoc = project.location?.toLowerCase().includes(loc) || 
                       project.client?.country?.toLowerCase().includes(loc);
      if (!matchLoc) return false;
    }

    // Category filter
    if (filters.category && filters.category !== 'All') {
      if (project.category.toLowerCase() !== filters.category.toLowerCase()) {
        return false;
      }
    }

    // Experience level filter
    if (filters.experienceLevels.length > 0) {
      if (!filters.experienceLevels.includes(project.experienceLevel)) {
        return false;
      }
    }

    // Project type filter (Hourly vs Fixed Price)
    if (filters.projectType && filters.projectType !== 'Any') {
      if (project.projectType !== filters.projectType) {
        return false;
      }
    }

    // Budget range filter
    if (filters.budgetRange && filters.budgetRange !== 'Any') {
      const budget = project.budget;
      if (filters.budgetRange === '<100' && budget >= 100) return false;
      if (filters.budgetRange === '100-500' && (budget < 100 || budget > 500)) return false;
      if (filters.budgetRange === '500-1000' && (budget < 500 || budget > 1000)) return false;
      if (filters.budgetRange === '1000-5000' && (budget < 1000 || budget > 5000)) return false;
      if (filters.budgetRange === '5000+' && budget < 5000) return false;
    }

    // Proposals count filter
    if (filters.proposalsRange && filters.proposalsRange !== 'Any') {
      const count = project.proposalsCount || 0;
      if (filters.proposalsRange === '<5' && count >= 5) return false;
      if (filters.proposalsRange === '5-10' && (count < 5 || count > 10)) return false;
      if (filters.proposalsRange === '10-15' && (count < 10 || count > 15)) return false;
      if (filters.proposalsRange === '15-20' && (count < 15 || count > 20)) return false;
    }

    // Skill-based recommendation filter
    if (filters.onlyRecommended && currentUser && currentUser.role === 'student') {
      const match = DataService.calculateProjectMatch(currentUser.skills || [], project.skillsRequired || []);
      if (match.score < 40) return false;
    }

    return true;
  }).sort((a, b) => {
    if (filters.sortBy === 'highest_budget') return b.budget - a.budget;
    if (filters.sortBy === 'lowest_budget') return a.budget - b.budget;
    if (filters.sortBy === 'most_proposals') return (b.proposalsCount || 0) - (a.proposalsCount || 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        projects,
        proposals,
        notifications,
        activeTab,
        setActiveTab,
        filters,
        setFilters,
        resetFilters,
        setCurrentUser,
        switchUserRole,
        signOut,
        applyForProject,
        publishProject,
        updateProposalStatus,
        updateStudentProfile,
        addPortfolioItem,
        deletePortfolioItem,
        submitReview,
        deleteProject,
        selectedProjectForApply,
        setSelectedProjectForApply,
        selectedProjectForMatch,
        setSelectedProjectForMatch,
        isPublishModalOpen,
        setIsPublishModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        filteredProjects,
        unreadNotificationsCount,
        markNotificationAsRead,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

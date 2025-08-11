import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import { apiService } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'CUSTOMER' | 'FACILITY_OWNER' | 'ADMIN';
  avatar?: string;
  status: 'ACTIVE' | 'BANNED' | 'SUSPENDED';
  createdAt: string;
}

interface UserStats {
  totalBookings: number;
  completedBookings: number;
  upcomingBookings: number;
  totalSpent: number;
  favoriteVenues: any[];
  recentActivity: any[];
}

interface AuthContextType {
  user: User | null;
  userStats: UserStats | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: { name?: string; phone?: string }) => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshStats: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const refreshUser = async () => {
    try {
      const response = await apiService.getCurrentUser();
      setUser(response.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    }
  };

  const refreshStats = async () => {
    try {
      const stats = await apiService.getUserStats();
      setUserStats(stats);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.login(email, password);
      setUser(response.user);
      await refreshStats();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await apiService.register(userData);
      setUser(response.user);
      await refreshStats();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
    setUserStats(null);
  };

  const updateProfile = async (userData: { name?: string; phone?: string }) => {
    try {
      const response = await apiService.updateProfile(userData);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  // Initialize user on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await refreshUser();
          await refreshStats();
        } catch (error) {
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const value: AuthContextType = {
    user,
    userStats,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    refreshUser,
    refreshStats,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

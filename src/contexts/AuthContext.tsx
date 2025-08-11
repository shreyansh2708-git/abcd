import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { apiService } from '@/services/api';

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshStats: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await apiService.getCurrentUser();
      // Map the backend user format to frontend User type
      const mappedUser: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role.toLowerCase() as 'customer' | 'facility_owner' | 'admin',
        phone: response.user.phone,
        avatar: response.user.avatar,
        status: response.user.status.toLowerCase() as 'active' | 'banned' | 'suspended',
        createdAt: new Date(response.user.createdAt),
      };
      setUser(mappedUser);
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

  useEffect(() => {
    // Check for stored token on app start
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.login(email, password);
      // Map the backend user format to frontend User type
      const mappedUser: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role.toLowerCase() as 'customer' | 'facility_owner' | 'admin',
        phone: response.user.phone,
        avatar: response.user.avatar,
        status: response.user.status.toLowerCase() as 'active' | 'banned' | 'suspended',
        createdAt: new Date(response.user.createdAt),
      };
      setUser(mappedUser);
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

  const register = async (userData: Partial<User> & { password: string }) => {
    setIsLoading(true);
    try {
      const registrationData = {
        name: userData.name!,
        email: userData.email!,
        password: userData.password,
        phone: userData.phone,
        role: (userData.role === 'facility_owner' ? 'FACILITY_OWNER' : 'CUSTOMER') as 'FACILITY_OWNER' | 'CUSTOMER',
      };
      
      const response = await apiService.register(registrationData);
      // Map the backend user format to frontend User type
      const mappedUser: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role.toLowerCase() as 'customer' | 'facility_owner' | 'admin',
        phone: response.user.phone,
        avatar: response.user.avatar,
        status: response.user.status.toLowerCase() as 'active' | 'banned' | 'suspended',
        createdAt: new Date(response.user.createdAt),
      };
      setUser(mappedUser);
      await refreshStats();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const updateData = {
        name: userData.name,
        phone: userData.phone,
      };
      
      const response = await apiService.updateProfile(updateData);
      // Map the backend user format to frontend User type
      const mappedUser: User = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role.toLowerCase() as 'customer' | 'facility_owner' | 'admin',
        phone: response.user.phone,
        avatar: response.user.avatar,
        status: response.user.status.toLowerCase() as 'active' | 'banned' | 'suspended',
        createdAt: new Date(response.user.createdAt),
      };
      setUser(mappedUser);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userStats,
      login,
      logout,
      register,
      updateProfile,
      refreshUser,
      refreshStats,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

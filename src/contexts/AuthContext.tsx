import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '@/types/user';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('crowd_mgmt_user');
    if (storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
      });
    }
  }, []);

  const login = async (email: string, password: string, role: string) => {
    // Simulated authentication
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      role: role as User['role'],
      name: email.split('@')[0],
    };

    localStorage.setItem('crowd_mgmt_user', JSON.stringify(user));
    setAuthState({
      user,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    localStorage.removeItem('crowd_mgmt_user');
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
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

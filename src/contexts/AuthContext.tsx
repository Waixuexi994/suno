import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('harmonyai_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('harmonyai_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      // Simulate authentication - in a real app, this would be an API call
      if (email && password.length >= 6) {
        const userData: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          email: email,
          picture: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=6366f1&color=fff&size=128`,
        };

        setUser(userData);
        localStorage.setItem('harmonyai_user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      } else {
        setError('Please enter a valid email and password (minimum 6 characters)');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('harmonyai_user');
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
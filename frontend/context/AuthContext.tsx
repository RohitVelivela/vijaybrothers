import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

// Helper function to get a cookie by name
export const getCookie = (name: string) => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) {
      const cookieValue = c.substring(nameEQ.length, c.length);
      return cookieValue;
    }
  }
  return null;
};

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean; // Add loading state
  login: (token: string) => void;
  logout: () => void;
  setUser: (user: User | null) => void; // Add setUser to context
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Initialize loading to true

  useEffect(() => {
    const token = getCookie('token');
    if (token) {
      setIsAuthenticated(true);
      fetchUserProfile(token);
    } else {
      setLoading(false); // No token, so not loading auth status
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser({
          name: userData.userName,
          email: userData.email,
          profileImageUrl: userData.profileImageUrl, // Include profileImageUrl
        });
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user profile', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (token: string) => {
    document.cookie = `token=${token}; path=/; max-age=3600`; // Store token in cookie
    setIsAuthenticated(true);
    fetchUserProfile(token);
  };

  const logout = async () => {
    const token = getCookie('token');
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
      } catch (error) {
        console.error('Error during logout API call:', error);
      }
    }
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // Clear the token cookie
    setIsAuthenticated(false);
    setUser(null);
    router.push('/admin/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, setUser }}>
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

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { API_BASE_URL } from '../lib/api';

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

export function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

export function eraseCookie(name: string) {
  document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

interface User {
  id: number; // Add id property
  name: string;
  email: string;
  profileImageUrl?: string;
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
      const response = await fetch(`http://localhost:8080/api/admin/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser({
          id: userData.id,
          name: userData.userName,
          email: userData.email,
          profileImageUrl: userData.profileImageUrl, // Include profileImageUrl
        });
        setIsAuthenticated(true);
      } else if (response.status === 401) {
        // Only reset auth state for unauthorized errors
        setIsAuthenticated(false);
        setUser(null);
      }
      // For other errors (500, etc.), keep existing auth state
    } catch (error) {
      console.error('Profile fetch error:', error);
      // Don't reset auth state for network errors - keep existing state
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
        await fetch(`${API_BASE_URL}/admin/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });
      } catch (error) {
        
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
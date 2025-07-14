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
      console.log(`getCookie: Found cookie '${name}' with value: ${cookieValue}`); // DEBUG
      return cookieValue;
    }
  }
  console.log(`getCookie: Cookie '${name}' not found.`); // DEBUG
  return null;
};

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();

  const login = (token: string) => {
    document.cookie = `token=${token}; path=/; max-age=3600`; // Store token in cookie
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
        // Even if API call fails, proceed with client-side logout
      }
    }
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; // Clear the token cookie
    setIsAuthenticated(false); // Update state after logout
    router.push('/admin/login'); // Redirect to admin login page after logout
  };

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // Initialize to false

  useEffect(() => {
    // This code runs only on the client-side
    const token = getCookie('token');
    setIsAuthenticated(!!token);
  }, []); // Empty dependency array means this runs once on mount

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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

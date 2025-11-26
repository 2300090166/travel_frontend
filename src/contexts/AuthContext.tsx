import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_BASE } from '@/lib/backend';

interface User {
  username: string;
  email: string;
  isAdmin?: boolean;
  profilePic?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('travelease_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signUp = async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (res.ok) {
        return { success: true };
      } else if (res.status === 409) {
        return { success: false, error: 'Username already exists. Please choose another one.' };
      } else {
        const errorText = await res.text();
        return { success: false, error: errorText || 'Sign up failed. Please try again.' };
      }
    } catch (error) {
      console.error('Sign up error - backend not available:', error);
      return { success: false, error: 'Sign up failed. Something went wrong. Please ensure the backend is running.' };
    }
  };

  const signIn = async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const userData = {
          username: data.username,
          email: data.email,
          isAdmin: data.role === 'ADMIN',
          profilePic: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.username}`,
        };
        setUser(userData);
        localStorage.setItem('travelease_user', JSON.stringify(userData));
        if (data.token) {
          localStorage.setItem('travelease_token', data.token);
        }
        return { success: true };
      } else if (res.status === 401) {
        return { success: false, error: 'Invalid username or password.' };
      } else {
        const errorText = await res.text();
        return { success: false, error: errorText || 'Sign in failed. Please try again.' };
      }
    } catch (error) {
      console.error('Sign in error - backend not available:', error);
      return { success: false, error: 'Sign in failed. Something went wrong. Please ensure the backend is running.' };
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('travelease_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signUp, signOut }}>
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

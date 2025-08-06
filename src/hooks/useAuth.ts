import { useState, useCallback, useEffect } from 'react';
import { User, AuthState, LoginCredentials, SignupCredentials } from '../types/auth';

const STORAGE_KEY = 'gemini-clone-auth';
const USERS_KEY = 'gemini-clone-users';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  // Load auth state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const user = {
          ...parsed,
          createdAt: new Date(parsed.createdAt)
        };
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (error) {
        console.error('Failed to load auth state:', error);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const getUsers = useCallback((): User[] => {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored).map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt)
        }));
      } catch {
        return [];
      }
    }
    return [];
  }, []);

  const saveUser = useCallback((user: User) => {
    const users = getUsers();
    const updatedUsers = [...users.filter(u => u.id !== user.id), user];
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  }, [getUsers]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const users = getUsers();
    const user = users.find(u => u.email === credentials.email);

    if (!user) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error('User not found. Please check your email or sign up.');
    }

    // In a real app, you'd verify the password hash
    // For demo purposes, we'll just check if password is not empty
    if (!credentials.password) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error('Please enter your password.');
    }

    const authUser = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    
    setAuthState({
      user: authUser,
      isAuthenticated: true,
      isLoading: false
    });
  }, [getUsers]);

  const signup = useCallback(async (credentials: SignupCredentials): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true }));

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.password !== credentials.confirmPassword) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error('Passwords do not match.');
    }

    if (credentials.password.length < 6) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error('Password must be at least 6 characters long.');
    }

    const users = getUsers();
    const existingUser = users.find(u => u.email === credentials.email);

    if (existingUser) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw new Error('An account with this email already exists.');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: credentials.email,
      name: credentials.name,
      createdAt: new Date()
    };

    saveUser(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));

    setAuthState({
      user: newUser,
      isAuthenticated: true,
      isLoading: false
    });
  }, [getUsers, saveUser]);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  }, []);

  return {
    ...authState,
    login,
    signup,
    logout
  };
};
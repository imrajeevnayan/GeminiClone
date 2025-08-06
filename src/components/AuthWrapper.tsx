import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { useAuth } from '../hooks/useAuth';

export const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, login, signup } = useAuth();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const handleLogin = async (credentials: any) => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      await login(credentials);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (credentials: any) => {
    setAuthError(null);
    setAuthLoading(true);
    try {
      await signup(credentials);
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setAuthLoading(false);
    }
  };

  const switchToSignup = () => {
    setIsLoginMode(false);
    setAuthError(null);
  };

  const switchToLogin = () => {
    setIsLoginMode(true);
    setAuthError(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-lg"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return isLoginMode ? (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToSignup={switchToSignup}
        isLoading={authLoading}
        error={authError}
      />
    ) : (
      <SignupForm
        onSignup={handleSignup}
        onSwitchToLogin={switchToLogin}
        isLoading={authLoading}
        error={authError}
      />
    );
  }

  return <>{children}</>;
};
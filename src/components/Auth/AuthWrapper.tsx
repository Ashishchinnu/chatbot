import React, { useState } from 'react';
import { useAuthenticationStatus } from '@nhost/react';
import SignIn from './SignIn';
import SignUp from './SignUp';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthenticationStatus();
  const [isSignUp, setIsSignUp] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return isSignUp ? (
      <SignUp onToggleMode={() => setIsSignUp(false)} />
    ) : (
      <SignIn onToggleMode={() => setIsSignUp(true)} />
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
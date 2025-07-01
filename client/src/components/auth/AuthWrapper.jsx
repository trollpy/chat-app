import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AuthWrapper = ({ children, type = 'protected' }) => {
  const { user } = useAuth();

  if (type === 'protected') {
    return user ? children : <Navigate to="/login" replace />;
  }

  if (type === 'guest') {
    return !user ? children : <Navigate to="/" replace />;
  }

  return children;
};

export default AuthWrapper;
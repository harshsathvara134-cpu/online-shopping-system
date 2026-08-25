import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logSecurityEvent } from '../../utils/securityLogger';

interface CustomerRouteGuardProps {
  children: React.ReactNode;
}

export const CustomerRouteGuard: React.FC<CustomerRouteGuardProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    if (!isAuthenticated) {
      logSecurityEvent('AUTH_UNAUTHORIZED_ACCESS', {
        action: `Unauthenticated access attempt to customer route: ${location.pathname}`,
        resource: 'CUSTOMER_PORTAL',
        status: 'FAILURE',
        details: { attemptedPath: location.pathname },
      });
    }
  }, [isAuthenticated, location.pathname]);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location.pathname, message: 'Please sign in to access your account dashboard.' }} replace />;
  }

  return <>{children}</>;
};

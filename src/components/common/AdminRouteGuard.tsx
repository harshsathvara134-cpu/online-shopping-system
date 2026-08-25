import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logSecurityEvent } from '../../utils/securityLogger';
import { isSessionExpired, isSessionInactive } from '../../utils/security';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const { user, currentSession, isAuthenticated, isAdmin, is2faVerified } = useAuth();
  const location = useLocation();

  const adminSess = isAdmin && currentSession ? (currentSession as import('../../types').AdminSession) : null;
  const isSessionValid = adminSess && !isSessionExpired(adminSess) && !isSessionInactive(adminSess);
  const is2FACompliant = !user?.two_factor_enabled || is2faVerified;
  const isAuthorized = isAuthenticated && isAdmin && isSessionValid && is2FACompliant;

  useEffect(() => {
    if (!isAuthorized) {
      logSecurityEvent('AUTHORIZATION_DENIED', {
        userId: user?.user_id,
        email: user?.email,
        action: `Unauthorized access attempt to admin route: ${location.pathname}`,
        resource: 'ADMIN_PORTAL',
        status: 'FAILURE',
        details: {
          attemptedPath: location.pathname,
          isAuthenticated,
          isAdmin,
          hasValidSession: !!isSessionValid,
          is2FACompliant,
        },
      });
    }
  }, [isAuthorized, isAuthenticated, isAdmin, isSessionValid, is2FACompliant, location.pathname, user]);

  if (!isAuthorized) {
    return <Navigate to="/admin/login" state={{ from: location.pathname, message: 'Administrative authentication required.' }} replace />;
  }

  return <>{children}</>;
};

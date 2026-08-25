import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logSecurityEvent } from '../../utils/securityLogger';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      logSecurityEvent('ADMIN_ACCESS_DENIED', {
        userId: user?.user_id,
        email: user?.email,
        details: { attemptedPath: location.pathname, role: user?.role || 'unauthenticated' },
      });
    }
  }, [isAuthenticated, isAdmin, location.pathname, user]);

  if (!isAuthenticated || !isAdmin) {
    // If not authenticated or not admin, redirect securely to admin login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

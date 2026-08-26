import React from 'react';

interface AdminRouteGuardProps {
  children: React.ReactNode;
}

/**
 * Public Access Mode: Admin portal is directly accessible.
 */
export const AdminRouteGuard: React.FC<AdminRouteGuardProps> = ({ children }) => {
  return <>{children}</>;
};

export default AdminRouteGuard;

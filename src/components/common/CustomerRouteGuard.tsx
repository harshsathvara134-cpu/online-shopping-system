import React from 'react';

interface CustomerRouteGuardProps {
  children: React.ReactNode;
}

/**
 * Public Access Mode: All customer routes are directly accessible.
 */
export const CustomerRouteGuard: React.FC<CustomerRouteGuardProps> = ({ children }) => {
  return <>{children}</>;
};

export default CustomerRouteGuard;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Public Access Mode: Automatically redirects to admin dashboard.
 */
export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/admin', { replace: true });
  }, [navigate]);

  return null;
};

export default AdminLoginPage;

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Public Access Mode: Automatically redirects to customer account center.
 */
export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/my-profile', { replace: true });
  }, [navigate]);

  return null;
};

export default LoginPage;

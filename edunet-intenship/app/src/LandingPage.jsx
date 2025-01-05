import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate('/login');
  }, [navigate]);

  return <div>Redirecting to login...</div>;
};

export default LandingPage;

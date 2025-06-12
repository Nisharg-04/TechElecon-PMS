import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Common/Button';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">Page Not Found</p>
      <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
    </div>
  );
};

export default NotFound;

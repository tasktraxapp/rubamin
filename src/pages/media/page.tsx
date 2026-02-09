
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MediaPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/media/notices');
  }, [navigate]);

  return null;
};

export default MediaPage;

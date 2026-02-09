import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GalleryPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/gallery/facilities', { replace: true });
  }, [navigate]);

  return null;
};

export default GalleryPage;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import EventFormModal from '../../components/EventForm';
import { eventService } from '../../../../services/api';
import { checkAuthError, validateToken } from '../../utils/auth-utils';

const EventCreatePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuthentication = () => {
      if (!isAuthenticated || !validateToken()) {
        navigate('/admin/login', {
          state: { from: { pathname: '/admin/events/new' } },
          replace: true
        });
      }
    };

    checkAuthentication();
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (eventData) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token || !validateToken()) {
        navigate('/admin/login', {
          state: { from: { pathname: '/admin/events/new' } },
          replace: true
        });
        throw new Error('You are not logged in. Please log in and try again.');
      }

      // Format dates to ISO string if they aren't already
      const formattedData = {
        ...eventData,
        startTime: new Date(eventData.startTime).toISOString(),
        endTime: new Date(eventData.endTime).toISOString(),
      };

      await eventService.createEvent(formattedData, token);
      navigate('/admin/dashboard', { 
        state: { success: 'Event created successfully' } 
      });
    } catch (err) {
      if (!checkAuthError(err, navigate)) {
        console.error('Error creating event:', err);
        setError(err.message || 'Failed to create event. Please try again.');
        throw err;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate('/admin/dashboard');
  };

  if (!isAuthenticated || !validateToken()) {
    return null;
  }

  return (
    <div className="relative">
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md z-50">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      <EventFormModal
        isOpen={true}
        onClose={handleClose}
        onSubmit={handleSubmit}
        isLoading={loading}
      />
    </div>
  );
};

export default EventCreatePage;
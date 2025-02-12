import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventFormModal from '../../components/EventForm';
import { eventService } from '../../../../services/api';
import { checkAuthError, validateToken } from '../../utils/auth-utils';

const EventEditPage = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const checkAuthentication = useCallback(() => {
    if (!validateToken()) {
      navigate('/admin/login', {
        state: { from: { pathname: `/admin/events/edit/${eventId}` } },
        replace: true
      });
      return false;
    }
    return true;
  }, [navigate, eventId]);

  const fetchEvent = useCallback(async () => {
    if (!checkAuthentication()) return;

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const eventData = await eventService.getEventById(eventId);
      
      // Format dates for the form
      const formattedEvent = {
        ...eventData,
        startTime: eventData.startTime ? new Date(eventData.startTime).toISOString().slice(0, 16) : '',
        endTime: eventData.endTime ? new Date(eventData.endTime).toISOString().slice(0, 16) : '',
        tags: eventData.tags || [],
        pictures: eventData.pictures || [],
        links: eventData.links || {
          registration: { title: '', url: '' },
          location: { title: '', url: '' },
          additionalInfo: []
        }
      };

      setEvent(formattedEvent);
      setError(null);
    } catch (err) {
      if (!checkAuthError(err, navigate)) {
        console.error('Error fetching event:', err);
        setError(err.message || 'Failed to fetch event details');
      }
    } finally {
      setLoading(false);
    }
  }, [eventId, navigate, checkAuthentication]);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    } else {
      setError('No event ID provided');
      setLoading(false);
    }
  }, [eventId, fetchEvent]);

  const handleSubmit = async (eventData) => {
    if (!checkAuthentication()) return;

    setSaving(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('You are not logged in. Please log in and try again.');
      }

      // Format dates to ISO string
      const formattedData = {
        ...eventData,
        startTime: new Date(eventData.startTime).toISOString(),
        endTime: new Date(eventData.endTime).toISOString(),
      };

      await eventService.updateEvent(eventId, formattedData, token);
      setShowSuccess(true);
      
      // Delay navigation to show success message
      setTimeout(() => {
        navigate('/admin/dashboard', { 
          state: { success: 'Event updated successfully' } 
        });
      }, 1500);
    } catch (err) {
      if (!checkAuthError(err, navigate)) {
        console.error('Failed to update event:', err);
        setError(err.message || 'Failed to update event. Please try again.');
        setShowSuccess(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    navigate('/admin/dashboard');
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md z-50">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}
      
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50">
          <p>Event updated successfully! Redirecting to dashboard...</p>
        </div>
      )}

      <EventFormModal
        isOpen={true}
        onClose={handleClose}
        event={event}
        onSubmit={handleSubmit}
        isLoading={saving}
      />
    </div>
  );
};

export default EventEditPage;
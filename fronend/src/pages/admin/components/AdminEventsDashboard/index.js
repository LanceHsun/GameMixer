import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../../../../services/api';
import Button from '../../../../components/common/Button';
import { Input } from '../../../../components/common/Input';
import { checkAuthError, validateToken } from '../../utils/auth-utils';

const AdminEventsDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [tags, setTags] = useState([]);

  const checkAuth = useCallback(() => {
    if (!validateToken()) {
      navigate('/admin/login', { 
        state: { from: { pathname: '/admin/dashboard' } },
        replace: true 
      });
      return false;
    }
    return true;
  }, [navigate]);

  const fetchTags = useCallback(async () => {
    try {
      if (!checkAuth()) return;
      const response = await eventService.getEventTags();
      setTags(Array.isArray(response) ? response : []);
    } catch (err) {
      if (!checkAuthError(err, navigate)) {
        console.error('Error fetching tags:', err);
        setTags([]);
      }
    }
  }, [navigate, checkAuth]);

  const fetchEvents = useCallback(async () => {
    if (!checkAuth()) return;
    
    setLoading(true);
    try {
      const data = await eventService.getAllEvents(selectedTag);
      setEvents(data);
      setError(null);
    } catch (err) {
      if (!checkAuthError(err, navigate)) {
        setError('Error loading events: Failed to fetch events');
      }
    } finally {
      setLoading(false);
    }
  }, [selectedTag, navigate, checkAuth]);

  useEffect(() => {
    fetchEvents();
    fetchTags();
  }, [fetchEvents, fetchTags]);

  const handleEditEvent = (eventId) => {
    if (checkAuth()) {
      navigate(`/admin/events/edit/${eventId}`);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!checkAuth()) return;

    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No authentication token found');
        }
        await eventService.deleteEvent(id, token);
        await fetchEvents();
        setError(null);
      } catch (err) {
        if (!checkAuthError(err, navigate)) {
          console.error('Delete error:', err);
          setError('Error deleting event: ' + (err.message || 'Unknown error'));
        }
      }
    }
  };

  const handleCreateEvent = () => {
    if (checkAuth()) {
      navigate('/admin/events/new');
    }
  };

  const filteredEvents = {
    upcoming: events.upcoming?.filter(event => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [],
    past: events.past?.filter(event => 
      event.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || []
  };

  const EventCard = ({ event }) => (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
      <p className="text-gray-600 mb-2">{event.subtitle}</p>
      <p className="text-sm text-gray-500 mb-2">
        {new Date(event.startTime).toLocaleDateString()} - 
        {new Date(event.endTime).toLocaleDateString()}
      </p>
      {event.tags && event.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {event.tags.map((tag, index) => (
            <span 
              key={index}
              className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <Button 
          onClick={() => handleEditEvent(event.id)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Edit
        </Button>
        <Button 
          onClick={() => handleDeleteEvent(event.id)}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Delete
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Event Management</h1>
        <Button 
          onClick={handleCreateEvent}
          className="bg-[#FFD200] hover:bg-[#FFE566] text-[#2C2C2C]"
        >
          + Create Event
        </Button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6 flex gap-4">
        <Input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="border rounded p-2 focus:border-[#FFD200] focus:ring-[#FFD200]"
        >
          <option value="">All Tags</option>
          {Array.isArray(tags) && tags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading events...</p>
        </div>
      ) : (
        <div>
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">
              Upcoming Events ({filteredEvents.upcoming.length})
            </h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.upcoming.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
              {filteredEvents.upcoming.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No upcoming events found
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              Past Events ({filteredEvents.past.length})
            </h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.past.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
              {filteredEvents.past.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  No past events found
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AdminEventsDashboard;
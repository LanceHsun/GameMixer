import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Plus, Pencil, Trash2, Search } from 'lucide-react';
import EventFormModal from '../EventForm';

const AdminEventsDashboard = () => {
  const [events, setEvents] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('/events',  {
        headers: {
          'Accept': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      setError('Error loading events: ' + error.message);
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (formData) => {
    try {
      const response = await fetch('/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create event');
      }

      await fetchEvents(); // Refresh the events list
      setIsCreateModalOpen(false);
    } catch (error) {
      setError('Error creating event: ' + error.message);
      console.error('Error creating event:', error);
    }
  };

  const handleUpdateEvent = async (eventId, formData) => {
    try {
      const response = await fetch(`/admin/events/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update event');
      }

      await fetchEvents(); // Refresh the events list
      setIsEditModalOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      setError('Error updating event: ' + error.message);
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`/admin/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      await fetchEvents(); // Refresh the events list
    } catch (error) {
      setError('Error deleting event: ' + error.message);
      console.error('Error deleting event:', error);
    }
  };

  const filteredEvents = {
    upcoming: events.upcoming?.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [],
    past: events.past?.filter(event =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []
  };

  const EventCard = ({ event, type }) => (
    <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="space-y-2 flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
          
          <div className="space-y-1">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {new Date(event.startTime).toLocaleDateString()}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              <span className="text-sm">
                {new Date(event.startTime).toLocaleTimeString()} - 
                {new Date(event.endTime).toLocaleTimeString()}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{event.location}</span>
            </div>
          </div>

          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {event.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelectedEvent(event);
              setIsEditModalOpen(true);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
            aria-label="Edit event"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDeleteEvent(event.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
            aria-label="Delete event"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Event Management</h1>
          <p className="text-gray-600">Manage all your events in one place</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-[#FFD200] text-[#2C2C2C] px-4 py-2 rounded-lg hover:bg-[#FFE566] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Event
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD200] focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`pb-2 px-1 ${
            activeTab === 'upcoming'
              ? 'border-b-2 border-[#FFD200] text-[#2C2C2C]'
              : 'text-gray-500'
          }`}
        >
          Upcoming Events ({filteredEvents.upcoming.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`pb-2 px-1 ${
            activeTab === 'past'
              ? 'border-b-2 border-[#FFD200] text-[#2C2C2C]'
              : 'text-gray-500'
          }`}
        >
          Past Events ({filteredEvents.past.length})
        </button>
      </div>

      {/* Event List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-[#FFD200] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === 'upcoming' ? (
            filteredEvents.upcoming.length > 0 ? (
              filteredEvents.upcoming.map(event => (
                <EventCard key={event.id} event={event} type="upcoming" />
              ))
            ) : (
              <p className="text-center text-gray-500 py-12">No upcoming events found</p>
            )
          ) : (
            filteredEvents.past.length > 0 ? (
              filteredEvents.past.map(event => (
                <EventCard key={event.id} event={event} type="past" />
              ))
            ) : (
              <p className="text-center text-gray-500 py-12">No past events found</p>
            )
          )}
        </div>
      )}

      {/* Create Event Modal */}
      <EventFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
      />

      {/* Edit Event Modal */}
      <EventFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEvent(null);
        }}
        event={selectedEvent}
        onSubmit={(formData) => handleUpdateEvent(selectedEvent.id, formData)}
      />
    </div>
  );
};

export default AdminEventsDashboard;
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PromotionalCarousel from '../../components/PromotionalCarousel';
import { eventService } from '../../services/api';
import getDirectImageUrl from '../../utils/getDirectImageUrl';

const EventCard = ({ event, onClick }) => {
  const [imageState, setImageState] = useState({
    src: getDirectImageUrl(event.mainPicture),
    hasError: false
  });

  const handleImageError = () => {
    if (!imageState.hasError) {
      setImageState({
        src: '/images/default-event-image.jpg',
        hasError: true
      });
    }
  };

  const isClickable = event.pictures?.length > 0 || 
                     event.video || 
                     event.links?.additionalInfo?.some(link => 
                       link.title.toLowerCase().includes('report')
                     );

  return (
    <div 
      key={event.id} 
      className={`bg-white rounded-lg shadow-md overflow-hidden ${
        isClickable 
          ? 'cursor-pointer hover:shadow-lg transition-shadow' 
          : 'cursor-default'
      }`}
      onClick={() => isClickable && onClick(event)}
    >
      <div className="relative h-32 md:h-48">
        <img
          src={imageState.src}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={handleImageError}
        />
        {event.tags?.includes('promoted') && (
          <div className="absolute top-2 sm:top-4 left-2 sm:left-4 bg-green-100 text-green-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm">
            Just added
          </div>
        )}
      </div>
      <div className="p-1.5 sm:p-4">
        <h3 className="text-sm sm:text-xl font-semibold mb-1 sm:mb-2 line-clamp-2">
          {event.title}
        </h3>
        <div className="flex flex-col sm:space-y-2 text-gray-600 text-xs sm:text-base">
          <div className="flex items-center gap-1 sm:gap-2">
            <Calendar className="w-3 sm:w-4 h-3 sm:h-4" />
            <span className="truncate">
              {new Date(event.startTime).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <MapPin className="w-3 sm:w-4 h-3 sm:h-4" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventsPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [allEvents, setAllEvents] = useState({ upcoming: [], past: [] });
  const [filteredEvents, setFilteredEvents] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tags, setTags] = useState([]);

  // 获取所有事件数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const eventsData = await eventService.getAllEvents();
        
        // Extract unique tags from past events
        const uniqueTags = new Set();
        eventsData.past.forEach(event => {
          if (event.tags && Array.isArray(event.tags)) {
            event.tags.forEach(tag => uniqueTags.add(tag));
          }
        });
        
        setTags(['All', ...Array.from(uniqueTags)]);
        setAllEvents(eventsData);
        setFilteredEvents(eventsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // 只在组件挂载时执行一次

  // 根据选中的标签过滤事件
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredEvents(allEvents);
    } else {
      const filteredPastEvents = allEvents.past.filter(event => 
        event.tags && event.tags.includes(activeFilter)
      );
      setFilteredEvents({
        ...allEvents,
        past: filteredPastEvents
      });
    }
  }, [activeFilter, allEvents]);

  const handlePastEventClick = async (event) => {
    try {
      const eventDetails = await eventService.getEventById(event.id);
      
      // Check if event has any content to display
      const hasContent = eventDetails.pictures?.length > 0 || 
                        eventDetails.video || 
                        eventDetails.links?.additionalInfo?.some(link => 
                          link.title.toLowerCase().includes('report')
                        );
      
      // If no content, do nothing
      if (!hasContent) {
        return;
      }
      
      // Handle video redirect
      if (eventDetails.video) {
        window.location.href = eventDetails.video;
        return;
      }
      
      // Handle report link redirect
      const reportLink = eventDetails.links?.additionalInfo?.find(
        link => link.title.toLowerCase().includes('report')
      );
      if (reportLink) {
        window.location.href = reportLink.url;
        return;
      }
      
      // Navigate to event detail page if it has pictures
      if (eventDetails.pictures?.length > 0) {
        navigate(`/events/past/${event.id}`);
      }
    } catch (err) {
      console.error('Error handling past event click:', err);
    }
  };

  const promotionalEvents = allEvents.upcoming?.map(event => ({
    id: event.id,
    title: event.title,
    location: event.location,
    date: new Date(event.startTime).toLocaleDateString(),
    time: new Date(event.startTime).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    }),
    image: getDirectImageUrl(event.mainPicture) || '/images/default-event-image.jpg',
    slug: event.id
  })) || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD200] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#2C2C2C]">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#FFD200] text-[#2C2C2C] px-6 py-2 rounded-lg hover:bg-[#FFE566]"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {promotionalEvents.length > 0 && (
        <div className="w-full max-w-[1920px] mx-auto h-[300px] md:h-[450px] mb-4 sm:mb-8">
          <PromotionalCarousel events={promotionalEvents} />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        <div className="overflow-x-auto mb-4 sm:mb-8">
          <div className="flex space-x-3 sm:space-x-6 min-w-max">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveFilter(tag)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm sm:text-base transition-colors ${
                  activeFilter === tag
                    ? 'bg-[#FFD200] text-black font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {filteredEvents.past.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onClick={handlePastEventClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
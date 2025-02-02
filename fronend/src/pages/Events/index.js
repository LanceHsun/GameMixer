import React, { useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PromotionalCarousel from '../../components/PromotionalCarousel';

const EventsPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  const promotionalEvents = [
    {
      id: 1,
      title: "Board Game Social",
      location: "San Jose",
      date: "Saturday, January 29",
      image: process.env.PUBLIC_URL + "/images/picture/weeklyboardgame/1B3076C5-8DC7-49E1-9612-9010F90E813E_1_102_a.jpeg",
      slug: "board-game-social"
    },
    {
      id: 2,
      title: "Game Mixer's Ultimate Summer Bash!",
      location: "San Jose",
      date: "Tuesday, Jan 28",
      image: "/api/placeholder/1200/600",
      slug: "summer-bash-2025"
    }
  ];

  const filterTabs = [
    'All', 'BoardGameSocial', 'UltimateSummerBash', 'Social, Charity, and Community'
  ];

  const pastEvents = [
    {
      id: 1,
      title: "Game Mixer's Ultimate Summer Bash!",
      location: 'San Jose',
      date: 'Sat, July 15',
      image: process.env.PUBLIC_URL + "/images/picture/barbecue/WOO_2469.JPG",
      promoted: true
    },
    {
      id: 2,
      title: 'LOVE BITES!',
      location: 'Ferry Building',
      date: 'Thu, Feb 13',
      image: '/api/placeholder/400/300'
    },
    {
      id: 3,
      title: 'Calistoga Wine Experience | SF',
      location: 'Press Club',
      date: 'Sat, Feb 1',
      image: '/api/placeholder/400/300'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Promotional Events Carousel */}
      <PromotionalCarousel events={promotionalEvents} />

      {/* Past Events Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="overflow-x-auto mb-8">
          <div className="flex space-x-6 min-w-max">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  activeFilter === tab
                    ? 'bg-[#FFD200] text-black font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastEvents.map((event) => (
            <div 
              key={event.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/events/past/${event.id}`)}
            >
              <div className="relative h-48">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                {event.promoted && (
                  <div className="absolute top-4 left-4 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Just added
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;
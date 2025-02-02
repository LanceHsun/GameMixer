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
      image: process.env.PUBLIC_URL + "/images/picture/Summer_Bash.jpg",
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
      title: <span><strong>B</strong>oard-<strong>G</strong>ame <strong>T</strong>ournament</span>,
      location: 'San Jose',
      date: 'Thu, Feb 13',
      image: process.env.PUBLIC_URL + "/images/picture/pastevent_main_picture/003.JPG"
    },
    {
      id: 3,
      title: <span><strong>W</strong>inery in the <strong>S</strong>ummer</span>,
      location: 'San Jose',
      date: 'Sat, Feb 1',
      image: process.env.PUBLIC_URL + "/images/picture/pastevent_main_picture/004.jpg"
    },
    {
      id: 4,
      title: <span><strong>H</strong>an-<strong>S</strong>tyle <strong>C</strong>lothes <strong>G</strong>ala</span>,
      location: 'San Jose',
      date: 'Sat, Feb 1',
      image: process.env.PUBLIC_URL + "/images/picture/pastevent_main_picture/005.jpg"
    },
    {
      id: 5,
      title: <span><strong>L</strong>unar <strong>N</strong>ew <strong>Y</strong>ear <strong>F</strong>estival <strong>C</strong>upertino</span>,
      location: 'Cupertino',
      date: 'Sat, Feb 1',
      image: process.env.PUBLIC_URL + "/images/picture/pastevent_main_picture/007.JPG"
    },
    {
      id: 6,
      title: <span><strong>H</strong>alloween <strong>C</strong>arnival</span>,
      location: 'San Jose',
      date: 'Sat, Feb 1',
      image: process.env.PUBLIC_URL + "/images/picture/pastevent_main_picture/010.jpg"
    },
    {
      id: 7,
      title: <span><strong>S</strong>vief <strong>C</strong>onvention</span>,
      location: 'Santa Clara',
      date: 'Sat, Feb 1',
      image: process.env.PUBLIC_URL + "/images/picture/pastevent_main_picture/Layla.JPG"
    },
    {
      id: 8,
      title: <span><strong>C</strong>upertino <strong>G</strong>ame <strong>N</strong>ight</span>,
      location: 'Cupertino',
      date: 'Sat, Feb 1',
      image: process.env.PUBLIC_URL + "/images/picture/pastevent_main_picture/rc2.jpg"
    },
    {
      id: 9,
      title: <span><strong>L</strong>abor <strong>D</strong>ay <strong>B</strong>bq</span>,
      location: 'San Jose',
      date: 'Sat, Feb 1',
      image: process.env.PUBLIC_URL + "/images/picture/pastevent_main_picture/003.JPG"
    },
    {
      id: 10,
      title: <span><strong>W</strong>inery <strong>P</strong>arty</span>,
      location: 'San Jose',
      date: 'Sat, Feb 1',
      image: process.env.PUBLIC_URL + "/images/picture/pastevent_main_picture/004.jpg"
    },
    {
      id: 11,
      title: <span><strong>C</strong>upertino <strong>G</strong>ame <strong>N</strong>ight</span>,
      location: 'Cupertino',
      date: 'Sat, Feb 1',
      image: process.env.PUBLIC_URL + "/images/picture/pastevent_main_picture/007 (1).jpg"
    },
    {
      id: 12,
      title: <span><strong>B</strong>bq in <strong>M</strong>ay</span>,
      location: 'San Jose',
      date: 'Sat, Feb 1',
      image: process.env.PUBLIC_URL + "/images/picture/pastevent_main_picture/005.jpg"
    },
    {
      id: 13,
      title: <span><strong>S</strong>anta <strong>C</strong>lara <strong>C</strong>ounty 5<strong>k</strong> <strong>R</strong>un</span>,
      location: 'Santa Clara',
      date: 'Sat, Feb 1',
      image: process.env.PUBLIC_URL + "/images/picture/pastevent_main_picture/010.jpg"
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
                  alt={typeof event.title === 'string' ? event.title : 'Event'}
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
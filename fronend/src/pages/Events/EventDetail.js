import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
import PhotoModal from '../../components/common/PhotoModal';

const PhotoGallery = ({ images, onPhotoClick }) => {
  const visibleImages = images.slice(0, 6);
  const remainingCount = Math.max(0, images.length - 6);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {visibleImages.map((image, index) => (
        <button
          key={index}
          onClick={() => onPhotoClick(index)}
          className="relative aspect-square rounded-lg overflow-hidden group"
        >
          <img
            src={image.url}
            alt={image.alt}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {index === 5 && remainingCount > 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                +{remainingCount}
              </span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

const EventDetailPage = () => {
  const { eventSlug } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Event details mapping based on slug
  const eventDetailsMap = {
    'board-game-social': {
      title: "Board Game Social",
      image: process.env.PUBLIC_URL + "/images/picture/weeklyboardgame/1B3076C5-8DC7-49E1-9612-9010F90E813E_1_102_a.jpeg",
      date: "Saturday, January 29",
      time: "3:00 PM - 6:00 PM",
      location: "San Jose",
      description: "Whether you're new to board games or a seasoned pro, our three-hour Game Mixer Board Game Social and our dinner gatherings are must-have experiences in your social calendar.\n\nAt Game Mixer, you'll discover an array of classic games that never lose their charm, alongside simple, joyful, and easy-to-learn picks recommended by our enthusiastic hosts. We also love to keep things exciting with a steady stream of new games added regularly. Join us for endless fun, great company, and the perfect blend of social and gaming excitement!\n\nNo experience required.\n\nCome and enjoy the fun, relaxing and diverse board games.",
      host: {
        name: "Game Mixer",
        image: process.env.PUBLIC_URL + "/images/Game-mixer-logo.avif"
      },
      photos: [
        {
          url: process.env.PUBLIC_URL + "/images/picture/weeklyboardgame/1B3076C5-8DC7-49E1-9612-9010F90E813E_1_102_a.jpeg",
          alt: "Board game session 1",
          description: "Board game social gathering"
        },
        {
          url: process.env.PUBLIC_URL + "/images/picture/weeklyboardgame/005.png",
          alt: "Board game session 2",
          description: "Players enjoying board games"
        },
        {
          url: process.env.PUBLIC_URL + "/images/picture/weeklyboardgame/6F42AF28-A052-49F9-BC2E-7AD384D50F93_1_102_a.jpeg",
          alt: "Board game session 3",
          description: "Game night fun"
        },
        {
          url: process.env.PUBLIC_URL + "/images/picture/weeklyboardgame/009.png",
          alt: "Board game session 4",
          description: "Community gaming event"
        },
        {
          url: process.env.PUBLIC_URL + "/images/picture/weeklyboardgame/IMG_0007.HEIC",
          alt: "Board game session 5",
          description: "Strategy game session"
        },
        {
          url: process.env.PUBLIC_URL + "/images/picture/weeklyboardgame/IMG_9594.PNG",
          alt: "Board game session 6",
          description: "Group playing games"
        },
        {
          url: process.env.PUBLIC_URL + "/images/picture/weeklyboardgame/IMG_9620.PNG",
          alt: "Board game session 7",
          description: "Game night highlights"
        }
      ]
    },
    'summer-bash-2025': {
        title: "Board Game Social",
        image: process.env.PUBLIC_URL + "/images/picture/weeklyboardgame/1B3076C5-8DC7-49E1-9612-9010F90E813E_1_102_a.jpeg",
        date: "Saturday, January 29",
        time: "3:00 PM - 6:00 PM",
        location: "San Jose",
        description: "Whether you're new to board games or a seasoned pro, our three-hour Game Mixer Board Game Social and our dinner gatherings are must-have experiences in your social calendar.\n\nAt Game Mixer, you'll discover an array of classic games that never lose their charm, alongside simple, joyful, and easy-to-learn picks recommended by our enthusiastic hosts. We also love to keep things exciting with a steady stream of new games added regularly. Join us for endless fun, great company, and the perfect blend of social and gaming excitement!\n\nNo experience required.\n\nCome and enjoy the fun, relaxing and diverse board games.",
        host: {
          name: "Game Mixer",
          image: process.env.PUBLIC_URL + "/images/Game-mixer-logo.avif"
        },
        photos: [
          {
            url: process.env.PUBLIC_URL + "/images/picture/weeklyboardgame/1B3076C5-8DC7-49E1-9612-9010F90E813E_1_102_a.jpeg",
            alt: "Board game session 1",
            description: "Board game social gathering"
          },
          {
            url: process.env.PUBLIC_URL + "/images/picture/weeklyboardgame/005.png",
            alt: "Board game session 2",
            description: "Players enjoying board games"
          },
          {
            url: process.env.PUBLIC_URL + "/images/picture/weeklyboardgame/6F42AF28-A052-49F9-BC2E-7AD384D50F93_1_102_a.jpeg",
            alt: "Board game session 3",
            description: "Game night fun"
          },
          {
            url: process.env.PUBLIC_URL + "/images/picture/weeklyboardgame/009.png",
            alt: "Board game session 4",
            description: "Community gaming event"
          },
          {
            url: process.env.PUBLIC_URL + "/images/picture/weeklyboardgame/IMG_0007.HEIC",
            alt: "Board game session 5",
            description: "Strategy game session"
          },
          {
            url: process.env.PUBLIC_URL + "/images/picture/weeklyboardgame/IMG_9594.PNG",
            alt: "Board game session 6",
            description: "Group playing games"
          },
          {
            url: process.env.PUBLIC_URL + "/images/picture/weeklyboardgame/IMG_9620.PNG",
            alt: "Board game session 7",
            description: "Game night highlights"
          }
        ]
      }
  };

  const eventDetails = eventDetailsMap[eventSlug];

  if (!eventDetails) {
    return <div>Event not found</div>;
  }

  const handlePhotoClick = (index) => {
    setCurrentPhotoIndex(index);
    setModalOpen(true);
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex(prev => 
      prev < eventDetails.photos.length - 1 ? prev + 1 : prev
    );
  };

  const handlePreviousPhoto = () => {
    setCurrentPhotoIndex(prev => prev > 0 ? prev - 1 : prev);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Event Title */}
      <h1 className="text-4xl font-bold text-center mb-8">{eventDetails.title}</h1>

      {/* Event Image */}
      <div className="rounded-xl overflow-hidden mb-8">
        <img
          src={eventDetails.image}
          alt={eventDetails.title}
          className="w-full h-auto"
        />
      </div>

      {/* Event Details */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#2C2C2C]" />
          <span className="text-lg">{eventDetails.date}</span>
          <Clock className="w-5 h-5 text-[#2C2C2C] ml-4" />
          <span className="text-lg">{eventDetails.time}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#2C2C2C]" />
          <span className="text-lg">{eventDetails.location}</span>
        </div>

        {/* Host Information - Updated with new style */}
        <div className="flex items-center gap-3">
          <p className="text-gray-600">Hosted by</p>
          <div className="flex items-center gap-2">
            <div className="bg-[#FFD200] p-1 rounded-lg">
              <img
                src={eventDetails.host.image}
                alt={eventDetails.host.name}
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="font-medium text-[#2C2C2C]">
              {eventDetails.host.name}
            </span>
          </div>
        </div>

        {/* Terms and Conditions Link */}
        <div>
          <Link to="/terms" className="text-[#6B90FF] hover:underline">
            Terms and conditions
          </Link>
        </div>

        {/* Event Description */}
        <p className="text-lg text-[#2C2C2C]/80 leading-relaxed whitespace-pre-line">
          {eventDetails.description}
        </p>

        {/* Register Button */}
        <div className="text-center">
          <button className="bg-[#FFD200] text-[#2C2C2C] px-8 py-3 rounded-lg font-bold hover:bg-[#FFE566] transition-colors">
            Register Now
          </button>
        </div>
      </div>

      {/* Photo Album */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Photo Album</h2>
        <PhotoGallery 
          images={eventDetails.photos} 
          onPhotoClick={handlePhotoClick}
        />
      </div>

      {/* Photo Modal */}
      <PhotoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentPhoto={eventDetails.photos[currentPhotoIndex]}
        onNext={handleNextPhoto}
        onPrevious={handlePreviousPhoto}
        photos={eventDetails.photos}
        currentIndex={currentPhotoIndex}
      />
    </div>
  );
};

export default EventDetailPage;
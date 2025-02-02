// pages/Events/PastEventDetail/index.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PhotoModal from '../../../components/common/PhotoModal';

const PastEventDetail = () => {
  const { eventId } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Mock data - in a real app, this would be fetched based on eventId
  const eventData = {
    title: "Game Mixer's Ultimate Summer Bash!",
    subtitle: "An evening of BBQ, board games, and community bonding",
    tags: ["Ultimate Summer Bash", "Latest"],
    author: {
      name: "Game Mixer",
      image: process.env.PUBLIC_URL + "/images/Game-mixer-logo.avif",
      link: "#"
    },
    mainImage: process.env.PUBLIC_URL + "/images/picture/barbecue/WOO_2303.JPG",
    content: `Come hungry and ready to trade (or play!), because Game Mixer's Summer BBQ is bringing together food lovers and game enthusiasts for the most exciting event of the season! Mingle with fellow gamers, trade your favorite board games, and enjoy mouth-watering BBQ in a vibrant, outdoor atmosphere. Whether you're a die-hard board game aficionado or just looking for a fantastic way to spend your Saturday, this event is packed with fun and excitement for everyone!\n\nDon't miss out on the fun, the games, and the amazing community vibes. Grab your friends and family, and join us for a day you won't forget. Let the games begin!\n\nDirection to Blackberry Farm, Cupertino, CA\n• Use this link to navigate to Blackberry Farm Parking.\n• Once you arrived at the parking lot, follow the map to join us at the picnic area!\n• You can use our interactive gallery to identify all the landmarks!`,
    photos: [
      { 
        url: process.env.PUBLIC_URL + "/images/picture/barbecue/WOO_2303.JPG",
        alt: "BBQ event overview",
        description: "Game Mixer community gathering for summer BBQ"
      },
      { 
        url: process.env.PUBLIC_URL + "/images/picture/barbecue/WOO_2469.JPG",
        alt: "Group playing games",
        description: "Friends enjoying board games together"
      },
      { 
        url: process.env.PUBLIC_URL + "/images/picture/barbecue/合照Volunteer.JPG",
        alt: "Volunteer group photo",
        description: "Our amazing volunteer team"
      },
      { 
        url: process.env.PUBLIC_URL + "/images/picture/barbecue/图5-2.JPG",
        alt: "BBQ preparation",
        description: "Getting the grill ready"
      },
      { 
        url: process.env.PUBLIC_URL + "/images/picture/barbecue/烧烤1.JPG",
        alt: "Grilling in action",
        description: "Master griller at work"
      },
      { 
        url: process.env.PUBLIC_URL + "/images/picture/barbecue/肉串2.JPG",
        alt: "Grilled skewers",
        description: "Delicious grilled skewers"
      },
      {
        url: process.env.PUBLIC_URL + "/images/picture/barbecue/食物.JPG",
        alt: "Food spread",
        description: "Amazing spread of BBQ dishes"
      }
    ]
  };

  const handlePhotoClick = (index) => {
    setCurrentPhotoIndex(index);
    setModalOpen(true);
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex(prev => 
      prev < eventData.photos.length - 1 ? prev + 1 : prev
    );
  };

  const handlePreviousPhoto = () => {
    setCurrentPhotoIndex(prev => prev > 0 ? prev - 1 : prev);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Header Section - Centered */}
      <div className="text-center mb-12">
        {/* Tags */}
        <div className="flex justify-center gap-4 mb-6">
          {eventData.tags.map(tag => (
            <span key={tag} className="bg-gray-100 px-4 py-1 rounded-full text-sm text-gray-600">
              {tag}
            </span>
          ))}
        </div>

        {/* Title and Subtitle */}
        <h1 className="text-4xl font-bold mb-4">{eventData.title}</h1>
        <p className="text-xl text-gray-600 mb-8">{eventData.subtitle}</p>

        {/* Author */}
        <div className="flex items-center justify-center gap-3">
          <p className="text-gray-600">Written by</p>
          <a href={eventData.author.link} className="flex items-center gap-2">
            <div className="bg-[#FFD200] p-1 rounded-lg">
              <img
                src={eventData.author.image}
                alt={eventData.author.name}
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="font-medium text-[#2C2C2C]">
              {eventData.author.name}
            </span>
          </a>
        </div>
      </div>

      {/* Main Image */}
      <div className="mb-12 rounded-xl overflow-hidden max-h-[300px] max-w-xl mx-auto">
        <img
          src={eventData.mainImage}
          alt={eventData.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="prose max-w-none mb-16">
        <div className="whitespace-pre-line text-lg text-gray-700 leading-relaxed">
          {eventData.content}
        </div>
      </div>

      {/* Photo Album */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Photo Album</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {eventData.photos.slice(0, 6).map((photo, index) => (
            <button
              key={index}
              onClick={() => handlePhotoClick(index)}
              className="relative aspect-square rounded-lg overflow-hidden group"
            >
              <img
                src={photo.url}
                alt={photo.alt}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {index === 5 && eventData.photos.length > 6 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    +{eventData.photos.length - 6}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Modal */}
      <PhotoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentPhoto={eventData.photos[currentPhotoIndex]}
        onNext={handleNextPhoto}
        onPrevious={handlePreviousPhoto}
        photos={eventData.photos}
        currentIndex={currentPhotoIndex}
      />
    </div>
  );
};

export default PastEventDetail;
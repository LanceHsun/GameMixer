import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import PhotoModal from '../../../components/common/PhotoModal';
import { eventService } from '../../../services/api';
import getDirectImageUrl from '../../../utils/getDirectImageUrl';

const PastEventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        setLoading(true);
        const eventData = await eventService.getEventById(eventId);

        if (eventData.video) {
          window.location.href = eventData.video;
          return;
        }

        const reportLink = eventData.links?.additionalInfo?.find(
          link => link.title.toLowerCase().includes('report')
        );

        if (reportLink) {
          window.location.href = reportLink.url;
          return;
        }

        setEvent(eventData);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details');
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId, navigate]);

  const handlePhotoClick = (index) => {
    setCurrentPhotoIndex(index);
    setModalOpen(true);
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex(prev => 
      prev < event.pictures.length - 1 ? prev + 1 : prev
    );
  };

  const handlePreviousPhoto = () => {
    setCurrentPhotoIndex(prev => prev > 0 ? prev - 1 : prev);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FFD200] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#2C2C2C]">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error || 'Event not found'}</p>
          <Link 
            to="/events"
            className="mt-4 inline-block bg-[#FFD200] text-[#2C2C2C] px-6 py-2 rounded-lg hover:bg-[#FFE566]"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header Section - Centered */}
      <div className="text-center mb-6">
        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <div className="flex justify-center gap-4 mb-3">
            {event.tags.map(tag => (
              <span key={tag} className="bg-gray-100 px-4 py-1 rounded-full text-sm text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title and Subtitle */}
        <h1 className="text-4xl font-bold mb-2">{event.title}</h1>
        {event.subtitle && (
          <p className="text-xl text-gray-600 mb-4">{event.subtitle}</p>
        )}

        {/* Author */}
        <div className="flex items-center justify-center gap-3">
          <p className="text-gray-600">Written by</p>
          <a href="#" className="flex items-center gap-2">
            <div className="bg-[#FFD200] p-1 rounded-lg">
              <img
                src={getDirectImageUrl(process.env.PUBLIC_URL + "/images/Game-mixer-logo.avif") || '/images/default-logo.png'}
                alt="Game Mixer"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.target.src = '/images/default-logo.png';
                }}
              />
            </div>
            <span className="font-medium text-[#2C2C2C]">
              Game Mixer
            </span>
          </a>
        </div>
      </div>

      {/* Main Image */}
      {event.mainPicture && (
        <div className="mb-6 rounded-xl overflow-hidden max-h-[300px] max-w-xl mx-auto">
          <img
            src={getDirectImageUrl(event.mainPicture) || '/default-event-image.jpg'}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/default-event-image.jpg';
            }}
          />
        </div>
      )}

      {/* Event Details and Content */}
      <div className="prose max-w-xl mx-auto mb-8">
        {/* Date and Location */}
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#2C2C2C]" />
            <span className="text-lg">
              {new Date(event.startTime).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#2C2C2C]" />
            <span className="text-lg">{event.location}</span>
          </div>
        </div>

        {/* Event Links */}
        {event.links && (
          <div className="mb-4 text-center">
            <div className="flex flex-wrap justify-center gap-4">
              {event.links.additionalInfo?.filter(link => 
                !link.title.toLowerCase().includes('report') && 
                !link.url.includes('video')
              ).map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors px-4 py-2"
                >
                  <span className="bg-blue-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </span>
                  {link.title}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        {event.description && (
          <div className="whitespace-pre-line text-lg text-gray-700 leading-relaxed">
            {event.description}
          </div>
        )}
      </div>

      {/* Photo Album */}
      {event.pictures && event.pictures.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">Photo Album</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {event.pictures.slice(0, 6).map((url, index) => (
              <button
                key={index}
                onClick={() => handlePhotoClick(index)}
                className="relative aspect-square rounded-lg overflow-hidden group"
              >
                <img
                  src={getDirectImageUrl(url) || '/default-event-image.jpg'}
                  alt={`${event.title} - Photo ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    console.error(`Failed to load image: ${url}`);
                    e.target.src = '/default-event-image.jpg';
                  }}
                />
                {index === 5 && event.pictures.length > 6 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      +{event.pictures.length - 6}
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Photo Modal */}
      <PhotoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        currentPhoto={{
          url: getDirectImageUrl(event.pictures?.[currentPhotoIndex]) || '/default-event-image.jpg',
          alt: `${event.title} - Photo ${currentPhotoIndex + 1}`,
          description: `Photo ${currentPhotoIndex + 1} of ${event.pictures?.length}`
        }}
        onNext={handleNextPhoto}
        onPrevious={handlePreviousPhoto}
        photos={event.pictures?.map((url, index) => ({
          url: getDirectImageUrl(url) || '/default-event-image.jpg',
          alt: `${event.title} - Photo ${index + 1}`,
          description: `Photo ${index + 1} of ${event.pictures.length}`
        }))}
        currentIndex={currentPhotoIndex}
      />
    </div>
  );
};

export default PastEventDetail;
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PromotionalCarousel = ({ events }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % events.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [events.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % events.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = touchStartX.current;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const swipeDistance = touchEndX.current - touchStartX.current;
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        handlePrevSlide();
      } else {
        handleNextSlide();
      }
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  const handleMakePlan = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <div className="relative h-[300px] md:h-[450px] border-2 md:border-4 border-[#FFD200]">
      <div 
        className="relative w-full h-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {events.map((event, index) => (
          <div
            key={event.id}
            className="absolute w-full h-full transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(${(index - currentSlide) * 100}%)`,
            }}
          >
            <div className="relative w-full h-full">
              <img
                src={event.image}
                alt={event.title}
                className="absolute inset-0 w-full h-full object-cover"
                draggable="false"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center text-white">
                <div className="mt-4 md:mt-12 text-center">
                  <p className="text-base md:text-xl">{event.location}</p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-center w-full px-6 md:px-8">
                  <div className="w-full max-w-3xl mx-auto">
                    <h1 className="text-2xl md:text-5xl font-bold mb-4 md:mb-8">
                      {event.title}
                    </h1>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMakePlan(event.slug);
                    }}
                    className="bg-[#FFD200] text-black px-6 md:px-8 py-2 md:py-3 rounded-lg font-bold hover:bg-[#FFE566] transition-colors text-sm md:text-base"
                  >
                    Make Plan Now
                  </button>
                </div>

                <div className="mb-4 md:mb-12 text-center">
                  <p className="text-base md:text-xl mb-1 md:mb-2">{event.date}</p>
                  <p className="text-base md:text-xl">{event.time}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handlePrevSlide}
        className="hidden md:block absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-1 md:p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4 md:w-6 md:h-6" />
      </button>
      <button
        onClick={handleNextSlide}
        className="hidden md:block absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-1 md:p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
      >
        <ChevronRight className="w-4 h-4 md:w-6 md:h-6" />
      </button>

      <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 md:space-x-2">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-colors ${
              currentSlide === index ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromotionalCarousel;
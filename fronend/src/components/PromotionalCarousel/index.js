import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PromotionalCarousel = ({ events }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

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

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  const handleMakePlan = (eventSlug) => {
    navigate(`/events/${eventSlug}`);
  };

  return (
    <div className="relative h-[600px] border-4 border-[#FFD200]">
      {/* Carousel Images */}
      <div className="relative w-full h-full overflow-hidden">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="absolute w-full h-full transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(${(index - currentSlide) * 100}%)`,
            }}
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center text-white">
              <div className="mt-12 text-center">
                <p className="text-xl">{event.location}</p>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-8">{event.title}</h1>
                <button
                  onClick={() => handleMakePlan(event.slug)}
                  className="bg-[#FFD200] text-black px-8 py-3 rounded-lg font-bold hover:bg-[#FFE566] transition-colors"
                >
                  Make Plan Now
                </button>
              </div>
              
              <div className="mb-12 text-center">
                <p className="text-xl mb-2">{event.date}</p>
                <p className="text-xl">{event.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={handleNextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {events.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              currentSlide === index ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromotionalCarousel;
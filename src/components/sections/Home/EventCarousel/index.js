import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const EventCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');

  const events = [
    {
      title: 'Weekly Board Game Socials',
      description: 'Every Saturday, 80-120 participants connect through curated games that spark laughter, collaboration, and friendships.',
      image: '/picture/hero.avif',
      link: '/events/weekly-socials'
    },
    {
      title: 'Monthly Tournament',
      description: 'Join our competitive yet friendly tournament series featuring strategy games and exciting prizes.',
      image: '/picture/hero.avif',
      link: '/events/tournaments'
    },
    {
      title: 'Family Game Day',
      description: 'A special monthly event designed for families to bond over board games and create lasting memories.',
      image: '/picture/hero.avif',
      link: '/events/family-day'
    }
  ];

  const nextSlide = () => {
    setSlideDirection('right');
    setCurrentSlide((prev) => (prev + 1) % events.length);
  };

  const prevSlide = () => {
    setSlideDirection('left');
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
  };

  const goToSlide = (index) => {
    setSlideDirection(index > currentSlide ? 'right' : 'left');
    setCurrentSlide(index);
  };

  return (
    <section className="max-w-screen-lg mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold text-white/90 mb-3">
          When You Give, Communities Thrive
        </h2>
        <p className="text-lg text-white/80">
          See how your donation transforms Saturday nights into life-changing social connections
        </p>
      </div>

      <div className="relative max-w-2xl mx-auto">
        <div 
          key={currentSlide}
          className={`h-[400px] rounded-xl overflow-hidden relative
            ${slideDirection === 'right' ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0'}
            animate-slideIn`}
          style={{
            animation: `slideIn${slideDirection === 'right' ? 'Right' : 'Left'} 0.5s forwards`
          }}
        >
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0">
            <img
              src={events[currentSlide].image}
              alt={events[currentSlide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/80 to-pink-500/80 backdrop-blur-sm" />
          </div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-8">
            <div className="max-w-xl">
              <h3 className="text-3xl font-bold text-white mb-4">{events[currentSlide].title}</h3>
              <p className="text-lg text-white/90">{events[currentSlide].description}</p>
            </div>
            
            <div className="self-end">
              <a 
                href={events[currentSlide].link}
                className="text-white/90 hover:text-white transition-colors text-lg hover:underline inline-flex items-center gap-2"
              >
                Read more
              </a>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-10"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-10"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex justify-center gap-2 z-10">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentSlide === index ? 'bg-white' : 'bg-white/40'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
};

export default EventCarousel;
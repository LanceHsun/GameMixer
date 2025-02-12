import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { paths } from '../../../../../src/config/paths';

const EventCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');

  const events = [
    {
      title: 'Weekly Board Game Socials',
      description: 'Every Saturday, 80-120 participants connect through curated games that spark laughter, collaboration, and friendships.',
      image: paths.getImagePath('picture/event1.jpg'),
      link: paths.getRoutePath('/events/weekly-socials')
    },
    {
      title: 'Monthly Tournament',
      description: 'Join our competitive yet friendly tournament series featuring strategy games and exciting prizes.',
      image: paths.getImagePath('picture/event2.jpg'),
      link: paths.getRoutePath('/events/tournaments')
    },
    {
      title: 'Family Game Day',
      description: 'A special monthly event designed for families to bond over board games and create lasting memories.',
      image: paths.getImagePath('picture/event3.jpg'),
      link: paths.getRoutePath('/events/family-day')
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
    <section id="event-carousel" className="bg-[#FAF6F0] px-4 py-8 md:py-12">
      <div className="max-w-screen-lg mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl text-[#2C2C2C] font-medium mb-3 font-serif">
            When You Give, Communities Thrive
          </h2>
          <p className="text-lg text-[#2C2C2C]/70">
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
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFF4CC] via-[#FFF4CC]/60 to-white/60 backdrop-blur-sm" />
            </div>

            {/* Content - Updated Typography */}
            <div className="relative h-full flex flex-col justify-between p-8">
              <div className="max-w-xl">
                <h3 className="text-2xl md:text-3xl text-[#2C2C2C] font-medium mb-4 font-serif">
                  {events[currentSlide].title}
                </h3>
                <p className="text-base text-[#2C2C2C]/70 leading-relaxed">
                  {events[currentSlide].description}
                </p>
              </div>
              
              <div className="self-end">
                <a 
                  href={events[currentSlide].link}
                  className="text-base text-[#2C2C2C]/70 hover:text-[#2C2C2C] transition-colors hover:underline inline-flex items-center gap-2"
                >
                  Read more
                </a>
              </div>
            </div>
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#2C2C2C]/10 hover:bg-[#2C2C2C]/20 text-[#2C2C2C] transition-colors z-10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#2C2C2C]/10 hover:bg-[#2C2C2C]/20 text-[#2C2C2C] transition-colors z-10"
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
                  currentSlide === index ? 'bg-[#2C2C2C]' : 'bg-[#2C2C2C]/40'
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
      </div>
    </section>
  );
};

export default EventCarousel;
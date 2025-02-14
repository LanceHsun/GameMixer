import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { paths } from '../../../../../src/config/paths';

const EventCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState('right');

  // Touch handling states
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [touchStartTime, setTouchStartTime] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isHorizontalDrag, setIsHorizontalDrag] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  // Constants for touch handling
  const DIRECTION_THRESHOLD = 10;
  const MOVEMENT_THRESHOLD = 5;
  const TIME_THRESHOLD = 100;
  const SWIPE_THRESHOLD = 50;
  const SPEED_THRESHOLD = 0.5;

  const events = [
    {
      title: 'Weekly Board Game Socials',
      description: 'Every Saturday in the South Bay Area, our consistently packed events bring together 80-120 participants for engaging, high-energy gameplay. With nearly 30% new attendees each week, our community is constantly growing, fostering fresh connections and lasting engagement.',
      image: paths.getImagePath('picture/event1.jpg'),
      link: paths.getRoutePath('/#/events/9340e7f2-4c22-4189-8c50-1b2818748774')
    },
    {
      title: 'Social, Charity and Community',
      description: 'From charity fundraisers to gaming tournaments and community meetups, these events create meaningful social impact while celebrating gaming culture. By fostering connection, inclusivity, and positive change, sponsorship helps amplify these efforts, transforming gaming into a powerful force for good.',
      image: paths.getImagePath('picture/event3.jpg'),
      link: 'https://mp.weixin.qq.com/s/g15wDHNcySFRU2LFa5wpvA'
    },
    {
      title: 'Summer Barbeque',
      description: 'The annual summer BBQ and board game meetup has become a flagship event, consistently reaching full capacity. With well-organized operations and strong engagement, participants sign up enthusiastically, establishing it as a trusted brand for community, entertainment, and impact.',
      image: paths.getImagePath('picture/event2.jpg'),
      link: 'https://mp.weixin.qq.com/s/7EwFrqcEhm0BfNxb7d1awg'
    }
  ];

  const nextSlide = () => {
    setSlideDirection('right');
    setCurrentSlide((prev) => (prev + 1) % events.length);
    setDragOffset(0);
  };

  const prevSlide = () => {
    setSlideDirection('left');
    setCurrentSlide((prev) => (prev - 1 + events.length) % events.length);
    setDragOffset(0);
  };

  const goToSlide = (index) => {
    setSlideDirection(index > currentSlide ? 'right' : 'left');
    setCurrentSlide(index);
    setDragOffset(0);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
    setTouchStartTime(Date.now());
    setIsDragging(true);
    setIsHorizontalDrag(false);
  };

  const onTouchMove = (e) => {
    if (!touchStart || !isDragging) return;

    const currentTouch = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    
    // If movement is too quick and distance is too short, ignore
    if (Date.now() - touchStartTime < TIME_THRESHOLD) {
      const deltaX = Math.abs(currentTouch - touchStart);
      if (deltaX < MOVEMENT_THRESHOLD) {
        return;
      }
    }

    const deltaX = Math.abs(currentTouch - touchStart);
    const deltaY = Math.abs(currentY - touchStartY);

    // Determine scroll direction
    if (!isHorizontalDrag && (deltaX > DIRECTION_THRESHOLD || deltaY > DIRECTION_THRESHOLD)) {
      if (deltaX > deltaY) {
        setIsHorizontalDrag(true);
        // Only prevent default for horizontal drags
        e.preventDefault();
      } else {
        // For vertical scrolls, cancel dragging and let native scroll happen
        setIsDragging(false);
        setDragOffset(0);
        return;
      }
    }

    // Handle horizontal drag
    if (isHorizontalDrag) {
      setTouchEnd(currentTouch);
      const diff = currentTouch - touchStart;
      setDragOffset(diff);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !touchStartTime) return;

    const distance = touchStart - touchEnd;
    const swipeSpeed = Math.abs(distance) / (Date.now() - touchStartTime);

    setIsDragging(false);
    setDragOffset(0);

    if (distance > SWIPE_THRESHOLD || (distance > 0 && swipeSpeed > SPEED_THRESHOLD)) {
      nextSlide();
    } else if (distance < -SWIPE_THRESHOLD || (distance < 0 && swipeSpeed > SPEED_THRESHOLD)) {
      prevSlide();
    }
  };

  // Reset touch states when dragging ends
  useEffect(() => {
    if (!isDragging) {
      setTouchStart(null);
      setTouchEnd(null);
      setTouchStartTime(null);
      setIsHorizontalDrag(false);
    }
  }, [isDragging]);

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
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div 
              className={`h-[400px] rounded-xl overflow-hidden relative
                ${!isDragging && (slideDirection === 'right' ? 'translate-x-full opacity-0' : '-translate-x-full opacity-0')}
                ${!isDragging ? 'animate-slideIn' : ''}`}
              style={{
                transform: isDragging ? `translateX(${dragOffset}px)` : undefined,
                animation: !isDragging ? `slideIn${slideDirection === 'right' ? 'Right' : 'Left'} 0.5s forwards` : undefined,
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            >
              {/* Background image and gradient overlay */}
              <div className="absolute inset-0">
                <img
                  src={events[currentSlide].image}
                  alt={events[currentSlide].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#FFF4CC] via-[#FFF4CC]/60 to-white/60 backdrop-blur-sm" />
              </div>

              {/* Content */}
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
          </div>

          {/* Navigation buttons */}
          <button 
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#2C2C2C]/10 hover:bg-[#2C2C2C]/20 text-[#2C2C2C] transition-colors z-10 hidden md:block"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#2C2C2C]/10 hover:bg-[#2C2C2C]/20 text-[#2C2C2C] transition-colors z-10 hidden md:block"
            aria-label="Next slide"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slide indicators */}
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
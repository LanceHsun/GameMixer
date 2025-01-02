import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MissionSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const images = [
    { id: 1, src: "/picture/hero.avif", alt: "Community game night" },
    { id: 2, src: "/picture/hero.avif", alt: "Board game session" },
    { id: 3, src: "/picture/hero.avif", alt: "Game mixer event" },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, images.length]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <section className="max-w-screen-lg mx-auto px-4 py-12 md:py-20">
      {/* Mission Statement */}
      <div className="text-center space-y-8 max-w-4xl mx-auto mb-16">
        <h2 className="text-lg font-semibold text-white/90 uppercase tracking-wider">
          Support Us
        </h2>
        <p className="text-3xl md:text-4xl text-white/90 font-medium leading-relaxed">
          Game Mixer is Silicon Valley's premier nonprofit dedicated to building vibrant and connected communities through the power of play.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-16">
        {/* Image Carousel - Desktop */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {images.map((image) => (
            <div 
              key={image.id}
              className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden relative aspect-square"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          ))}
        </div>

        {/* Image Carousel - Mobile */}
        <div className="relative md:hidden">
          <div className="overflow-hidden rounded-xl aspect-square max-w-[80%] mx-auto">
            <div className="relative flex transition-transform duration-300 ease-in-out"
                 style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="min-w-full relative"
                  style={{
                    transform: `scale(${index === currentIndex ? 1 : 0.9})`,
                    transition: 'transform 0.3s ease-in-out',
                    zIndex: index === currentIndex ? 2 : 1,
                  }}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-full object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-xl" />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute left-[12%] top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-[12%] top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsAutoPlaying(false);
                }}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  index === currentIndex ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Vision Statement */}
        <div className="text-center space-y-6">
          <h3 className="text-2xl md:text-3xl text-white/90 font-medium">
            Together, we end loneliness
          </h3>
          <p className="text-lg text-white/80 leading-relaxed max-w-4xl mx-auto">
            Since 2013, we've hosted over 600 events, engaged 40,000+ participants, and built a community that celebrates diversity, inclusivity, and joy. We create spaces where play brings people together—breaking barriers, fostering friendships, and creating a sense of belonging in Silicon Valley's fast-paced world. Our vision is to build a world where everyone has a community to call their own, built through the joy of shared experiences.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
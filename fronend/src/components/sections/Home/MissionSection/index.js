import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { paths } from '../../../../../src/config/paths';

const MissionSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Separate hero image and carousel images
  const heroImage = {
    src: paths.getImagePath('picture/mission-main.jpg'),
    alt: "Main hero image"
  };

  const carouselImages = [
    { id: 1, src: paths.getImagePath('picture/carousel-1.jpg'), alt: "Community game night" },
    { id: 2, src: paths.getImagePath('picture/carousel-2.jpg'), alt: "Board game session" },
    { id: 3, src: paths.getImagePath('picture/carousel-3.JPG'), alt: "Game mixer event" },
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, carouselImages.length]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <section id="mission-section" className="bg-[#FAF6F0]">
      {/* Hero Image - Mobile */}
      <div className="md:hidden w-full h-[50vh] relative">
        <img
          src={heroImage.src}
          alt={heroImage.alt}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="px-4 py-8 md:pt-0 md:pb-24">
        <div className="max-w-screen-lg mx-auto">
          {/* Hero Image - Desktop */}
          <div className="hidden md:block w-full h-[60vh] relative mb-8">
            <img
              src={heroImage.src}
              alt={heroImage.alt}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Mission Statement */}
          <div className="text-center space-y-4 md:space-y-6 max-w-4xl mx-auto mb-8 md:mb-16">
            <p className="text-2xl md:text-4xl text-[#2C2C2C] font-medium leading-snug md:leading-relaxed">
              Game Mixer is Silicon Valley's premier nonprofit dedicated to building vibrant and connected communities through the power of play.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-8 md:space-y-16">
            {/* Image Carousel - Desktop */}
            <div className="hidden md:grid md:grid-cols-3 gap-6">
              {carouselImages.map((image) => (
                <div 
                  key={image.id}
                  className="bg-white rounded-xl overflow-hidden relative aspect-square shadow-sm"
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Image Carousel - Mobile */}
            <div className="relative md:hidden">
              <div className="overflow-hidden rounded-xl aspect-square max-w-[80%] mx-auto">
                <div 
                  className="relative flex"
                  style={{ 
                    transform: `translateX(-${currentIndex * 100}%)`, 
                    transition: 'transform 0.3s ease-in-out' 
                  }}
                >
                  {carouselImages.map((image) => (
                    <div
                      key={image.id}
                      className="min-w-full relative"
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-[#2C2C2C]" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-[#2C2C2C]" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
                {carouselImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentIndex(index);
                      setIsAutoPlaying(false);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      index === currentIndex ? 'bg-[#2C2C2C]' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Vision Statement */}
            <div className="text-center space-y-6">
              <h3 className="text-2xl md:text-3xl text-[#2C2C2C] font-medium">
                Together, we end loneliness
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
                Since 2013, we've hosted over 600 events, engaged 40,000+ participants, and built a community that celebrates diversity, inclusivity, and joy. We create spaces where play brings people together—breaking barriers, fostering friendships, and creating a sense of belonging in Silicon Valley's fast-paced world. Our vision is to build a world where everyone has a community to call their own, built through the joy of shared experiences.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
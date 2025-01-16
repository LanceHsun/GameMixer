import React from 'react';
import { Coins, House, Gift, Gamepad2, Calendar, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DonationCard = ({ title, description, icon: Icon }) => {
  const navigate = useNavigate();
  const [firstLine, secondLine] = description.split(' & ');
  
  return (
    <div 
      className="bg-white rounded-lg p-3 md:p-6 h-full transition-all duration-300 hover:shadow-lg cursor-pointer border border-gray-100"
      onClick={() => navigate('/donate')}
    >
      <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-4">
        <Icon className="w-5 h-5 md:w-6 md:h-6 text-[#2C2C2C]" />
        <h3 className="text-base md:text-lg font-semibold text-[#2C2C2C] line-clamp-1">{title}</h3>
      </div>
      <div className="space-y-0.5 md:space-y-1">
        <p className="text-gray-600 text-xs md:text-sm leading-relaxed line-clamp-2">{firstLine}</p>
        <p className="text-gray-600 text-xs md:text-sm leading-relaxed line-clamp-2">{secondLine}</p>
      </div>
    </div>
  );
};

const EventDetail = ({ label, icon: Icon }) => (
  <div className="flex items-center gap-2">
    <Icon className="w-4 h-4 text-gray-500" />
    <span className="text-gray-500 text-sm">{label}</span>
  </div>
);

const Hero = () => {
  const navigate = useNavigate(); 
  const donationOptions = [
    {
      title: 'Financial Donation',
      description: 'Funds events & Supports volunteers',
      icon: Coins
    },
    {
      title: 'Venue Support',
      description: 'Spaces for 50-100 attendees & 3-4 hours per event',
      icon: House
    },
    {
      title: 'Prize Support',
      description: 'Winner rewards & Participation gifts',
      icon: Gift
    },
    {
      title: 'Game Library',
      description: 'Board games for all levels & Party games for groups',
      icon: Gamepad2
    }
  ];

  const eventDetails = [
    { label: 'Jan 15, 2025', icon: Calendar },
    { label: 'San Jose', icon: MapPin },
    { label: '80 Expected', icon: Users }
  ];

  return (
    <section className="relative bg-[#FAF6F0] px-4 py-12 md:py-20">
      <div className="max-w-screen-lg mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Content Container */}
          <div className="space-y-6 lg:w-1/2">
            {/* Event Details */}
            <div className="flex flex-wrap gap-4">
              {eventDetails.map((detail, index) => (
                <EventDetail key={index} label={detail.label} icon={detail.icon} />
              ))}
            </div>

            {/* Hero Text */}
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl text-[#2C2C2C] font-medium font-serif leading-tight">
                Donate for future events
              </h1>
              <p className="text-xl text-[#2C2C2C]/70 leading-relaxed">
                Every gift creates a moment of connection and belonging for someone new. 
                Act now to help us welcome even more participants.
              </p>
            </div>
            
            {/* Donation Options Grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {donationOptions.map((option, index) => (
                <DonationCard
                  key={index}
                  title={option.title}
                  description={option.description}
                  icon={option.icon}
                />
              ))}
            </div>
          </div>

          {/* Image Container */}
          <div className="lg:w-1/2">
            <div className="w-full h-full relative rounded-xl overflow-hidden">
              <img 
                src={process.env.PUBLIC_URL + "/images/picture/hero.avif"}
                alt="Game Mixer Event"
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
import React from 'react';
import { Coins, House, Gift, Gamepad2, Calendar, MapPin, Users } from 'lucide-react';

const DonationCard = ({ title, description, icon: Icon }) => {
  const [firstLine, secondLine] = description.split(' & ');
  
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 h-full transition-all duration-300 hover:bg-white/20">
      <div className="flex items-center gap-3 mb-4">
        <Icon className="w-6 h-6 text-white" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="space-y-1">
        <p className="text-white/80 text-sm leading-relaxed">{firstLine}</p>
        <p className="text-white/80 text-sm leading-relaxed">{secondLine}</p>
      </div>
    </div>
  );
};

const EventDetail = ({ label, icon: Icon }) => (
  <div className="flex items-center gap-2">
    <Icon className="w-4 h-4 text-white/80" />
    <span className="text-white/80 text-sm">{label}</span>
  </div>
);

const Hero = () => {
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
    <section className="relative max-w-screen-lg mx-auto px-4 py-12 md:py-20">
      {/* Main container */}
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
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
              Donate for future events
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Every gift creates a moment of connection and belonging for someone new. 
              Act now to help us welcome even more participants.
            </p>
          </div>
          
          {/* Donation Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <div className="lg:w-1/2 flex items-center">
          <div className="w-full h-full relative rounded-lg overflow-hidden">

            <img 
              src="/picture/hero.avif"
              alt="Game Mixer Event"
              className="w-full h-full object-cover rounded-lg aspect-[16/9] md:aspect-[4/3] lg:aspect-[16/10]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
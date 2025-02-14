// components/layout/MobileNavigation/index.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { LayoutGrid, X, Home, Gift, Users, Trophy, Heart, Building2, MessageCircle, Calendar } from 'lucide-react';

const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  if (location.pathname !== '/') {
    return null;
  }

  const sections = [
    { name: 'Mission', icon: Home, id: 'mission-section' },
    { name: 'Impact', icon: Trophy, id: 'impact-metrics' },
    { name: 'Events', icon: Calendar, id: 'event-carousel' },
    { name: 'Industry', icon: Building2, id: 'industry-breakdown' },
    { name: 'Testimonials', icon: MessageCircle, id: 'testimonials' },
    { name: 'Donate', icon: Heart, id: 'call-to-action' },
    { name: 'Sponsors', icon: Gift, id: 'sponsors' },
    { name: 'Contact', icon: MessageCircle, id: 'contact' },
  ];

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false);
    }
  };

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 bottom-4 w-12 h-12 bg-[#FFD200] rounded-full flex items-center justify-center shadow-lg z-50 transition-transform duration-300 hover:scale-110 active:scale-95"
        aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-[#2C2C2C]" />
        ) : (
          <LayoutGrid className="w-6 h-6 text-[#2C2C2C]" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed left-4 bottom-20 bg-white rounded-lg shadow-lg z-40">
            <nav className="py-2">
              {sections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <button
                    key={index}
                    onClick={() => scrollToSection(section.id)}
                    className="w-full flex items-center gap-3 px-6 py-3 text-[#2C2C2C] hover:bg-[#FFD200]/10 transition-colors"
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{section.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={() => setIsOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default MobileNavigation;
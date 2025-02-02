import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Links to homepage */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={process.env.PUBLIC_URL + "/images/Game-mixer-logo.avif"} 
              alt="Game Mixer Logo" 
              className="w-10 h-10 object-contain bg-[#FFD200] p-1 rounded-lg"
            />
            <span className="text-[#2C2C2C] font-bold text-xl">Game Mixer</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-10">
            <Link 
              to="/" 
              className="text-[#2C2C2C] hover:text-[#6B90FF] transition-colors"
            >
              Get to Know Us
            </Link>
            <Link 
              to="/events" 
              className="text-[#2C2C2C] hover:text-[#6B90FF] transition-colors"
            >
              Get Involved
            </Link>
            <Link 
              to="/donate" 
              className="bg-[#FFD200] text-[#2C2C2C] px-6 py-2 rounded-lg font-bold hover:bg-[#FFE566] transition-colors"
            >
              GIVE TODAY
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
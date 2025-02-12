import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen && 
        menuRef.current && 
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="bg-white border-b border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-12 sm:h-16">
          {/* Logo - Links to homepage */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={process.env.PUBLIC_URL + "/images/Game-mixer-logo.avif"} 
              alt="Game Mixer Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain bg-[#FFD200] p-1 rounded-lg"
            />
            <span className="text-[#2C2C2C] font-bold text-base sm:text-xl">
              Game Mixer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-10">
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

          {/* Mobile Menu Button */}
          <button
            ref={buttonRef}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className={`w-6 h-6 text-[#2C2C2C] transform transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`} />
          </button>
        </div>

        {/* Mobile Navigation - with animation */}
        <nav 
          ref={menuRef}
          className={`
            md:hidden 
            absolute 
            left-0 
            right-0 
            top-12 
            bg-white 
            border-b 
            border-gray-100 
            shadow-lg 
            z-50
            transform 
            transition-all 
            duration-300 
            ease-in-out
            origin-top
            ${isMenuOpen 
              ? 'opacity-100 translate-y-0 visible' 
              : 'opacity-0 -translate-y-2 invisible'}
          `}
        >
          <div className={`
            px-4 
            py-4 
            space-y-4 
            transform 
            transition-transform 
            duration-300 
            ${isMenuOpen ? 'translate-y-0' : '-translate-y-2'}
          `}>
            <Link 
              to="/" 
              className="block text-[#2C2C2C] hover:text-[#6B90FF] transition-colors"
            >
              Get to Know Us
            </Link>
            <Link 
              to="/events" 
              className="block text-[#2C2C2C] hover:text-[#6B90FF] transition-colors"
            >
              Get Involved
            </Link>
            <Link 
              to="/donate" 
              className="block w-full text-center bg-[#FFD200] text-[#2C2C2C] px-6 py-2 rounded-lg font-bold hover:bg-[#FFE566] transition-colors"
            >
              GIVE TODAY
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { paths } from '../../../config/paths';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const navigation = [
    { 
      name: 'Take Action', 
      subItems: [{ name: 'Give Today', path: '/give' }]
    },
    {
      name: 'Get Involved',
      subItems: [
        { name: 'Board Game Social', path: '/events/board-game-social' },
        { name: "Game Mixer's Ultimate Summer Bash", path: '/events/summer-bash' }
      ]
    },
    { 
      name: 'Get to Know Us', 
      subItems: [{ name: 'Meet the Team', path: '/team' }]
    },
    { 
      name: 'Connect', 
      subItems: [{ name: 'Connect Us', path: '/contact' }]
    },
  ];

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section with logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <img 
                src={process.env.PUBLIC_URL + "/images/Game-mixer-logo.avif"} 
                alt="Game Mixer Logo" 
                className="w-10 h-10 object-contain bg-[#FFD200] p-1 rounded-lg"
              />
              <span className="text-[#2C2C2C] font-bold text-xl">Game Mixer</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navigation.map((item) => (
              <div 
                key={item.name} 
                className="relative group"
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button 
                  className="text-[#2C2C2C] hover:text-[#6B90FF] transition-colors"
                >
                  {item.name}
                </button>
                {hoveredItem === item.name && (
                  <div className="absolute top-full left-0 bg-white rounded-lg shadow-lg mt-2 p-4 min-w-[200px]">
                    {item.subItems.map((subItem) => (
                      <div key={subItem.name} className="mb-2 last:mb-0">
                        <a 
                          href={paths.getRoutePath(subItem.path)} 
                          className="block text-[#2C2C2C] hover:text-[#6B90FF] transition-colors whitespace-nowrap"
                        >
                          {subItem.name}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button className="bg-[#FFD200] text-[#2C2C2C] px-6 py-2 rounded-lg font-bold hover:bg-[#FFE566] transition-colors">
              GIVE TODAY
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#2C2C2C] hover:bg-gray-100 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 bg-white border-t border-gray-100">
            <nav className="flex flex-col gap-4 p-4">
              {navigation.map((item) => (
                <div key={item.name}>
                  <h3 className="text-[#2C2C2C] font-medium mb-2">{item.name}</h3>
                  {item.subItems.map((subItem) => (
                    <a 
                      key={subItem.name}
                      href={paths.getRoutePath(subItem.path)}
                      className="block text-[#2C2C2C] hover:text-[#6B90FF] transition-colors px-2 py-2"
                    >
                      {subItem.name}
                    </a>
                  ))}
                </div>
              ))}
              <button className="w-full bg-[#FFD200] text-[#2C2C2C] px-6 py-2 rounded-lg font-bold hover:bg-[#FFE566] transition-colors mt-2">
                GIVE TODAY
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
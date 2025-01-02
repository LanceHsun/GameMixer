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
    <header className="sticky top-0 z-50 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section with logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2">
              <img 
                src={process.env.PUBLIC_URL + "/images/Game-mixer-logo.avif"} 
                alt="Game Mixer Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="logo-text text-white">Game Mixer</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-10 relative">
            {navigation.map((item) => (
              <div 
                key={item.name} 
                className="relative group"
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button 
                  className="nav-item text-white hover:text-gray-200 transition-colors"
                  onClick={() => {/* 处理点击事件 */}}
                >
                  {item.name}
                </button>
                {hoveredItem === item.name && (
                  <div className="absolute top-full left-0 bg-gradient-to-r from-purple-300 to-indigo-300 backdrop-blur-lg rounded-lg shadow-lg border border-white/20 mt-2 p-4"
                    style={{
                      backgroundColor: 'rgba(200, 170, 255, 0.85)',
                    }}>
                    {item.subItems.map((subItem) => (
                      <div key={subItem.name} className="mb-2 last:mb-0">
                        <a 
                          href={paths.getRoutePath(subItem.path)} 
                          className="nav-item block text-white hover:text-gray-200 transition-colors whitespace-nowrap"
                        >
                          {subItem.name}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <button className="button-text text-sm font-bold px-4 py-0.5 sm:px-6 sm:py-1 rounded-xl bg-gradient-to-r from-indigo-400/70 to-blue-400/70 backdrop-blur-md border-2 border-white/40 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:from-indigo-300/80 hover:to-blue-300/80 active:scale-95 group relative overflow-hidden">
              <span className="relative z-10 text-white drop-shadow-lg">
                GIVE TODAY
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/40 to-pink-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 shadow-lg">
            <nav className="flex flex-col gap-4 p-4">
              {navigation.map((item) => (
                <div key={item.name}>
                  <h3 className="nav-secondary text-white mb-2">{item.name}</h3>
                  {item.subItems.map((subItem) => (
                    <a 
                        key={subItem.name}
                        href={paths.getRoutePath(subItem.path)}
                        className="nav-item block text-white hover:text-gray-200 transition-colors px-2 py-2 rounded-lg hover:bg-white/20"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {subItem.name}
                      </a>
                    ))}
                </div>
              ))}
              <button className="button-text text-sm font-bold mt-2 w-full px-6 py-1.5 rounded-xl bg-gradient-to-r from-indigo-400/70 to-blue-400/70 backdrop-blur-md border-2 border-white/40 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 hover:from-indigo-300/80 hover:to-blue-300/80 active:scale-95 group relative overflow-hidden">
                <span className="relative z-10 text-white drop-shadow-lg">
                  GIVE TODAY
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/40 to-pink-400/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
export default Header;
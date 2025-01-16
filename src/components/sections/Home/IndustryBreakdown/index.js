import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { MapPin } from 'lucide-react';

const IndustryBreakdown = () => {
  const [showLabels, setShowLabels] = useState(true);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isHovered, setIsHovered] = useState(false);

  const enhanceSmallSectors = (value) => {
    if (value < 1) {
      return Math.max(value * 3, 1);
    }
    return value;
  };

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      setShowLabels(window.innerWidth > 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Data remains the same
  const rawData = [
    { name: 'Tech Giants', value: 47.07, displayValue: 47.07, position: 'left' },
    { name: 'Retail & E-commerce', value: 0.15, displayValue: 0.15, position: 'left' },
    { name: 'Tech Startups', value: 29.92, displayValue: 29.92, position: 'center' },
    { name: 'Freelance', value: 0.45, displayValue: 0.45, position: 'right' },
    { name: 'Research', value: 13.23, displayValue: 13.23, position: 'left' },
    { name: 'Finance & Consulting', value: 2.41, displayValue: 2.41, position: 'right' },
    { name: 'Gaming & Entertainment', value: 1.35, displayValue: 1.35, position: 'center' },
    { name: 'Semiconductor', value: 2.86, displayValue: 2.86, position: 'left' },
    { name: 'Biotech & Healthcare', value: 2.56, displayValue: 2.56, position: 'right' }
  ];

  const data = rawData.map(item => ({
    ...item,
    value: enhanceSmallSectors(item.value)
  }));

  const COLORS = [
    '#FFD200', '#FFE566', '#FFEA80', '#FFF0B3', '#FFD633',
    '#FFDB4D', '#FFE099', '#FFCC00', '#FFE5B3'
  ];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    if (!showLabels || isHovered) return null;
    
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * (screenWidth <= 768 ? 1.3 : 1.4);
    
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    const item = data[index];
    const textAnchor = x > cx ? 'start' : 'end';
    const xOffset = textAnchor === 'start' ? 
      (screenWidth <= 768 ? 5 : 10) : 
      (screenWidth <= 768 ? -5 : -10);

    return (
      <g>
        <line
          x1={cx + (outerRadius + 2) * Math.cos(-midAngle * RADIAN)}
          y1={cy + (outerRadius + 2) * Math.sin(-midAngle * RADIAN)}
          x2={x}
          y2={y}
          stroke="rgba(44, 44, 44, 0.3)"
          strokeWidth={1}
        />
        <text
          x={x + xOffset}
          y={y - 8}
          fill="#2C2C2C"
          textAnchor={textAnchor}
          className="text-xs md:text-sm font-serif"
        >
          {item.name}
        </text>
        <text
          x={x + xOffset}
          y={y + 8}
          fill="rgba(44, 44, 44, 0.7)"
          textAnchor={textAnchor}
          className="text-xs md:text-sm"
        >
          {`${rawData[index].displayValue}%`}
        </text>
      </g>
    );
  };

  const dimensions = screenWidth <= 768 ? {
    width: Math.min(screenWidth * 0.5, 300),
    height: Math.min(screenWidth * 0.5, 300),
    innerRadius: Math.min(screenWidth * 0.1, 60),
    outerRadius: Math.min(screenWidth * 0.15, 90)
  } : {
    width: 800,
    height: 500,
    innerRadius: 100,
    outerRadius: 150
  };

  return (
    <section className="bg-[#FAF6F0] max-w-screen-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      {/* Title Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl text-[#2C2C2C] font-medium font-serif mb-2">
          INDUSTRY BREAKDOWN
        </h2>
        <h3 className="text-2xl md:text-3xl text-[#2C2C2C]/70 font-light">
          A Decade of Game Mixer Community
        </h3>
      </div>

      {/* Chart Container with Fixed Height */}
      <div 
        className="relative"
        style={{ height: `${dimensions.height}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background Image Layer */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-screen min-w-[1200px] h-full">
          <img 
            src={process.env.PUBLIC_URL + "/images/picture/map.jpg"}
            alt="Silicon Valley Map"
            className="w-full h-full object-cover object-center"
          />
          <div 
            className="absolute inset-0 bg-[#FAF6F0] transition-opacity duration-300"
            style={{ opacity: isHovered ? 0 : 0.9 }}
          />
        </div>

        {/* Pie Chart Layer */}
        <div 
          className="absolute left-1/2 z-10 transition-opacity duration-300"
          style={{ 
            opacity: isHovered ? 0 : 1,
            transform: 'translateX(-50%)'
          }}
        >
          <PieChart width={dimensions.width} height={dimensions.height}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={dimensions.innerRadius}
              outerRadius={dimensions.outerRadius}
              paddingAngle={2}
              dataKey="value"
              label={renderCustomizedLabel}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="#FFFFFF"
                  strokeWidth={1}
                />
              ))}
            </Pie>
          </PieChart>
        </div>

        {/* Center Icon */}
        <div className="absolute z-20" style={{ 
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <div 
            className={`w-8 h-8 md:w-10 md:h-10 rounded-full transition-colors duration-300 
            ${isHovered ? 'bg-white' : 'bg-[#FFD200]/70'} 
            backdrop-blur-sm flex items-center justify-center`}
          >
            <MapPin className="w-5 h-5 md:w-6 md:h-6 text-[#2C2C2C]" />
          </div>
        </div>
      </div>

      {/* Legend Container - Separate from Chart */}
      {!showLabels && !isHovered && (
        <div className="mt-8 w-full flex justify-center">
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-8 sm:px-12">
            {rawData.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 min-w-0 py-1">
                <div 
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="text-[#2C2C2C]/70 text-[10px] sm:text-xs truncate">
                  {item.name}: {item.displayValue}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default IndustryBreakdown;
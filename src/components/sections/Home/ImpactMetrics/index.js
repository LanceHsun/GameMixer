import React from 'react';
import { paths } from '../../../../../src/config/paths';

const MetricCard = ({ number, label, imageUrl }) => {
  return (
    <div className="relative h-[115.2px] md:h-64 lg:h-[460.8px] group cursor-pointer">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-xl transition-opacity duration-300 group-hover:opacity-0" />
      
      {/* Image Layer (Hidden by default, shown on hover) */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-cover bg-center rounded-xl overflow-hidden"
      >
        <div className="w-full h-full bg-white/10 backdrop-blur-lg flex items-center justify-center">
          {imageUrl && (
            <img 
              src={imageUrl} 
              alt={label} 
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </div>

      {/* Content Layer (Hidden on hover) */}
      <div className="relative h-full flex flex-col items-center justify-center lg:justify-end text-white p-8 group-hover:opacity-0 transition-opacity duration-300">
        <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3">{number}</div>
        <div className="text-xl md:text-2xl lg:text-2xl text-center">{label}</div>
      </div>
    </div>
  );
};

const ImpactMetrics = () => {
  const metrics = [
    { 
      number: '600', 
      label: 'EVENTS',
      imageUrl: paths.getImagePath('picture/hero.avif')
    },
    { 
      number: '40k', 
      label: 'ATTENDANCES',
      imageUrl: paths.getImagePath('picture/hero.avif')
    },
    { 
      number: '8k', 
      label: 'MEMBERS', 
      imageUrl: paths.getImagePath('picture/hero.avif')
    },
    { 
      number: '18k', 
      label: 'VOLUNTEER HOURS',
      imageUrl: paths.getImagePath('picture/hero.avif')
    }
  ];

  return (
    <section className="max-w-screen-lg mx-auto px-4 py-12 md:py-20">
      <h2 className="text-4xl font-bold text-white/90 text-center mb-12">
        What difference does it make?
      </h2>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            number={metric.number}
            label={metric.label}
            imageUrl={metric.imageUrl}
          />
        ))}
      </div>

      {/* Testimonial */}
      <div className="mt-12 text-center">
        <p className="text-xl text-white/80 italic">
          "Game Mixer isn't just a gaming group—it's a family. I've met lifelong friends here."
        </p>
        <p className="text-white/60 mt-2">
          – A Regular Participant
        </p>
      </div>
    </section>
  );
};

export default ImpactMetrics;
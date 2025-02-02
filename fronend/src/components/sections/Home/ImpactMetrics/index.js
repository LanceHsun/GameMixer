import React from 'react';

const MetricCard = ({ number, label }) => {
  return (
    <div className="relative h-[115.2px] md:h-64 lg:h-[460.8px]">
      {/* Background Layer */}
      <div className="absolute inset-0 bg-[#FFD200]/10 backdrop-blur-lg rounded-xl" />
      
      {/* Content Layer */}
      <div className="relative h-full flex flex-col items-center justify-center lg:justify-end text-[#2C2C2C] p-8">
        <div className="text-5xl md:text-6xl lg:text-7xl font-bold mb-3 font-serif">{number}</div>
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
    },
    { 
      number: '40k', 
      label: 'ATTENDANCES',
    },
    { 
      number: '8k', 
      label: 'MEMBERS', 
    },
    { 
      number: '18k', 
      label: 'VOLUNTEER HOURS',
    }
  ];

  return (
    <section id="impact-metrics" className="max-w-screen-lg mx-auto px-4 py-12 md:py-20">
      <h2 className="text-3xl md:text-4xl text-[#2C2C2C] font-medium text-center mb-12 font-serif">
        What difference does it make?
      </h2>

      {/* Metrics Grid - Preserving exact same layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={index}
            number={metric.number}
            label={metric.label}
          />
        ))}
      </div>

      {/* Testimonial */}
      <div className="mt-12 text-center">
        <p className="text-xl text-[#2C2C2C]/80 italic font-serif">
          "Game Mixer isn't just a gaming group—it's a family. I've met lifelong friends here."
        </p>
        <p className="text-[#2C2C2C]/60 mt-2">
          – A Regular Participant
        </p>
      </div>
    </section>
  );
};

export default ImpactMetrics;
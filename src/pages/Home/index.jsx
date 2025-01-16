// src/pages/Home/index.jsx
import React from 'react';
import Hero from '../../components/sections/Home/Hero';
import ImpactMetrics from '../../components/sections/Home/ImpactMetrics';
import EventCarousel from '../../components/sections/Home/EventCarousel';
import MissionSection from '../../components/sections/Home/MissionSection';
import CallToAction from '../../components/sections/Home/CallToAction';
import SponsorsSection from '../../components/sections/Home/SponsorsSection';
import IndustryBreakdown from '../../components/sections/Home/IndustryBreakdown';
import TestimonialsSection from '../../components/sections/Home/TestimonialsSection';
import WordCloudSection from '../../components/sections/Home/WordCloudSection';

import { DonationProvider } from '../../context/DonationContext';

const HomePage = () => {
  return (
    <DonationProvider>
      <div>
        <MissionSection />
        <ImpactMetrics />
        <EventCarousel />
        <IndustryBreakdown />
        <WordCloudSection/>
        <TestimonialsSection/>
        <CallToAction />
        <Hero />
        <SponsorsSection />
      </div>
    </DonationProvider>
  );
};

export default HomePage;
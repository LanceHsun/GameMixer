// src/pages/Home/index.jsx
import React from 'react';
import Hero from '../../components/sections/Home/Hero';
import DonationOptions from '../../components/sections/Home/DonationOptions';
import ImpactMetrics from '../../components/sections/Home/ImpactMetrics';
import EventCarousel from '../../components/sections/Home/EventCarousel';
import MissionSection from '../../components/sections/Home/MissionSection';
import CallToAction from '../../components/sections/Home/CallToAction';
import SponsorsSection from '../../components/sections/Home/SponsorsSection';
import { DonationProvider } from '../../context/DonationContext';

const HomePage = () => {
  return (
    <DonationProvider>
      <div>
        <Hero />
        <DonationOptions />
        <ImpactMetrics />
        <EventCarousel />
        <MissionSection />
        <CallToAction />
        <SponsorsSection />
      </div>
    </DonationProvider>
  );
};

export default HomePage;
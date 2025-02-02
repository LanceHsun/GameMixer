// pages/Donation/index.jsx
import React from 'react';
import DonationOptions from '../../components/sections/Home/DonationOptions';
import { DonationProvider } from '../../context/DonationContext';

const DonationPage = () => {
  return (
    <DonationProvider>
      <div className="py-12">
        <DonationOptions />
      </div>
    </DonationProvider>
  );
};

export default DonationPage;
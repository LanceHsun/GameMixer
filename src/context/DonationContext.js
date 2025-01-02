import React, { createContext, useContext, useState } from 'react';

const DonationContext = createContext(undefined);

export function DonationProvider({ children }) {
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [donationType, setDonationType] = useState('financial');
  const [customAmount, setCustomAmount] = useState('');

  const setDonationAmount = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount(amount ? amount.toString() : '');
  };

  const value = {
    selectedAmount,
    donationType,
    customAmount,
    setDonationAmount,
    setDonationType,
    setCustomAmount
  };

  return (
    <DonationContext.Provider value={value}>
      {children}
    </DonationContext.Provider>
  );
}

export function useDonation() {
  const context = useContext(DonationContext);
  if (context === undefined) {
    throw new Error('useDonation must be used within a DonationProvider');
  }
  return context;
}
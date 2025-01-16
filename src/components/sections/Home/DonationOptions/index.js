import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import GradientButton from '../../../common/Button';
import { useDonation } from '../../../../context/DonationContext';

const DonationOptions = () => {
  const {
    selectedAmount,
    donationType,
    customAmount,
    setDonationAmount,
    setDonationType,
    setCustomAmount
  } = useDonation();

  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });

  const donationOptions = [
    { amount: 40, description: 'Supports a participant' },
    { amount: 240, description: 'Event Games support' },
    { amount: 1000, description: 'Large event support' }
  ];

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCustomAmount(value);
    setDonationAmount(null);
  };

  const handleDonationTypeChange = (type) => {
    setDonationType(type);
    if (type === 'goods') {
      setDonationAmount(null);
      setCustomAmount('');
    }
  };

  const renderPaymentFields = () => {
    switch (paymentMethod) {
      case 'credit_card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-[#2C2C2C] font-medium mb-1.5">Card Number</label>
              <input
                type="text"
                maxLength="16"
                placeholder="1234 5678 9012 3456"
                className="w-full p-3 rounded-lg border-2 border-[#2C2C2C]/10 focus:border-[#FFD200] focus:ring-2 focus:ring-[#FFD200]/20 bg-white text-[#2C2C2C] placeholder:text-[#2C2C2C]/40 transition duration-200"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value.replace(/\D/g, '')})}
              />
            </div>
            <div>
              <label className="block text-[#2C2C2C] font-medium mb-2">Cardholder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full p-4 rounded-xl border-2 border-[#2C2C2C]/10 focus:border-[#FFD200] focus:ring-2 focus:ring-[#FFD200]/20 bg-white text-[#2C2C2C] placeholder:text-[#2C2C2C]/40 transition duration-200"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[#2C2C2C] font-medium mb-2">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength="5"
                  className="w-full p-4 rounded-xl border-2 border-[#2C2C2C]/10 focus:border-[#FFD200] focus:ring-2 focus:ring-[#FFD200]/20 bg-white text-[#2C2C2C] placeholder:text-[#2C2C2C]/40 transition duration-200"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[#2C2C2C] font-medium mb-2">CVV</label>
                <input
                  type="password"
                  maxLength="4"
                  placeholder="123"
                  className="w-full p-4 rounded-xl border-2 border-[#2C2C2C]/10 focus:border-[#FFD200] focus:ring-2 focus:ring-[#FFD200]/20 bg-white text-[#2C2C2C] placeholder:text-[#2C2C2C]/40 transition duration-200"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                />
              </div>
            </div>
          </div>
        );
      case 'paypal':
        return (
          <div className="text-center bg-[#2C2C2C]/5 rounded-xl p-8">
            <p className="text-[#2C2C2C] text-lg">You will be redirected to PayPal to complete your donation.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="donation-options" className="max-w-5xl mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] tracking-tight">
            Support Our Community Your Way
          </h2>
          <p className="text-xl text-[#2C2C2C]/70">
            Choose how you'd like to make a difference
          </p>
        </div>

        {/* Donation Amount Options */}
        <div className="grid grid-cols-3 gap-3">
          {donationOptions.map((option) => (
            <button
              key={option.amount}
              onClick={() => {
                setDonationAmount(option.amount);
                setDonationType('financial');
              }}
              className={`p-4 rounded-lg transition-all duration-300 ${
                selectedAmount === option.amount
                  ? 'bg-[#FFD200] shadow-lg scale-105 border-2 border-[#2C2C2C]'
                  : 'bg-white hover:bg-[#FFD200]/10 border-2 border-[#2C2C2C]/10'
              }`}
            >
              <div className="text-xl font-bold text-[#2C2C2C]">${option.amount}</div>
              <div className="text-sm text-[#2C2C2C]/70 mt-2">{option.description}</div>
            </button>
          ))}
        </div>

        {/* Donation Type Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleDonationTypeChange('financial')}
            className={`p-6 rounded-xl transition-all duration-300 ${
              donationType === 'financial'
                ? 'bg-[#FFD200] shadow-lg scale-105 border-2 border-[#2C2C2C]'
                : 'bg-white hover:bg-[#FFD200]/10 border-2 border-[#2C2C2C]/10'
            }`}
          >
            <span className="text-xl font-bold text-[#2C2C2C]">Donate Now</span>
          </button>
          <button
            onClick={() => handleDonationTypeChange('goods')}
            className={`p-6 rounded-xl transition-all duration-300 ${
              donationType === 'goods'
                ? 'bg-[#FFD200] shadow-lg scale-105 border-2 border-[#2C2C2C]'
                : 'bg-white hover:bg-[#FFD200]/10 border-2 border-[#2C2C2C]/10'
            }`}
          >
            <span className="text-xl font-bold text-[#2C2C2C]">Offer Goods</span>
          </button>
        </div>

        {/* Dynamic Form Based on Donation Type */}
        {donationType && (
          <form className="space-y-4 bg-white p-5 rounded-lg border-2 border-[#2C2C2C]/10">
            {donationType === 'financial' ? (
              <>
                <div className="space-y-2">
                  <label className="block text-[#2C2C2C] font-medium">Donation Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#2C2C2C]">$</span>
                    <input
                      type="text"
                      value={customAmount}
                      onChange={handleAmountChange}
                      placeholder="Enter amount in USD"
                      className="w-full p-3 pl-7 rounded-lg border-2 border-[#2C2C2C]/10 focus:border-[#FFD200] focus:ring-2 focus:ring-[#FFD200]/20 bg-white text-[#2C2C2C] placeholder:text-[#2C2C2C]/40 transition duration-200"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[#2C2C2C] font-medium">Payment Method</label>
                  <div className="relative">
                    <select 
                      className="w-full p-4 rounded-xl border-2 border-[#2C2C2C]/10 focus:border-[#FFD200] focus:ring-2 focus:ring-[#FFD200]/20 bg-white text-[#2C2C2C] appearance-none transition duration-200"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="">Select payment method</option>
                      <option value="credit_card">Credit/Debit Card</option>
                      <option value="paypal">PayPal</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#2C2C2C]" />
                  </div>
                </div>
                {renderPaymentFields()}
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="block text-[#2C2C2C] font-medium">Donation Type</label>
                  <div className="relative">
                    <select className="w-full p-4 rounded-xl border-2 border-[#2C2C2C]/10 focus:border-[#FFD200] focus:ring-2 focus:ring-[#FFD200]/20 bg-white text-[#2C2C2C] appearance-none transition duration-200">
                      <option>Select donation type</option>
                      <option>Venue Space</option>
                      <option>Games</option>
                      <option>Gifts</option>
                      <option>Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#2C2C2C]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-[#2C2C2C] font-medium">Donation Details</label>
                  <textarea
                    placeholder="Please describe the items or venue you would like to donate..."
                    className="w-full p-4 rounded-xl border-2 border-[#2C2C2C]/10 focus:border-[#FFD200] focus:ring-2 focus:ring-[#FFD200]/20 bg-white text-[#2C2C2C] placeholder:text-[#2C2C2C]/40 min-h-32 transition duration-200"
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="block text-[#2C2C2C] font-medium">Contact Email</label>
              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full p-4 rounded-xl border-2 border-[#2C2C2C]/10 focus:border-[#FFD200] focus:ring-2 focus:ring-[#FFD200]/20 bg-white text-[#2C2C2C] placeholder:text-[#2C2C2C]/40 transition duration-200"
              />
            </div>

            <p className="text-sm text-[#2C2C2C]/70">
              {donationType === 'financial'
                ? 'We will send you a donation receipt and our thanks via email'
                : 'We will contact you via email to discuss further collaboration details'}
            </p>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="px-8 py-3 bg-[#FFD200] text-[#2C2C2C] rounded-xl font-bold text-lg hover:bg-[#FFE566] transition-colors duration-300 transform hover:scale-105 active:scale-95"
              >
                Give
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default DonationOptions;
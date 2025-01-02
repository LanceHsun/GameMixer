import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import GradientButton from '../../../common/GradientButton';
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
    setDonationAmount(null);  // Clear selected amount when custom amount is entered
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
              <label className="block text-white mb-2">Card Number</label>
              <input
                type="text"
                maxLength="16"
                placeholder="1234 5678 9012 3456"
                className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg text-white placeholder:text-white/50"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value.replace(/\D/g, '')})}
              />
            </div>
            <div>
              <label className="block text-white mb-2">Cardholder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg text-white placeholder:text-white/50"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  maxLength="5"
                  className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg text-white placeholder:text-white/50"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-white mb-2">CVV</label>
                <input
                  type="password"
                  maxLength="4"
                  placeholder="123"
                  className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg text-white placeholder:text-white/50"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value.replace(/\D/g, '')})}
                />
              </div>
            </div>
          </div>
        );
      case 'paypal':
        return (
          <div className="text-white text-center p-6">
            <p>You will be redirected to PayPal to complete your donation.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="donation-options" className="max-w-6xl mx-auto px-4 py-12 md:py-20">
      <div className="max-w-3xl mx-auto space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold text-white/90 text-center mb-8">Support Our Community Your Way</h2>

        {/* Donation Amount Options */}
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {donationOptions.map((option) => (
            <button
              key={option.amount}
              onClick={() => {
                setDonationAmount(option.amount);
                setDonationType('financial');
              }}
              className={`p-3 md:p-4 rounded-xl transition-all duration-300 ${
                selectedAmount === option.amount
                  ? 'bg-white/20 text-white shadow-lg scale-105 border-2 border-white/50'
                  : 'bg-white/10 text-white/80 hover:bg-white/15 border border-white/10'
              }`}
            >
              <div className="text-base md:text-lg font-semibold">${option.amount}</div>
              <div className="text-xs md:text-sm">{option.description}</div>
            </button>
          ))}
        </div>

        {/* Donation Type Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleDonationTypeChange('financial')}
            className={`p-4 rounded-xl transition-all duration-300 ${
              donationType === 'financial'
                ? 'bg-white/20 text-white shadow-lg scale-105 border-2 border-white/50'
                : 'bg-white/10 text-white/80 hover:bg-white/15 border border-white/10'
            }`}
          >
            Donate Now
          </button>
          <button
            onClick={() => handleDonationTypeChange('goods')}
            className={`p-4 rounded-xl transition-all duration-300 ${
              donationType === 'goods'
                ? 'bg-white/20 text-white shadow-lg scale-105 border-2 border-white/50'
                : 'bg-white/10 text-white/80 hover:bg-white/15 border border-white/10'
            }`}
          >
            Offer Goods
          </button>
        </div>

        {/* Dynamic Form Based on Donation Type */}
        {donationType && (  // Only show form if a donation type is selected
          <form className="space-y-6">
            {donationType === 'financial' ? (
            <>
              <div className="space-y-2">
                <label className="block text-white">Donation Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white">$</span>
                  <input
                    type="text"
                    value={customAmount}
                    onChange={handleAmountChange}
                    placeholder="Enter amount in USD"
                    className="w-full p-4 pl-8 rounded-xl bg-white/10 backdrop-blur-lg text-white placeholder:text-white/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-white">Payment Method</label>
                <div className="relative">
                  <select 
                    className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg text-white appearance-none"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="">Select payment method</option>
                    <option value="credit_card">Credit/Debit Card</option>
                    <option value="paypal">PayPal</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white" />
                </div>
              </div>
              {renderPaymentFields()}
            </>
          ) : (
            <>
              <div className="space-y-2">
                <label className="block text-white">Donation Type</label>
                <div className="relative">
                  <select className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg text-white appearance-none">
                    <option>Select donation type</option>
                    <option>Venue Space</option>
                    <option>Games</option>
                    <option>Gifts</option>
                    <option>Other</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-white">Donation Details</label>
                <textarea
                  placeholder="Please describe the items or venue you would like to donate.."
                  className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg text-white placeholder:text-white/50 min-h-32"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="block text-white">Contact Email</label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full p-4 rounded-xl bg-white/10 backdrop-blur-lg text-white placeholder:text-white/50"
            />
          </div>

          <p className="text-sm text-white/70">
            {donationType === 'financial'
              ? 'We will send you a donation receipt and our thanks via email'
              : 'We will contact you via email to discuss further collaboration details'}
          </p>

          <div className="flex justify-end">
            <GradientButton
              type="submit"
              size="small"
              className="w-32"
            >
              Give
            </GradientButton>
          </div>
        </form>
        )}
      </div>
    </section>
  );
};

export default DonationOptions;
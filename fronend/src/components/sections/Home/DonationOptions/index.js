import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useDonation } from '../../../../context/DonationContext';
import { donationService } from '../../../../services/api';

const DonationOptions = () => {
  const {
    selectedAmount,
    donationType,
    customAmount,
    setDonationAmount,
    setDonationType,
    setCustomAmount
  } = useDonation();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    donationType: '',
    details: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [errors, setErrors] = useState({});

  // 其他函数保持不变...
  const getNextSaturday = () => {
    const today = new Date();
    const day = today.getDay();
    const daysUntilSaturday = (6 - day + 7) % 7;
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + daysUntilSaturday);
    return nextSaturday.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const nextEventDate = getNextSaturday();

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
    setSubmitStatus({ type: '', message: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (donationType === 'financial') {
      if (!selectedAmount && !customAmount) {
        newErrors.amount = 'Please select or enter an amount';
      }
    } else {
      if (!formData.donationType) {
        newErrors.donationType = 'Please select a donation type';
      }
      if (!formData.details) {
        newErrors.details = 'Please provide donation details';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });

    try {
      if (donationType === 'financial') {
        await donationService.submitMonetaryDonation({
          amount: parseFloat(customAmount || selectedAmount),
          email: formData.email,
          name: formData.name,
          paymentMethod: 'ZELLE'
        });
        
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your donation! Please check your email for Zelle payment instructions. Follow the steps in the email to complete your donation.'
        });
      } else {
        await donationService.submitGoodsDonation({
          donationType: formData.donationType,
          details: formData.details,
          email: formData.email,
          name: formData.name
        });
        
        setSubmitStatus({
          type: 'success',
          message: 'Thank you for your donation offer! We will contact you soon to arrange the details.'
        });
      }

      setFormData({
        name: '',
        email: '',
        donationType: '',
        details: ''
      });
      setCustomAmount('');
      setDonationAmount(null);

    } catch (error) {
      console.error('Donation submission error:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to process donation. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="donation-options" className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C2C2C] tracking-tight">
            Support Our Community Your Way
          </h2>
          <p className="text-xl text-[#2C2C2C]/70">
            Choose how you'd like to make a difference
          </p>
          <p className="text-base text-[#2C2C2C]/70">
            Join us for our next event on {nextEventDate}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {donationOptions.map((option) => (
            <button
              key={option.amount}
              onClick={() => {
                setDonationAmount(option.amount);
                setDonationType('financial');
              }}
              className={`p-3 rounded-lg transition-all duration-300 ${
                selectedAmount === option.amount
                  ? 'bg-[#FFD200] shadow-lg scale-105 border-2 border-[#2C2C2C]'
                  : 'bg-white hover:bg-[#FFD200]/10 border-2 border-[#2C2C2C]/10'
              }`}
            >
              <div className="text-lg font-bold text-[#2C2C2C]">${option.amount}</div>
              <div className="text-xs text-[#2C2C2C]/70 mt-1">{option.description}</div>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleDonationTypeChange('financial')}
            className={`p-4 rounded-xl transition-all duration-300 ${
              donationType === 'financial'
                ? 'bg-[#FFD200] shadow-lg scale-105 border-2 border-[#2C2C2C]'
                : 'bg-white hover:bg-[#FFD200]/10 border-2 border-[#2C2C2C]/10'
            }`}
          >
            <span className="text-lg font-bold text-[#2C2C2C]">Donate Now</span>
          </button>
          <button
            onClick={() => handleDonationTypeChange('goods')}
            className={`p-4 rounded-xl transition-all duration-300 ${
              donationType === 'goods'
                ? 'bg-[#FFD200] shadow-lg scale-105 border-2 border-[#2C2C2C]'
                : 'bg-white hover:bg-[#FFD200]/10 border-2 border-[#2C2C2C]/10'
            }`}
          >
            <span className="text-lg font-bold text-[#2C2C2C]">Offer Goods</span>
          </button>
        </div>

        {donationType && (
          <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded-lg border-2 border-[#2C2C2C]/10">
            {donationType === 'financial' ? (
              <>
                <div className="space-y-1">
                  <label className="block text-[#2C2C2C] font-medium">Donation Amount (USD)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#2C2C2C]">$</span>
                    <input
                      type="text"
                      value={customAmount}
                      onChange={handleAmountChange}
                      placeholder="Enter amount in USD"
                      className={`w-full p-2 pl-7 rounded-lg border-2 ${
                        errors.amount ? 'border-red-500' : 'border-[#2C2C2C]/10'
                      } focus:border-[#FFD200] focus:ring-2 focus:ring-[#FFD200]/20 bg-white text-[#2C2C2C] placeholder:text-[#2C2C2C]/40 transition duration-200`}
                    />
                    {errors.amount && (
                      <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[#2C2C2C] font-medium">Payment Method</label>
                  <div className="p-3 bg-[#F5F5F5] rounded-xl">
                    <div className="flex items-center space-x-2">
                      <span className="text-[#2C2C2C] font-medium">Zelle</span>
                      <span className="text-sm text-[#2C2C2C]/70">(Only payment method accepted)</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 text-blue-800 border border-blue-200 rounded-xl text-sm">
                  After submitting this form, you will receive an email with detailed Zelle payment instructions. 
                  Please follow the steps in the email to complete your donation.
                </div>
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <label className="block text-[#2C2C2C] font-medium">Donation Type</label>
                  <div className="relative">
                    <select
                      name="donationType"
                      value={formData.donationType}
                      onChange={handleInputChange}
                      className={`w-full p-3 rounded-xl border-2 ${
                        errors.donationType ? 'border-red-500' : 'border-[#2C2C2C]/10'
                      } focus:border-[#FFD200] focus:ring-2 focus:ring-[#FFD200]/20 bg-white text-[#2C2C2C] appearance-none transition duration-200`}
                    >
                      <option value="">Select donation type</option>
                      <option value="VENUE_SPACE">Venue Space</option>
                      <option value="GAMES">Games</option>
                      <option value="GIFTS">Gifts</option>
                      <option value="OTHER">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#2C2C2C]" />
                    {errors.donationType && (
                      <p className="mt-1 text-sm text-red-500">{errors.donationType}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[#2C2C2C] font-medium">Donation Details</label>
                  <textarea
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    placeholder="Please describe the items or venue you would like to donate..."
                    className={`w-full p-3 rounded-xl border-2 ${
                      errors.details ? 'border-red-500' : 'border-[#2C2C2C]/10'
                    } focus:border-[#FFD200] focus:ring-2 focus:ring-[#FFD200]/20 bg-white text-[#2C2C2C] placeholder:text-[#2C2C2C]/40 min-h-24 transition duration-200`}
                  />
                  {errors.details && (
                    <p className="mt-1 text-sm text-red-500">{errors.details}</p>
                  )}
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="block text-[#2C2C2C] font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full p-3 rounded-xl border-2 border-[#2C2C2C]/10 focus:border-[#FFD200] focus:ring-2 focus:ring-[#FFD200]/20 bg-white text-[#2C2C2C] placeholder:text-[#2C2C2C]/40 transition duration-200"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-[#2C2C2C] font-medium">Contact Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
                className={`w-full p-3 rounded-xl border-2 ${
                  errors.email ? 'border-red-500' : 'border-[#2C2C2C]/10'
                } focus:border-[#FFD200] focus:ring-2 focus:ring-[#FFD200]/20 bg-white text-[#2C2C2C] placeholder:text-[#2C2C2C]/40 transition duration-200`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <p className="text-xs text-[#2C2C2C]/70">
              {donationType === 'financial'
                ? 'We will send you payment instructions via email. Please follow the steps in the email to complete your Zelle donation.'
                : 'We will contact you via email to discuss further collaboration details'}
            </p>

            <div className="space-y-2 pt-2">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    px-6 py-2.5
                    bg-[#FFD200] text-[#2C2C2C] 
                    rounded-xl font-bold text-base
                    transition-all duration-300 
                    ${isSubmitting ? 
                      'opacity-50 cursor-not-allowed' : 
                      'hover:bg-[#FFE566] transform hover:scale-105 active:scale-95'
                    }
                  `}
                >
                  {isSubmitting ? 'Processing...' : 'Submit'}
                </button>
              </div>
              
              {submitStatus.message && (
                <div className={`p-3 rounded-lg text-sm ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {submitStatus.message}
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default DonationOptions;
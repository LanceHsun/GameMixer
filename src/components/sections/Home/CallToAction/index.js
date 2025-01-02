import React from 'react';
import { useDonation } from '../../../../context/DonationContext';

const CallToAction = () => {
  const { setDonationAmount } = useDonation();

  const handleDonateClick = () => {
    const element = document.getElementById('donation-options');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setDonationAmount(40);
    }
  };

  return (
    <section className="max-w-screen-lg mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col-reverse md:flex-row items-start gap-8 md:gap-12">
        {/* Content Area */}
        <div className="w-full md:w-1/2 space-y-6 mt-48 md:mt-0 flex flex-col items-center text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white/90 leading-tight">
            Ready to multiply joy in the Valley?
          </h2>
          
          <p className="text-xl text-white/80">
            Every $40 helps one person find their community. Join us in creating spaces where 
            friendships begin.
          </p>
          
          <button 
            onClick={handleDonateClick}
            className="mt-8 bg-transparent border-2 border-white/60 hover:border-white text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105"
          >
            GIVE $40
          </button>
        </div>

        {/* Visual Elements */}
        <div className="w-full md:w-1/2">
          <div className="relative w-full h-48 md:h-80">
            <div className="absolute left-4 -top-4 w-2/3 aspect-[4/3] rounded-2xl shadow-md overflow-hidden transform -rotate-6 origin-bottom-left">
              <img 
                src="/picture/hero.avif"
                alt="Board game hero"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute right-4 top-8 w-2/3 aspect-[4/3] rounded-2xl shadow-md overflow-hidden">
              <img 
                src="/picture/hero.avif"
                alt="Board game hero"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
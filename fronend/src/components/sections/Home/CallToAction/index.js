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
    <section id="call-to-action" className="max-w-5xl mx-auto px-4 py-8 md:py-12">
      <div className="flex flex-col-reverse md:flex-row items-start gap-6 md:gap-8">
        {/* Content Area */}
        <div className="w-full md:w-1/2 space-y-4 mt-12 md:mt-0 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl text-[#2C2C2C] font-medium font-serif leading-tight">
            Ready to multiply joy in the Valley?
          </h2>
          
          <p className="text-lg text-[#2C2C2C]/80">
            Every $40 helps one person find their community. Join us in creating spaces where 
            friendships begin.
          </p>
          
          <button 
            onClick={handleDonateClick}
            className="mt-4 bg-[#FFD200] text-[#2C2C2C] px-6 py-2.5 rounded-lg font-bold 
                     hover:bg-[#FFE566] transition-all duration-300 transform hover:scale-105"
          >
            GIVE $40
          </button>
        </div>

        {/* Visual Elements - Updated margin-top for md screens */}
        <div className="w-full md:w-1/2 my-16 md:-mt-11 md:mb-8">
          <div className="relative max-w-[420px] mx-auto h-60 md:h-96">
            <div className="absolute left-0 -top-4 w-[240px] aspect-[4/3] rounded-lg shadow-md overflow-hidden 
                          transform -rotate-6 origin-bottom-left hover:rotate-0 transition-transform duration-300">
              <img 
                src={process.env.PUBLIC_URL + "/images/picture/play1.jpg"}
                alt="Board game hero"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute right-0 top-8 w-[240px] aspect-[4/3] rounded-lg shadow-md overflow-hidden
                          hover:transform hover:scale-105 transition-transform duration-300">
              <img 
                src={process.env.PUBLIC_URL + "/images/picture/play2.jpg"}
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
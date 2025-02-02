import React from 'react';

const SponsorsSection = () => {
  const basePath = `${process.env.PUBLIC_URL}/images/sponsor-logo/`;

  const sponsors = [
    {
      logo: `${basePath}BOA.avif`,
      link: 'https://www.bankofamerica.com/',
    },
    {
      logo: `${basePath}Starbucks-Logo.avif`,
      link: 'https://www.starbucks.com/',
    },
    {
      logo: `${basePath}Texas Roadhouse_edited.avif`,
      link: 'https://www.texasroadhouse.com/locations/80-union-cityca',
    },
    {
      logo: `${basePath}Stonemaier_edited.avif`,
      link: 'https://stonemaiergames.com/',
    },
    {
      logo: `${basePath}flyhigh.avif`,
      link: 'https://flyhightalent.com/',
    },
    {
      logo: `${basePath}safeway logo square.avif`,
      link: 'https://www.safeway.com/',
    },
    {
      logo: `${basePath}Game Toppers.avif`,
      link: 'https://www.gametoppersllc.com/',
    },
    {
      logo: `${basePath}Sunrise Tornado.avif`,
      link: 'https://www.sunrisetornado.com/',
    },
  ];

  const handleGiveToday = () => {
    const donationSection = document.getElementById('donation-options');
    if (donationSection) {
      donationSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <section id="sponsors" className="bg-[#FAF6F0] max-w-screen-lg mx-auto px-4 py-12 md:py-20">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-3xl md:text-4xl text-[#2C2C2C] font-medium font-serif">
          Thank You to Our Amazing Sponsors
        </h2>
        <p className="text-xl text-[#2C2C2C]/70">
          We are proud to have the support of leading organizations and community
          partners who believe in building bridges through play.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 gap-y-6 max-w-4xl mx-auto">
        {sponsors.map((sponsor, index) => (
          <div
            key={index}
            className="flex items-center justify-center relative mx-auto bg-white rounded-full shadow-sm hover:shadow-md transition-shadow duration-300 w-20 h-20 overflow-hidden"
          >
            <a
              href={sponsor.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-full flex items-center justify-center"
            >
              <img
                src={sponsor.logo}
                alt={`Sponsor ${index + 1}`}
                className="max-w-[70%] max-h-[70%] object-contain"
              />
            </a>
          </div>
        ))}
      </div>

      <div className="text-center space-y-6 mt-12">
        <p className="text-xl text-[#2C2C2C]/70">
          Join these game-changers in building a more connected Silicon Valley.
        </p>
        <button 
          onClick={handleGiveToday}
          className="
            px-8 
            py-3 
            rounded-xl
            text-lg
            font-bold
            tracking-wider
            bg-[#FFD200]
            text-[#2C2C2C]
            shadow-sm
            transition-all 
            duration-300
            transform
            hover:bg-[#FFE566]
            hover:shadow-md
            hover:scale-105
            active:scale-95
          "
        >
          GIVE TODAY
        </button>
      </div>
    </section>
  );
};

export default SponsorsSection;
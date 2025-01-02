import React from 'react';

const SponsorsSection = () => {
  const basePath = '/sponsor-logo/';

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
    <section className="max-w-screen-lg mx-auto px-4 py-12 md:py-20">
      <div className="text-center space-y-4 mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white/90">
          Thank You to Our Amazing Sponsors
        </h2>
        <p className="text-xl text-white/80 max-w-3xl mx-auto">
          We are proud to have the support of leading organizations and community
          partners who believe in building bridges through play.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 gap-y-6 max-w-4xl mx-auto">
        {sponsors.map((sponsor, index) => (
          <div
            key={index}
            className="flex items-center justify-center relative mx-auto bg-white rounded-full shadow-md w-20 h-20 overflow-hidden"
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
        <p className="text-xl text-white/80">
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
            text-white
            bg-gradient-to-r 
            from-indigo-400/70 
            to-blue-400/70
            backdrop-blur-md
            border-2
            border-white/40
            shadow-[0_0_15px_rgba(255,255,255,0.3)]
            transition-all
            duration-300
            hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]
            hover:scale-105
            hover:from-indigo-300/80 
            hover:to-blue-300/80
            active:scale-95
            group
            relative
            overflow-hidden
          "
        >
          <span className="relative z-10 text-lg font-bold tracking-wider uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,0.3)]">GIVE TODAY</span>
          <div className="
            absolute 
            inset-0 
            bg-gradient-to-r 
            from-purple-400/40 
            to-pink-400/40 
            opacity-0 
            group-hover:opacity-100 
            transition-opacity 
            duration-300
          "></div>
        </button>
      </div>
    </section>
  );
};

export default SponsorsSection;
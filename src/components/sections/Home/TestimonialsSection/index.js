import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Linkedin } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const testimonials = [
    {
      name: "STELLA LU",
      title: "Former Board Member of the Chief's Advisory Committee, Co-founder of Game Mixer",
      quote: "Ten years ago, I discovered the magic of board gaming at Rony's local meetups. When the organizing group dissolved, Rony and I decided to keep the games alive. Our simple effort to restart the gatherings drew unexpected support. People eagerly offered venues and resources. We reignited these weekly game nights, and I uncovered my unexpected talent for bringing people together.\n\nOur weekly events in Santa Clara grew beyond expectations, from thirty to eighty regular attendees. I found pure joy in hosting these gatherings, grateful for the amazing team and resources that made it possible. Through countless weekends, I watched strangers become friends over shared stories and card games. The most rewarding part? Seeing brilliant minds from tech and healthcare connect, creating lasting bonds in our immigrant community. These experiences inspired my transition from finance to government work.\n\nEach event now brings our perfect mix: 30% eager newcomers alongside familiar faces. Here in this space, we've created something I once desperately searched for: a true sense of home.",
      linkedinUrl: "https://www.linkedin.com/in/stellaxlu/",
      showLinkedIn: true
    },
    {
      name: "EDISON",
      title: "Regular Member",
      quote: "There's something remarkable about Game Mixer players. I've always felt this instant connection and trust with them. We're all drawn here by Game Mixer's enduring commitment to giving back to the community. The chemistry is just magical! Through Game Mixer, I've built wonderful friendships, including one with a fellow player who now provides installation services for the hardware products I sell. We hit it off immediately, started referring trusted clients to each other, and now work together serving our shared customers. I couldn't be happier with this partnership! Thank you, Game Mixer, and thank you to all my amazing friends!",
      linkedinUrl: "https://linkedin.com/in/edison",
      showLinkedIn: true
    },
    {
      name: "A Developer at Google",
      quote: "I absolutely love board games and used to join many different gaming events. But then I suddenly realized that all those other events disappeared over time due to poor management and various issues. Game Mixer became my only weekly haven to look forward to! They always have games of different types and difficulty levels, with hosts who patiently explain everything. I can strongly feel the organizers' pure passion for games. It's been five years since I started attending Game Mixer every Saturday. Can you believe it, five years! It's like my Sunday church service, but I'm worshipping games instead!",
      showLinkedIn: false
    }
  ];

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[currentPage];

  return (
    <section className="bg-[#FAF6F0] py-16 md:py-24">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#6B90FF] text-base mb-4 uppercase tracking-wider">
            WHAT PEOPLE ARE SAYING
          </p>
          <h2 className="text-2xl md:text-3xl text-[#2C2C2C] font-serif mb-16">
            An experience that transforms<br />lives through play
          </h2>
        </div>

        {/* Testimonials Container */}
        <div className="relative max-w-2xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#2C2C2C]/10 hover:bg-[#2C2C2C]/20 text-[#2C2C2C] transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#2C2C2C]/10 hover:bg-[#2C2C2C]/20 text-[#2C2C2C] transition-colors z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Testimonial Card */}
          <div className="transition-all duration-500 ease-in-out transform">
            <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center h-full">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg text-[#2C2C2C] font-serif">
                  {currentTestimonial.name}
                </h3>
                {currentTestimonial.showLinkedIn && (
                  <a 
                    href={currentTestimonial.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0077B5] hover:text-[#0077B5]/80 transition-colors"
                    aria-label={`Visit ${currentTestimonial.name}'s LinkedIn profile`}
                  >
                    <Linkedin className="w-6 h-6" />
                  </a>
                )}
              </div>
              {currentTestimonial.title && (
                <p className="text-sm text-[#2C2C2C]/60 mb-6">
                  {currentTestimonial.title}
                </p>
              )}
              <p className="text-base text-[#2C2C2C]/80 leading-relaxed font-serif flex-grow whitespace-pre-line">
                {currentTestimonial.quote}
              </p>
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentPage === index ? 'bg-[#2C2C2C]' : 'bg-[#2C2C2C]/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
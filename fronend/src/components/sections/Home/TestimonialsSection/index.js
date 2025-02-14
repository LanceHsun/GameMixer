import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Linkedin } from 'lucide-react';

const TestimonialsSection = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

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
    },
    {
      name: "HANGSONG",
      title: "Architect, Writer, Educator",
      quote: "Game Mixer has marked a decade of my life. I spent countless evenings playing board games, sharing meals, and singing. Something about this community draws kindred spirits together. Conversations flow naturally here, and everyone carries themselves with grace. I can still name several core hosts who have stayed with us, always warmhearted and ready to help explain the rules. Marriage shifted my routines, but I found myself drawn to their paid gatherings, gladly joining outdoor BBQs and special events. The organizers' dedication runs deep, and I return whenever they need help. Our love for games binds us together, and I must help keep this spirit alive.",
      showLinkedIn: false
    },
    {
      name: "SHUAI WU",
      title: "Senior Principal Scientist, Biotech",
      quote: "Game Mixer events are the perfect place to meet people from different industries in a casual and relaxed vibe. I met my first Bay Area friends here, and our community is always ready to help each other out. I once connected a fellow player with a great real estate agent! Even after moving away from the Bay Area, I make sure to join whenever I visit. It's been wonderful to see how Stella has grown this community over the years.",
      linkedinUrl: "http://linkedin.com/in/shuai-wu-03462313",
      showLinkedIn: true
    },
    {
      name: "REBECCA LI",
      title: "Credit Analyst, Finance",
      quote: "I met experienced gamers at Game Mixer who became amazing guides. Each visit expands my board game knowledge—like learning from a skilled player passionate about complex games with miniatures he paints himself. The conversations here go far beyond games. As a Hanfu enthusiast, I enjoy discussing traditional culture, and once, during a game, we brainstormed promoting Hanfu through a showcase at a restaurant opening. Board gamers seem naturally gifted at creative thinking! These collaborations, even if unexecuted, fuel my passion. Game Mixer is a magical space where connections spark creativity, and you never know what incredible ideas will emerge.",
      showLinkedIn: false
    },
    {
      name: "RAY",
      title: "Restaurant Owner",
      quote: "Stella introduced me to these board game gatherings, and I was instantly impressed by her dedication to organizing each event. As a restaurant owner, I'm happy to provide ingredients for Game Mixer's BBQ events. The community has brought so many wonderful friends into my life that helping out feels natural. I've watched with joy as their events have grown larger and more organized over time. I hope Game Mixer continues to thrive for many years to come.",
      showLinkedIn: false
    }
];

  const handlePrev = () => {
    setCurrentPage((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    setDragOffset(0);
  };

  const handleNext = () => {
    setCurrentPage((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    setDragOffset(0);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const onTouchMove = (e) => {
    if (!touchStart || !isDragging) return;
    
    const currentTouch = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    const startY = e.targetTouches[0].clientY;
    
    // 计算水平和垂直移动距离
    const deltaX = Math.abs(currentTouch - touchStart);
    const deltaY = Math.abs(currentY - startY);
    
    // 如果刚开始移动（deltaX < 10）且垂直移动更明显，取消拖动状态
    if (deltaX < 10 && deltaY > deltaX) {
      setIsDragging(false);
      return;
    }
    
    // 如果确定是水平滑动，则阻止默认行为并更新状态
    if (deltaX > deltaY) {
      e.preventDefault();
      setTouchEnd(currentTouch);
      const diff = currentTouch - touchStart;
      setDragOffset(diff);
    }
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    const swipeSpeed = Math.abs(distance) / (Date.now() - touchStart);

    setIsDragging(false);
    setDragOffset(0);

    if (distance > minSwipeDistance || (distance > 0 && swipeSpeed > 0.5)) {
      handleNext();
    } else if (distance < -minSwipeDistance || (distance < 0 && swipeSpeed > 0.5)) {
      handlePrev();
    }
  };

  // Reset touch states when dragging ends
  useEffect(() => {
    if (!isDragging) {
      setTouchStart(null);
      setTouchEnd(null);
    }
  }, [isDragging]);

  const currentTestimonial = testimonials[currentPage];

  return (
    <section id="testimonials" className="bg-[#FAF6F0] py-16 md:py-24">
      <div className="max-w-screen-xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#6B90FF] text-base mb-4 uppercase tracking-wider">
            WHAT PEOPLE ARE SAYING
          </p>
          <h2 className="text-2xl md:text-3xl text-[#2C2C2C] font-serif mb-4">
            An experience that transforms<br />lives through play
          </h2>
          <p className="text-sm text-[#2C2C2C]/60 md:hidden">
            Swipe left or right to see more stories
          </p>
        </div>

        {/* Testimonials Container */}
        <div className="relative max-w-2xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className="absolute -left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#2C2C2C]/10 hover:bg-[#2C2C2C]/20 text-[#2C2C2C] transition-colors z-10 hidden md:block"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#2C2C2C]/10 hover:bg-[#2C2C2C]/20 text-[#2C2C2C] transition-colors z-10 hidden md:block"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Testimonial Card */}
          <div 
            className="touch-pan-x"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div 
              className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center h-full transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(${dragOffset}px)`,
                cursor: isDragging ? 'grabbing' : 'grab'
              }}
            >
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
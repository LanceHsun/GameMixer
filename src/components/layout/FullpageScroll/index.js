import React, { useEffect, useRef, useState } from 'react';

const FullpageScroll = ({ children }) => {
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sections = React.Children.toArray(children);

  useEffect(() => {
    const handleScroll = (e) => {
      if (isTransitioning) {
        return;
      }

      const container = containerRef.current;
      const sectionElements = sectionsRef.current;
      
      // 获取当前视口中最接近中心的section
      const viewportMiddle = window.scrollY + window.innerHeight / 2;
      const currentSectionIndex = sectionElements.findIndex((section, index) => {
        const rect = section.getBoundingClientRect();
        const sectionTop = window.scrollY + rect.top;
        const sectionBottom = sectionTop + rect.height;
        return viewportMiddle >= sectionTop && viewportMiddle < sectionBottom;
      });

      if (currentSectionIndex === -1) return;

      const currentSection = sectionElements[currentSectionIndex];
      const rect = currentSection.getBoundingClientRect();
      
      // 检查是否在section的边界
      const isAtTop = rect.top >= 0 && rect.top <= 5;
      const isAtBottom = rect.bottom >= window.innerHeight - 5 && rect.bottom <= window.innerHeight;
      
      if (isAtTop || isAtBottom) {
        const nextIndex = isAtTop ? 
          Math.max(0, currentSectionIndex - 1) : 
          Math.min(sections.length - 1, currentSectionIndex + 1);

        if (nextIndex !== currentSectionIndex) {
          setIsTransitioning(true);
          const nextSection = sectionElements[nextIndex];
          nextSection.scrollIntoView({ behavior: 'smooth' });
          
          setTimeout(() => {
            setIsTransitioning(false);
          }, 1000);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sections.length, isTransitioning]);

  // 初始化section引用
  useEffect(() => {
    sectionsRef.current = Array.from(
      containerRef.current.getElementsByClassName('fullpage-section')
    );
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {sections.map((section, index) => (
        <div 
          key={index}
          className="fullpage-section min-h-screen w-full"
        >
          {section}
        </div>
      ))}
    </div>
  );
};

export default FullpageScroll;
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Hero() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Initial Hero Entrance Animation
    gsap.fromTo(container, 
      { opacity: 0, y: 80 }, 
      { opacity: 1, y: 0, duration: 2, ease: "power3.out", delay: 0.1 }
    );
    
    // Text entrance animation
    if (textRef.current) {
      gsap.fromTo(textRef.current,
        { opacity: 0, y: -60 },
        { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", delay: 0.4 }
      );
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative w-screen h-screen overflow-hidden bg-[#030303] flex items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/10 blur-[150px] rounded-full mix-blend-screen transition-opacity duration-1000" style={{ opacity: isHovered ? 0.8 : 0.4 }} />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMiIvPjwvc3ZnPg==')] opacity-30 mix-blend-overlay" />
      </div>

      {/* Foreground UI Components */}
      <div ref={textRef} className="absolute inset-0 z-10 flex flex-col justify-center mx-auto w-full max-w-[90rem] px-8 lg:px-16 mt-20">
        <div 
          className="w-full flex flex-col md:flex-row justify-between md:items-end transition-transform duration-700 ease-out gap-10" 
          style={{ transform: isHovered ? 'translateY(-10px)' : 'translateY(0px)' }}
        >
            
          {/* Left Side: Intro and Title */}
          <div className="flex-1 max-w-lg lg:max-w-xl text-left">
            <p className="text-sm md:text-base text-red-500 font-mono tracking-widest uppercase mb-6 opacity-90 font-bold">
              Hey, I’m Vansh Baranwal
            </p>
            
            <h1 className="text-4xl md:text-6xl lg:text-[5rem] xl:text-[5.5rem] font-bold tracking-tighter leading-[1.05] font-sans text-white">
              Emerging<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white font-serif italic font-light pr-2">Developer</span> from<br />
              End to End
            </h1>
          </div>
          
          {/* Right Side: Description and CTA */}
          <div className="flex-1 max-w-md text-left md:text-right flex flex-col md:items-end z-20">
            <p className="w-110 text-lg md:text-xl text-gray-400 font-light tracking-wide leading-relaxed mb-8">
              BMSIT Undergrad & IIT Patna BS Scholar. I build scalable web applications that merge striking design with robust, high-performance functionality.
            </p>
            
            <a href="#contact" className="px-8 py-4 rounded-full border border-red-500/30 text-white text-sm tracking-[0.2em] uppercase font-medium hover:bg-red-500 hover:border-red-500 transition-all duration-500 shadow-[0_0_20px_rgba(239,68,68,0.1)] hover:shadow-[0_0_30px_rgba(239,68,68,0.4)] inline-block">
              Start a Project
            </a>
          </div>
            
        </div>
      </div>
      
      {/* Overlay border/frame for cinematic effect */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
    </div>
  );
}

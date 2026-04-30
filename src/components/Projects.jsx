import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import imgProject1 from '../assets/projects/Screenshot 2025-10-05 203302.png';
import imgProject2 from '../assets/projects/climate-risk-2.png';
import imgProject3 from '../assets/hackathons/ALterino 1.jpeg';

gsap.registerPlugin(ScrollTrigger);

const MISSIONS = [
  {
    id: '01',
    name: 'Space Biology Knowledge Engine',
    description: 'An AI-driven web application built for the NASA Space Apps Challenge. Transforms complex NASA space biology publications into an accessible database.',
    tech: ['AI', 'Google Gemini', 'JavaScript', 'Tailwind CSS'],
    image: imgProject1,
    link: '#',
    blend: 'opacity-80 group-hover:opacity-100',
  },
  {
    id: '02',
    name: 'Climate Risk Management System',
    description: 'An AI + cloud-powered platform for climate risk prediction in urban informal settlements. Designed for disaster preparedness.',
    tech: ['AWS Lambda', 'DynamoDB', 'AI/ML', 'Serverless'],
    image: imgProject2,
    link: '#',
    blend: 'opacity-80 group-hover:opacity-100',
  },
  {
    id: '03',
    name: 'ALTERINO Hackathon System',
    description: 'Successfully qualified through competitive stages and developed a functional MVP under strict deadlines with rapid prototyping.',
    tech: ['Rapid Prototyping', 'Design Thinking', 'Agile'],
    image: imgProject3,
    link: '#',
    blend: 'opacity-80 group-hover:opacity-100',
  }
];

const ProjectCard = ({ project }) => {
  const cardRef = useRef(null);
  const glowRef = useRef(null);
  const imageRef = useRef(null);
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    // Calculate mouse position strictly bounded within the card [-1, 1]
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    // Apply 3D tilt mapped against mouse offset
    gsap.to(cardRef.current, {
      rotateY: x * 10, 
      rotateX: -y * 10, 
      transformPerspective: 1000,
      ease: 'power2.out',
      duration: 0.4
    });
    
    // Move the glow to follow the cursor exactly
    gsap.to(glowRef.current, {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
      duration: 0.2
    });
  };

  const handleMouseLeave = () => {
    // Snap back everything cleanly
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      ease: 'power3.out',
      duration: 0.6
    });
    
    gsap.to(glowRef.current, {
      opacity: 0,
      duration: 0.4
    });
  };

  return (
    <div 
      className="project-card relative w-full h-full flex flex-col rounded-2xl overflow-hidden cursor-pointer group bg-black/40 backdrop-blur-md border border-white/10 hover:border-white/30 transition-colors duration-500"
      style={{ transformStyle: 'preserve-3d' }}
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Header */}
      <div className="w-full h-56 md:h-64 overflow-hidden relative border-b border-white/5 z-10 bg-black">
        <img 
          ref={imageRef}
          src={project.image} 
          alt={project.name} 
          className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
        />
        {/* Very subtle dim so it fits the dark theme, but completely visible */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
      </div>

      {/* Dynamic Hover Glow Layer Tracker */}
      <div 
        ref={glowRef}
        className="absolute w-64 h-64 bg-red-500/15 rounded-full blur-[80px] pointer-events-none z-0 -translate-x-1/2 -translate-y-1/2 opacity-0 mix-blend-screen"
      />

      {/* Foreground Content */}
      <div className="flex-1 p-8 flex flex-col z-20" style={{ transform: 'translateZ(20px)' }}> 
        
        <h3 className="text-2xl font-bold tracking-tight text-white mb-3 leading-tight drop-shadow-md font-sans">
          {project.name}
        </h3>
        
        <p className="text-gray-400 text-sm leading-relaxed mb-8 font-light flex-1">
          {project.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-8 pointer-events-auto mt-auto">
          {project.tech.map((tool) => (
            <span key={tool} className="text-[10px] uppercase tracking-widest px-3 py-1.5 border border-white/10 bg-white/5 rounded-full text-gray-300 font-medium">
              {tool}
            </span>
          ))}
        </div>
        
        <div className="pointer-events-auto w-fit">
          <a href={project.link} className="flex items-center space-x-2 text-sm uppercase tracking-widest font-medium text-red-500 hover:text-red-400 group/link relative transition-colors">
            <span>View Project</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform group-hover/link:translate-x-1 transition-transform duration-300">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};


export default function Projects() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse"
        }
      });
      
      // Header Animation
      tl.fromTo(headerRef.current.children,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
      );
      
      // Select cards via class
      const cards = sectionRef.current.querySelectorAll('.project-card');
      
      tl.fromTo(cards,
        { opacity: 0, y: 100, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, stagger: 0.15, ease: "power3.out" },
        "-=0.6"
      );
      
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="projects" 
      ref={sectionRef}
      className="w-full min-h-screen bg-[#030303] py-32 px-6 md:px-12 lg:px-24 flex flex-col justify-center relative overflow-hidden"
    >
      <div className="max-w-[90rem] mx-auto w-full relative z-10">
        
        {/* Header Block */}
        <div ref={headerRef} className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-[4.5rem] font-bold tracking-tighter text-white font-sans leading-none drop-shadow-lg mb-4">
              Declassified <span className="font-serif italic font-light opacity-80 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-white pr-2">Missions</span>
            </h2>
          </div>
          <p className="text-gray-400 font-light tracking-wide text-base md:text-lg max-w-sm mt-6 md:mt-0 leading-relaxed md:text-right">
            Selected operations engineered for supreme performance and scale.
          </p>
        </div>
        
        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 place-items-center">
          {VISIONS.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
      </div>
      
      {/* Background Ambience line-grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '100px 100px' }} 
      />
    </section>
  );
}

// Ensure the mapping variable aligns exactly with the constant 
const VISIONS = MISSIONS;

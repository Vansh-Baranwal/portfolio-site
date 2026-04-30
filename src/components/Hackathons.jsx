import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import alterino1 from '../assets/hackathons/ALterino 1.jpeg';
import alterino2 from '../assets/hackathons/Alterino 2.jpeg';
import alterino3 from '../assets/hackathons/Alterino 3.jpeg';
import cloudathon1 from '../assets/hackathons/cloudathon-1.jpg';
import cloudathon2 from '../assets/hackathons/cloudathon-2.jpg';
import cloudathon3 from '../assets/hackathons/cloudathon-3.jpg';
import bengaluru1 from '../assets/hackathons/bengaluru-1.jpg';
import bengaluru2 from '../assets/hackathons/bengaluru-2.jpg';
import bengaluru3 from '../assets/hackathons/bengaluru-3.jpg';

gsap.registerPlugin(ScrollTrigger);

const HACKATHONS = [
  {
    id: '01',
    title: 'ALTERINO BMSIT Hackathon',
    subtitle: 'Build & Conquer',
    rank: '🏆 9th Rank (Top 10/50)',
    description: 'Successfully qualified through three distinct competitive stages: Trivia, Ideation, and Prototyping. Developed a functional MVP under strict deadlines, demonstrating rapid prototyping capabilities and user-centric design thinking.',
    team: 'Team: Syntax Squad ',
    tags: ['Rapid Prototyping', 'Agile Collaboration', 'Design Thinking'],
    images: [alterino1, alterino2, alterino3],
  },
  {
    id: '02',
    title: 'International Cloudathon',
    subtitle: 'Thiran 2026 — Sri Eshwar College of Engineering, Coimbatore',
    rank: '🥈 2nd Place',
    description: 'Built a cloud-based Climate Risk Management System for urban informal settlements, designed for real-time climate risk prediction and disaster preparedness. Collaborated in a team with evaluation by international judges.',
    team: 'Syntax Hex',
    tags: ['AWS Lambda', 'DynamoDB', 'S3', 'CloudFront', 'API Gateway', 'AI Integration', 'Cloud Architecture'],
    images: [cloudathon2, cloudathon1, cloudathon3],
  },
  {
    id: '03',
    title: 'Build For Bengaluru Hackathon',
    subtitle: 'Build For Bengaluru',
    rank: '',
    description: 'NammaFix – AI Civic Intelligence Platform connecting citizens, government, and media to resolve urban infrastructure issues.',
    team: 'Team: VegaSync',
    tags: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'PostgreSQL', 'PostGIS', 'AI', 'Render', 'Vercel', 'Supabase'],
    images: [bengaluru1, bengaluru2, bengaluru3],
  }
];

const HackathonCard = ({ hackathon, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(cardRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative w-full rounded-2xl overflow-hidden bg-black/40 border border-white/5 backdrop-blur-md p-8 md:p-12 mb-16 hover:border-white/20 transition-colors duration-500 group"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-900/5 rounded-full blur-[100px] pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100" />

      <div className="flex flex-col lg:flex-row gap-12 relative z-10">

        {/* Info Column */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-red-500 font-mono text-sm tracking-[0.2em] font-bold">EVENT // {hackathon.id}</span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white uppercase tracking-widest">{hackathon.rank}</span>
          </div>

          <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight font-sans">
            {hackathon.title}
          </h3>
          <p className="text-gray-400 text-sm md:text-base font-light italic font-serif">
            {hackathon.subtitle}
          </p>

          <div className="h-px w-1/4 bg-gradient-to-r from-red-500/50 to-transparent my-6" />

          <p className="text-gray-300 font-light leading-relaxed">
            {hackathon.description}
          </p>

          <p className="text-gray-500 text-sm font-mono mt-4">
            {hackathon.team}
          </p>

          <div className="flex flex-wrap gap-2 mt-8">
            {hackathon.tags.map(tag => (
              <span key={tag} className="text-xs text-gray-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-sm uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Images Gallery */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div className="col-span-2 overflow-hidden rounded-xl border border-white/10 aspect-video group/img relative">
            <img
              src={hackathon.images[0]}
              alt={`${hackathon.title} Gallery 1`}
              className="w-full h-full object-cover transform group-hover/img:scale-105 transition-transform duration-700 opacity-80 group-hover/img:opacity-100"
            />
            <div className="absolute inset-0 bg-black/20 group-hover/img:bg-transparent transition-colors duration-500 pointer-events-none" />
          </div>
          <div className="overflow-hidden rounded-xl border border-white/10 aspect-square group/img relative">
            <img
              src={hackathon.images[1]}
              alt={`${hackathon.title} Gallery 2`}
              className="w-full h-full object-cover transform group-hover/img:scale-105 transition-transform duration-700 opacity-80 group-hover/img:opacity-100 grayscale group-hover/img:grayscale-0"
            />
          </div>
          <div className="overflow-hidden rounded-xl border border-white/10 aspect-square group/img relative">
            <img
              src={hackathon.images[2]}
              alt={`${hackathon.title} Gallery 3`}
              className="w-full h-full object-cover transform group-hover/img:scale-105 transition-transform duration-700 opacity-80 group-hover/img:opacity-100 grayscale group-hover/img:grayscale-0"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default function Hackathons() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headerRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hackathons"
      ref={sectionRef}
      className="w-full min-h-screen bg-[#030303] py-32 px-6 md:px-12 lg:px-24 flex flex-col justify-center relative overflow-hidden"
    >
      <div className="max-w-[90rem] mx-auto w-full relative z-10">

        {/* Header Block */}
        <div ref={headerRef} className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-[4.5rem] font-bold tracking-tighter text-white font-sans leading-none drop-shadow-lg mb-4">
              Competitive <span className="font-serif italic font-light opacity-80 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500 pr-2">Arenas</span>
            </h2>
          </div>
          <p className="text-gray-400 font-light tracking-wide text-base md:text-lg max-w-sm mt-6 md:mt-0 leading-relaxed md:text-right">
            Hackathons and competitions showcasing rapid prototyping and collaborative innovation.
          </p>
        </div>

        {/* Hackathons List */}
        <div className="flex flex-col">
          {HACKATHONS.map((hackathon, index) => (
            <HackathonCard key={hackathon.id} hackathon={hackathon} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}

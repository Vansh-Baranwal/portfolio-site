import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';


// Import images from parent src/assets/hackathons folder
import alterino1 from '../../src/assets/hackathons/ALterino 1.jpeg';
import alterino2 from '../../src/assets/hackathons/Alterino 2.jpeg';
import alterino3 from '../../src/assets/hackathons/Alterino 3.jpeg';
import cloudathon1 from '../../src/assets/hackathons/cloudathon-1.jpg';
import cloudathon2 from '../../src/assets/hackathons/cloudathon-2.jpg';
import cloudathon3 from '../../src/assets/hackathons/cloudathon-3.jpg';
import bengaluru1 from '../../src/assets/hackathons/bengaluru-1.jpg';
import bengaluru2 from '../../src/assets/hackathons/bengaluru-2.jpg';
import bengaluru3 from '../../src/assets/hackathons/bengaluru-3.jpg';
import browserbattle1 from '../../src/assets/hackathons/browserbattle-1.jpg';
import browserbattle2 from '../../src/assets/hackathons/browserbattle-2.jpg';
import browserbattle3 from '../../src/assets/hackathons/browserbattle-3.jpg';



const HACKATHONS = [
  {
    id: '01',
    title: 'ALTERINO BMSIT Hackathon',
    subtitle: 'Build & Conquer',
    achievement: '🏆 9th Rank (Top 10/50)',
    team: 'Syntax Squad',
    description:
      'Qualified through Trivia, Ideation, and Prototyping. Built a functional MVP under strict deadlines with rapid prototyping and user-centric design.',
    stack: ['Rapid Prototyping', 'Agile Collaboration', 'Design Thinking'],
    location: 'BMSIT, Bengaluru',
    images: [alterino1, alterino2, alterino3],
  },
  {
    id: '02',
    title: 'International Cloudathon',
    subtitle: 'Thiran 2026 — Sri Eshwar College of Engineering, Coimbatore',
    achievement: '🥈 2nd Place',
    date: '2026',
    team: 'Syntax Hex',
    description:
      'Built a cloud-based Climate Risk Management System for urban informal settlements with real-time risk prediction and disaster preparedness workflows.',
    stack: ['AWS Lambda', 'DynamoDB', 'S3', 'CloudFront', 'API Gateway', 'AI Integration', 'Cloud Architecture'],
    location: 'Coimbatore',
    images: [cloudathon2, cloudathon1, cloudathon3],
  },
  {
    id: '03',
    title: 'Build For Bengaluru Hackathon',
    subtitle: 'Build For Bengaluru - Shri Krishna Institute of Technology, Bangalore',
    team: 'VegaSync',
    description:
      'Built NammaFix, an AI civic intelligence platform connecting citizens, government, and media to resolve urban infrastructure issues.',
    stack: ['React', 'Tailwind CSS', 'Node.js', 'Express', 'PostgreSQL', 'PostGIS', 'AI', 'Render', 'Vercel', 'Supabase'],
    location: 'Bangalore',
    images: [bengaluru1, bengaluru2, bengaluru3],
  },
  {
    id: '04',
    title: 'Browser Battle — BMSCE Hackathon',
    subtitle: 'B. M. S. College of Engineering, Bengaluru',
    team: 'Syntax Squad',
    description:
      'Built Campus OS, a next-gen college platform with AI assistant, lost and found matching, mental health support, digital ID, and a 360° explorer.',
    stack: ['Next.js', 'AI Assistant', 'UX Design', 'Vercel', 'Full-Stack', 'Product Thinking'],
    location: 'Bengaluru',
    images: [browserbattle1, browserbattle2, browserbattle3],
  },
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const normalizeAngle = (deg) => {
  let result = deg % 360;
  if (result > 180) result -= 360;
  if (result < -180) result += 360;
  return result;
};

export default function CompetitiveArenas() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const isMobile = viewportWidth < 900;

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = window.gsap.context(() => {
      window.gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 42, filter: 'blur(10px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      if (!isMobile) {
        window.ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=2200',
          pin: true,
          scrub: 0.45,
          onUpdate: (self) => {
            setProgress(self.progress);
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile]);

  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === 'Escape') setSelectedIndex(null);
    };
    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, []);

  useEffect(() => {
    if (selectedIndex === null) {
      window.lenis?.start();
      return;
    }

    window.lenis?.stop();
    const tl = window.gsap.timeline();
    tl.fromTo('.arena-modal-backdrop', { opacity: 0 }, { opacity: 1, duration: 0.24, ease: 'power2.out' }).fromTo(
      '.arena-modal-panel',
      { y: 34, scale: 0.95, opacity: 0 },
      { y: 0, scale: 1, opacity: 1, duration: 0.4, ease: 'power3.out' },
      0.04
    );

    return () => {
      window.lenis?.start();
    };
  }, [selectedIndex]);

  useEffect(() => {
    setSelectedImage(0);
  }, [selectedIndex]);

  const wheelCards = useMemo(() => {
    const fanProgress = isMobile ? 1 : clamp(progress / 0.36, 0, 1);
    const fanEase = window.gsap.parseEase('power3.out')(fanProgress);
    const spinProgress = isMobile ? 0 : clamp((progress - 0.36) / 0.64, 0, 1);
    const rotation = spinProgress * 540;
    const radius = viewportWidth < 1280 ? 270 : 335;
    const spread = viewportWidth < 1280 ? 118 : 146;
    const startY = viewportWidth < 1280 ? 430 : 520;

    const snapshots = HACKATHONS.map((hackathon, index) => {
      const count = HACKATHONS.length;
      const baseAngle = count === 1 ? 0 : -spread / 2 + (spread * index) / (count - 1);
      const orbitAngle = baseAngle + rotation;
      const rad = (orbitAngle * Math.PI) / 180;

      const targetX = Math.sin(rad) * radius;
      const targetY = -Math.cos(rad) * radius;
      const x = targetX * fanEase;
      const y = startY + (targetY - startY) * fanEase;

      return {
        hackathon,
        index,
        x,
        y,
        fanTilt: baseAngle * 0.16 * fanEase,
        topDistance: Math.abs(normalizeAngle(orbitAngle)),
      };
    });

    let active = 0;
    let bestDistance = Number.POSITIVE_INFINITY;
    snapshots.forEach((snapshot, index) => {
      if (snapshot.topDistance < bestDistance) {
        bestDistance = snapshot.topDistance;
        active = index;
      }
    });

    return snapshots.map((snapshot) => ({
      ...snapshot,
      active: snapshot.index === active,
      zIndex: snapshot.index === active ? 30 : Math.round(20 - snapshot.topDistance / 18),
    }));
  }, [isMobile, progress, viewportWidth]);

  const selectedHackathon = selectedIndex !== null ? HACKATHONS[selectedIndex] : null;
  const compactDescription = useMemo(() => {
    if (!selectedHackathon?.description) return '';
    const firstSentence = selectedHackathon.description.split('. ')[0]?.trim() ?? '';
    const source = firstSentence.length > 0 ? firstSentence : selectedHackathon.description.trim();
    return source.length > 150 ? `${source.slice(0, 147).trimEnd()}...` : source;
  }, [selectedHackathon]);

  const compactStack = useMemo(() => {
    if (!selectedHackathon?.stack) return [];
    const maxVisible = 5;
    const visible = selectedHackathon.stack.slice(0, maxVisible);
    const remaining = selectedHackathon.stack.length - maxVisible;
    return remaining > 0 ? [...visible, `+${remaining} more`] : visible;
  }, [selectedHackathon]);

  const modal =
    selectedHackathon &&
    createPortal(
      <div
        className="arena-modal-backdrop"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedIndex(null);
        }}
        role="dialog"
        aria-modal="true"
      >
        <article className="arena-modal-panel">
          <button className="arena-modal-close" data-cursor="hover" onClick={() => setSelectedIndex(null)} aria-label="Close details">
            ×
          </button>

          <div className="arena-modal-media">
            <img src={selectedHackathon.images[selectedImage]} alt={selectedHackathon.title} loading="lazy" />
          </div>

          <div className="arena-modal-thumbs">
            {selectedHackathon.images.map((img, idx) => (
              <button
                key={img}
                className={`arena-thumb ${idx === selectedImage ? 'active' : ''}`}
                data-cursor="hover"
                onClick={() => setSelectedImage(idx)}
                aria-label={`Show image ${idx + 1}`}
              >
                <img src={img} alt={`${selectedHackathon.title} gallery ${idx + 1}`} loading="lazy" />
              </button>
            ))}
          </div>

          <div className="arena-modal-body">
            <p className="arena-modal-eyebrow">EVENT // {selectedHackathon.id}</p>
            <h3>{selectedHackathon.title}</h3>
            <p className="arena-modal-sub">{selectedHackathon.subtitle}</p>

            {selectedHackathon.achievement && <p className="arena-modal-rank">{selectedHackathon.achievement}</p>}

            <div className="arena-meta-grid">
              {selectedHackathon.date && (
                <div>
                  <span>DATE</span>
                  <strong>{selectedHackathon.date}</strong>
                </div>
              )}
              {selectedHackathon.location && (
                <div>
                  <span>LOCATION</span>
                  <strong>{selectedHackathon.location}</strong>
                </div>
              )}
              {selectedHackathon.team && (
                <div>
                  <span>TEAM</span>
                  <strong>{selectedHackathon.team}</strong>
                </div>
              )}
            </div>

            <p className="arena-modal-desc">{compactDescription}</p>

            <div className="arena-modal-tags">
              {compactStack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </article>
      </div>,
      document.body
    );

  return (
    <section id="competitive-arenas" ref={sectionRef} className="arenas-section">
      <div className="arenas-inner">
        <header className="arenas-header" ref={titleRef}>
          <div className="arenas-eyebrow">FIELD REPORT // HACKATHON ERA</div>
          <h2 className="arenas-title">
            Competitive <span>Arenas</span>
          </h2>
          <p className="arenas-subtitle">Every hackathon was a battlefield. Every build was a statement.</p>
        </header>

        {!isMobile ? (
          <div className="arenas-stage">
            <div className="arenas-wheel">
              {wheelCards.map((snapshot) => (
                <button
                  key={snapshot.hackathon.id}
                  className="arena-wheel-card"
                  data-cursor="hover"
                  onClick={() => setSelectedIndex(snapshot.index)}
                  style={{
                    transform: `translate(calc(-50% + ${snapshot.x}px), calc(-50% + ${snapshot.y}px))`,
                    opacity: snapshot.active ? 1 : 0.66,
                    zIndex: snapshot.zIndex,
                  }}
                  aria-label={`Open ${snapshot.hackathon.title}`}
                >
                  <div
                    className={`arena-card-face ${snapshot.active ? 'arena-card-active' : ''}`}
                    style={{
                      transform: `rotate(${snapshot.fanTilt}deg) scale(${snapshot.active ? 1.1 : 0.94})`,
                    }}
                  >
                    <img
                      src={snapshot.hackathon.images[0]}
                      alt={snapshot.hackathon.title}
                      loading="lazy"
                      className="arena-card-image"
                    />
                    <div className="arena-card-overlay" />
                    <div className="arena-card-caption">
                      <span>EVENT // {snapshot.hackathon.id}</span>
                      <h3>{snapshot.hackathon.title}</h3>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="arenas-hint">SCROLL TO OPEN • CONTINUE TO ROTATE</div>
          </div>
        ) : (
          <div className="arenas-mobile-track">
            {HACKATHONS.map((hackathon, index) => (
              <button
                key={hackathon.id}
                className="arenas-mobile-card"
                data-cursor="hover"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Open ${hackathon.title}`}
              >
                <img src={hackathon.images[0]} alt={hackathon.title} loading="lazy" />
                <div className="arena-card-overlay" />
                <div className="arena-card-caption">
                  <span>EVENT // {hackathon.id}</span>
                  <h3>{hackathon.title}</h3>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      {modal}
    </section>
  );
}

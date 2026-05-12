import React, { useRef, useMemo, useState, useEffect, useCallback, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/* ── Card Data ─────────────────────────────────────────────────── */
const CARDS_DATA = [
  { id: 0, title: "The Beginning",        subtitle: "First spark of curiosity",            symbol: "★",  colorStart: "#FF6B35", colorEnd: "#FFD700" },
  { id: 1, title: "Entering Engineering",  subtitle: "The leap into the unknown",           symbol: "🎓", colorStart: "#00D4FF", colorEnd: "#00b4d8" },
  { id: 2, title: "The Double Challenge",  subtitle: "B.E. + B.S. simultaneously",          symbol: "◎◎", colorStart: "#7B61FF", colorEnd: "#3a0ca3" },
  { id: 3, title: "First Projects",        subtitle: "3am and still typing",                symbol: ">_", colorStart: "#C8FF00", colorEnd: "#00ff88" },
  { id: 4, title: "Hackathon Era",         subtitle: "36 hours. One idea. Ship it.",         symbol: "⚡", colorStart: "#ff006e", colorEnd: "#8338ec" },
  { id: 5, title: "Exploring Domains",     subtitle: "AI. Blockchain. Web. Open Source.",    symbol: "◆◇◆◇", colorStart: "#0066ff", colorEnd: "#7B61FF" },
  { id: 6, title: "Realizations & Growth", subtitle: "Consistency beats talent",             symbol: "↑",  colorStart: "#FFD700", colorEnd: "#FF6B35" },
  { id: 7, title: "The Future",            subtitle: "The best is still unwritten",          symbol: "🚀", colorStart: "#7B61FF", colorEnd: "#00D4FF" },
];

const STORY_TEXT = [
  "Before the code, there was just curiosity. A kid staring at a screen wondering — how does this work? Who built this? Can I build this? That wonder never faded.",
  "Orientation week. A hundred new faces. A syllabus that looked like a foreign language. Overwhelming? Yes. Exciting? Absolutely. This was the leap.",
  "B.E. and B.S. simultaneously. Two curriculums. Double the deadlines. Triple the coffee. Zero regrets. Nobody said it would be easy.",
  "Todo apps. Weather widgets. Broken APIs. 404 pages that weren't supposed to be 404 pages. Every bug was a lesson. Every fix, a small victory.",
  "36 hours. One idea. A team of strangers becoming a team. The pressure cooker that taught me more than any classroom ever could. Ship it or sink.",
  "AI/ML. Blockchain. Web Dev. Open Source. Not dabbling — diving. Each domain a rabbit hole with no bottom. The curiosity only grew stronger.",
  "Talent is common. Consistency is rare. I stopped comparing my chapter 1 to everyone else's chapter 10. That was the real breakthrough.",
  "Build things that matter. Contribute to something larger than a grade or a job title. The work is just beginning. The best is still unwritten.",
];

/* ── Helper: draw rounded rect (cross-browser) ─────────────────── */
function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* ── Texture Generator ──────────────────────────────────────────── */
function createCardTexture(card) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 340;
  const ctx = canvas.getContext('2d');

  // Outer gradient border
  const borderGrad = ctx.createLinearGradient(0, 0, 512, 340);
  borderGrad.addColorStop(0, card.colorStart);
  borderGrad.addColorStop(1, card.colorEnd);
  drawRoundedRect(ctx, 0, 0, 512, 340, 24);
  ctx.fillStyle = borderGrad;
  ctx.fill();

  // Inner dark fill
  drawRoundedRect(ctx, 4, 4, 504, 332, 20);
  ctx.fillStyle = 'rgba(10, 10, 10, 0.92)';
  ctx.fill();

  // Symbol
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = card.colorStart;
  ctx.font = '52px Arial, sans-serif';
  ctx.fillText(card.symbol, 256, 100);

  // Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px Arial, Helvetica, sans-serif';
  ctx.fillText(card.title, 256, 190);

  // Subtitle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = '18px "Courier New", monospace';
  ctx.fillText(card.subtitle, 256, 240);

  // Bottom accent line
  const lineGrad = ctx.createLinearGradient(156, 280, 356, 280);
  lineGrad.addColorStop(0, 'transparent');
  lineGrad.addColorStop(0.5, card.colorStart);
  lineGrad.addColorStop(1, 'transparent');
  ctx.strokeStyle = lineGrad;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(156, 280);
  ctx.lineTo(356, 280);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/* ── Helix math ─────────────────────────────────────────────────── */
const RADIUS = 3;
const ANGLE_STEP = 0.8;
const VERTICAL_STEP = 0.8;

function getHelixPosition(i) {
  const angle = i * ANGLE_STEP;
  return new THREE.Vector3(
    RADIUS * Math.cos(angle),
    i * VERTICAL_STEP,
    RADIUS * Math.sin(angle)
  );
}

function getHelixRotation(i) {
  const angle = i * ANGLE_STEP;
  // Face outward from spiral center + random tilt
  const rx = (Math.random() - 0.5) * 0.7;
  const ry = -angle + Math.PI / 2 + (Math.random() - 0.5) * 0.7;
  const rz = (Math.random() - 0.5) * 0.7;
  return new THREE.Euler(rx, ry, rz);
}

/* ── Single Card Mesh ───────────────────────────────────────────── */
function Card({ data, index, progressRef, activeIndexRef, clickedCardRef, onCardClick }) {
  const meshRef = useRef();
  const glowRef = useRef();

  const texture = useMemo(() => createCardTexture(data), [data]);
  const pos = useMemo(() => getHelixPosition(index), [index]);
  const rot = useMemo(() => getHelixRotation(index), [index]);
  const [hovered, setHovered] = useState(false);

  const targetScale = useRef(new THREE.Vector3(1, 1, 1));

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime();
    const bob = Math.sin(time + index * 0.5) * 0.05;

    // Position with idle bob
    meshRef.current.position.set(pos.x, pos.y + bob, pos.z);

    // Determine scale
    const isActive = activeIndexRef.current === index;
    const isClicked = clickedCardRef.current === index;
    let s = 1.0;
    if (isClicked) s = 1.0;
    else if (hovered) s = 1.3;
    else if (isActive) s = 1.2;
    targetScale.current.set(s, s, s);
    meshRef.current.scale.lerp(targetScale.current, 0.1);

    // Opacity: dim non-clicked cards when one is clicked
    const mat = meshRef.current.material;
    if (mat) {
      const targetOp = (clickedCardRef.current !== null && clickedCardRef.current !== index) ? 0.15 : 1;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, targetOp, 0.08);
    }

    // Glow light
    if (glowRef.current) {
      glowRef.current.intensity = THREE.MathUtils.lerp(
        glowRef.current.intensity,
        (isActive || hovered) ? 1.5 : 0,
        0.08
      );
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[pos.x, pos.y, pos.z]}
        rotation={[rot.x, rot.y, rot.z]}
        onClick={(e) => { e.stopPropagation(); onCardClick(index); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = ''; }}
      >
        <boxGeometry args={[2.4, 1.6, 0.01]} />
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={1}
          roughness={0.5}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      <pointLight
        ref={glowRef}
        position={[pos.x, pos.y, pos.z + 1]}
        color={data.colorStart}
        intensity={0}
        distance={5}
      />
    </group>
  );
}

/* ── Scene (contains spiral group + camera control) ─────────────── */
function SpiralScene({ progressRef, activeIndexRef, clickedCardRef, onCardClick }) {
  const groupRef = useRef();
  const { camera } = useThree();
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    const p = progressRef.current;

    if (clickedCardRef.current === null) {
      // Spiral rotation
      groupRef.current.rotation.y = p * Math.PI * 2;

      // Camera scroll-driven position
      const targetZ = 10 - p * 7;
      const targetY = 2 + p * 3;
      camera.position.z += (targetZ - camera.position.z) * 0.08;
      camera.position.y += (targetY - camera.position.y) * 0.08;

      // Mouse parallax
      const parallaxX = mouse.current.x * 0.3;
      const parallaxY = mouse.current.y * 0.1;
      camera.position.x += (parallaxX - camera.position.x) * 0.05;

      camera.lookAt(0, camera.position.y - 1, 0);
    } else {
      // Fly toward clicked card
      const ci = clickedCardRef.current;
      const cardPos = getHelixPosition(ci);
      // Transform to world space through group rotation
      const worldPos = cardPos.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), groupRef.current.rotation.y);

      const angle = ci * ANGLE_STEP + groupRef.current.rotation.y;
      const camTarget = new THREE.Vector3(
        worldPos.x + Math.cos(angle) * 3,
        worldPos.y + 0.5,
        worldPos.z + Math.sin(angle) * 3
      );

      camera.position.lerp(camTarget, 0.04);
      camera.lookAt(worldPos);
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 10, 5]} intensity={0.6} />
      <pointLight position={[-5, 0, -5]} intensity={0.3} color="#7B61FF" />

      <group ref={groupRef}>
        {CARDS_DATA.map((card, i) => (
          <Card
            key={card.id}
            data={card}
            index={i}
            progressRef={progressRef}
            activeIndexRef={activeIndexRef}
            clickedCardRef={clickedCardRef}
            onCardClick={onCardClick}
          />
        ))}
      </group>
    </>
  );
}

/* ── Main Exported Component ────────────────────────────────────── */
export default function SpiralJourney() {
  const [viewMode, setViewMode] = useState('spiral');
  const [clickedCard, setClickedCard] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef();
  const listContainerRef = useRef();

  // Use refs for animation values (no re-renders)
  const progressRef = useRef(0);
  const activeIndexRef = useRef(0);
  const clickedCardRef = useRef(null);

  // Sync state → ref
  useEffect(() => { clickedCardRef.current = clickedCard; }, [clickedCard]);

  const activeColor = CARDS_DATA[activeIndex]?.colorStart || '#FF6B35';

  // ScrollTrigger setup
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=5000',
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          const idx = Math.min(7, Math.floor(self.progress * 8));
          activeIndexRef.current = idx;
          setActiveIndex(idx);
          if (listContainerRef.current) {
            const maxScroll = listContainerRef.current.scrollHeight - listContainerRef.current.clientHeight;
            if (maxScroll > 0) {
              listContainerRef.current.scrollTop = self.progress * maxScroll;
            }
          }
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Pause/resume Lenis on card click
  useEffect(() => {
    if (clickedCard !== null) {
      window.lenis?.stop();
    } else {
      window.lenis?.start();
    }
  }, [clickedCard]);

  const handleCardClick = useCallback((idx) => {
    setClickedCard(idx);
  }, []);

  const scrollToCard = useCallback((index) => {
    if (!containerRef.current) return;
    const scrollTarget = containerRef.current.offsetTop + (5000 * (index / 7));
    window.lenis?.scrollTo(scrollTarget, { duration: 1.5 });
  }, []);

  return (
    <div
      id="timeline"
      ref={containerRef}
      style={{
        position: 'relative',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      {/* ── Progress Bar ── */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, height: '3px', zIndex: 50,
          width: `${progressRef.current * 100}%`,
          background: activeColor,
          transition: 'width 0.1s linear, background 0.3s ease',
        }}
      />

      {/* ── View Toggle ── */}
      <div style={{
        position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 15, zIndex: 50, fontFamily: '"Space Mono", monospace',
        fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.12em',
      }}>
        <button onClick={() => setViewMode('spiral')} style={{
          color: viewMode === 'spiral' ? '#fff' : '#666', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        }}>Spiral</button>
        <span style={{ color: '#444' }}>•</span>
        <button onClick={() => setViewMode('list')} style={{
          color: viewMode === 'list' ? '#fff' : '#666', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        }}>List</button>
      </div>

      {/* ── Section Dots ── */}
      <div style={{
        position: 'absolute', right: 28, top: '50%', transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 14, zIndex: 40,
      }}>
        {CARDS_DATA.map((card, i) => (
          <button key={i} onClick={() => scrollToCard(i)} title={card.title} style={{
            width: 10, height: 10, borderRadius: '50%', border: 'none', padding: 0,
            background: activeIndex === i ? card.colorStart : 'rgba(255,255,255,0.15)',
            boxShadow: activeIndex === i ? `0 0 8px ${card.colorStart}` : 'none',
            cursor: 'pointer', transition: 'all 0.3s ease',
          }} />
        ))}
      </div>

      {/* ── 3D Spiral View ── */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: viewMode === 'spiral' ? 1 : 0,
        pointerEvents: viewMode === 'spiral' ? 'auto' : 'none',
        transition: 'opacity 0.5s ease',
      }}>
        <Canvas camera={{ position: [0, 2, 10], fov: 60 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <SpiralScene
              progressRef={progressRef}
              activeIndexRef={activeIndexRef}
              clickedCardRef={clickedCardRef}
              onCardClick={handleCardClick}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ── List View ── */}
      <div 
        ref={listContainerRef}
        style={{
        position: 'absolute', inset: 0,
        opacity: viewMode === 'list' ? 1 : 0,
        pointerEvents: viewMode === 'list' ? 'auto' : 'none',
        transition: 'opacity 0.5s ease',
        overflowY: 'hidden', padding: '80px 40px 40px',
        display: 'flex', flexDirection: 'column', gap: 30, alignItems: 'center',
      }}>
        {CARDS_DATA.map((card) => (
          <div key={card.id} style={{
            maxWidth: 560, width: '100%', padding: '32px 28px',
            background: 'rgba(255,255,255,0.02)',
            border: `1px solid ${card.colorStart}33`,
            borderRadius: 16, textAlign: 'center',
            transition: 'border-color 0.3s ease',
          }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = card.colorStart}
            onMouseOut={(e) => e.currentTarget.style.borderColor = card.colorStart + '33'}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>{card.symbol}</div>
            <h3 style={{ fontFamily: '"Playfair Display", serif', fontSize: 28, margin: '0 0 8px', color: '#fff', fontStyle: 'italic' }}>
              {card.title}
            </h3>
            <p style={{ fontFamily: '"Space Mono", monospace', color: 'rgba(255,255,255,0.5)', fontSize: 14, margin: 0 }}>
              {card.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* ── Card Detail Overlay ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 100,
        background: 'linear-gradient(to top, rgba(10,10,10,0.98) 0%, rgba(10,10,10,0.85) 60%, transparent 100%)',
        padding: '80px 40px 50px',
        transform: clickedCard !== null ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      }}>
        {clickedCard !== null && (() => {
          const c = CARDS_DATA[clickedCard];
          return (
            <div style={{ maxWidth: 700, width: '100%' }}>
              <h2 style={{
                fontFamily: '"Playfair Display", serif', fontSize: 44,
                color: '#fff', margin: '0 0 8px', fontStyle: 'italic',
              }}>{c.title}</h2>
              <p style={{
                fontFamily: '"Space Mono", monospace', color: c.colorStart,
                fontSize: 15, margin: '0 0 28px', textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>{c.subtitle}</p>
              <p style={{
                fontFamily: '"DM Sans", sans-serif', color: 'rgba(255,255,255,0.75)',
                fontSize: 17, lineHeight: 1.7, margin: '0 0 36px',
              }}>{STORY_TEXT[clickedCard]}</p>
              <button
                onClick={() => setClickedCard(null)}
                style={{
                  background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
                  padding: '12px 28px', color: '#fff', borderRadius: 30, cursor: 'pointer',
                  fontFamily: '"Space Mono", monospace', fontSize: 13, textTransform: 'uppercase',
                  letterSpacing: '0.06em', transition: 'all 0.3s ease',
                }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
              >
                ← Back to Journey
              </button>
            </div>
          );
        })()}
      </div>
    </div>
  );
}

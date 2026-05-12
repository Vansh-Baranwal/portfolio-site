/**
 * Echoes of Becoming - Foundation Logic
 * Handles Smooth Scrolling, ScrollTrigger integrations, and Custom Cursor
 */

document.addEventListener("DOMContentLoaded", () => {
    // Global device flags
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
    const isMobileViewport = window.innerWidth < 768;
    // Utility for splitting text into spans for letter animation
    function splitTextToChars(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            const text = el.innerText;
            el.innerHTML = '';
            text.split('').forEach(char => {
                const span = document.createElement('span');
                span.className = 'char';
                span.innerHTML = char === ' ' ? '&nbsp;' : char;
                el.appendChild(span);
            });
        });
    }

    // ==========================================================================
    // 1. Lenis Smooth Scrolling Initialization
    // ==========================================================================
    let lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function for smooth stop
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });
    window.lenis = lenis;

    // Request Animation Frame loop for Lenis
    function raf(time) {
        if(lenis) lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Pause Lenis initially while loading screen is active
    if(lenis) lenis.stop();

    // Destroy Lenis natively on mobile to favor native scroll
    if(isMobileViewport || isTouchDevice) {
        lenis.destroy();
        lenis = null;
        window.lenis = null;
    }

    // ==========================================================================
    // 2. GSAP & ScrollTrigger Integration
    // ==========================================================================
    gsap.registerPlugin(ScrollTrigger);

    // Keep ScrollTrigger in sync with Lenis
    if(lenis) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
    }
    
    // Prevent GSAP from causing lag spikes when syncing
    gsap.ticker.lagSmoothing(0);

    // Global Timeline Progress Bar Logic
    // Grows the height of the left line from 0 to 100% as the user scrolls
    gsap.to('.progress-bar', {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.05 // Tiny bit of smoothing on the scrub feels premium
        }
    });

    // ==========================================================================
    // 2.5. Loading Screen Sequence
    // ==========================================================================
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        const monogramPaths = document.querySelectorAll('.monogram-svg path');
        const terminalLoader = document.querySelector('.terminal-loader');
        const loaderBlocks = document.querySelector('.loader-blocks');
        const loaderPercent = document.querySelector('.loader-percent');
        
        // Setup initial SVG state
        monogramPaths.forEach(path => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
        });

        const loaderProxy = { progress: 0 };
        const totalBlocks = 8;
        
        const masterTl = gsap.timeline({
            onComplete: () => {
                loadingScreen.remove();
                if(lenis) lenis.start(); // Re-enable smooth scrolling
                
                // ==========================================================================
                // Hero Reveal Sequence
                // ==========================================================================
                splitTextToChars('.line-1');
                splitTextToChars('.line-2');
                splitTextToChars('.line-3');
                
                const heroTl = gsap.timeline();
                
                // 1. Label types out
                heroTl.to('.hero-label', {
                    opacity: 1,
                    duration: 0.1
                })
                .fromTo('.hero-label', 
                    { textContent: "" }, 
                    { 
                        textContent: "> Initializing your journey...", 
                        duration: 1.5, 
                        ease: "none", 
                        onUpdate: function() {
                            const target = "> Initializing your journey...";
                            const el = document.querySelector('.hero-label');
                            if(el) {
                                const progress = Math.round(this.progress() * target.length);
                                el.innerText = target.substring(0, progress);
                            }
                        }
                    }
                )
                // 2. Letters stagger in
                .to('.char', {
                    opacity: 1,
                    y: 0,
                    stagger: 0.02,
                    duration: 0.8,
                    ease: 'power4.out'
                }, "-=0.5")
                // 3. Subtext fades up
                .to('.hero-subtext', {
                    opacity: 0.7,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out'
                }, "-=0.4")
                // 4. Counters fade in
                .to('.hero-counters', {
                    opacity: 1,
                    duration: 0.5
                }, "-=0.5");
                
                // Counter animation
                const counterVals = document.querySelectorAll('.counter-value .val');
                counterVals.forEach(val => {
                    const target = parseInt(val.getAttribute('data-target'));
                    gsap.to(val, {
                        innerHTML: target,
                        duration: 2,
                        ease: 'power2.out',
                        snap: { innerHTML: 1 },
                        delay: 1.5
                    });
                });
                
                // 5. CTA Button and scroll indicator fade in
                gsap.to(['.magnetic-btn', '.scroll-indicator'], {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    stagger: 0.2,
                    delay: 2,
                    ease: 'power2.out'
                });
            }
        });

        // Fade in terminal text
        masterTl.to(terminalLoader, {
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out'
        }, 0);

        // Draw the SVG lines
        masterTl.to(monogramPaths, {
            strokeDashoffset: 0,
            duration: 2,
            ease: 'power3.inOut'
        }, 0.2);

        // Terminal block counter animation
        masterTl.to(loaderProxy, {
            progress: 100,
            duration: 2,
            ease: 'power2.inOut',
            onUpdate: () => {
                const percent = Math.round(loaderProxy.progress);
                loaderPercent.textContent = `${percent}%`;
                
                const activeBlocks = Math.floor((percent / 100) * totalBlocks);
                let blockString = '';
                for(let i = 0; i < totalBlocks; i++) {
                    blockString += (i < activeBlocks) ? '█' : '&nbsp;';
                }
                loaderBlocks.innerHTML = blockString;
            }
        }, 0.2);

        // Fill the inner/outer SVG towards the end
        masterTl.to('.monogram-path', {
            fill: 'rgba(200, 255, 0, 0.1)', // Subtle premium glow inside
            duration: 1,
            ease: 'power2.out'
        }, 1.4);

        // Subtle bloom flash
        masterTl.to('.bloom-flash', {
            opacity: 0.08,
            duration: 0.4,
            ease: 'power1.inOut'
        }, 2.0);

        // Fade out overlay seamlessly, preserving background so we see the hero behind
        masterTl.to(loadingScreen, {
            opacity: 0,
            duration: 1.2,
            ease: 'power2.inOut'
        }, 2.4);
    }

    // ==========================================================================
    // 3. Cinematic Custom Cursor
    // ==========================================================================
    const cursor = document.querySelector('.cursor');
    const cursorTrail = document.querySelector('.cursor-trail');

    // Store mouse coordinates
    const cursorState = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        targetX: window.innerWidth / 2,
        targetY: window.innerHeight / 2
    };

    const trailState = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        targetX: window.innerWidth / 2,
        targetY: window.innerHeight / 2
    };

    // Update targets on mouse move
    window.addEventListener('mousemove', (e) => {
        cursorState.targetX = e.clientX;
        cursorState.targetY = e.clientY;
        
        trailState.targetX = e.clientX;
        trailState.targetY = e.clientY;
    });

    // Render loop for the cursor (using LERP for smooth trailing)
    function renderCursor() {
        // Main dot - very fast response
        cursorState.x += (cursorState.targetX - cursorState.x) * 0.4;
        cursorState.y += (cursorState.targetY - cursorState.y) * 0.4;
        
        // Trailing ring - slower response for emotional/cinematic lag
        trailState.x += (trailState.targetX - trailState.x) * 0.12;
        trailState.y += (trailState.targetY - trailState.y) * 0.12;
        
        // Apply transforms
        cursor.style.transform = `translate(${cursorState.x}px, ${cursorState.y}px) translate(-50%, -50%)`;
        cursorTrail.style.transform = `translate(${trailState.x}px, ${trailState.y}px) translate(-50%, -50%)`;
        
        requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover effect bindings
    const bindHoverEffects = () => {
        const interactiveElements = document.querySelectorAll('a, button, [data-cursor="hover"]');
        
        interactiveElements.forEach(el => {
            // Remove existing listeners if any to prevent duplicates on re-render
            el.removeEventListener('mouseenter', handleMouseEnter);
            el.removeEventListener('mouseleave', handleMouseLeave);
            
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });
    };

    const handleMouseEnter = () => document.body.classList.add('hovering');
    const handleMouseLeave = () => document.body.classList.remove('hovering');

    // Initial binding
    bindHoverEffects();
    
    // ==========================================================================
    // 4. Scroll-Controlled Frame Sequence Background
    // ==========================================================================
    const initFrameSequence = () => {
        const canvas = document.getElementById('hero-frame-sequence');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const frameCount = 192; // frames 000 to 191
        const frames = [];
        let loadedCount = 0;
        let currentFrame = 0;

        // Build frame paths
        const framePaths = [];
        for (let i = 0; i < frameCount; i++) {
            const padded = String(i).padStart(3, '0');
            framePaths.push(`./assets/ezgif-split/frame_${padded}_delay-0.041s.webp`);
        }

        // Resize canvas to match display size (handles retina)
        function resizeCanvas() {
            const dpr = Math.min(window.devicePixelRatio, 2);
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            ctx.scale(dpr, dpr);
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            // Redraw current frame after resize
            if (frames[currentFrame] && frames[currentFrame].complete) {
                drawFrame(currentFrame);
            }
        }

        // Draw a frame with cover-fit behavior
        function drawFrame(index) {
            const img = frames[index];
            if (!img || !img.complete || !img.naturalWidth) return;

            const canvasW = canvas.width / Math.min(window.devicePixelRatio, 2);
            const canvasH = canvas.height / Math.min(window.devicePixelRatio, 2);

            // Calculate cover-fit dimensions
            const imgAspect = img.naturalWidth / img.naturalHeight;
            const canvasAspect = canvasW / canvasH;

            let drawW, drawH, offsetX, offsetY;
            if (canvasAspect > imgAspect) {
                // Canvas is wider — fit to width
                drawW = canvasW;
                drawH = canvasW / imgAspect;
                offsetX = 0;
                offsetY = (canvasH - drawH) / 2;
            } else {
                // Canvas is taller — fit to height
                drawH = canvasH;
                drawW = canvasH * imgAspect;
                offsetX = (canvasW - drawW) / 2;
                offsetY = 0;
            }

            ctx.clearRect(0, 0, canvasW, canvasH);
            ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
        }

        // Preload all frames
        let allLoaded = false;
        framePaths.forEach((path, i) => {
            const img = new Image();
            img.src = path;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    allLoaded = true;
                    resizeCanvas();
                    drawFrame(0);
                    initScrollControl();
                } else if (i === 0 && img.complete) {
                    // Draw first frame immediately for instant visual
                    resizeCanvas();
                    drawFrame(0);
                }
            };
            frames[i] = img;
        });

        // Scroll-controlled frame switching using GSAP ScrollTrigger
        function initScrollControl() {
            const frameProxy = { frame: 0 };

            gsap.to(frameProxy, {
                frame: frameCount - 1,
                snap: 'frame',
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: () => '+=' + (window.innerHeight * 3), // 3x viewport scroll to complete all frames
                    scrub: 0.5,
                    pin: true,           // Lock the hero in place while animating
                    pinSpacing: true,    // Push content below to respect the pinned scroll distance
                    anticipatePin: 1,    // Smooth pin entry
                    refreshPriority: 10, // Ensure this calculates before the React timeline
                },
                onUpdate: () => {
                    const newFrame = Math.round(frameProxy.frame);
                    if (newFrame !== currentFrame) {
                        currentFrame = newFrame;
                        drawFrame(currentFrame);
                    }
                }
            });
            
            // Force a refresh so that the React timeline recalculates its start position
            // now that the hero section has added its pinSpacing.
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 100);
        }

        // Handle window resize
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                resizeCanvas();
            }, 250);
        });
    };
    initFrameSequence();

    // ==========================================================================
    // 5. Magnetic Button Logic
    // ==========================================================================
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.5,
                ease: 'power3.out'
            });
            
            gsap.to(btn.querySelector('.btn-text'), {
                x: x * 0.2,
                y: y * 0.2,
                duration: 0.5,
                ease: 'power3.out'
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
            gsap.to(btn.querySelector('.btn-text'), { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.3)' });
        });
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if(lenis) lenis.scrollTo('#introduction', { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            else document.getElementById('introduction').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ==========================================================================
    // 6. Ambient Audio Toggle
    // ==========================================================================
    const soundToggle = document.querySelector('.sound-toggle');
    const ambientAudio = document.getElementById('ambient-audio');
    let isPlaying = false;

    if (soundToggle && ambientAudio) {
        let audioPlaying = false;
        let playPromise = null;

        // Function to attempt playing audio and updating UI
        const attemptPlay = () => {
            playPromise = ambientAudio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    soundToggle.innerHTML = `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                        </svg>
                    `;
                    audioPlaying = true;
                }).catch(() => {
                    console.log("Autoplay blocked by browser. Click the sound icon to play.");
                });
            }
        };

        // Attempt to play automatically on load
        attemptPlay();

        soundToggle.addEventListener('click', async () => {
            // Guard: no source loaded
            if (!ambientAudio.src && ambientAudio.querySelectorAll('source').length === 0) return;

            if (audioPlaying) {
                // Wait for any pending play() to resolve before pausing
                if (playPromise) {
                    try { await playPromise; } catch(_) { /* ignored */ }
                }
                ambientAudio.pause();
                soundToggle.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                        <line x1="23" y1="9" x2="17" y2="15"></line>
                        <line x1="17" y1="9" x2="23" y2="15"></line>
                    </svg>
                `;
                audioPlaying = false;
            } else {
                attemptPlay();
            }
        });
    }

    // ==========================================================================
    // 7. Scroll Indicator Animations
    // ==========================================================================
    gsap.to('.scroll-indicator .chevron', {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1,
        ease: 'power1.inOut'
    });
    
    gsap.to('.scroll-indicator', {
        opacity: 0,
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: '50px top',
            scrub: true
        }
    });

    // ==========================================================================
    // 8. Introduction Section Logic
    // ==========================================================================

    // A. 3D Hologram Tilt
    const hologramWrapper = document.querySelector('.hologram-wrapper');
    const hologramCard = document.querySelector('.hologram-card');
    
    if(hologramWrapper && hologramCard && !isTouchDevice) {
        hologramWrapper.addEventListener('mousemove', (e) => {
            const rect = hologramWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -15; // Max 15 deg tilt
            const rotateY = ((x - centerX) / centerX) * 15;
            
            gsap.to(hologramCard, {
                rotateX: rotateX,
                rotateY: rotateY,
                duration: 0.5,
                ease: 'power2.out'
            });
        });
        
        hologramWrapper.addEventListener('mouseleave', () => {
            gsap.to(hologramCard, {
                rotateX: 0,
                rotateY: 0,
                duration: 1,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    }

    // Constellation Generation removed as per user request

    // C. ScrollTrigger Intro Animations
    const introSection = document.querySelector('.intro-section');
    if(introSection) {
        const introTl = gsap.timeline({
            scrollTrigger: {
                trigger: introSection,
                start: 'top 70%',
                once: true
            }
        });
        
        introTl.from('.intro-left', {
            x: -100,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        }, 0);
        
        introTl.from('.intro-right > *:not(.intro-cards)', {
            x: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: 'power3.out'
        }, 0.2);
        
        introTl.from('.stat-card', {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out'
        }, "-=0.8");
        
        const introStatVals = document.querySelectorAll('.intro-section .stat-val');
        introTl.add(() => {
            introStatVals.forEach(val => {
                const target = parseInt(val.getAttribute('data-target'));
                gsap.to(val, {
                    innerHTML: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { innerHTML: 1 }
                });
            });
        }, "-=0.4");
        // Constellation animations removed
    }

    // ==========================================================================
    // 9. Reusable Chapter Dividers
    // ==========================================================================
    const chapterDividers = document.querySelectorAll('.chapter-divider');
    
    // Atmospheric color palette for subtle variations per chapter
    const atmosphericColors = [
        'rgba(200, 255, 0, 0.03)',   // 1. Lime soft
        'rgba(0, 212, 255, 0.04)',   // 2. Cyan deep
        'rgba(123, 97, 255, 0.05)',  // 3. Violet emotion
        'rgba(255, 107, 53, 0.04)',  // 4. Orange heat/grind
        'rgba(255, 255, 255, 0.02)', // 5. Stark white pressure
        'rgba(0, 212, 255, 0.05)',   // 6. Cyan multiverse
        'rgba(200, 255, 0, 0.05)',   // 7. Lime intense
        'rgba(123, 97, 255, 0.06)'   // 8. Violet soft end
    ];

    chapterDividers.forEach((divider, index) => {
        const number = divider.getAttribute('data-number');
        const title = divider.getAttribute('data-title');
        const subtitle = divider.getAttribute('data-subtitle');
        
        // Build DOM
        divider.innerHTML = `
            <div class="chapter-ghost">${number}</div>
            <div class="chapter-content">
                <h2 class="chapter-title">${title}</h2>
                <p class="chapter-subtitle">${subtitle}</p>
            </div>
            <div class="chapter-rule"></div>
        `;
        
        // Apply Atmospheric Variation & Rhythm
        const glowColor = atmosphericColors[index % atmosphericColors.length];
        divider.style.setProperty('--atmosphere-color', glowColor);
        divider.style.setProperty('--atmosphere-opacity', '1');
        
        // Dynamic pacing: inject breathing room before major acts
        if (index === 2 || index === 6) {
            divider.style.marginTop = '15vh';
            divider.style.marginBottom = '15vh';
        } else {
            divider.style.marginTop = '10vh';
            divider.style.marginBottom = '10vh';
        }

        // GSAP ScrollTrigger
        const titleEl = divider.querySelector('.chapter-title');
        const subtitleEl = divider.querySelector('.chapter-subtitle');
        const ruleEl = divider.querySelector('.chapter-rule');
        const ghostEl = divider.querySelector('.chapter-ghost');

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: divider,
                start: 'top 80%',
                end: 'center center',
                toggleActions: 'play none none reverse'
            }
        });

        // 1. Ghost subtle parallax up
        gsap.to(ghostEl, {
            yPercent: -15,
            ease: 'none',
            scrollTrigger: {
                trigger: divider,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });

        // 2. Blur to Sharp Reveal
        tl.to(titleEl, {
            y: 0,
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.2,
            ease: 'power3.out'
        }, 0);

        // 3. Poetic line fades in
        tl.to(subtitleEl, {
            opacity: 0.8,
            duration: 1,
            ease: 'power2.out'
        }, 0.4);

        // 4. Glowing rule expands from center
        tl.to(ruleEl, {
            width: '100%',
            duration: 1.5,
            ease: 'power4.inOut'
        }, 0.2);
    });

    // ==========================================================================
    // 10. Timeline Skeleton Logic
    // ==========================================================================
    const timelineContainer = document.querySelector('.timeline-container');
    const spineLine = document.querySelector('.spine-line');
    
    if(timelineContainer && spineLine) {
        // SVG Spine Scroll Drawing
        // We set a massive strokeDasharray artificially so we can scrub it backwards.
        // It's a clean hack since SVG line lengths scale dynamically in a fluid container.
        gsap.fromTo(spineLine, 
            { strokeDasharray: '20000', strokeDashoffset: '20000' },
            {
                strokeDashoffset: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: timelineContainer,
                    start: 'top center',
                    end: 'bottom center',
                    scrub: true
                }
            }
        );
        
        // Milestone Card Reveal (IntersectionObserver for elegant fading)
        const cards = document.querySelectorAll('.milestone-card');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.15 });
        
        cards.forEach(card => observer.observe(card));
        
        // Cinematic, Restrained 3D Card Tilt
        const cardWrappers = document.querySelectorAll('.milestone-card-wrapper');
        cardWrappers.forEach(wrapper => {
            const card = wrapper.querySelector('.milestone-card');
            
            wrapper.addEventListener('mousemove', (e) => {
                if(!card.classList.contains('revealed')) return;
                
                const rect = wrapper.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                // Extremely restrained tilt (max 6 degrees)
                const rotateX = ((y - centerY) / centerY) * -6;
                const rotateY = ((x - centerX) / centerX) * 6;
                
                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
            
            wrapper.addEventListener('mouseleave', () => {
                if(!card.classList.contains('revealed')) return;
                
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    duration: 0.8,
                    ease: 'power2.out' // Smooth, non-elastic recovery
                });
            });
        });
        // Special Turning Point Cinematic Wipe
        const turningSection = document.querySelector('.special-turning-point');
        if(turningSection) {
            const splitAfter = turningSection.querySelector('.split-after');
            const turningQuote = turningSection.querySelector('.turning-quote span');
            
            const turnTl = gsap.timeline({
                scrollTrigger: {
                    trigger: turningSection,
                    start: 'top 40%',
                    end: 'bottom 60%',
                    scrub: 1 // Smooth, elegant scrubbing
                }
            });
            
            // Wipe reveal (clip path animating right to left to uncover the 50% split)
            turnTl.to(splitAfter, {
                clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
                ease: 'none'
            });
            
            // Text blur reveal synced to scroll
            gsap.to(turningQuote, {
                filter: 'blur(0px)',
                opacity: 1,
                scrollTrigger: {
                    trigger: turningSection,
                    start: 'top center',
                    end: 'center center',
                    scrub: true
                }
            });
        }

        // Closing Section Quote Reveal
        const closingQuote = document.querySelector('.closing-quote');
        if(closingQuote) {
            gsap.to(closingQuote, {
                opacity: 1,
                filter: 'blur(0px)',
                duration: 2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.closing-section',
                    start: 'top 50%', // Trigger when the section is halfway up the screen
                    toggleActions: 'play none none none'
                }
            });
        }
    }

    // =========================================================================
    // 11. EASTER EGGS & HIDDEN INTERACTIONS
    // =========================================================================

    // 11.1 Global Lighting Shift
    gsap.to(':root', {
        '--current-glow': '#7B61FF',
        scrollTrigger: {
            trigger: 'body',
            start: 'top top',
            end: 'center center',
            scrub: true
        }
    });
    gsap.to(':root', {
        '--current-glow': '#FF6B35',
        scrollTrigger: {
            trigger: 'body',
            start: 'center center',
            end: 'bottom bottom',
            scrub: true
        }
    });

    // 11.2 Konami Code
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    window.addEventListener('keydown', (e) => {
        if(e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if(konamiIndex === konamiCode.length) {
                // Trigger Easter Egg
                const toast = document.getElementById('konami-toast');
                if(toast) {
                    toast.classList.add('active');
                    setTimeout(() => toast.classList.remove('active'), 4000);
                }
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    // 11.3 Keyboard Shortcuts
    const shortcutsModal = document.getElementById('shortcuts-modal');
    window.addEventListener('keydown', (e) => {
        // Ignore if typing in input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        const key = e.key.toLowerCase();
        if(key === 'h') { if(lenis) lenis.scrollTo('#hero'); else window.scrollTo(0, 0); }
        if(key === 't') {
            const timelineEl = document.getElementById('timeline');
            if(lenis && timelineEl) lenis.scrollTo('#timeline');
            else timelineEl?.scrollIntoView();
        }
        if(key === 'a') {
            const arenasEl = document.getElementById('competitive-arenas');
            if(lenis && arenasEl) lenis.scrollTo('#competitive-arenas');
            else arenasEl?.scrollIntoView();
        }
        if(key === 'c') {
            const contactEl = document.getElementById('contact');
            if(lenis && contactEl) lenis.scrollTo('#contact');
            else contactEl?.scrollIntoView();
        }
        if(key === 'f') {
            const closingEl = document.getElementById('closing');
            if(lenis && closingEl) lenis.scrollTo('#closing');
            else closingEl?.scrollIntoView();
        }
        if(key === '?') {
            if(shortcutsModal) shortcutsModal.classList.toggle('active');
        } else if (shortcutsModal && shortcutsModal.classList.contains('active') && key === 'escape') {
            shortcutsModal.classList.remove('active');
        }
    });

    // 11.4 Milestone Linger Badges
    const lingerMessages = [
        "This is where it all started.",
        "The first step is always the hardest.",
        "Double the load. Double the growth.",
        "Every expert was once a beginner.",
        "Pressure makes diamonds.",
        "Curiosity has no boundaries.",
        "This realization changed everything.",
        "The future is being written."
    ];
    
    document.querySelectorAll('.milestone-card-wrapper').forEach((wrapper, index) => {
        let lingerTimer;
        
        // Create badge
        const badge = document.createElement('div');
        badge.className = 'linger-badge';
        badge.innerHTML = `✦ ${lingerMessages[index] || "You paused here."}`;
        wrapper.appendChild(badge);

        wrapper.addEventListener('mouseenter', () => {
            lingerTimer = setTimeout(() => {
                badge.classList.add('active');
            }, 3000);
        });

        wrapper.addEventListener('mouseleave', () => {
            clearTimeout(lingerTimer);
            badge.classList.remove('active');
        });
    });

    // 11.5 Mobile Shake
    let lastX, lastY, lastZ;
    let shakeTimer;
    window.addEventListener('devicemotion', (e) => {
        const acc = e.accelerationIncludingGravity;
        if(!acc) return;
        
        if(!lastX) {
            lastX = acc.x; lastY = acc.y; lastZ = acc.z;
            return;
        }
        
        const deltaX = Math.abs(acc.x - lastX);
        const deltaY = Math.abs(acc.y - lastY);
        const deltaZ = Math.abs(acc.z - lastZ);
        
        if(deltaX + deltaY + deltaZ > 25) {
            // Threshold exceeded, user shook device
            if(!shakeTimer) {
                const toast = document.getElementById('mobile-shake-toast');
                if(toast) {
                    toast.classList.add('active');
                    // Flash screen lime
                    const flash = document.createElement('div');
                    flash.style.position = 'fixed';
                    flash.style.inset = 0;
                    flash.style.background = 'var(--lime)';
                    flash.style.opacity = '0.3';
                    flash.style.zIndex = '99999';
                    flash.style.pointerEvents = 'none';
                    flash.style.transition = 'opacity 0.5s ease';
                    document.body.appendChild(flash);
                    
                    setTimeout(() => {
                        flash.style.opacity = '0';
                        setTimeout(() => flash.remove(), 500);
                        toast.classList.remove('active');
                    }, 2000);
                }
                shakeTimer = setTimeout(() => { shakeTimer = null; }, 3000);
            }
        }
        
        lastX = acc.x; lastY = acc.y; lastZ = acc.z;
    });

    // Re-bind hover effects to newly injected UI elements
    bindHoverEffects();
});

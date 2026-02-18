// 3D Tilt Effect for Profile Card
const card = document.querySelector('.profile-card-3d');
const container = document.querySelector('.hero-visual');

if (card && container) {
  container.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

    card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
  });

  container.addEventListener('mouseenter', (e) => {
    card.style.transition = 'none';
  });

  container.addEventListener('mouseleave', (e) => {
    card.style.transition = 'all 0.5s ease';
    card.style.transform = `rotateY(0deg) rotateX(0deg)`;
  });
}

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Contact Form Handling
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.innerText;
    submitBtn.innerText = 'Sending...';
    submitBtn.disabled = true;

    // These IDs should be replaced with your actual EmailJS Service ID and Template ID
    // You can find these in your EmailJS dashboard
    const serviceID = 'service_szuqirl';
    const templateID = 'template_h9bohvh';

    emailjs.sendForm(serviceID, templateID, this)
      .then(() => {
        submitBtn.innerText = 'Message Sent!';
        submitBtn.style.background = 'var(--accent-color)';
        contactForm.reset();
        setTimeout(() => {
          submitBtn.innerText = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      }, (error) => {
        submitBtn.innerText = 'Failed to Send';
        submitBtn.style.background = '#ff4b4b'; // Red for error
        console.error('FAILED...', error);
        alert('Failed to send message. Please check the console or try again later.');
        setTimeout(() => {
          submitBtn.innerText = originalText;
          submitBtn.style.background = '';
          submitBtn.disabled = false;
        }, 3000);
      });
  });
}

console.log("Portfolio loaded successfully!");

// Scroll Animations
const observeElements = () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: Stop observing once revealed to only animate once
        // observer.unobserve(entry.target); 
      }
    });
  }, {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: "0px"
  });

  const hiddenElements = document.querySelectorAll('.reveal');
  hiddenElements.forEach((el) => observer.observe(el));
};

// Initialize observer when DOM is loaded
document.addEventListener('DOMContentLoaded', observeElements);

// ========== V2 ENHANCEMENTS ==========

// --- Lightbox Modal ---
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = lightboxModal?.querySelector('.lightbox-img');
const lightboxClose = lightboxModal?.querySelector('.lightbox-close');

function openLightbox(src, alt) {
  if (!lightboxModal || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || 'Enlarged photo';
  lightboxModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightboxModal) return;
  lightboxModal.classList.remove('active');
  document.body.style.overflow = '';
}

// Attach click to gallery items
document.querySelectorAll('.gallery-item[data-lightbox]').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (img) {
      openLightbox(img.src, img.alt);
    }
  });
});

// Also attach click to existing gallery items (ALTERINO photos)
document.querySelectorAll('.gallery-item:not([data-lightbox])').forEach(item => {
  const img = item.querySelector('img');
  if (img) {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      openLightbox(img.src, img.alt);
    });
  }
});

// Close lightbox
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxModal) {
  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal) closeLightbox();
  });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// --- Active Nav Section Indicator ---
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}, {
  threshold: 0.3,
  rootMargin: '-80px 0px -50% 0px'
});

sections.forEach(section => navObserver.observe(section));

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

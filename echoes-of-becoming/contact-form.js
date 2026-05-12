/**
 * Contact Form Handler - EmailJS (REST API, no CDN dependency)
 */

(function () {
    'use strict';

    const EMAILJS_API_URL = 'https://api.emailjs.com/api/v1.0/email/send';
    const SERVICE_ID = 'service_szuqirl';
    const TEMPLATE_ID = 'template_h9bohvh';
    const PUBLIC_KEY = 'eJe22GVJKegbw5FeV';

    function sendEmailViaEmailJS(formEl) {
        const formData = new FormData(formEl);
        const templateParams = {
            from_name: String(formData.get('from_name') || '').trim(),
            reply_to: String(formData.get('reply_to') || '').trim(),
            college: String(formData.get('college') || '').trim(),
            message: String(formData.get('message') || '').trim(),
        };

        const payload = {
            service_id: SERVICE_ID,
            template_id: TEMPLATE_ID,
            user_id: PUBLIC_KEY,
            template_params: templateParams,
        };

        return fetch(EMAILJS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        }).then(async (response) => {
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`EmailJS error (${response.status}): ${errorText}`);
            }
        });
    }

    function initContactForm() {
        const contactForm = document.getElementById('contact-form');
        if (!contactForm || contactForm.dataset.emailjsBound === 'true') return;

        const submitButton = contactForm.querySelector('.submit-button');
        const submitText = submitButton?.querySelector('.submit-text');
        if (!submitButton || !submitText) return;

        contactForm.dataset.emailjsBound = 'true';
        let isSending = false;

        try {
            if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: contactSection,
                            start: 'top 75%',
                            toggleActions: 'play none none reverse',
                        },
                    });
                    const contactElements = contactSection.querySelectorAll('.contact-header, .form-group, .form-submit');
                    tl.fromTo(contactElements, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' });
                }
            }
        } catch (err) {
            console.warn('Contact animation setup failed:', err);
        }

        contactForm.addEventListener(
            'submit',
            (event) => {
                event.preventDefault();
                event.stopPropagation();

                if (isSending) return;

                if (!contactForm.checkValidity()) {
                    contactForm.reportValidity();
                    return;
                }

                isSending = true;
                submitButton.disabled = true;
                const originalText = submitText.textContent;
                submitText.textContent = 'Sending...';

                sendEmailViaEmailJS(contactForm)
                    .then(() => {
                        submitText.textContent = 'Message Sent!';
                        contactForm.reset();
                    })
                    .catch((error) => {
                        console.error(error);
                        submitText.textContent = 'Failed to Send';
                    })
                    .finally(() => {
                        setTimeout(() => {
                            submitText.textContent = originalText;
                            submitButton.disabled = false;
                            isSending = false;
                        }, 2500);
                    });
            },
            true
        );
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initContactForm);
    } else {
        initContactForm();
    }
})();

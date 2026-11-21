document.getElementById('year').textContent = new Date().getFullYear();

const navCollapse = document.getElementById('siteNav');
navCollapse.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    if (navCollapse.classList.contains('show') && window.bootstrap) {
      window.bootstrap.Collapse.getOrCreateInstance(navCollapse, { toggle: false }).hide();
    }
  });
});

const enquiryForm = document.getElementById('whatsapp-enquiry');
document.querySelectorAll('[data-enquiry-interest]').forEach((link) => {
  link.addEventListener('click', () => {
    document.getElementById('enquiry-interest').value = link.dataset.enquiryInterest;
  });
});

enquiryForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(enquiryForm);
  const name = String(formData.get('name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const interest = String(formData.get('interest') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const lines = [
    'Hi S3 Fitness, I would like to make an enquiry.',
    '',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Enquiry: ${interest}`,
  ];
  if (message) lines.push(`Message: ${message}`);
  window.location.assign(`https://wa.me/917400979269?text=${encodeURIComponent(lines.join('\n'))}`);
});

const gallery = [...document.querySelectorAll('.gallery-item')];
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox.querySelector('img');
let current = 0;
let lastFocusedGalleryItem = null;

function showImage(index) {
  current = (index + gallery.length) % gallery.length;
  lightboxImg.src = gallery[current].dataset.full;
  lightboxImg.alt = gallery[current].querySelector('img').alt;
}

function openLightbox(index) {
  lastFocusedGalleryItem = gallery[index];
  showImage(index);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  lightbox.querySelector('.lightbox-close').focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lastFocusedGalleryItem?.focus();
}

gallery.forEach((item, index) => item.addEventListener('click', () => openLightbox(index)));
lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
lightbox.querySelector('.lightbox-prev').addEventListener('click', () => showImage(current - 1));
lightbox.querySelector('.lightbox-next').addEventListener('click', () => showImage(current + 1));
lightbox.addEventListener('click', (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (event) => {
  if (!lightbox.classList.contains('open')) return;
  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') showImage(current - 1);
  if (event.key === 'ArrowRight') showImage(current + 1);
});

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const heroVideo = document.querySelector('.hero-video');
const videoToggle = document.querySelector('.video-toggle');

function syncVideoToggle() {
  if (!heroVideo || !videoToggle) return;
  const isPaused = heroVideo.paused;
  videoToggle.setAttribute('aria-pressed', String(isPaused));
  videoToggle.setAttribute('aria-label', isPaused ? 'Play background video' : 'Pause background video');
  videoToggle.innerHTML = isPaused
    ? 'Play background video <span aria-hidden="true">▶</span>'
    : 'Pause background video <span aria-hidden="true">Ⅱ</span>';
}

if (prefersReducedMotion && heroVideo) {
  heroVideo.pause();
  heroVideo.removeAttribute('autoplay');
}
heroVideo?.addEventListener('play', syncVideoToggle);
heroVideo?.addEventListener('pause', syncVideoToggle);
videoToggle?.addEventListener('click', () => {
  if (heroVideo.paused) {
    heroVideo.play().catch(() => syncVideoToggle());
  } else {
    heroVideo.pause();
  }
});
syncVideoToggle();

const gsap = window.gsap;
if (!prefersReducedMotion && gsap) {
  document.documentElement.classList.add('has-gsap');

  gsap.fromTo('.hero-copy .motion-item',
    { autoAlpha: 0, y: 28 },
    {
      autoAlpha: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
      clearProps: 'transform,opacity,visibility',
      onComplete: () => document.querySelectorAll('.hero-copy .motion-item').forEach((item) => item.classList.add('is-revealed')),
    }
  );
  gsap.fromTo('.hero-visual',
    { autoAlpha: 0, scale: 1.035 },
    {
      autoAlpha: 1,
      scale: 1,
      duration: 1.25,
      ease: 'power3.out',
      clearProps: 'transform,opacity,visibility',
      onComplete: () => document.querySelector('.hero-visual')?.classList.add('is-revealed'),
    }
  );
  gsap.to('.hero-sticker', {
    y: -7,
    duration: 2.8,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
  });

  const revealTargets = [...document.querySelectorAll('.motion-reveal')];
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        gsap.fromTo(entry.target,
          { autoAlpha: 0, y: 26 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.82,
            ease: 'power3.out',
            clearProps: 'transform,opacity,visibility',
            onComplete: () => entry.target.classList.add('is-revealed'),
          }
        );
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' });
    revealTargets.forEach((element) => revealObserver.observe(element));
  } else {
    gsap.fromTo(revealTargets,
      { autoAlpha: 0, y: 26 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.82,
        stagger: 0.06,
        ease: 'power3.out',
        clearProps: 'transform,opacity,visibility',
        onComplete: () => revealTargets.forEach((item) => item.classList.add('is-revealed')),
      }
    );
  }
}

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
const animeApi = window.anime;
if (!prefersReducedMotion && animeApi?.animate) {
  const { animate, stagger } = animeApi;
  document.documentElement.classList.add('has-anime');

  animate('.hero-copy .motion-item', {
    opacity: [0, 1],
    translateY: [24, 0],
    delay: stagger(105),
    duration: 850,
    ease: 'outExpo',
  });

  animate('.hero-visual', {
    opacity: [0, 1],
    scale: [.96, 1],
    delay: 180,
    duration: 1050,
    ease: 'outExpo',
  });

  animate('.hero-sticker', {
    translateY: [0, -7],
    rotate: [7, 10],
    duration: 2400,
    ease: 'inOutSine',
    alternate: true,
    loop: true,
  });

  const revealTargets = [...document.querySelectorAll('.motion-reveal')];
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target, {
          opacity: [0, 1],
          translateY: [28, 0],
          duration: 780,
          ease: 'outExpo',
        });
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((element) => revealObserver.observe(element));
  } else {
    animate(revealTargets, {
      opacity: [0, 1],
      translateY: [28, 0],
      delay: stagger(55),
      duration: 780,
      ease: 'outExpo',
    });
  }
}

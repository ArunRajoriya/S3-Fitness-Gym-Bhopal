import * as THREE from 'three';

const mount = document.getElementById('hero-three');
if (mount) initializeScene(mount);

function initializeScene(mount) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let renderer;

  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
  } catch {
    // Keep the CSS orbital rings as a lightweight fallback if WebGL is unavailable.
  }

  if (!renderer) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 40);
  camera.position.z = 6.4;

  const orbit = new THREE.Group();
  scene.add(orbit);

  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xFF5A1F,
    transparent: true,
    opacity: 0.2,
    wireframe: true,
    depthWrite: false,
  });
  const fineRingMaterial = ringMaterial.clone();
  fineRingMaterial.opacity = 0.11;

  const center = new THREE.Mesh(
    new THREE.SphereGeometry(0.68, 32, 24),
    new THREE.MeshBasicMaterial({
      color: 0xFFB28F,
      transparent: true,
      opacity: 0.045,
      depthWrite: false,
    }),
  );
  orbit.add(center);

  const primaryRing = new THREE.Mesh(new THREE.TorusGeometry(1.42, 0.012, 5, 96), ringMaterial);
  primaryRing.rotation.set(0.5, 0.18, -0.3);
  orbit.add(primaryRing);

  const secondaryRing = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.008, 4, 96), fineRingMaterial);
  secondaryRing.rotation.set(1.2, -0.65, 0.45);
  orbit.add(secondaryRing);

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.76, 1), fineRingMaterial.clone());
  core.material.opacity = 0.14;
  orbit.add(core);

  const particleCount = window.matchMedia('(max-width: 575px)').matches ? 28 : 64;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let index = 0; index < particleCount; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 1.65 + Math.random() * 0.7;
    const height = (Math.random() - 0.5) * 3.2;
    particlePositions[index * 3] = Math.cos(angle) * radius;
    particlePositions[index * 3 + 1] = height;
    particlePositions[index * 3 + 2] = Math.sin(angle) * radius;
  }
  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  orbit.add(new THREE.Points(particleGeometry, new THREE.PointsMaterial({
    color: 0xFFD2BE,
    size: 0.022,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
    sizeAttenuation: true,
  })));

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  mount.appendChild(renderer.domElement);
  mount.classList.add('is-rendering');

  const resize = () => {
    const width = mount.clientWidth;
    const height = mount.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    renderer.render(scene, camera);
  };

  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
  } else {
    window.addEventListener('resize', resize, { passive: true });
  }
  resize();

  let inView = true;
  let pageVisible = !document.hidden;
  const draw = (time = 0) => {
    if (!prefersReducedMotion) {
      orbit.rotation.y = time * 0.000075;
      orbit.rotation.x = Math.sin(time * 0.00012) * 0.07;
    }
    renderer.render(scene, camera);
  };
  const syncAnimation = () => {
    if (prefersReducedMotion || !inView || !pageVisible) {
      renderer.setAnimationLoop(null);
      if (pageVisible) draw(0);
      return;
    }
    renderer.setAnimationLoop(draw);
  };

  if ('IntersectionObserver' in window) {
    const sceneObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      syncAnimation();
    });
    sceneObserver.observe(mount);
  }
  document.addEventListener('visibilitychange', () => {
    pageVisible = !document.hidden;
    syncAnimation();
  });
  syncAnimation();
}

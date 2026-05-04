// Parallax scrolling with scroll-triggered animations
export function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');

  if (parallaxElements.length === 0) return;

  let rafId: number;
  let scrollPos = 0;

  function updateParallax() {
    parallaxElements.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax') || '0.5');
      const rect = el.getBoundingClientRect();
      const elementCenter = rect.top + rect.height / 2;
      const windowCenter = window.innerHeight / 2;
      const distance = windowCenter - elementCenter;
      const offset = distance * (1 - speed) * 0.3;

      (el as HTMLElement).style.transform = `translateY(${offset}px)`;
    });
  }

  window.addEventListener('scroll', () => {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateParallax);
  }, { passive: true });

  updateParallax();
}

// Depth layering for sections
export function initDepthLayers() {
  const sections = document.querySelectorAll('section[id]');

  sections.forEach(section => {
    const numLayers = 3;
    const container = section as HTMLElement;

    if (!container.querySelector('.depth-layers')) {
      const layerContainer = document.createElement('div');
      layerContainer.className = 'depth-layers';

      for (let i = 0; i < numLayers; i++) {
        const layer = document.createElement('div');
        layer.className = `depth-layer depth-layer-${i}`;
        layer.style.setProperty('--layer', `${i}`);
        layerContainer.appendChild(layer);
      }

      container.insertBefore(layerContainer, container.firstChild);
    }
  });
}

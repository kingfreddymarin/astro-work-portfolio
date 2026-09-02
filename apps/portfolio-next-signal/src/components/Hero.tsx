'use client';

import { useEffect } from 'react';
// @ts-expect-error — untyped JS data module shared with the Astro original
import { site } from '../data/portfolio.js';

export default function Hero() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    cleanups.push(nodeNetwork());
    cleanups.push(styleCycling());
    cleanups.push(textScramble());
    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section id="hero">
      <div className="hero-blob" aria-hidden="true"></div>
      <canvas id="hero-canvas" aria-hidden="true"></canvas>
      <div className="hero-content">
        <p className="hero-label">
          {site.studio} // {site.discipline}
        </p>
        <h1 className="hero-name">
          {site.heroHeadline.prefix}
          <br />
          <em>{site.heroHeadline.highlight}</em>
          <span className="cursor" aria-hidden="true"></span>
        </h1>
        <p className="hero-tagline">{site.tagline}</p>
        <div className="hero-cta">
          <a className="btn btn-primary" href="#projects">
            View our work
          </a>
          <a className="btn btn-ghost" href="#contact">
            Get in touch
          </a>
        </div>
        {site.available && (
          <p className="hero-available">
            <span className="dot" aria-hidden="true"></span>
            Available for new engagements
          </p>
        )}
      </div>
      <button
        className="hero-scroll"
        type="button"
        data-open-menu
        aria-label="Open menu to explore"
      >
        Press [M] to open Menu
      </button>
      <span className="hero-style-hint" aria-hidden="true">
        ✦ shift aesthetic
      </span>
    </section>
  );
}

/* ── Node network + shockwave ripple (Canvas 2D — no external deps) ── */
function nodeNetwork(): () => void {
  const disposers: Array<() => void> = [];
  const canvas = document.getElementById('hero-canvas');
  if (
    !(canvas instanceof HTMLCanvasElement) ||
    document.documentElement.getAttribute('data-mode') === 'lite'
  ) {
    return () => {};
  }

  const ctx = canvas.getContext('2d')!;

  let W = 0,
    H = 0;
  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();

  const isMobile = window.matchMedia('(pointer: coarse)').matches;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const COUNT = isMobile ? 28 : 55;
  const CDIST2 = (isMobile ? 160 : 200) ** 2;

  const px = new Float32Array(COUNT);
  const py = new Float32Array(COUNT);
  const vx = new Float32Array(COUNT);
  const vy = new Float32Array(COUNT);
  const bvx = new Float32Array(COUNT);
  const bvy = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    px[i] = Math.random() * W;
    py[i] = Math.random() * H;
    bvx[i] = vx[i] = (Math.random() - 0.5) * 0.5;
    bvy[i] = vy[i] = (Math.random() - 0.5) * 0.35;
  }

  type Ripple = { x: number; y: number; r: number; s: number };
  const ripples: Ripple[] = [];

  let mnx = 0.5,
    mny = 0.5;
  let parallaxX = 0,
    parallaxY = 0;
  let scrollOff = 0;
  let blobX = W / 2,
    blobY = H / 2,
    blobTX = W / 2,
    blobTY = H / 2;
  const blob = document.querySelector<HTMLElement>('.hero-blob');

  const onMouseMove = (e: MouseEvent) => {
    mnx = e.clientX / W;
    mny = e.clientY / H;
    blobTX = e.clientX;
    blobTY = e.clientY;
  };
  window.addEventListener('mousemove', onMouseMove);
  disposers.push(() => window.removeEventListener('mousemove', onMouseMove));

  const onScroll = () => {
    scrollOff = window.scrollY;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  disposers.push(() => window.removeEventListener('scroll', onScroll));

  const heroEl = document.getElementById('hero');
  const onHeroClick = (e: Event) => {
    const ev = e as MouseEvent;
    ripples.push({ x: ev.clientX, y: ev.clientY, r: 0, s: 3 });
  };
  heroEl?.addEventListener('click', onHeroClick);
  disposers.push(() => heroEl?.removeEventListener('click', onHeroClick));

  // Blob lerp — desktop only
  let blobRAFId = 0;
  if (!isMobile && blob) {
    (function blobRAF() {
      if (!document.hidden) {
        blobX += (blobTX - blobX) * 0.04;
        blobY += (blobTY - blobY) * 0.04;
        blob.style.transform = `translate(${blobX - 320}px, ${blobY - 320}px)`;
      }
      blobRAFId = requestAnimationFrame(blobRAF);
    })();
    disposers.push(() => cancelAnimationFrame(blobRAFId));
  }

  let heroVisible = true;
  const onVisibility = () => {
    heroVisible = !document.hidden;
  };
  document.addEventListener('visibilitychange', onVisibility);
  disposers.push(() => document.removeEventListener('visibilitychange', onVisibility));

  const io = new IntersectionObserver(
    (entries) => {
      heroVisible = entries[0].isIntersecting && !document.hidden;
    },
    { threshold: 0 },
  );
  io.observe(canvas);
  disposers.push(() => io.disconnect());

  let tickId = 0;
  function tick() {
    tickId = requestAnimationFrame(tick);
    if (!heroVisible || reduce) return;

    ctx.clearRect(0, 0, W, H);

    parallaxX += ((mnx - 0.5) * 24 - parallaxX) * 0.04;
    parallaxY += ((mny - 0.5) * 16 - parallaxY) * 0.04;
    const ox = isMobile ? 0 : parallaxX;
    const oy = (isMobile ? 0 : parallaxY) - scrollOff * 0.03;

    for (let i = 0; i < COUNT; i++) {
      px[i] += vx[i];
      py[i] += vy[i];
      if (px[i] < -20) px[i] = W + 20;
      if (px[i] > W + 20) px[i] = -20;
      if (py[i] < -20) py[i] = H + 20;
      if (py[i] > H + 20) py[i] = -20;
      vx[i] += (bvx[i] - vx[i]) * 0.022;
      vy[i] += (bvy[i] - vy[i]) * 0.022;
    }

    for (let ri = ripples.length - 1; ri >= 0; ri--) {
      const rp = ripples[ri];
      rp.r += 8;
      rp.s *= 0.965;
      for (let i = 0; i < COUNT; i++) {
        const dx = px[i] - rp.x,
          dy = py[i] - rp.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 0.1) continue;
        const wave = Math.max(0, 1 - Math.abs(dist - rp.r) / 40);
        if (wave > 0) {
          const f = wave * rp.s * 0.5;
          vx[i] += (dx / dist) * f;
          vy[i] += (dy / dist) * f;
        }
      }
      if (rp.r > Math.max(W, H) || rp.s < 0.04) ripples.splice(ri, 1);
    }

    // Connections — one batched path
    ctx.beginPath();
    for (let i = 0; i < COUNT; i++) {
      for (let j = i + 1; j < COUNT; j++) {
        const dx = px[i] - px[j],
          dy = py[i] - py[j];
        if (dx * dx + dy * dy < CDIST2) {
          ctx.moveTo(px[i] + ox, py[i] + oy);
          ctx.lineTo(px[j] + ox, py[j] + oy);
        }
      }
    }
    ctx.strokeStyle = 'rgba(255,194,75,0.12)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Particles — one batched path
    ctx.beginPath();
    for (let i = 0; i < COUNT; i++) {
      ctx.moveTo(px[i] + ox + 2.5, py[i] + oy);
      ctx.arc(px[i] + ox, py[i] + oy, 2.5, 0, Math.PI * 2);
    }
    ctx.fillStyle = 'rgba(255,194,75,0.7)';
    ctx.fill();
  }

  tick();
  disposers.push(() => cancelAnimationFrame(tickId));

  const onResize = () => {
    resize();
    for (let i = 0; i < COUNT; i++) {
      if (px[i] > W) px[i] = Math.random() * W;
      if (py[i] > H) py[i] = Math.random() * H;
    }
  };
  window.addEventListener('resize', onResize, { passive: true });
  disposers.push(() => window.removeEventListener('resize', onResize));

  return () => disposers.forEach((fn) => fn());
}

/* ── Style theme cycling — click hero to shift aesthetic ── */
function styleCycling(): () => void {
  const STYLES = ['', 'glass', 'chaos', 'terminal', 'winxp'] as const;
  const HINTS = [
    '✦ shift aesthetic',
    '✦ go chaotic',
    '✦ restore sanity',
    '✦ enter the matrix',
    '✦ activate luna',
  ] as const;

  const current = (document.documentElement.getAttribute('data-style') ??
    '') as (typeof STYLES)[number];
  let styleIdx = Math.max(0, STYLES.indexOf(current));

  const hint = document.querySelector<HTMLElement>('.hero-style-hint');
  if (hint) hint.textContent = HINTS[styleIdx];

  function cycleStyle() {
    // Strict mode locks the default brand — no aesthetic shifting.
    if (document.documentElement.hasAttribute('data-strict')) return;
    styleIdx = (styleIdx + 1) % STYLES.length;
    const style = STYLES[styleIdx];

    document.documentElement.setAttribute('data-transitioning', '');

    if (style) {
      document.documentElement.setAttribute('data-style', style);
      localStorage.setItem('site-style', style);
    } else {
      document.documentElement.removeAttribute('data-style');
      localStorage.removeItem('site-style');
    }

    if (hint) hint.textContent = HINTS[styleIdx];

    setTimeout(() => document.documentElement.removeAttribute('data-transitioning'), 500);
  }

  // Exposed for any external trigger (e.g. Ctrl+, handler) to shift the aesthetic.
  (window as any).cycleStyle = cycleStyle;

  const onHintClick = (e: Event) => {
    e.stopPropagation();
    cycleStyle();
  };
  hint?.addEventListener('click', onHintClick);

  // Change theme/aesthetic: Ctrl + ,
  const onKey = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === ',') {
      e.preventDefault();
      cycleStyle();
    }
  };
  window.addEventListener('keydown', onKey);

  return () => {
    hint?.removeEventListener('click', onHintClick);
    window.removeEventListener('keydown', onKey);
  };
}

/* ── Text scramble on load + re-scramble on hover + chromatic glitch ── */
function textScramble(): () => void {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%!?&';
  let disposed = false;

  function scramble(el: HTMLElement, delay = 0, duration = 600) {
    const original = el.textContent ?? '';
    setTimeout(() => {
      if (disposed) return;
      const t0 = performance.now();
      (function tick(now: number) {
        if (disposed) return;
        const p = Math.min((now - t0) / duration, 1);
        el.textContent = original
          .split('')
          .map((ch, i) => {
            if (ch === ' ' || ch === '\n') return ch;
            if (i / original.length < p) return ch;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('');
        if (p < 1) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = original;
          el.animate(
            [{ transform: 'scale(1)' }, { transform: 'scale(1.015)' }, { transform: 'scale(1)' }],
            { duration: 180, easing: 'ease-out' },
          );
        }
      })(performance.now());
    }, delay);
  }

  const label = document.querySelector<HTMLElement>('.hero-label');
  const heroEm = document.querySelector<HTMLElement>('.hero-name em');

  if (label) scramble(label, 200, 800);
  if (heroEm) scramble(heroEm, 420, 650);

  let reScrambleCooldown = false;
  const heroNameEl = document.querySelector('.hero-name');
  const onEnter = () => {
    if (reScrambleCooldown || !heroEm) return;
    reScrambleCooldown = true;
    scramble(heroEm, 0, 320);
    setTimeout(() => {
      reScrambleCooldown = false;
    }, 900);
  };
  if (document.documentElement.getAttribute('data-mode') !== 'lite') {
    heroNameEl?.addEventListener('mouseenter', onEnter);
  }

  /* Chromatic aberration glitch — fires every 5–11s (full mode only) */
  if (document.documentElement.getAttribute('data-mode') !== 'lite') {
    const heroName = document.querySelector<HTMLElement>('.hero-name');
    function triggerGlitch() {
      if (!heroName || disposed) return;
      heroName
        .animate(
          [
            { textShadow: 'none', filter: 'none' },
            {
              textShadow: '-4px 0 rgba(255,30,30,0.7), 4px 0 rgba(30,30,255,0.7)',
              filter: 'blur(0.4px)',
            },
            {
              textShadow: '4px 0 rgba(255,30,30,0.7), -4px 0 rgba(30,30,255,0.7)',
              filter: 'none',
            },
            {
              textShadow: '-2px 0 rgba(255,30,30,0.5), 2px 0 rgba(30,30,255,0.5)',
              filter: 'blur(0.2px)',
            },
            { textShadow: 'none', filter: 'none' },
          ],
          { duration: 350, easing: 'steps(4)' },
        )
        .finished.then(() => setTimeout(triggerGlitch, 5000 + Math.random() * 6000));
    }
    setTimeout(triggerGlitch, 4500);
  }

  return () => {
    disposed = true;
    heroNameEl?.removeEventListener('mouseenter', onEnter);
  };
}

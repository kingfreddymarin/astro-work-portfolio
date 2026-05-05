import * as THREE from 'three';
import { projects, skills, about, site } from '../data/portfolio.js';

// Scene state
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let rafId = 0;
let isRunning = false;

// Input state
const keys: Record<string, boolean> = {};
let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let yaw = 0;
let pitch = 0;

// Movement
const camTarget = new THREE.Vector3(0, 1.8, 0);
const SPEED = 8;
const LERP = 0.08;

// Interaction
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const interactables: THREE.Object3D[] = [];

// Zone positions
const ZONES = {
  hub: new THREE.Vector3(0, 0, 0),
  projects: new THREE.Vector3(25, 0, 0),
  skills: new THREE.Vector3(0, 0, -25),
  about: new THREE.Vector3(-25, 0, 0),
  contact: new THREE.Vector3(0, 0, 25),
};

interface ThemePalette {
  accent: THREE.Color;
  bg: THREE.Color;
  surface: THREE.Color;
  ink3: THREE.Color;
  fog: THREE.Color;
  gridColor: number;
  fogNear: number;
  fogFar: number;
}

function getThemePalette(): ThemePalette {
  const style = document.documentElement.getAttribute('data-style') ?? '';
  const cs = getComputedStyle(document.documentElement);

  const accentStr = cs.getPropertyValue('--accent').trim();
  const bgStr = cs.getPropertyValue('--bg').trim();
  const surfaceStr = cs.getPropertyValue('--surface').trim();
  const ink3Str = cs.getPropertyValue('--ink-3').trim();

  // Theme-specific accent overrides
  const accentOverrides: Record<string, string> = {
    glass: '#3CA0FF',
    chaos: '#FF00EE',
    terminal: '#00ff00',
    winxp: '#0078D4',
  };

  const accent = new THREE.Color(accentOverrides[style] ?? accentStr);
  const bg = new THREE.Color(bgStr);
  const surface = new THREE.Color(surfaceStr);
  const ink3 = new THREE.Color(ink3Str);

  return {
    accent,
    bg,
    surface,
    ink3,
    fog: bg.clone(),
    gridColor: accent.getHex(),
    fogNear: 20,
    fogFar: 80,
  };
}

function makeTextSprite(text: string, color: THREE.Color): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, 512, 128);
  ctx.font = 'bold 48px "DM Mono", monospace';
  ctx.fillStyle = `#${color.getHexString()}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text.toUpperCase(), 256, 64);

  const texture = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(4, 1, 1);
  sprite.position.y = 7.5;
  return sprite;
}

function makeZonePillar(pos: THREE.Vector3, color: THREE.Color, label: string): THREE.Group {
  const group = new THREE.Group();
  group.position.copy(pos);

  // Glowing column
  const geo = new THREE.CylinderGeometry(0.15, 0.15, 6, 8);
  const mat = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.85,
  });
  const pillar = new THREE.Mesh(geo, mat);
  pillar.position.y = 3;
  group.add(pillar);

  // Top point light
  const light = new THREE.PointLight(color.getHex(), 1.5, 8);
  light.position.y = 6.5;
  group.add(light);

  // Label sprite
  group.add(makeTextSprite(label, color));

  return group;
}

function buildHub(palette: ThemePalette) {
  const base = ZONES.hub;
  scene!.add(makeZonePillar(base, palette.accent, 'Hub'));

  // Floating title sprite
  const titleSprite = makeTextSprite(`${site.name} ✦ ${site.title}`, palette.accent);
  titleSprite.position.set(base.x, 2, base.z);
  titleSprite.scale.set(6, 1.5, 1);
  scene!.add(titleSprite);
}

function buildProjectsZone(palette: ThemePalette) {
  const base = ZONES.projects;
  scene!.add(makeZonePillar(base, palette.accent, 'Projects'));

  projects.forEach((proj, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = base.x - 4 + col * 4;
    const z = base.z - 6 + row * 5;

    // Create card texture
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 200;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = palette.surface.getStyle();
    ctx.fillRect(0, 0, 320, 200);

    ctx.fillStyle = palette.accent.getStyle();
    ctx.font = 'bold 24px "DM Mono", monospace';
    ctx.fillText(proj.index, 20, 40);

    ctx.font = 'bold 18px "Cormorant Garant", serif';
    ctx.fillStyle = palette.ink3.getStyle();
    ctx.fillText(proj.title, 20, 80);

    if (proj.nda) {
      ctx.fillStyle = '#FFD89B';
      ctx.font = '12px "DM Mono", monospace';
      ctx.fillText('NDA', 20, 180);
    }

    const texture = new THREE.CanvasTexture(canvas);
    const geo = new THREE.PlaneGeometry(3.2, 2);
    const mat = new THREE.MeshStandardMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const card = new THREE.Mesh(geo, mat);
    card.position.set(x, 1.5, z);
    card.rotation.y = -Math.PI / 6;
    card.userData = { type: 'project', data: proj };

    interactables.push(card);
    scene!.add(card);
  });
}

function buildSkillsZone(palette: ThemePalette) {
  const base = ZONES.skills;
  scene!.add(makeZonePillar(base, palette.accent, 'Skills'));

  const offsets = [
    [-8, 0],
    [0, 0],
    [8, 0],
    [-8, -8],
    [0, -8],
    [8, -8],
  ];

  skills.forEach((skillGroup, gi) => {
    const [ox, oz] = offsets[gi];
    const cx = base.x + ox;
    const cz = base.z + oz;

    // Category label
    const labelSprite = makeTextSprite(skillGroup.category, palette.accent);
    labelSprite.position.set(cx, 3.5, cz);
    labelSprite.scale.set(2.5, 0.8, 1);
    scene!.add(labelSprite);

    // Skill orbs
    skillGroup.items.forEach((item, ii) => {
      const angle = (ii / skillGroup.items.length) * Math.PI * 2;
      const r = 1.4;
      const sx = cx + Math.cos(angle) * r;
      const sz = cz + Math.sin(angle) * r;

      const geo = new THREE.SphereGeometry(0.25, 12, 12);
      const mat = new THREE.MeshStandardMaterial({
        color: palette.accent,
        emissive: palette.accent,
        emissiveIntensity: 0.3,
      });
      const orb = new THREE.Mesh(geo, mat);
      orb.position.set(sx, 1.5, sz);
      orb.userData = { type: 'skill', category: skillGroup.category, item };
      interactables.push(orb);
      scene!.add(orb);
    });
  });
}

function buildAboutZone(palette: ThemePalette) {
  const base = ZONES.about;
  scene!.add(makeZonePillar(base, palette.accent, 'About'));

  // Bio canvas
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = palette.surface.getStyle();
  ctx.fillRect(0, 0, 512, 320);
  ctx.fillStyle = palette.ink3.getStyle();
  ctx.font = '14px "DM Sans", sans-serif';
  ctx.fillText('Systems Engineer', 20, 40);
  ctx.font = '12px "DM Sans", sans-serif';
  let y = 80;
  const bioText = about.bio[0]?.replace(/<[^>]*>/g, '') || 'Systems Engineer & AI Agent Coordinator';
  const lines = bioText.split('\n');
  lines.forEach((line) => {
    ctx.fillText(line, 20, y);
    y += 20;
  });

  const texture = new THREE.CanvasTexture(canvas);
  const geo = new THREE.PlaneGeometry(8, 5);
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const panel = new THREE.Mesh(geo, mat);
  panel.position.set(base.x + 5, 2.5, base.z);
  panel.rotation.y = Math.PI / 2;
  panel.userData = { type: 'about' };
  interactables.push(panel);
  scene!.add(panel);
}

function buildContactZone(palette: ThemePalette) {
  const base = ZONES.contact;
  scene!.add(makeZonePillar(base, palette.accent, 'Contact'));

  // Contact canvas
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 192;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = palette.surface.getStyle();
  ctx.fillRect(0, 0, 384, 192);
  ctx.fillStyle = palette.accent.getStyle();
  ctx.font = 'bold 16px "DM Mono", monospace';
  ctx.fillText('CONTACT', 20, 40);
  ctx.fillStyle = palette.ink3.getStyle();
  ctx.font = '12px "DM Mono", monospace';
  ctx.fillText(`Email: ${site.email}`, 20, 80);
  if (site.linkedin) ctx.fillText('LinkedIn: linkedin.com/in/...', 20, 110);
  ctx.fillText('Press I to toggle immersive mode', 20, 160);

  const texture = new THREE.CanvasTexture(canvas);
  const geo = new THREE.PlaneGeometry(6, 3);
  const mat = new THREE.MeshStandardMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const panel = new THREE.Mesh(geo, mat);
  panel.position.set(base.x, 1.8, base.z - 4);
  panel.userData = { type: 'contact' };
  interactables.push(panel);
  scene!.add(panel);
}

function buildScene(palette: ThemePalette) {
  scene = new THREE.Scene();
  scene.background = palette.bg;
  scene.fog = new THREE.Fog(palette.fog.getHex(), palette.fogNear, palette.fogFar);

  // Lighting
  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  const dir = new THREE.DirectionalLight(palette.accent.getHex(), 1.2);
  dir.position.set(10, 20, 10);
  scene.add(dir);

  const fill = new THREE.PointLight(palette.accent.getHex(), 0.3, 60);
  fill.position.set(0, -1, 0);
  scene.add(fill);

  // Grid floor
  const grid = new THREE.GridHelper(400, 80, palette.gridColor, palette.gridColor);
  (grid.material as THREE.LineBasicMaterial).opacity = 0.15;
  (grid.material as THREE.LineBasicMaterial).transparent = true;
  scene.add(grid);

  // Build zones
  buildHub(palette);
  buildProjectsZone(palette);
  buildSkillsZone(palette);
  buildAboutZone(palette);
  buildContactZone(palette);
}

function setupCamera() {
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 300);
  camera.position.set(0, 1.8, 5);
  yaw = 0;
  pitch = 0;
}

function updateCamera(dt: number) {
  if (!camera) return;

  // Build movement
  const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
  const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));

  const move = new THREE.Vector3();
  if (keys['w'] || keys['W'] || keys['ArrowUp']) move.addScaledVector(forward, 1);
  if (keys['s'] || keys['S'] || keys['ArrowDown']) move.addScaledVector(forward, -1);
  if (keys['a'] || keys['A'] || keys['ArrowLeft']) move.addScaledVector(right, -1);
  if (keys['d'] || keys['D'] || keys['ArrowRight']) move.addScaledVector(right, 1);

  if (move.lengthSq() > 0) {
    move.normalize().multiplyScalar(SPEED * dt);
  }

  // Apply movement and height constraints
  camTarget.add(move);
  camTarget.y = Math.max(0.5, Math.min(camTarget.y, 8));

  // Lerp camera to target
  camera.position.lerp(camTarget, LERP);

  // Apply look rotation
  const qYaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  const qPitch = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), pitch);
  camera.quaternion.copy(qYaw).multiply(qPitch);
}

function updateZoneLabel() {
  if (!camera) return;
  const p = camera.position;
  let closest = 'hub';
  let minDist = Infinity;

  for (const [name, pos] of Object.entries(ZONES)) {
    const d = p.distanceTo(pos);
    if (d < minDist) {
      minDist = d;
      closest = name;
    }
  }

  const labels: Record<string, string> = {
    hub: 'HUB — Freddy J. Marin',
    projects: 'ZONE: Projects',
    skills: 'ZONE: Skills',
    about: 'ZONE: About',
    contact: 'ZONE: Contact',
  };

  const el = document.getElementById('imm-zone-label');
  if (el) el.textContent = labels[closest] ?? '';
}

function onClick(e: MouseEvent) {
  if (isDragging || !camera || !scene) return;

  pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(interactables, false);

  if (hits.length === 0) {
    document.getElementById('imm-panel')!.hidden = true;
    return;
  }

  const obj = hits[0].object;
  handleInteraction(obj);
}

function handleInteraction(obj: THREE.Object3D) {
  const { type, data, category, item } = obj.userData;

  if (type === 'project') {
    showProjectPanel(data);
  } else if (type === 'skill') {
    highlightCategory(category);
    showSkillPanel(category, item);
  } else if (type === 'about') {
    showAboutPanel();
  } else if (type === 'contact') {
    showContactPanel();
  }
}

function showProjectPanel(proj: (typeof projects)[0]) {
  const panel = document.getElementById('imm-panel')!;
  const content = document.getElementById('imm-panel-content')!;
  content.innerHTML = `
    <span class="imm-panel-index">${proj.index}</span>
    <h2 class="imm-panel-title">${proj.title}</h2>
    <p class="imm-panel-desc">${proj.description}</p>
    <div class="imm-panel-tags">
      ${proj.tags.map((t) => `<span class="tag">${t}</span>`).join('')}
    </div>
    ${proj.nda ? '<span class="imm-panel-nda">NDA Protected</span>' : ''}
    ${proj.url ? `<a href="${proj.url}" target="_blank" rel="noopener noreferrer" class="imm-panel-link">↗ View Project</a>` : ''}
  `;
  panel.hidden = false;
}

function showSkillPanel(category: string, item: string) {
  const panel = document.getElementById('imm-panel')!;
  const content = document.getElementById('imm-panel-content')!;
  content.innerHTML = `
    <h2 class="imm-panel-title">${category}</h2>
    <p class="imm-panel-desc">${item}</p>
    <p style="color: var(--ink-3); font-size: 12px; margin-top: 1rem;">Click another skill to explore different technologies</p>
  `;
  panel.hidden = false;
}

function showAboutPanel() {
  const panel = document.getElementById('imm-panel')!;
  const content = document.getElementById('imm-panel-content')!;
  content.innerHTML = `
    <h2 class="imm-panel-title">About Freddy</h2>
    <p class="imm-panel-desc">Systems Engineer specializing in AI agent coordination and distributed systems. Based in Managua.</p>
    <p class="imm-panel-desc" style="margin-top: 1rem;">Passionate about building resilient, scalable systems and exploring the intersection of systems engineering and artificial intelligence.</p>
  `;
  panel.hidden = false;
}

function showContactPanel() {
  const panel = document.getElementById('imm-panel')!;
  const content = document.getElementById('imm-panel-content')!;
  content.innerHTML = `
    <h2 class="imm-panel-title">Get In Touch</h2>
    <p class="imm-panel-desc"><strong>Email:</strong> ${site.email}</p>
    ${site.linkedin ? `<p class="imm-panel-desc"><strong>LinkedIn:</strong> <a href="${site.linkedin}" target="_blank" rel="noopener noreferrer" class="imm-panel-link">Visit Profile</a></p>` : ''}
    <p class="imm-panel-desc" style="margin-top: 1rem; font-size: 12px; color: var(--ink-3);">Available for new opportunities and collaborations.</p>
  `;
  panel.hidden = false;
}

function highlightCategory(category: string) {
  interactables.forEach((obj) => {
    if (obj.userData.type !== 'skill') return;
    const mat = (obj as THREE.Mesh).material as THREE.MeshStandardMaterial;
    if (obj.userData.category === category) {
      mat.emissiveIntensity = 1.2;
      obj.scale.setScalar(1.5);
    } else {
      mat.emissiveIntensity = 0.1;
      obj.scale.setScalar(1);
    }
  });
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key.toLowerCase() === 'i') return; // handled in ImmersiveMode.astro
  if (e.key === 'Escape') return; // handled in ImmersiveMode.astro

  keys[e.key] = true;

  // Prevent Lenis scroll on movement keys
  if (['w', 'W', 's', 'S', 'a', 'A', 'd', 'D', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
  }
}

function onKeyUp(e: KeyboardEvent) {
  keys[e.key] = false;
}

function onMouseDown(e: MouseEvent) {
  isDragging = true;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
}

function onMouseMove(e: MouseEvent) {
  if (!isDragging) return;
  const dx = e.clientX - lastMouseX;
  const dy = e.clientY - lastMouseY;
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;
  yaw -= dx * 0.003;
  pitch -= dy * 0.003;
  pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pitch));
}

function onMouseUp() {
  isDragging = false;
}

function onResize() {
  if (!renderer || !camera) return;
  const w = window.innerWidth;
  const h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
}

let lastTime = 0;

function animate(time: number) {
  if (!isRunning) return;
  rafId = requestAnimationFrame(animate);

  const dt = Math.min((time - lastTime) / 1000, 0.05);
  lastTime = time;

  updateCamera(dt);
  updateZoneLabel();

  renderer!.render(scene!, camera!);
}

export function initImmersive() {
  const canvas = document.getElementById('immersive-canvas') as HTMLCanvasElement;
  if (!canvas) return;

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = false;

  setupCamera();

  const palette = getThemePalette();
  buildScene(palette);

  // Event listeners
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  canvas.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);
  canvas.addEventListener('click', onClick);
  window.addEventListener('resize', onResize);

  isRunning = true;
  lastTime = performance.now();
  animate(lastTime);
}

export function destroyImmersive() {
  isRunning = false;
  cancelAnimationFrame(rafId);

  // Remove listeners
  window.removeEventListener('keydown', onKeyDown);
  window.removeEventListener('keyup', onKeyUp);
  const canvas = document.getElementById('immersive-canvas') as HTMLCanvasElement;
  if (canvas) {
    canvas.removeEventListener('mousedown', onMouseDown);
    canvas.removeEventListener('click', onClick);
  }
  window.removeEventListener('mousemove', onMouseMove);
  window.removeEventListener('mouseup', onMouseUp);
  window.removeEventListener('resize', onResize);

  // Dispose Three.js resources
  if (scene) {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => {
            m.map?.dispose();
            m.dispose();
          });
        } else {
          obj.material.map?.dispose();
          obj.material.dispose();
        }
      }
    });
  }

  if (renderer) {
    renderer.dispose();
  }

  renderer = null;
  scene = null;
  camera = null;
  interactables.length = 0;

  // Reset panel
  const panel = document.getElementById('imm-panel');
  if (panel) panel.hidden = true;
}

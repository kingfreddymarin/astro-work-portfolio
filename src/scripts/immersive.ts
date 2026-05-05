import * as THREE from 'three';
import { projects, skills } from '../data/portfolio.js';

// Scene state
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let rafId = 0;
let isRunning = false;

// Pointer lock & game state
let isPointerLocked = false;
let isPaused = false;
let isReloading = false;
let lastFireTime = 0;
const fireInterval = 100; // 600 RPM

// Camera & movement
const keys: Record<string, boolean> = {};
let yaw = 0;
let pitch = 0;
let camPos = new THREE.Vector3(0, 1.8, 4);

// Weapon & ammo
let currentAmmo = 30;
let reserveAmmo = 90;
let recoilAmount = 0;
let lastReloadTime = 0;
const reloadDuration = 2500;

// Game state
let score = 0;
let shotsFired = 0;
let shotsHit = 0;

// Targets & bullets
const targets: THREE.Object3D[] = [];
const bullets: Bullet[] = [];
const pendingTimeouts: NodeJS.Timeout[] = [];

// Weapon group (attached to camera)
let weaponGroup: THREE.Group | null = null;

interface Bullet {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  distanceTraveled: number;
  maxRange: number;
}

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
    fogFar: 120,
  };
}

function buildEnvironment() {
  if (!scene) return;
  const palette = getThemePalette();

  // Floor
  const floorGeo = new THREE.PlaneGeometry(50, 60);
  const floorMat = new THREE.MeshStandardMaterial({
    color: palette.bg,
    roughness: 0.8,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = 0;
  scene.add(floor);

  // Back wall
  const wallGeo = new THREE.PlaneGeometry(50, 20);
  const wallMat = new THREE.MeshStandardMaterial({
    color: palette.surface,
    roughness: 0.6,
  });
  const backWall = new THREE.Mesh(wallGeo, wallMat);
  backWall.position.z = -30;
  backWall.position.y = 10;
  scene.add(backWall);

  // Left & right walls (range boundaries)
  const sideWallGeo = new THREE.PlaneGeometry(5, 20);
  const sideWallMat = new THREE.MeshStandardMaterial({
    color: palette.surface,
    roughness: 0.7,
  });

  const leftWall = new THREE.Mesh(sideWallGeo, sideWallMat);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.position.x = -25;
  leftWall.position.y = 10;
  scene.add(leftWall);

  const rightWall = new THREE.Mesh(sideWallGeo, sideWallMat);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.position.x = 25;
  rightWall.position.y = 10;
  scene.add(rightWall);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 20, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Fog
  scene.fog = new THREE.Fog(palette.fog, palette.fogNear, palette.fogFar);
  scene.background = palette.fog;
}

function buildTargets() {
  if (!scene) return;
  const palette = getThemePalette();

  // Near row (z=-10): 5 bullseye dummies
  const dummyPositions = [-8, -4, 0, 4, 8];
  dummyPositions.forEach((x, i) => {
    const dummy = buildDummy(palette);
    dummy.position.set(x, 2, -10);
    dummy.userData = { type: 'dummy', id: i };
    scene!.add(dummy);
    targets.push(dummy);
  });

  // Mid row (z=-20): 7 project cards
  const projectPositions = [-10, -6, -2, 2, 6, 10, 14];
  projectPositions.forEach((x, i) => {
    if (i < projects.length) {
      const card = buildProjectCard(projects[i], palette);
      card.position.set(x, 2, -20);
      card.userData = { type: 'project', index: i, data: projects[i] };
      scene!.add(card);
      targets.push(card);
    }
  });

  // Far row (z=-30): skill orbs
  const skillCategories = ['Languages', 'Frameworks', 'Tools'];
  let orbX = -12;
  let orbIndex = 0;
  skillCategories.forEach((category) => {
    const categorySkills = skills.filter((s) => s.category === category);
    categorySkills.forEach((skill) => {
      const orb = buildSkillOrb(skill, palette);
      orb.position.set(orbX, 2, -30);
      orb.userData = { type: 'skill', category, skill, index: orbIndex };
      scene!.add(orb);
      targets.push(orb);
      orbX += 1.5;
      orbIndex++;
    });
  });
}

function buildDummy(palette: ThemePalette): THREE.Group {
  const group = new THREE.Group();

  // Post
  const postGeo = new THREE.CylinderGeometry(0.05, 0.05, 2);
  const postMat = new THREE.MeshStandardMaterial({ color: 0x8b7355 });
  const post = new THREE.Mesh(postGeo, postMat);
  post.position.y = 1;
  group.add(post);

  // Bullseye (concentric rings)
  const ringRadius = 0.5;
  const colors = [0xff0000, 0xffffff, 0x000000];
  const ringGeometries = [
    new THREE.CircleGeometry(ringRadius, 32),
    new THREE.RingGeometry(ringRadius * 0.6, ringRadius, 32),
    new THREE.RingGeometry(ringRadius * 0.3, ringRadius * 0.6, 32),
  ];

  ringGeometries.forEach((geo, i) => {
    const mat = new THREE.MeshStandardMaterial({
      color: colors[i],
      emissive: new THREE.Color(colors[i]).multiplyScalar(0.3),
    });
    const ring = new THREE.Mesh(geo, mat);
    ring.position.z = 0.01 + i * 0.01;
    group.add(ring);
  });

  return group;
}

function buildProjectCard(proj: any, palette: ThemePalette): THREE.Group {
  const group = new THREE.Group();

  // Stand
  const standGeo = new THREE.BoxGeometry(0.05, 1, 0.2);
  const standMat = new THREE.MeshStandardMaterial({ color: palette.surface });
  const stand = new THREE.Mesh(standGeo, standMat);
  stand.position.z = -0.15;
  stand.position.y = 0.5;
  group.add(stand);

  // Card
  const cardGeo = new THREE.PlaneGeometry(1.5, 2.5);
  const cardCanvas = document.createElement('canvas');
  cardCanvas.width = 300;
  cardCanvas.height = 500;
  const ctx = cardCanvas.getContext('2d')!;

  ctx.fillStyle = palette.bg.getStyle();
  ctx.fillRect(0, 0, 300, 500);

  ctx.fillStyle = palette.accent.getStyle();
  ctx.font = 'bold 32px "DM Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(proj.title, 150, 80);

  ctx.font = '16px "DM Mono", monospace';
  ctx.fillStyle = palette.ink3.getStyle();
  ctx.fillText(`${proj.index}`, 150, 450);

  const cardTexture = new THREE.CanvasTexture(cardCanvas);
  const cardMat = new THREE.MeshStandardMaterial({
    map: cardTexture,
    emissive: palette.accent,
    emissiveIntensity: 0.2,
  });
  const card = new THREE.Mesh(cardGeo, cardMat);
  card.position.z = 0.05;
  group.add(card);

  return group;
}

function buildSkillOrb(skill: any, palette: ThemePalette): THREE.Mesh {
  const orbGeo = new THREE.SphereGeometry(0.35, 16, 16);
  const orbMat = new THREE.MeshStandardMaterial({
    color: palette.accent,
    emissive: palette.accent,
    emissiveIntensity: 0.5,
    roughness: 0.3,
  });
  const orb = new THREE.Mesh(orbGeo, orbMat);
  return orb;
}

function buildWeapon() {
  if (!camera) return;

  weaponGroup = new THREE.Group();
  weaponGroup.position.set(0.4, -0.5, -0.8);
  camera.add(weaponGroup);

  const palette = getThemePalette();

  // Barrel
  const barrelGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.6);
  const barrelMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a });
  const barrel = new THREE.Mesh(barrelGeo, barrelMat);
  barrel.position.set(0, 0, -0.35);
  barrel.rotation.z = Math.PI / 2;
  weaponGroup.add(barrel);

  // Body
  const bodyGeo = new THREE.BoxGeometry(0.1, 0.08, 0.3);
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x2a2a2a });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.set(0, 0, 0);
  weaponGroup.add(body);

  // Stock
  const stockGeo = new THREE.BoxGeometry(0.08, 0.07, 0.2);
  const stockMat = new THREE.MeshStandardMaterial({ color: 0x4a3a2a });
  const stock = new THREE.Mesh(stockGeo, stockMat);
  stock.position.set(0, 0, 0.25);
  weaponGroup.add(stock);

  // Grip
  const gripGeo = new THREE.BoxGeometry(0.05, 0.12, 0.12);
  const gripMat = new THREE.MeshStandardMaterial({ color: 0x3a3a3a });
  const grip = new THREE.Mesh(gripGeo, gripMat);
  grip.position.set(0, -0.08, 0.05);
  weaponGroup.add(grip);

  return weaponGroup;
}

function fire(now: number) {
  if (!isPointerLocked || isPaused || isReloading) return;
  if (currentAmmo <= 0) return;
  if (now - lastFireTime < fireInterval) return;

  lastFireTime = now;
  currentAmmo--;
  shotsFired++;

  const direction = new THREE.Vector3(0, 0, -1);
  direction.applyAxisAngle(new THREE.Vector3(1, 0, 0), pitch);
  direction.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);

  // Apply spread based on recoil
  const spread = recoilAmount * 0.5;
  direction.x += (Math.random() - 0.5) * spread;
  direction.y += (Math.random() - 0.5) * spread;
  direction.normalize();

  // Spawn bullet
  const bulletGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.3);
  const bulletMat = new THREE.MeshStandardMaterial({ color: 0xffd700 });
  const bulletMesh = new THREE.Mesh(bulletGeo, bulletMat);

  const bulletPos = new THREE.Vector3(0, 0, -0.6);
  bulletPos.applyAxisAngle(new THREE.Vector3(1, 0, 0), pitch);
  bulletPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  bulletPos.add(camera!.position);

  bulletMesh.position.copy(bulletPos);
  bulletMesh.rotation.z = Math.PI / 2;
  scene!.add(bulletMesh);

  const bullet: Bullet = {
    mesh: bulletMesh,
    velocity: direction.multiplyScalar(120),
    distanceTraveled: 0,
    maxRange: 80,
  };
  bullets.push(bullet);

  // Muzzle flash
  spawnMuzzleFlash();

  // Recoil
  recoilAmount += 0.008;

  // Update HUD
  updateHUD();
}

function spawnMuzzleFlash() {
  if (!camera) return;
  const flashGeo = new THREE.SphereGeometry(0.15, 8, 8);
  const flashMat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
  const flash = new THREE.Mesh(flashGeo, flashMat);

  const flashPos = new THREE.Vector3(0.2, -0.15, -0.5);
  flashPos.applyAxisAngle(new THREE.Vector3(1, 0, 0), pitch);
  flashPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  flashPos.add(camera.position);

  flash.position.copy(flashPos);
  scene!.add(flash);

  const timeout = setTimeout(() => {
    scene!.remove(flash);
    flashMat.dispose();
    flashGeo.dispose();
  }, 50);
  pendingTimeouts.push(timeout);

  // Light flash
  const light = new THREE.PointLight(0xffaa00, 2, 5);
  light.position.copy(flashPos);
  scene!.add(light);

  const lightTimeout = setTimeout(() => {
    scene!.remove(light);
  }, 50);
  pendingTimeouts.push(lightTimeout);
}

function updateBullets(dt: number) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    bullet.mesh.position.addScaledVector(bullet.velocity, dt);
    bullet.distanceTraveled += bullet.velocity.length() * dt;

    if (bullet.distanceTraveled > bullet.maxRange) {
      scene!.remove(bullet.mesh);
      bullet.mesh.geometry.dispose();
      (bullet.mesh.material as THREE.Material).dispose();
      bullets.splice(i, 1);
      continue;
    }

    // Raycaster from bullet's last position
    const origin = bullet.mesh.position.clone();
    const direction = bullet.velocity.clone().normalize();

    // Check collision with targets
    let hitTarget = false;
    for (const target of targets) {
      if (target.userData.type === 'dummy') {
        const dummyBounds = new THREE.Box3().setFromObject(target);
        if (dummyBounds.containsPoint(origin)) {
          onTargetHit(target, origin);
          hitTarget = true;
          break;
        }
      } else if (target.userData.type === 'project') {
        const cardBounds = new THREE.Box3().setFromObject(target);
        if (cardBounds.containsPoint(origin)) {
          onTargetHit(target, origin);
          hitTarget = true;
          break;
        }
      } else if (target.userData.type === 'skill') {
        const distance = origin.distanceTo(target.position);
        if (distance < 0.4) {
          onTargetHit(target, origin);
          hitTarget = true;
          break;
        }
      }
    }

    if (hitTarget) {
      scene!.remove(bullet.mesh);
      bullet.mesh.geometry.dispose();
      (bullet.mesh.material as THREE.Material).dispose();
      bullets.splice(i, 1);
    }
  }
}

function onTargetHit(target: THREE.Object3D, hitPos: THREE.Vector3) {
  const { type } = target.userData;
  spawnImpactEffect(hitPos);
  shotsHit++;

  if (type === 'dummy') {
    score += 10;
    shakeMesh(target);
    const timeout = setTimeout(() => resetTarget(target), 3000);
    pendingTimeouts.push(timeout);
  } else if (type === 'project') {
    score += 25;
    showProjectPanel(target.userData.data);
    spinCard(target);
    const timeout = setTimeout(() => resetTarget(target), 2000);
    pendingTimeouts.push(timeout);
  } else if (type === 'skill') {
    score += 15;
    showSkillPanel(target.userData.skill);
    popOrb(target);
    const timeout = setTimeout(() => resetTarget(target), 3000);
    pendingTimeouts.push(timeout);
  }

  updateHUD();
}

function spawnImpactEffect(pos: THREE.Vector3) {
  const particleCount = 4 + Math.floor(Math.random() * 3);
  for (let i = 0; i < particleCount; i++) {
    const particleGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const particleMat = new THREE.MeshStandardMaterial({
      color: Math.random() > 0.5 ? 0xff6b00 : 0xffaa00,
    });
    const particle = new THREE.Mesh(particleGeo, particleMat);
    particle.position.copy(pos);
    scene!.add(particle);

    const velocity = new THREE.Vector3(
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 3
    );

    let life = 1;
    const startTime = performance.now();
    const updateParticle = (now: number) => {
      const elapsed = (now - startTime) / 300;
      life = Math.max(0, 1 - elapsed);
      particle.position.addScaledVector(velocity, 0.016);
      (particle.material as THREE.MeshStandardMaterial).opacity = life;
      if (life > 0) {
        requestAnimationFrame(updateParticle);
      } else {
        scene!.remove(particle);
        particleGeo.dispose();
        particleMat.dispose();
      }
    };
    requestAnimationFrame(updateParticle);
  }
}

function shakeMesh(mesh: THREE.Object3D) {
  const originalPos = mesh.position.clone();
  const shakeAmount = 0.1;
  const duration = 200;
  const startTime = performance.now();

  const shake = (now: number) => {
    const elapsed = now - startTime;
    if (elapsed > duration) {
      mesh.position.copy(originalPos);
      return;
    }
    const progress = elapsed / duration;
    mesh.position.x = originalPos.x + (Math.random() - 0.5) * shakeAmount * (1 - progress);
    mesh.position.y = originalPos.y + (Math.random() - 0.5) * shakeAmount * (1 - progress);
    requestAnimationFrame(shake);
  };
  requestAnimationFrame(shake);
}

function spinCard(card: THREE.Object3D) {
  const startTime = performance.now();
  const duration = 2000;
  const originalRotation = card.rotation.clone();

  const spin = (now: number) => {
    const elapsed = now - startTime;
    if (elapsed > duration) {
      card.rotation.copy(originalRotation);
      return;
    }
    const progress = elapsed / duration;
    card.rotation.y = originalRotation.y + Math.PI * 4 * progress;
    requestAnimationFrame(spin);
  };
  requestAnimationFrame(spin);
}

function popOrb(orb: THREE.Object3D) {
  const startScale = orb.scale.clone();
  const startTime = performance.now();
  const duration = 500;

  const pop = (now: number) => {
    const elapsed = now - startTime;
    if (elapsed > duration) {
      orb.scale.copy(startScale);
      return;
    }
    const progress = elapsed / duration;
    const scale = 1 - progress;
    orb.scale.multiplyScalar(scale / orb.scale.x);
    requestAnimationFrame(pop);
  };
  requestAnimationFrame(pop);
}

function resetTarget(target: THREE.Object3D) {
  target.visible = true;
  if (target.userData.type === 'dummy') {
    target.rotation.set(0, 0, 0);
  } else if (target.userData.type === 'project') {
    target.rotation.set(0, 0, 0);
  } else if (target.userData.type === 'skill') {
    target.scale.set(1, 1, 1);
  }
}

function showProjectPanel(proj: any) {
  const panel = document.getElementById('imm-panel')!;
  const content = document.getElementById('imm-panel-content')!;
  content.innerHTML = `<strong>${proj.title}</strong><br>${proj.description || 'Project'}`;
  panel.hidden = false;

  const timeout = setTimeout(() => {
    panel.hidden = true;
  }, 4000);
  pendingTimeouts.push(timeout);
}

function showSkillPanel(skill: any) {
  const panel = document.getElementById('imm-panel')!;
  const content = document.getElementById('imm-panel-content')!;
  content.innerHTML = `<strong>${skill.name}</strong><br>${skill.category}`;
  panel.hidden = false;

  const timeout = setTimeout(() => {
    panel.hidden = true;
  }, 4000);
  pendingTimeouts.push(timeout);
}

function updateHUD() {
  const ammoCurrentEl = document.getElementById('imm-ammo-current');
  const ammoReserveEl = document.getElementById('imm-ammo-reserve');
  const scoreEl = document.getElementById('imm-score-val');
  const accuracyEl = document.getElementById('imm-accuracy');
  const statusEl = document.getElementById('imm-status');
  const magazineEl = document.getElementById('imm-magazine');

  if (ammoCurrentEl) {
    ammoCurrentEl.textContent = String(currentAmmo);
    if (currentAmmo < 10) {
      ammoCurrentEl.style.color = '#ff4444';
    } else if (currentAmmo < 15) {
      ammoCurrentEl.style.color = '#ffaa00';
    } else {
      ammoCurrentEl.style.color = 'var(--accent)';
    }
  }

  if (ammoReserveEl) ammoReserveEl.textContent = String(reserveAmmo);
  if (scoreEl) scoreEl.textContent = String(score);

  const accuracy = shotsFired > 0 ? Math.round((shotsHit / shotsFired) * 100) : 100;
  if (accuracyEl) accuracyEl.textContent = `${accuracy}%`;

  if (magazineEl) {
    let magazineHTML = '';
    const maxRounds = 30;
    for (let i = 0; i < maxRounds; i++) {
      if (i < currentAmmo) {
        magazineHTML += '<span class="imm-round imm-round--loaded"></span>';
      } else {
        magazineHTML += '<span class="imm-round imm-round--empty"></span>';
      }
    }
    magazineEl.innerHTML = magazineHTML;
  }

  if (isReloading && statusEl) {
    const now = performance.now();
    const elapsed = now - lastReloadTime;
    const remaining = Math.max(0, Math.ceil((reloadDuration - elapsed) / 100) * 100);
    statusEl.textContent = remaining > 0 ? 'RELOADING...' : '';
  } else if (statusEl) {
    statusEl.textContent = '';
  }
}

function updateCamera(dt: number) {
  const moveDirection = new THREE.Vector3();
  const forward = new THREE.Vector3(0, 0, -1);
  const right = new THREE.Vector3(1, 0, 0);

  forward.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
  right.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);

  if (keys['w'] || keys['W']) moveDirection.addScaledVector(forward, 1);
  if (keys['s'] || keys['S']) moveDirection.addScaledVector(forward, -1);
  if (keys['a'] || keys['A']) moveDirection.addScaledVector(right, -1);
  if (keys['d'] || keys['D']) moveDirection.addScaledVector(right, 1);

  if (moveDirection.length() > 0) {
    moveDirection.normalize();
    camPos.addScaledVector(moveDirection, 8 * dt);
  }

  // Restrict to firing line area
  camPos.x = Math.max(-5, Math.min(5, camPos.x));
  camPos.z = Math.max(0, Math.min(8, camPos.z));

  camera!.position.copy(camPos);
  camera!.lookAt(
    camera!.position.x + Math.sin(yaw),
    camera!.position.y + Math.tan(pitch),
    camera!.position.z - Math.cos(yaw)
  );

  recoilAmount *= 0.88;
  pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, pitch - recoilAmount * 0.02));
}

function handlePointerMove(e: MouseEvent) {
  if (!isPointerLocked) return;

  const sensitivity = 0.004;
  yaw -= e.movementX * sensitivity;
  pitch += e.movementY * sensitivity;

  pitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, pitch));
}

function handlePointerLockChange() {
  isPointerLocked = document.pointerLockElement === document.getElementById('immersive-canvas');

  const clickToPlay = document.getElementById('imm-click-to-play');
  const pauseOverlay = document.getElementById('imm-pause-overlay');

  if (isPointerLocked) {
    if (clickToPlay) clickToPlay.hidden = true;
    if (pauseOverlay) pauseOverlay.hidden = true;
    isPaused = false;
  } else {
    if (pauseOverlay) pauseOverlay.hidden = false;
    if (clickToPlay) clickToPlay.hidden = false;
    isPaused = true;
  }
}

function handleKeyDown(e: KeyboardEvent) {
  keys[e.key] = true;

  if (e.key === 'r' || e.key === 'R') {
    if (isPointerLocked && !isPaused && !isReloading && reserveAmmo > 0) {
      isReloading = true;
      lastReloadTime = performance.now();
      const timeout = setTimeout(() => {
        currentAmmo = 30;
        reserveAmmo = Math.max(0, reserveAmmo - 30);
        isReloading = false;
        updateHUD();
      }, reloadDuration);
      pendingTimeouts.push(timeout);
      updateHUD();
    }
  }

  if (e.key === 'p' || e.key === 'P') {
    if (isPointerLocked) {
      document.exitPointerLock();
    }
  }

  if (e.key === 'Escape') {
    document.exitPointerLock();
  }
}

function handleKeyUp(e: KeyboardEvent) {
  keys[e.key] = false;
}

function handleMouseDown(e: MouseEvent) {
  if (e.button !== 0) return;
  if (!isPointerLocked) {
    (document.getElementById('immersive-canvas') as HTMLCanvasElement).requestPointerLock();
  }
}

export function initImmersive() {
  const canvas = document.getElementById('immersive-canvas') as HTMLCanvasElement;
  if (!canvas) return;

  // Setup scene
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.copy(camPos);

  renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  // Build world
  buildEnvironment();
  buildTargets();
  buildWeapon();

  // Event listeners
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handlePointerMove);
  document.addEventListener('pointerlockchange', handlePointerLockChange);
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);

  // Window resize
  const handleResize = () => {
    if (!renderer || !camera) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  };
  window.addEventListener('resize', handleResize);

  // Reset HUD
  updateHUD();

  // Animation loop
  isRunning = true;
  let lastTime = performance.now();

  const animate = (now: number) => {
    if (!isRunning) return;
    rafId = requestAnimationFrame(animate);

    const dt = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;

    if (!isPaused) {
      updateCamera(dt);
      updateBullets(dt);
      fire(now);
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  };

  rafId = requestAnimationFrame(animate);
}

export function destroyImmersive() {
  isRunning = false;
  if (rafId) cancelAnimationFrame(rafId);

  // Clear timeouts
  pendingTimeouts.forEach((t) => clearTimeout(t));
  pendingTimeouts.length = 0;

  // Remove event listeners
  const canvas = document.getElementById('immersive-canvas');
  if (canvas) {
    canvas.removeEventListener('mousedown', handleMouseDown);
    canvas.removeEventListener('mousemove', handlePointerMove);
  }
  document.removeEventListener('pointerlockchange', handlePointerLockChange);
  document.removeEventListener('keydown', handleKeyDown);
  document.removeEventListener('keyup', handleKeyUp);
  window.removeEventListener('resize', () => {});

  // Dispose geometry, materials, textures
  if (scene) {
    scene.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.geometry?.dispose();
        if (Array.isArray(obj.material)) {
          obj.material.forEach((m) => m?.dispose());
        } else {
          obj.material?.dispose();
        }
      } else if (obj instanceof THREE.Light) {
        obj.dispose?.();
      }
    });
    scene.clear();
  }

  if (renderer) {
    renderer.dispose();
  }

  // Clear state
  scene = null;
  camera = null;
  renderer = null;
  weaponGroup = null;
  targets.length = 0;
  bullets.length = 0;
  for (const key in keys) delete keys[key];
  isPointerLocked = false;
  isPaused = false;
  isReloading = false;
  score = 0;
  shotsFired = 0;
  shotsHit = 0;
  currentAmmo = 30;
  reserveAmmo = 90;
}

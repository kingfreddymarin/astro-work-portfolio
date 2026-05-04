// Simplex noise implementation for procedural generation
function hash(x: number, y: number): number {
  let h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return h - Math.floor(h);
}

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function perlinNoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;

  const n00 = hash(xi, yi);
  const n10 = hash(xi + 1, yi);
  const n01 = hash(xi, yi + 1);
  const n11 = hash(xi + 1, yi + 1);

  const u = smoothstep(xf);
  const v = smoothstep(yf);

  const nx0 = n00 * (1 - u) + n10 * u;
  const nx1 = n01 * (1 - u) + n11 * u;
  return nx0 * (1 - v) + nx1 * v;
}

interface NoiseOptions {
  scale?: number;
  octaves?: number;
  persistence?: number;
  lacunarity?: number;
  animate?: boolean;
}

export function generateNoiseTexture(
  width: number,
  height: number,
  seed: number = 0,
  options: NoiseOptions = {}
): ImageData {
  const {
    scale = 50,
    octaves = 4,
    persistence = 0.5,
    lacunarity = 2,
  } = options;

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  let maxNoise = 0;
  const noiseValues = new Float32Array(width * height);

  // Generate fractal noise
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let noise = 0;
      let amplitude = 1;
      let frequency = 1;
      let maxValue = 0;

      for (let i = 0; i < octaves; i++) {
        noise += perlinNoise(
          (x / scale / frequency) + seed,
          (y / scale / frequency) + seed
        ) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
      }

      noiseValues[y * width + x] = noise / maxValue;
      maxNoise = Math.max(maxNoise, noise / maxValue);
    }
  }

  // Convert to image data
  for (let i = 0; i < data.length; i += 4) {
    const idx = i / 4;
    const value = noiseValues[idx];
    const normalized = (value + 1) / 2;
    const color = Math.floor(normalized * 255);

    data[i] = color;      // R
    data[i + 1] = color;  // G
    data[i + 2] = color;  // B
    data[i + 3] = 255;    // A
  }

  return imageData;
}

export function initGenerativeBackgrounds() {
  const body = document.body;
  const theme = document.documentElement.getAttribute('data-style') || 'default';
  const seed = Math.floor(Math.random() * 10000);

  // Create canvas for generative background
  const canvas = document.createElement('canvas');
  canvas.id = 'generative-bg';
  canvas.width = 1920;
  canvas.height = 1080;
  canvas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: -1;
    opacity: 0.1;
  `;

  const ctx = canvas.getContext('2d')!;

  // Generate base noise texture
  const imageData = generateNoiseTexture(canvas.width, canvas.height, seed, {
    scale: 80,
    octaves: 5,
    persistence: 0.6,
    lacunarity: 2.2,
  });

  ctx.putImageData(imageData, 0, 0);
  body.appendChild(canvas);

  // Animate scroll-based variation
  let lastScroll = 0;
  window.addEventListener(
    'scroll',
    () => {
      const scroll = window.scrollY;
      if (Math.abs(scroll - lastScroll) > 50) {
        lastScroll = scroll;
        // Subtle animation: shift the noise pattern
        const offset = (scroll * 0.1) % canvas.width;
        canvas.style.transform = `translateY(${offset * 0.5}px)`;
      }
    },
    { passive: true }
  );
}

// Mouse-responsive generative effect
export function initMouseGenerative() {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Subtle gradient follow effect
    const x = (mouseX / window.innerWidth) * 100;
    const y = (mouseY / window.innerHeight) * 100;
    document.documentElement.style.setProperty('--mouse-x', `${x}%`);
    document.documentElement.style.setProperty('--mouse-y', `${y}%`);
  });
}

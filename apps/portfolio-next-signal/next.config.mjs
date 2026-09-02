/** @type {import('next').NextConfig} */
const nextConfig = {
  // The Astro original is a fully static site deployed to Firebase Hosting.
  // Static export keeps that deployment model byte-for-byte compatible.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;

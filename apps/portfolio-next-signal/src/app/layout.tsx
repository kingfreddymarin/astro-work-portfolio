import type { Metadata } from 'next';
import '../styles/global.css';
import '../styles/components.css';
// @ts-expect-error — untyped JS data module shared with the Astro original
import { site, services, faq } from '../data/portfolio.js';

const SITE_URL = 'https://fjml-studio.web.app';

// Engagement-optimized defaults — written for click-through, not just description.
const seoDescription =
  'Independent engineering studio building web apps, AI automation, and embedded systems — production-ready and shipped in days, not months. From SIM applets to AI agent pipelines.';

// Punchier copy for social cards (where curiosity > completeness wins clicks).
const socialTitle = 'We just build stuff — production systems, shipped fast.';
const socialDescription =
  'One studio, team-scale output. Web, AI automation, and embedded engineering delivered at AI-accelerated speed — days instead of weeks.';

const keywords = [
  'web development', 'AI automation', 'LLM integration', 'AI agents',
  'embedded systems', 'SIM applet development', 'full-stack engineering',
  'software studio', 'data platforms', 'document AI', 'remote engineering',
];

const ogImage = `${SITE_URL}/brand/og-image.png`;
const imageAlt = `${site.studio} — ${site.discipline}`;
const orgId = `${SITE_URL}/#organization`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'FJML Studio — Web, AI & Embedded Systems, Shipped Fast',
  description: seoDescription,
  keywords,
  authors: [{ name: site.studio }],
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    siteName: site.studio,
    locale: 'en_US',
    url: SITE_URL,
    title: socialTitle,
    description: socialDescription,
    images: [{ url: ogImage, width: 1200, height: 630, alt: imageAlt, type: 'image/png' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: socialTitle,
    description: socialDescription,
    images: [{ url: ogImage, alt: imageAlt }],
  },
  icons: {
    icon: [
      { url: '/favicon.svg?v=3', type: 'image/svg+xml' },
      { url: '/favicon-32.png?v=3', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16.png?v=3', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico?v=3', sizes: 'any' },
    ],
    apple: [{ url: '/brand/apple-touch-icon.png?v=3', sizes: '512x512' }],
  },
  other: {
    'theme-color': '#0E0F11',
    'color-scheme': 'dark',
  },
};

// Real service offerings → rich-result eligible OfferCatalog.
const offerCatalog = {
  '@type': 'OfferCatalog',
  name: 'Engineering services',
  itemListElement: services.map((s: { title: string; capability: string }) => ({
    '@type': 'Offer',
    itemOffered: { '@type': 'Service', name: s.title, description: s.capability },
  })),
};

// Structured data: studio (Organization + ProfessionalService), the site, and FAQ.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Organization', 'ProfessionalService'],
      '@id': orgId,
      name: site.studio,
      url: `${SITE_URL}/`,
      description: site.tagline,
      slogan: 'We just build stuff.',
      logo: `${SITE_URL}/brand/fjml-mark.svg`,
      image: ogImage,
      email: site.email,
      priceRange: '$$',
      ...(site.linkedin ? { sameAs: [site.linkedin] } : {}),
      address: { '@type': 'PostalAddress', addressLocality: 'Managua', addressCountry: 'NI' },
      areaServed: { '@type': 'Place', name: 'Worldwide' },
      knowsAbout: [
        'Web Development', 'AI & Automation', 'Embedded Systems',
        'SIM Applets', 'LLM Integration', 'Data Platforms', 'Document AI',
      ],
      hasOfferCatalog: offerCatalog,
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: site.studio,
      description: seoDescription,
      publisher: { '@id': orgId },
      inLanguage: 'en',
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#faq`,
      mainEntity: faq.map((f: { q: string; a: string }) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
  ],
};

// Restores site-mode / style before first paint — no FOUC. Must stay inline and
// synchronous in <head>, exactly as in the Astro original.
const prePaintScript = `(function () {
  var m = localStorage.getItem('site-mode');
  if (m === 'lite') document.documentElement.setAttribute('data-mode', 'lite');

  let cfg = {};
  try { cfg = JSON.parse(localStorage.getItem('site-config') || '{}'); } catch (e) {}
  if (cfg.strict) {
    document.documentElement.setAttribute('data-strict', '');
    return; /* strict forces the default brand — ignore any saved style */
  }
  const s = localStorage.getItem('site-style');
  if (s) document.documentElement.setAttribute('data-style', s);
})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: prePaintScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

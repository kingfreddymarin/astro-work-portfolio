export const site = {
  name: "Freddy J. Marin",
  logoText: "FJML",
  title: "Systems Engineer",
  tagline: "Problem solver. I build for anything — hardware, software, or whatever comes next.",
  location: "Managua, Nicaragua · Remote Worldwide",
  email: "freddymarin.jpg@gmail.com",
  github: null,
  linkedin: "https://www.linkedin.com/in/freddymarinn",
  resumeUrl: null,
  available: true,
  heroHeadline: {
    prefix: "I just build",
    highlight: "stuff",
  },
};

export const about = {
  bio: [
    "I'm <strong>Freddy J. Marin</strong>, a Systems Engineer based in Managua, Nicaragua — available worldwide since I work fully remote. I'm a proactive problem-solver with a genuine obsession for building things that work: clean, efficient, and quietly invisible to the people who depend on them.",
    "Over 8 years of building and 5+ in professional engagements, I've shipped 20+ projects to production spanning embedded SIM applets, enterprise data platforms, mobile secure-element communication, and AI-powered document workflows. Most of my work lives under NDA — but the depth and breadth speak for themselves.",
    "What sets me apart right now is my ability to <strong>coordinate AI agents to accelerate development pipelines</strong> — orchestrating LLMs, RPA automations, and directory-monitoring workflows to compress what used to take weeks into days. I thrive in multidisciplinary teams, I plan obsessively, and I deliver.",
    "As the breadth of my work shows, I'm <strong>highly efficient and adaptable</strong> — I ramp fast on unfamiliar stacks, move between domains without losing momentum, and find the shortest credible path from problem to shipped.",
  ],
  stats: [
    { number: "8+",  label: "Years building" },
    { number: "20+", label: "Projects in production" },
    { number: "100%", label: "Project success rate" },
    { number: "60M+", label: "SIM cards running my code" },
  ],
};

export const projects = [
  {
    index: "01",
    title: "Casa Blanca · Bosques del Mar",
    description:
      "Landing page for a vacation rental in Bosques del Mar, Nicaragua — five minutes from Marsella Beach, between jungle and Pacific. Bilingual EN/ES, live Airbnb calendar integration, and a runtime design system with four palettes.",
    tags: ["React", "Vite", "TypeScript", "Firebase", "i18n", "Leaflet"],
    url: "https://casa-blanca-nic.web.app/",
    nda: false,
  },
  {
    index: "02",
    title: "Unified Telecom Dashboard",
    description:
      "Enterprise platform aggregating data from multiple disconnected sources into a single, unified interface — giving operators a complete view across all their applications.",
    tags: ["Angular", "TypeScript", "Node.js", "Express.js", "REST APIs", "PostgreSQL", "SQL", "PL/SQL"],
    url: null,
    nda: true,
  },
  {
    index: "03",
    title: "SIM Applet — 60M+ Cards",
    description:
      "A SIM toolkit applet deployed and running across 60 million+ SIM cards. Handles secure on-card logic and communication at the carrier level.",
    tags: ["JavaCard", "SIM Toolkit", "Cryptography", "Telecom"],
    url: null,
    nda: true,
  },
  {
    index: "04",
    title: "Android Secure Element Bridge",
    description:
      "Android applications communicating directly with the phone's secure element, transmitting TPDU data for secure transaction flows.",
    tags: ["Kotlin", "SDK", "Cryptography", "3GPP", "ETSI"],
    url: null,
    nda: true,
  },
  {
    index: "05",
    title: "AI Document Workflow Engine",
    description:
      "End-to-end document and item management system embedded with AI: extracts, classifies, and routes data through workflows. Uses RPA for non-scrapable apps and monitors email folders, SharePoint, and OneDrive.",
    tags: ["OCR", "Docling", "Python", "AI / LLM", "RPA", "REST API", "Microservices", "PostgreSQL", "SQLAlchemy", "Alembic"],
    url: null,
    nda: true,
  },
  {
    index: "06",
    title: "Web Scraper Platform",
    description:
      "Automated data extraction platform aggregating structured and semi-structured information at scale from multiple live sources.",
    tags: ["Python", "Django", "Web Scraping", "Data Engineering", "Chromium", "Selenium", "PostgreSQL", "SQLAlchemy"],
    url: null,
    nda: true,
  },
  {
    index: "07",
    title: "Cross-Platform Customer Service",
    description:
      "Multi-platform customer service application delivering a consistent, high-quality support experience across web and mobile surfaces.",
    tags: ["React Native", "Node.js", "Cross-Platform", "PostgreSQL", "SQL"],
    url: null,
    nda: true,
  },
  {
    index: "08",
    title: "Chess",
    description:
      "A fully playable chess implementation built for the love of the game. Clean rules engine, move validation, and UI — no libraries, just logic.",
    tags: ["JavaScript", "Game Logic", "Hobby"],
    url: null,
    nda: false,
  },
  {
    index: "09",
    title: "This Portfolio",
    description:
      "Personal portfolio site built from scratch — an editorial project index with expanding entries, marquee hover interactions, reveal animations, and a clean typographic system. Designed and engineered as a living showcase.",
    tags: ["Astro", "TypeScript", "JavaScript", "CSS", "Firebase"],
    url: "https://freddy-marinn.web.app/",
    nda: false,
  },
];

export const skills = [
  {
    category: "Frontend",
    items: ["React.js / Next.js", "Angular 2+", "TypeScript", "HTML & CSS", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js / Express", "Python / Django", "REST & GraphQL", "WebSockets", "Microservices"],
  },
  {
    category: "Mobile & Embedded",
    items: ["Android (Java/Kotlin)", "Secure Element / TPDU", "JavaCard / SIM Toolkit", "NFC / Smart Card"],
  },
  {
    category: "AI & Automation",
    items: ["AI Agent Coordination", "LLM Integration", "RPA Tooling", "Web Scraping", "Document AI"],
  },
  {
    category: "Data & Cloud",
    items: ["PostgreSQL / MySQL", "Redis / MongoDB", "Docker", "AWS / GCP", "CI/CD Pipelines"],
  },
  {
    category: "Practices",
    items: ["System Design", "Multidisciplinary Teams", "Agile / Scrum", "NDA Project Delivery", "Code Review"],
  },
];

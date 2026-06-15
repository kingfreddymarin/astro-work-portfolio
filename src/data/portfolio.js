export const site = {
  studio: "FJML Studio",            // brand / business name — the only identity used
  logoText: "FJML",                 // wordmark
  title: "Systems Engineer",        // studio discipline
  discipline: "Independent Engineering Studio",
  tagline: "An independent engineering studio shipping production systems—from embedded SIM applets to AI agentic pipelines—at AI-accelerated speed.",
  location: "Managua, Nicaragua · Remote Worldwide",
  email: "freddymarin.jpg@gmail.com",
  github: null,
  linkedin: "https://www.linkedin.com/in/freddymarinn",
  resumeUrl: null,
  available: true,
  heroHeadline: {
    prefix: "We just build",
    highlight: "stuff!",
  },
};

export const about = {
  bio: [
    "<strong>FJML Studio</strong> is an independent engineering practice that ships production systems: clean, efficient, and quietly invisible to the people who depend on them.",
    "The studio brings 8+ years and 20+ shipped projects across embedded SIM applets, enterprise data platforms, and AI-powered document workflows — always finding the shortest credible path from problem to shipped.",
    "What sets the studio apart is <strong>AI agent coordination</strong>: orchestrating a custom fleet of LLMs and automation to compress delivery pipelines, shipping in days what traditionally takes weeks. One principal engineer, team-scale output.",
  ],
  stats: [
    { number: "8+",  label: "Years building" },
    { number: "20+", label: "Projects in production" },
    { number: "100%", label: "Project success rate" },
    { number: "60M+", label: "SIM cards running our code" },
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

export const strategicMultipliers = [
  {
    title: "Extreme Domain Adaptability",
    description: "The studio's core advantage: ramping onto specialized industries and legacy stacks at a velocity that exceeds standard engineering teams. From 3GPP telecom protocols to AI agentic workflows, we bridge knowledge gaps in days, not months.",
    impact: "STACK-AGNOSTIC // ZERO-FRICTION RAMPING"
  },
  {
    title: "High-Velocity Orchestration",
    description: "We coordinate a custom fleet of AI agents to bypass boilerplate and research bottlenecks — adapting to new project requirements instantly and delivering complex systems in 30% of the standard time.",
    impact: "70% REDUCTION IN DELIVERY CYCLES"
  },
  {
    title: "Self-Sustaining Delivery",
    description: "Built to operate as a self-contained software business. The studio owns planning, risk mitigation, and execution for systems running on 60M+ devices — zero hand-holding, full accountability.",
    impact: "MISSION-CRITICAL INDEPENDENCE"
  }
];

export const services = [
  {
    id: "web",
    index: "01",
    title: "Web Development",
    capability: "We build robust, production-ready web interfaces and full-stack systems — focused on architectural integrity, performance, and solving the business problem the product was built for.",
    whatItInvolves: "From architectural planning and database design to front-end implementation and cloud deployment, the studio handles the end-to-end lifecycle of web products — scalable, secure, and intuitive for the end-user.",
    metrics: { scalability: 90, performance: 95, accessibility: 85, security: 88 },
    tiers: [
      {
        name: "Budget",
        label: "Quick-Start MVP",
        price: "$1,400",
        marketAvg: "$2,000",
        features: ["Single Page / Landing", "Basic CMS Integration", "Responsive Design", "Standard Deployment"]
      },
      {
        name: "Middle",
        label: "Professional Build",
        price: "$5,600",
        marketAvg: "$8,000",
        features: ["Complex Dashboards", "User Authentication", "API Integrations", "Database Architecture", "CI/CD Setup"]
      },
      {
        name: "High-End",
        label: "Elite Enterprise",
        price: "$14,000+",
        marketAvg: "$20,000+",
        features: ["Custom Design Systems", "High-Concurrency Backend", "Multilingual / i18n", "Advanced Security Audits", "24/7 Support"]
      }
    ]
  },
  {
    id: "ai",
    index: "02",
    title: "AI & Automation",
    capability: "We bridge the gap between complex AI models and practical business automation. We don't just 'use' AI — we orchestrate it to compress timelines and eliminate manual bottlenecks.",
    whatItInvolves: "Identifying high-friction business processes and automating them with AI agents, LLM pipelines, and RPA. We build systems that monitor, classify, and route data autonomously — turning days of work into minutes.",
    metrics: { automation: 95, accuracy: 92, velocity: 98, integration: 85 },
    tiers: [
      {
        name: "Budget",
        label: "Automation Script",
        price: "$2,100",
        marketAvg: "$3,000",
        features: ["Basic Scraping", "Simple API Wrapper", "Single AI Task", "Documentation"]
      },
      {
        name: "Middle",
        label: "Integrated Pipeline",
        price: "$7,000",
        marketAvg: "$10,000",
        features: ["Workflow Automation", "LLM Integration", "RPA Tooling", "Error Handling", "Status Dashboards"]
      },
      {
        name: "High-End",
        label: "Agentic System",
        price: "$21,000+",
        marketAvg: "$30,000+",
        features: ["Autonomous AI Agents", "Complex Document AI", "Multi-Source Monitoring", "Custom Fine-Tuning", "Scalable Infrastructure"]
      }
    ]
  },
  {
    id: "embedded",
    index: "03",
    title: "Mobile & Embedded Systems",
    capability: "Low-level engineering where security and reliability are non-negotiable. The studio has proven experience deploying code to millions of devices where every byte counts.",
    whatItInvolves: "Developing secure communication protocols between mobile applications and hardware. We specialize in Secure Element interfacing, SIM Toolkit applets, and cryptography at the device level.",
    metrics: { security: 99, reliability: 98, optimization: 95, compliance: 90 },
    tiers: [
      {
        name: "Budget",
        label: "Discovery / POC",
        price: "$2,800",
        marketAvg: "$4,000",
        features: ["Technical Feasibility", "Basic Prototype", "Protocol Definition", "Consulting Report"]
      },
      {
        name: "Middle",
        label: "Standard Implementation",
        price: "$10,500",
        marketAvg: "$15,000",
        features: ["Core Applet Dev", "Android/iOS Bridge", "Basic Security Layers", "Field Testing"]
      },
      {
        name: "High-End",
        label: "Mass Deployment",
        price: "$35,000+",
        marketAvg: "$50,000+",
        features: ["Carrier-Grade Security", "Full SIM Toolkit Ops", "Advanced Cryptography", "OTA Update Support", "Enterprise Compliance"]
      }
    ]
  },
  {
    id: "data",
    index: "04",
    title: "Data & Business Intelligence",
    capability: "We turn scattered data into decisions. From the SQL layer underneath to the dashboard leadership actually opens, we build BI that's fast, trustworthy, and answers the question on the first click.",
    whatItInvolves: "We connect disconnected systems into a clean, secure data layer, model it properly, and build dashboards on advanced DAX that hold up as you grow — or audit and rescue the reporting you already have.",
    metrics: { accuracy: 96, performance: 94, clarity: 95, integration: 90 },
    tiers: [
      {
        name: "High-End",
        label: "BI Audit",
        price: "$1,500",
        marketAvg: "$3,000",
        features: ["Data Model & DAX Review", "Performance Diagnosis", "Trust & Accuracy Check", "Prioritized Findings Report", "Roadmap Session"]
      },
      {
        name: "High-End",
        label: "Dashboard Build / Rescue",
        price: "$8,000",
        marketAvg: "$12,000",
        features: ["Proper Data Model", "Advanced DAX Measures", "Decision-Ready Dashboards", "Rescue Existing Reports", "Documented Handoff"]
      },
      {
        name: "High-End",
        label: "Platform & Data Engineering",
        price: "$12,000+",
        marketAvg: "$20,000+",
        features: ["System & Tool Integration", "Secure Auth & Access", "Clean SQL Data Layer", "Unified Reporting Pipeline", "1–3 Month Engagement"]
      }
    ]
  }
];

export const faq = [
  {
    q: "What does FJML Studio do?",
    a: "FJML Studio is an independent engineering studio that builds production web applications, AI automation, and embedded systems — from embedded SIM applets to AI agent pipelines.",
  },
  {
    q: "How fast can you deliver a project?",
    a: "By orchestrating a custom fleet of AI agents alongside senior engineering, the studio compresses delivery cycles by roughly 70% — shipping in days what traditionally takes weeks.",
  },
  {
    q: "Do you work remotely and under NDA?",
    a: "Yes. The studio works remotely worldwide from Managua, Nicaragua, and regularly delivers confidential, NDA-bound work.",
  },
  {
    q: "What technologies do you specialize in?",
    a: "Full-stack web (React, Node, Python), AI & LLM integration, RPA and document AI, and low-level embedded / SIM toolkit engineering on secure elements.",
  },
];

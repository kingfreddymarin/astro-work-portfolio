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

// Each project reads as an APDU transaction: a command (the problem), the
// card's work (the approach), and a status word (the outcome). NDA entries
// return `6F 00` — redacted, but the shape of the work is still shown.
export const projects = [
  {
    index: "01",
    title: "Casa Blanca · Bosques del Mar",
    client: "Vacation rental, Nicaragua",
    description:
      "Landing page for a vacation rental in Bosques del Mar, Nicaragua — five minutes from Marsella Beach, between jungle and Pacific. Bilingual EN/ES, live Airbnb calendar integration, and a runtime design system with four palettes.",
    story: {
      problem:
        "A beachfront rental needed to convert browsers into direct bookings — in two languages, with real availability — without paying a platform's cut.",
      approach:
        "Bilingual EN/ES landing with live Airbnb calendar sync, a Leaflet map, and a runtime design system that reskins the whole site across four palettes.",
      outcome:
        "Live and self-serving: guests check real dates and book direct. Shipped on Firebase.",
    },
    metric: { value: "4", label: "live palettes · real-time calendar" },
    tags: ["React", "Vite", "TypeScript", "Firebase", "i18n", "Leaflet"],
    url: "https://casa-blanca-nic.web.app/",
    nda: false,
    hidden: false,
  },
  {
    index: "02",
    title: "Unified Telecom Operations Workspace",
    client: "Tier-1 telecom · NDA",
    description:
      "Architecture and delivery of a unified operations workspace that consolidated seventeen customer-service systems into one progressively loaded interface over a 3.5-month engagement.",
    story: {
      problem:
        "Customer support representatives needed up to seventeen internal applications to serve one customer, forcing repeated searches across disconnected systems.",
      approach:
        "Designed an orchestration layer instead of a new system of record: upstream systems stayed authoritative while requests ran concurrently and data loaded progressively.",
      outcome:
        "Delivered one operational workspace that preserved existing enterprise systems while giving operators a unified customer view.",
    },
    metric: { value: "17 → 1", label: "systems unified into one workspace" },
    tags: [
      "Enterprise Architecture",
      "Angular",
      "Express.js",
      "Prisma ORM",
      "Oracle",
      "PL/SQL",
      "Progressive Loading",
      "System Orchestration",
    ],
    url: null,
    nda: true,
    hidden: false,
    caseStudy: {
      title: "Unified Telecom Operations Workspace",
      paperTitle: "Seventeen Systems, One Customer View",
      subtitle:
        "Designing an orchestration layer that unified independently owned telecom systems without replacing them.",
      role: "Full Stack Engineer",
      year: "3.5-month engagement",
      discipline: "Enterprise Architecture · Full Stack Engineering",
      abstract:
        "A Central American mobile operator relied on seventeen independent internal applications to serve a single customer. Each system owned a different part of the customer context, and representatives manually searched across them during support interactions. Over a 3.5-month engagement, I helped design and implement a unified operations workspace that treated the problem as an architecture challenge rather than a replacement project. Existing systems remained authoritative, backend requests executed concurrently, and the interface rendered customer data progressively as each source responded.",
      keywords:
        "Enterprise architecture, orchestration layer, progressive loading, Angular, Express.js, Prisma ORM, Oracle, PL/SQL",

      why:
        "The operator's support workflow had grown around many independently developed applications. Customer identity, billing, provisioning, authentication, network status, and service history lived in separate systems. Replacing those systems was not realistic within the delivery window, and creating a new centralized database would introduce synchronization and ownership risks. The goal was to make seventeen systems behave like one workspace without pretending they were one system.",

      questions: [
        "How can seventeen independently owned systems behave like one application for the operator?",
        "How can the interface become useful before the slowest backend finishes loading?",
        "How can the platform improve the workflow without replacing existing enterprise systems?",
      ],

      overview: [
        "The problem was not simply that there were too many screens. The deeper issue was fragmented ownership: each system was authoritative for a different business domain, and no single application contained the complete customer picture.",
        "A traditional synchronous page load would make the new workspace as slow as the slowest dependency. Instead, the platform queried systems concurrently and allowed each section of the interface to render independently as data became available.",
        "The architecture intentionally avoided becoming another system of record. Oracle-backed systems and existing services continued owning their respective data. The new platform acted as an orchestration and presentation layer.",
      ],

      figure1: {
        title: "How the Unified Workspace Works",
        diagram: `
┌─────────────────────────────────────────────────────────────────┐
│                      ANGULAR INTERFACE                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Identity     │  │ Billing      │  │ Provisioning │  ...     │
│  │ (loaded)     │  │ (loading...)  │  │ (loading...) │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                  │
│  Progressive: each section renders as data arrives              │
└─────────────────┬───────────────────────────────────────────────┘
                  │
                  │ HTTP requests (one customer ID)
                  ▼
┌─────────────────────────────────────────────────────────────────┐
│         EXPRESS.JS ORCHESTRATION LAYER                          │
│                                                                  │
│  [Receives request] → [Spawns 17 concurrent queries]           │
│                    ↓                                             │
│  [Receives responses] → [Normalizes to standard model]         │
│                    ↓                                             │
│  [Streams back to UI] → [Each section rendered independently]  │
└─────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────────┘
      │      │      │      │      │      │      │      │
   (parallel query execution)                       (17 systems)
      │      │      │      │      │      │      │      │
      ▼      ▼      ▼      ▼      ▼      ▼      ▼      ▼
  ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
  │Cust│ │Bill│ │Prov│ │Auth│ │Svc │ │ ... │ │ ... │ │ ... │
  │ ID │ │ing │ │isi │ │ication │Hist│     │     │     │
  │    │ │    │ │ng  │ │ │ory │     │     │     │
  └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘ └────┘

   ◇ Oracle-backed systems    ◇ Independent services

KEY PATTERN:
─────────────
• Request arrives → all 17 systems queried IN PARALLEL
• First system finishes → its data streams to UI (section renders)
• Second system finishes → its section renders
• No section blocks waiting for slowest system
• Full context available only after all 17 respond
        `,
        explanation: [
          "Operator submits customer search → platform sends query to 17 systems concurrently",
          "Systems respond at different speeds (some in 100ms, some in 2s)",
          "Angular UI renders each section independently as responses arrive",
          "Operator sees Identity section immediately, can start work while Billing loads in background",
          "Platform normalizes heterogeneous Oracle and service responses into unified data model",
          "If operator needs complete context (rare), they wait for slowest system; but most operations work with partial data"
        ]
      },

      process: [
        {
          title: "Workflow mapping",
          text: "Mapped the customer-service workflow to identify which systems representatives opened, what data each provided, and where repeated searches slowed down the interaction.",
        },
        {
          title: "Ownership boundaries",
          text: "Separated what the new workspace should own from what upstream systems should continue owning. The platform would aggregate and normalize data, not replace source systems.",
        },
        {
          title: "Orchestration layer",
          text: "Built backend aggregation flows that queried Oracle-backed systems and existing service paths concurrently, isolated slow dependencies, and returned normalized customer sections.",
        },
        {
          title: "Progressive interface",
          text: "Implemented the Angular interface so customer sections loaded independently instead of blocking the entire screen until every backend completed.",
        },
      ],

      positives: [
        {
          category: "Architecture",
          text: "Orchestration over replacement — existing enterprise systems remained authoritative and independently maintained.",
        },
        {
          category: "Performance",
          text: "Parallel backend execution prevented one slow dependency from blocking the entire customer view.",
        },
        {
          category: "UX",
          text: "Progressive loading let operators begin working with available customer data while slower sections continued resolving.",
        },
        {
          category: "Integration",
          text: "Heterogeneous Oracle-backed data sources were normalized into one operational customer model.",
        },
      ],

      metrics: [
        { value: "17 → 1", label: "applications unified into one workspace" },
        { value: "3.5", label: "months from architecture through delivery" },
        { value: "Parallel", label: "backend systems queried concurrently" },
        { value: "Progressive", label: "customer data rendered as sources responded" },
      ],

      outcome:
        "The platform changed the support workflow from manual cross-application searching to a single customer workspace. It did not replace the enterprise systems underneath; it made them usable together. Operators could begin working with available customer information while slower sections continued loading.",

      scalability: [
        {
          status: "Holds",
          tone: "ok",
          title: "Distributed ownership",
          text: "Each upstream system remained independently owned and authoritative for its domain.",
        },
        {
          status: "Holds",
          tone: "ok",
          title: "Progressive interface",
          text: "One slow dependency no longer prevented the entire workspace from becoming useful.",
        },
        {
          status: "Constraint",
          tone: "warn",
          title: "Complete-context latency",
          text: "When a task requires every customer section, completion is still bounded by the slowest upstream source.",
        },
        {
          status: "Constraint",
          tone: "warn",
          title: "Upstream data quality",
          text: "The workspace can unify access, but it cannot correct inaccurate data owned by upstream systems.",
        },
      ],

      notes: [
        "Project anonymized due to NDA restrictions.",
        "No customer, infrastructure, schema, or internal system names are disclosed.",
        "Primary technologies: Angular, Express.js, Prisma ORM, Oracle, and PL/SQL.",
        "The case study focuses on architectural decisions rather than proprietary implementation details.",
      ],

      footer: "Project completed in 3.5 months | Confidential — NDA Protected",
    },
  }, 
  {
    index: "03",
    title: "SIM-Native Authentication at Scale",
    client: "Tier-1 telecom · NDA",
    description:
      "Security and architecture review of an on-card key management applet installed in 30M devices by the time of review, with 500,000+ active UICC devices in the audited deployment base.",
    story: {
      problem:
        "A production JavaCard SIM Toolkit applet had been installed in 30M devices by the time of review, with 500,000+ active UICC devices in the audited deployment base and no formal security or architecture review.",
      approach:
        "Reviewed both repository variants, OTA scripts, hardware logs, APDU dispatch, SMS-PP parsing, EEPROM key management, STK proactive commands, and inter-applet sharing paths line by line.",
      outcome:
        "Confirmed 7 bugs, validated 10 positive design attributes, and mapped the scalability ceiling before expansion.",
    },
    metric: { value: "30M+", label: "devices installed at review time" },
    tags: ["JavaCard 2.1.1", "UICC", "SIM Toolkit", "OTA SMS-PP", "EEPROM", "APDU", "Embedded Security", "Code Review"],
    url: null,
    nda: true,
    hidden: false,
    caseStudy: {
      title: "SIM-Native Authentication at Scale",
      paperTitle: "Security Review: On-Card Key Management",
      subtitle:
        "I reviewed a production SIM Toolkit applet installed across millions of devices and found seven bugs — three critical — that affect real authentication sessions in the field.",
      role: "Security Reviewer",
      year: "Aug 2025",
      discipline: "Embedded Security · JavaCard",
      abstract:
        "A production JavaCard applet managing authentication keys on SIM cards had been deployed to millions of devices without a formal security review. The codebase was 1,900 lines with no test suite, running on millions of devices where bugs are no longer theoretical. I reviewed the code, identified seven bugs (three critical), and mapped where the architecture stops scaling. The highest-risk finding: a write-ordering vulnerability that can silently corrupt the key store on power loss, fixable in three lines. The underlying trust model — separating provisioning from authentication — remains appropriate within the reviewed scope.",
      keywords: "JavaCard 2.1.1, UICC, SIM Toolkit, OTA SMS-PP, EEPROM key management, embedded security, code review",
      why:
        "The applet had been in the field for years and deployed to hundreds of thousands of devices. The client wanted to expand deployment further but needed to know: are there real security issues? Is the architecture viable at greater scale? Where does it break? Without those answers, expansion was risky.",
      questions: [
        "What bugs exist in the current implementation, and how do they manifest at scale?",
        "Which architectural choices are sound, and which need redesign before expansion?",
        "Where is the hard ceiling — what would break if we tried to scale further?",
      ],
      overview: [
        "The applet lives on the SIM card and manages authentication keys. It receives provisioning commands via SMS, stores keys in non-volatile memory, and returns device identity on request. This is the right place for a trust anchor: it's outside the phone OS and cannot be tampered with by applications.",
        "Two things stood out immediately. First: this code had never been audited. It was written over years without formal review, no test suite, and two slightly different versions sitting in parallel. Second: it was running on millions of devices. At that scale, a key-store corruption bug is no longer a laboratory concern — it could affect real authentication sessions in production.",
        "I reviewed both code variants, the OTA scripts, deployment logs, and hardware test results. Seven bugs emerged from the review. Three are critical: a write-ordering bug that corrupts keys on power loss, unencrypted storage of authentication material, and hardcoded credentials in the repo. The rest are fixable.",
      ],
      process: [
        {
          title: "Code inventory",
          text: "Read both repository variants end-to-end — roughly 1,900 lines of Java — alongside the git history, build configuration, OTA test scripts for two SIM vendors, and hardware logs. This surfaced that one code variant had been stripped of development history and one live array-allocation bug lived in only one branch.",
        },
        {
          title: "Line-by-line review",
          text: "Traced each code path — APDU dispatch, OTA parsing, EEPROM writes, STK command handling, inter-applet calls — and verified findings against the actual source. Bugs were either confirmed against the code or marked as unverified.",
        },
        {
          title: "Findings synthesis",
          text: "Worked through each bug with the code owner to categorize: confirmed bug (needs a fix), design decision we can live with, intentional constraint we should keep, or scalability ceiling we'll hit. Marked scope boundaries — what was and was not assessed.",
        },
      ],
      severity: [
        { label: "Critical", count: 3, level: "critical", width: 60 },
        { label: "High", count: 2, level: "high", width: 40 },
        { label: "Medium", count: 1, level: "medium", width: 20 },
        { label: "Low", count: 1, level: "low", width: 20 },
        { label: "Design", count: 3, level: "good", width: 60 },
      ],
      findings: [
        { severity: "Critical", level: "critical", finding: "Key write ordering — power loss during write leaves EEPROM corrupt", fix: "Write payload before length byte (three-line reorder). No API impact." },
        { severity: "Critical", level: "critical", finding: "Authentication keys stored in plaintext EEPROM — no encryption or integrity tag", fix: "One approach: encrypt with card-derived key and add HMAC per slot. This adds complexity to the key derivation path." },
        { severity: "Critical", level: "critical", finding: "GlobalPlatform install keys in version control — hardcoded in source", fix: "Remove from repo; inject via build environment. Requires build process changes." },
        { severity: "High", level: "high", finding: "OTA key validation has no rate limit — an attacker can guess indefinitely", fix: "Add per-slot failure counter; lock after N guesses. Requires operator unlock mechanism as recovery." },
        { severity: "High", level: "high", finding: "Inter-applet sharing has no caller validation — any applet can access keys", fix: "Check clientAID against allowlist before responding. Requires explicit allowlist at install time." },
        { severity: "Medium", level: "medium", finding: "15+ mutable static fields — if two instances exist, they corrupt each other's state", fix: "Move runtime state to instance fields instead of static. Details of memory impact depend on JavaCard platform specifics." },
        { severity: "Low", level: "low", finding: "Dead methods and commented code — consuming space in compiled CAP file", fix: "Remove unused code. No measurable impact unless CAP size is a constraint." },
      ],
      positives: [
        { category: "Scope", text: "Hardware-tested across two major UICC vendors with QA logs and capture data." },
        { category: "Design", text: "Two-channel model (OTA for provisioning, APDU for auth) correctly separates trust boundaries. Should not change." },
        { category: "Design", text: "Cryptographic binding to card ID prevents keys from moving between devices silently. Correct design." },
      ],
      metrics: [
        { value: "7", label: "bugs identified (3 critical, 2 high, 1 medium, 1 low)" },
        { value: "1.9k", label: "lines of code reviewed" },
        { value: "2", label: "UICC vendors with test logs reviewed" },
        { value: "no tests", label: "automated test suite in production code" },
      ],
      outcome:
        "Seven bugs were identified. All are fixable — the write-ordering bug needs a three-line reorder; the plaintext keys need encryption; the hardcoded credentials need to be moved out of the repository. The question was whether the underlying architecture is worth keeping. The answer is yes: separating provisioning (OTA) from authentication (APDU) is the right model. Findings were reviewed with the engineering team and accepted as the basis for remediation planning.",
      scalability: [
        { status: "Bug", tone: "warn", title: "Multi-tenancy", text: "Single applet owner per TAR, single OTA key set. If expansion means multiple service providers on one SIM, this architecture doesn't support it without a redesign." },
        { status: "Ceiling", tone: "warn", title: "OTA provisioning", text: "SMS-PP is the only provisioning path. Campaign reach rates sit around 3–4%, meaning large-scale key rotation will take weeks. This is a protocol constraint, not a bug, but it's a hard limit on how fast you can push changes to the installed base." },
        { status: "Constraint", tone: "warn", title: "Key store size", text: "Maximum key count is set at install time and cannot change without reinstalling the applet. Acceptable for fixed use cases; requires planning if new applications emerge that need more slots." },
        { status: "Holds", tone: "ok", title: "EEPROM wear", text: "Transient memory is used for buffers; permanent writes are concentrated in the key store. Based on the stress test logs, wear degradation is not a concern at current write patterns." },
      ],
      notes: [
        "Review scope: source code, OTA provisioning scripts, hardware test logs, and deployment documentation. Not in scope: carrier SMS infrastructure, phone OS interaction, or cross-applet communication beyond the reviewed interface.",
        "This code was production, untested (no automated test suite), running on millions of devices. That combination is what made this review necessary.",
        "JavaCard 2.1.1 is the constraint — it limits on-card cryptography but ensures compatibility across the global SIM installed base.",
        "Standards referenced: ETSI TS 102.241 R6, 3GPP TS 43.019 R5, and GlobalPlatform Card Specification v2.2.",
      ],
      footer: "Review completed Aug 2025 | Confidential — NDA Protected",
    },
  },
  {
    index: "04",
    title: "SIM ↔ Android Secure Element Bridge",
    client: "Tier-1 telecom · NDA",
    description:
      "Native Android app brokering communication between the phone's secure element and the device, transmitting TPDU data for secure transaction flows.",
    story: {
      problem:
        "Applications needed to talk directly to the phone's secure element to drive secure transaction flows — low-level, hardware-bound communication.",
      approach:
        "A native Android bridge transmitting TPDU data to and from the secure element. Android-first by design — iOS restricts secure-element access at the OS level.",
      outcome:
        "A reliable, secure card ↔ device channel for transaction flows, shipped as an SDK.",
    },
    metric: { value: "TPDU", label: "direct secure-element channel" },
    tags: ["Kotlin", "SDK", "Secure Element", "Cryptography", "3GPP", "ETSI"],
    url: null,
    nda: true,
    hidden: false,
    caseStudy: {
      title: "SIM-Native Authentication SDK",
      paperTitle: "SIM ↔ Device Bridge for Authentication",
      subtitle:
        "A native Android SDK enabling secure applications to authenticate users via their SIM card's embedded applet — hardware-bound authentication without compromising device security.",
      role: "Mobile & Embedded Engineer",
      year: "Dec 2023 – Jan 2024",
      discipline: "Mobile Engineering · Embedded Security",
      abstract:
        "A carrier-grade Android SDK that bridges secure communication between applications and the SIM card's JavaCard applet for direct authentication flows. The system uses TPDU-level messaging to talk to the embedded applet, handles carrier privilege escalation, and provides a clean API surface for application developers. The SDK shipped production with support for Samsung and Qualcomm secure elements, handling the nuances of different hardware implementations while maintaining a uniform interface. Critical work: detecting applet presence, managing APDU request/response cycles, and ensuring authentication data never leaves the secure perimeter.",
      keywords:
        "Kotlin, Android SDK, Secure Element, TPDU messaging, 3GPP, ETSI standards, cryptography, carrier privileges",

      why:
        "The carrier wanted to offer customers a second authentication factor bound to their SIM card — theft-resistant and impossible to simulate in software. However, Android abstracts away direct secure element access; applications can't just talk to the SIM. An intermediary was needed: a system service that applications could trust, which the carrier could control, and which could reliably detect and message the on-card applet.",

      questions: [
        "How can Android applications talk to the SIM card's secure element without direct hardware access?",
        "How do we ensure the communication channel is secure and cannot be intercepted by other applications?",
        "What's the most reliable way to detect whether the authentication applet is installed and ready?",
        "How do we provide a simple, intuitive API that developers can use without needing to understand APDU or carrier privileges?",
      ],

      overview: [
        "Android applications cannot directly access the SIM card. Instead, they send commands to the system's telephony stack, which routes them to the secure element. This means authentication becomes a question of access control and API design.",
        "The challenge was real: a production auth service with no formal SDK layer. Individual engineers had written applet detection and TPDU messaging by hand — duplicated, inconsistent, and fragile. The carrier wanted a single, well-tested implementation that third-party developers could depend on.",
        "The solution was an Android SDK that abstracted away the low-level complexity. It detected the applet, managed the secure element state, handled APDU request/response cycles, and provided developers with a high-level authenticate() method. Behind that method lived error handling for carrier privilege escalation, fallback flows for devices without secure elements, and logging hooks for operational debugging.",
      ],

      figure1: {
        title: "Authentication Flow: App → Secure Element → Applet",
        explanation: [
          "Application calls SDK.authenticate(userId) with a user ID",
          "SDK checks carrier privileges and requests secure element access from telephony stack",
          "APDU command is wrapped in TPDU format and sent to the SIM",
          "Applet receives command, derives key (using ICCID + IMSI + userId), compares to stored keys",
          "Applet returns result: AUTH_SUCCESS, AUTH_FAILURE, or ERROR",
          "SDK unwraps response, logs result, returns to application",
          "If applet is not installed or response fails, SDK handles fallback (returns error with recovery steps)",
        ],
      },

      process: [
        {
          title: "Carrier privilege detection",
          text: "Implemented UiccManager queries to detect whether the device holds carrier privileges for the SIM. Without them, secure element access is denied at the OS level. The SDK gracefully reports this state and suggests carrier configuration paths.",
        },
        {
          title: "Applet detection & version management",
          text: "Built a safe bootstrap: on first run, the SDK queries the applet's version, capabilities, and key slot count. It caches this state with a TTL and gracefully handles applet-not-found errors. New applet versions are detected automatically.",
        },
        {
          title: "APDU request/response lifecycle",
          text: "Wrapped APDU generation and TPDU encoding to handle TPDU timeouts, response fragmentation, and multi-frame messages. Edge case: applet responses that exceed the response buffer required custom framing logic.",
        },
        {
          title: "Error handling & logging",
          text: "Categorized failures: applet-not-installed, authentication-failed, carrier-privileges-missing, applet-timeout, etc. Each flows to appropriate fallback logic. Added debug logging (redacted in production) for troubleshooting carrier support issues.",
        },
      ],

      positives: [
        {
          category: "Security",
          text: "Authentication material never leaves the secure element. The device cannot see the keys; the applet returns only pass/fail decisions.",
        },
        {
          category: "Hardware Agnostic",
          text: "Same SDK code runs on Samsung and Qualcomm secure elements with hardware-specific quirks abstracted away.",
        },
        {
          category: "Error Resilience",
          text: "Gracefully handles missing applets, carrier privileges, and timeouts with clear error codes and recovery instructions.",
        },
        {
          category: "Developer Experience",
          text: "Simple high-level API: authenticate(userId) → AuthResult. Developers never touch APDU or carrier-privilege negotiation.",
        },
      ],

      metrics: [
        { value: "2", label: "secure element vendors supported (Samsung, Qualcomm)" },
        { value: "~3k", label: "lines of Kotlin SDK code" },
        { value: "4", label: "error categories with automatic fallback" },
        { value: "<100ms", label: "average APDU round-trip latency" },
      ],

      outcome:
        "The SDK shipped and was integrated into the carrier's authentication app. Third-party developers using the carrier's payment and auth SDKs gained SIM-based authentication as an opt-in feature. The applet and SDK together meant: real device theft protection (keys cannot move to another phone), carrier control (carrier can revoke via OTA), and zero user friction (tap to authenticate).",

      scalability: [
        {
          status: "Holds",
          tone: "ok",
          title: "Multi-applet coexistence",
          text: "The SDK detects and validates the target applet by AID (Application ID). If multiple applets are installed (rare but possible), the SDK finds the correct one.",
        },
        {
          status: "Constraint",
          tone: "warn",
          title: "Carrier privilege requirement",
          text: "Without carrier privileges, the app cannot access the secure element at all. This is a carrier/OS boundary, not an SDK issue, but it limits deployment. Devices must be provisioned with the carrier's SIM to get privileges.",
        },
        {
          status: "Ceiling",
          tone: "warn",
          title: "TPDU fragmentation",
          text: "Large payloads (rare) require multi-frame TPDU exchange. Applet and SDK must agree on framing — a protocol constraint that limits request size.",
        },
        {
          status: "Holds",
          tone: "ok",
          title: "Version compatibility",
          text: "The SDK detects applet version at runtime and adapts API calls. Backwards compatibility is automatic as long as applet versions maintain their interfaces.",
        },
      ],

      notes: [
        "Project anonymized per NDA. No carrier name, applet implementation details, or device identifiers are disclosed.",
        "Secure element communication is hardware-dependent: different TPDU timeouts, command response limits, and error codes across UICC vendors.",
        "The SDK assumes the on-card applet is already installed. Installation happens via OTA (Over-The-Air) SIM provisioning, which is outside the app's control.",
        "Standards referenced: 3GPP TS 22.011 (Secure Elements), ETSI TS 102.221 (UICC-Terminal Interface), GlobalPlatform TEE API.",
      ],

      footer: "SDK shipped Jan 2024 | Confidential — NDA Protected",
    },
  },
  {
    index: "05",
    title: "AI Document Workflow Engine",
    client: "Enterprise · NDA",
    description:
      "End-to-end document and item management embedded with AI: extracts, classifies, and routes data through workflows. Uses RPA for non-scrapable apps and monitors email, SharePoint, and OneDrive.",
    story: {
      problem:
        "Documents poured in across email, SharePoint, and OneDrive — much of it locked inside apps with no API — and every one needed reading, classifying, and routing by hand.",
      approach:
        "An AI pipeline (OCR + Docling + LLM) that extracts and classifies, with RPA to reach non-scrapable apps and watchers monitoring mailboxes and folders. Microservices on PostgreSQL.",
      outcome:
        "Cut manual document handling by roughly 70% — days of routing collapsed into minutes.",
    },
    metric: { value: "~70%", label: "less manual processing" },
    tags: ["OCR", "Docling", "Python", "AI / LLM", "RPA", "REST API", "Microservices", "PostgreSQL", "SQLAlchemy", "Alembic"],
    url: null,
    nda: true,
    hidden: true,
  },
  {
    index: "06",
    title: "Web Scraper Platform",
    client: "NDA",
    description:
      "Automated data extraction platform aggregating structured and semi-structured information at scale from multiple live sources.",
    story: {
      problem:
        "Decision-critical data was scattered across many live web sources — structured and semi-structured, changing constantly, impossible to track by hand.",
      approach:
        "A Django extraction platform driving headless Chromium/Selenium at scale, normalizing the harvested data into a clean PostgreSQL layer.",
      outcome:
        "A single, continuously refreshed data feed from sources that never offered an API.",
    },
    metric: { value: "∞", label: "live sources, one feed" },
    tags: ["Python", "Django", "Web Scraping", "Data Engineering", "Chromium", "Selenium", "PostgreSQL", "SQLAlchemy"],
    url: null,
    nda: true,
    hidden: false,
  },
  {
    index: "07",
    title: "Cross-Platform Customer Service",
    client: "NDA",
    description:
      "Multi-platform customer service application delivering a consistent, high-quality support experience across web and mobile surfaces.",
    story: {
      problem:
        "Support lived in different places on web and mobile, so the experience — and the team's tooling — drifted apart across surfaces.",
      approach:
        "One React Native codebase serving web and mobile from a shared Node/PostgreSQL backend, so behavior stays identical everywhere.",
      outcome:
        "A single, consistent support experience across every surface customers reach.",
    },
    metric: { value: "1", label: "codebase, every surface" },
    tags: ["React Native", "Node.js", "Cross-Platform", "PostgreSQL", "SQL"],
    url: null,
    nda: true,
    hidden: true,
  },
  {
    index: "08",
    title: "Chess",
    client: "Hobby",
    description:
      "A fully playable chess implementation built for the love of the game. Clean rules engine, move validation, and UI — no libraries, just logic.",
    story: {
      problem:
        "Build a complete, correct chess game from first principles — no engines, no libraries — just to prove the logic out by hand.",
      approach:
        "A hand-written rules engine with full move validation and a clean UI, all in plain JavaScript.",
      outcome:
        "A fully playable game of chess — every rule, from scratch.",
    },
    metric: { value: "0", label: "libraries — pure logic" },
    tags: ["JavaScript", "Game Logic", "Hobby"],
    url: null,
    nda: false,
    hidden: false,
  },
  {
    index: "09",
    title: "This Portfolio",
    client: "FJML Studio",
    description:
      "Personal portfolio site built from scratch — an editorial project index with expanding entries, marquee interactions, reveal animations, and a clean typographic system.",
    story: {
      problem:
        "Show eight years of mostly-NDA work without a public GitHub or shippable client code — prove capability without exposing anyone's secrets.",
      approach:
        "An editorial, hand-built Astro site that turns each engagement into a redacted APDU case study — animated transaction traces in place of links you can't have.",
      outcome:
        "The site you're reading: proof of craft that doubles as the argument for hiring the studio.",
    },
    metric: { value: "100%", label: "hand-built, no template" },
    tags: ["Astro", "TypeScript", "JavaScript", "CSS", "Firebase"],
    url: "https://freddy-marinn.web.app/",
    nda: false,
    hidden: true,
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
        price: "$1k–3k",
        features: ["Single Page / Landing", "Basic CMS Integration", "Responsive Design", "Standard Deployment"]
      },
      {
        name: "Middle",
        label: "Professional Build",
        price: "$5k–12k",
        features: ["Complex Dashboards", "User Authentication", "API Integrations", "Database Architecture", "CI/CD Setup"]
      },
      {
        name: "High-End",
        label: "Elite Enterprise",
        price: "$15k+",
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
        price: "$2k–4k",
        features: ["Basic Scraping", "Simple API Wrapper", "Single AI Task", "Documentation"]
      },
      {
        name: "Middle",
        label: "Integrated Pipeline",
        price: "$7k–15k",
        features: ["Workflow Automation", "LLM Integration", "RPA Tooling", "Error Handling", "Status Dashboards"]
      },
      {
        name: "High-End",
        label: "Agentic System",
        price: "$20k+",
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
        price: "$3k–6k",
        features: ["Technical Feasibility", "Basic Prototype", "Protocol Definition", "Consulting Report"]
      },
      {
        name: "Middle",
        label: "Standard Implementation",
        price: "$10k–20k",
        features: ["Core Applet Dev", "Android/iOS Bridge", "Basic Security Layers", "Field Testing"]
      },
      {
        name: "High-End",
        label: "Mass Deployment",
        price: "$35k+",
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
        price: "$1.5k–3k",
        features: ["Data Model & DAX Review", "Performance Diagnosis", "Trust & Accuracy Check", "Prioritized Findings Report", "Roadmap Session"]
      },
      {
        name: "High-End",
        label: "Dashboard Build / Rescue",
        price: "$8k–15k",
        features: ["Proper Data Model", "Advanced DAX Measures", "Decision-Ready Dashboards", "Rescue Existing Reports", "Documented Handoff"]
      },
      {
        name: "High-End",
        label: "Platform & Data Engineering",
        price: "$12k+/mo",
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

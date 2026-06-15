// ─────────────────────────────────────────────────────────────────────────────
// Build configurator — catalog + pricing logic (UI lives in Configurator.astro).
//
// Philosophy: this is NOT a feature calculator. The user is *designing their
// software*; the estimate is a consequence of the value they're building.
// Per-feature dollar amounts are never shown — only effort. Pricing logic is
// fully separated from the UI and trivial to extend: add a feature object,
// done.
// ─────────────────────────────────────────────────────────────────────────────

// What are you building? — sets the tone + gently recommends features.
export const goals = [
  { id: 'mvp',         label: 'Launch an MVP',          blurb: 'Get a real product in front of users, fast.',           recommends: ['auth_plus', 'payments', 'dashboards'] },
  { id: 'automate',    label: 'Automate my business',   blurb: 'Replace manual, repetitive work with systems.',         recommends: ['automation', 'integrations', 'reports', 'ai'] },
  { id: 'ecommerce',   label: 'Sell products online',   blurb: 'Take orders and payments at scale.',                    recommends: ['payments', 'inventory', 'search', 'email'] },
  { id: 'spreadsheets',label: 'Replace spreadsheets',   blurb: 'Move from fragile sheets to a real data layer.',        recommends: ['reports', 'roles', 'docs', 'dashboards'] },
  { id: 'saas',        label: 'Build a SaaS',           blurb: 'A multi-user product you can grow and bill.',           recommends: ['payments', 'roles', 'portal', 'dashboards'] },
  { id: 'internal',    label: 'Internal platform',      blurb: 'A tool your team runs the business on.',                recommends: ['roles', 'reports', 'staff_portal', 'automation'] },
  { id: 'booking',     label: 'Booking platform',       blurb: 'Scheduling, availability, reminders.',                  recommends: ['scheduling', 'notifications', 'payments', 'portal'] },
  { id: 'marketplace', label: 'Marketplace',            blurb: 'Connect two sides with trust and payments.',            recommends: ['payments', 'search', 'chat', 'roles'] },
  { id: 'ai_app',      label: 'AI-powered app',         blurb: 'Put a model to work on a real workflow.',               recommends: ['ai', 'automation', 'docs', 'search'] },
  { id: 'other',       label: 'Something else',         blurb: "Tell us the goal — we'll shape the build.",             recommends: [] },
];

// Mandatory foundation — every professional build ships with these.
export const foundation = [
  'Authentication', 'Secure Database', 'Responsive Design', 'User Management',
  'Admin Dashboard', 'API Foundation', 'Hosting Setup', 'Security Best Practices', 'Analytics',
];

// Effort scale — what the ■ indicator means (and its cost weight).
export const effortLevels = {
  1: { label: 'Simple',     bars: 2 },
  2: { label: 'Light',      bars: 3 },
  3: { label: 'Medium',     bars: 4 },
  4: { label: 'Advanced',   bars: 5 },
  5: { label: 'Enterprise', bars: 6 },
};
const EFFORT_COST = { 1: 700, 2: 1400, 3: 2600, 4: 4200, 5: 6500 };

// Build-your-product catalog. `axes` feeds the live capability visualization.
export const features = [
  { id: 'ai',          icon: 'ai',       title: 'AI Assistant',     blurb: 'Answer, draft, classify and decide in-app.', effort: 5, axes: { features: 1, automation: 2 } },
  { id: 'payments',    icon: 'pay',      title: 'Payments',         blurb: 'Take cards, subscriptions and invoices.',    effort: 3, axes: { features: 1, security: 1 } },
  { id: 'scheduling',  icon: 'calendar', title: 'Scheduling',       blurb: 'Bookings, availability and calendars.',      effort: 3, axes: { features: 1 } },
  { id: 'notifications',icon: 'bell',    title: 'Notifications',    blurb: 'Email, SMS and in-app alerts.',              effort: 2, axes: { features: 1, automation: 1 } },
  { id: 'chat',        icon: 'chat',     title: 'Chat / Messaging', blurb: 'Real-time conversations between users.',     effort: 4, axes: { features: 1 } },
  { id: 'reports',     icon: 'report',   title: 'Reports',          blurb: 'Trustworthy numbers, exportable.',           effort: 3, axes: { features: 1 } },
  { id: 'crm',         icon: 'crm',      title: 'CRM',              blurb: 'Track contacts, deals and pipeline.',        effort: 4, axes: { features: 1 } },
  { id: 'inventory',   icon: 'box',      title: 'Inventory',        blurb: 'Stock, SKUs and movements.',                 effort: 3, axes: { features: 1 } },
  { id: 'portal',      icon: 'portal',   title: 'Customer Portal',  blurb: 'A logged-in space for your customers.',       effort: 4, axes: { features: 1, security: 1 } },
  { id: 'staff_portal',icon: 'staff',    title: 'Staff Portal',     blurb: 'Internal workspace for your team.',           effort: 4, axes: { features: 1, security: 1 } },
  { id: 'automation',  icon: 'auto',     title: 'Automation',       blurb: 'Workflows that run without you.',             effort: 4, axes: { automation: 3 } },
  { id: 'integrations',icon: 'plug',     title: 'Integrations',     blurb: 'Connect the tools you already use.',          effort: 3, axes: { automation: 2 } },
  { id: 'email',       icon: 'mail',     title: 'Email Marketing',  blurb: 'Campaigns, sequences and lists.',            effort: 2, axes: { features: 1, automation: 1 } },
  { id: 'multilang',   icon: 'globe',    title: 'Multi-language',   blurb: 'Reach customers in their language.',          effort: 2, axes: { features: 1 } },
  { id: 'mobile',      icon: 'mobile',   title: 'Mobile App',       blurb: 'Native iOS / Android experience.',           effort: 5, axes: { features: 2 } },
  { id: 'roles',       icon: 'lock',     title: 'Role Permissions', blurb: 'Who can see and do what.',                   effort: 3, axes: { security: 2 } },
  { id: 'docs',        icon: 'doc',      title: 'Document Storage', blurb: 'Upload, manage and serve files.',            effort: 2, axes: { features: 1, security: 1 } },
  { id: 'search',      icon: 'search',   title: 'Search',           blurb: 'Find anything, instantly.',                  effort: 3, axes: { features: 1 } },
  { id: 'auth_plus',   icon: 'key',      title: 'Advanced Auth',    blurb: 'SSO, 2FA and social login.',                 effort: 3, axes: { security: 2 } },
  { id: 'dashboards',  icon: 'dash',     title: 'Dashboards',       blurb: 'Live views of what matters.',                effort: 3, axes: { features: 1 } },
];

// Scale — described as benefits, not architecture jargon.
export const scaleLevels = [
  { id: 'startup',   label: 'Startup',          benefit: 'Lean and fast. Built to validate and grow.',                 mult: 1.0 },
  { id: 'growing',   label: 'Growing Business', benefit: 'Headroom for more users and data without rework.',          mult: 1.2 },
  { id: 'large',     label: 'Large Company',    benefit: 'Resilient infrastructure and serious load capacity.',       mult: 1.45 },
  { id: 'enterprise',label: 'Enterprise',       benefit: 'Mission-grade scalability, redundancy and compliance.',     mult: 1.75 },
];

// Timeline — moving toward urgency visibly raises the estimate.
export const timelineLevels = [
  { id: 'flexible', label: 'Flexible', benefit: 'No rush — optimized for value per dollar.',     mult: 0.92, weeks: [10, 16] },
  { id: 'standard', label: 'Standard', benefit: 'A steady, predictable delivery pace.',          mult: 1.0,  weeks: [8, 12] },
  { id: 'urgent',   label: 'Urgent',   benefit: 'Front-of-queue focus to ship sooner.',          mult: 1.35, weeks: [5, 8] },
];

// Quality — each step adds real engineering, described as benefits.
export const qualityLevels = [
  { id: 'prototype',  label: 'Prototype',       benefit: 'Prove the idea quickly.',                              mult: 0.72, adds: [] },
  { id: 'production', label: 'Production Ready', benefit: 'Tested, monitored and safe to launch.',               mult: 1.0,  adds: ['Automated testing', 'Monitoring', 'Backups'] },
  { id: 'premium',    label: 'Premium',         benefit: 'Hardened, documented and continuously delivered.',     mult: 1.28, adds: ['CI/CD', 'Documentation', 'Performance tuning'] },
  { id: 'critical',   label: 'Mission Critical',benefit: 'Zero-compromise reliability and security review.',     mult: 1.6,  adds: ['Security review', 'High availability', 'SLA-grade ops'] },
];

// Capability ladder — what they're building, not what they're paying.
export const capabilityStages = [
  'Idea', 'Prototype', 'Business Tool', 'Business Platform', 'Operational System', 'Enterprise Product',
];

const FOUNDATION_BASE = 3800; // everyone gets the foundation
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function roundK(n) {
  if (n >= 10000) return `$${Math.round(n / 1000)}k`;
  return `$${(Math.round(n / 500) * 500 / 1000).toFixed(1).replace('.0', '')}k`;
}

// The single source of truth for the estimate + visualization state.
export function estimate(state) {
  const { goalId, featureIds = [], scaleId = 'startup', timelineId = 'standard', qualityId = 'production' } = state;
  const scale = scaleLevels.find((s) => s.id === scaleId) || scaleLevels[0];
  const timeline = timelineLevels.find((t) => t.id === timelineId) || timelineLevels[1];
  const quality = qualityLevels.find((q) => q.id === qualityId) || qualityLevels[1];
  const chosen = features.filter((f) => featureIds.includes(f.id));

  // — Investment range —
  const featureCost = chosen.reduce((sum, f) => sum + (EFFORT_COST[f.effort] || 0), 0);
  const subtotal = (FOUNDATION_BASE + featureCost) * scale.mult * timeline.mult * quality.mult;
  const low = subtotal * 0.85;
  const high = subtotal * 1.18;

  // — Live capability axes (0–100) —
  const axisSum = (axis) => chosen.reduce((s, f) => s + (f.axes?.[axis] || 0), 0);
  const qIdx = qualityLevels.indexOf(quality);
  const sIdx = scaleLevels.indexOf(scale);
  const tIdx = timelineLevels.indexOf(timeline);
  const axes = {
    foundation: 100,
    features:   clamp(20 + axisSum('features') * 11, 0, 100),
    automation: clamp(axisSum('automation') * 16, 0, 100),
    scalability: clamp(30 + sIdx * 23, 0, 100),
    security:   clamp(35 + axisSum('security') * 12 + qIdx * 8, 0, 100),
    speed:      clamp(40 + tIdx * 30, 0, 100),
  };

  // — Capability stage —
  const weight = chosen.reduce((s, f) => s + f.effort, 0);
  const score = weight + sIdx * 3 + qIdx * 2;
  const stageIdx = clamp(
    chosen.length === 0 ? 0 : Math.round(clamp((score - 2) / 6, 0, 1) * (capabilityStages.length - 1)),
    0, capabilityStages.length - 1
  );

  // — Recommendation —
  const goal = goals.find((g) => g.id === goalId);
  const pkgName = ['Spark', 'Launch', 'Growth', 'Scale', 'Enterprise'][clamp(Math.round(stageIdx * 0.8), 0, 4)] + ' Build';
  const weeks = timeline.weeks;
  const reasons = [];
  if (goal && goal.id !== 'other') reasons.push(`Your focus is ${goal.label.toLowerCase()}.`);
  if (featureIds.includes('ai')) reasons.push('You selected AI capabilities.');
  if (featureIds.includes('roles') || featureIds.includes('staff_portal')) reasons.push('Multiple business users need permissions.');
  if (sIdx >= 2) reasons.push('Built to scale as you grow.');
  if (qIdx >= 2) reasons.push('Hardened for reliability from day one.');
  if (reasons.length === 0) reasons.push('A clean foundation you can build on over time.');

  return {
    rangeLow: roundK(low),
    rangeHigh: roundK(high),
    axes,
    stageIdx,
    stage: capabilityStages[stageIdx],
    featureCount: chosen.length,
    recommendation: { package: pkgName, weeks: `${weeks[0]}–${weeks[1]} weeks`, reasons: reasons.slice(0, 4) },
  };
}

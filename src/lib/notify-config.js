// ─────────────────────────────────────────────────────────────────────────────
// Instant lead notifications via ntfy (https://ntfy.sh) — open source, free,
// self-hostable, no account or token needed. You get a push the moment a
// directive is transmitted.
//
// SETUP (2 minutes):
//   1. Install the "ntfy" app (iOS / Android) or open https://ntfy.sh in a browser.
//   2. Subscribe to the topic below (NTFY_TOPIC). That's it — submissions ping you.
//
// PRIVACY: anything POSTed to a public ntfy topic is readable by anyone who
// knows the topic name. This code runs in the browser, so the topic name is
// effectively public — which is why it's a long, random string (hard to guess).
// For stronger privacy: self-host ntfy with auth, or use a reserved topic with
// access control (ntfy Pro / self-hosted), then set NTFY_SERVER accordingly.
// ─────────────────────────────────────────────────────────────────────────────

export const NTFY_SERVER = 'https://ntfy.sh';

// Change this to your own topic if you like (then resubscribe in the app).
export const NTFY_TOPIC = 'fjml-leads-7c0JP1PMCyuw';

export const ntfyEnabled =
  !!NTFY_TOPIC && !NTFY_TOPIC.startsWith('PASTE_');

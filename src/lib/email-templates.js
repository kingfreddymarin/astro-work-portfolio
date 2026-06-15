// ──────────────────────────────────────────────────────────────────────────
// FJML Studio — transactional email templates (SIGNAL identity, see BRAND.md)
//
// Two emails, both following the brand: deep graphite base, one amber signal
// accent on the values that matter, mono "readout" labels, rare large serif.
// Pure functions, zero dependencies → usable from a Cloud Function, an API
// route, or the Firebase "Trigger Email" extension.
//
//   leadNotificationEmail(lead)  → to the studio  (new inquiry)
//   leadConfirmationEmail(lead)  → to the visitor (we got it)
//
// Email-safe by construction: table layout, inline styles, web-safe fonts
// (Georgia + Courier — the same serif the brand mark is built from).
// ──────────────────────────────────────────────────────────────────────────

const SITE = 'https://fjml-studio.web.app';
const MARK = `${SITE}/brand/email-mark.png`;
const STUDIO = 'FJML Studio';

const C = {
  bg: '#0E0F11',
  card: '#16181B',
  card2: '#1E2125',
  border: '#2A2D31',
  ink: '#ECEEF0',
  ink2: '#9BA1A8',
  ink3: '#5A6066',
  accent: '#FFC24B',
  accentDim: '#2A2113',
};
const SERIF = "Georgia, 'Times New Roman', serif";
const MONO = "'Courier New', Courier, monospace";

function esc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// A hidden line that becomes the inbox preview snippet.
function preheader(text) {
  return `<div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;font-size:1px;line-height:1px;color:${C.bg};">${esc(text)}</div>`;
}

// Mono "readout" kicker label.
function kicker(text) {
  return `<span style="font-family:${MONO};font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${C.ink3};">${esc(text)}</span>`;
}

// One spec-sheet row: mono label on the left, amber-highlighted value on the right.
function specRow(label, value, { highlight = true, link } = {}) {
  if (value == null || value === '') return '';
  const inner = link
    ? `<a href="${esc(link)}" style="color:${highlight ? C.accent : C.ink};text-decoration:none;">${esc(value)}</a>`
    : `<span style="color:${highlight ? C.accent : C.ink};">${esc(value)}</span>`;
  return `
    <tr>
      <td style="padding:14px 0;border-bottom:1px solid ${C.border};font-family:${MONO};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.ink3};white-space:nowrap;vertical-align:top;width:118px;">${esc(label)}</td>
      <td style="padding:14px 0 14px 18px;border-bottom:1px solid ${C.border};font-family:${SERIF};font-size:17px;line-height:1.45;font-weight:bold;">${inner}</td>
    </tr>`;
}

function button(label, href) {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0;">
      <tr><td style="background:${C.accent};">
        <a href="${esc(href)}" style="display:inline-block;padding:14px 28px;font-family:${MONO};font-size:12px;letter-spacing:2px;text-transform:uppercase;color:${C.bg};text-decoration:none;font-weight:bold;">${esc(label)} &nbsp;&rarr;</a>
      </td></tr>
    </table>`;
}

// The shared shell: corner-bracket framed card, mark, content, footer.
function shell({ pre, kickerText, title, bodyHtml }) {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};">
${preheader(pre)}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bg};">
  <tr><td align="center" style="padding:32px 16px;">

    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background:${C.card};border:1px solid ${C.border};">

      <!-- top signal bar -->
      <tr><td style="height:3px;background:${C.accent};font-size:0;line-height:0;">&nbsp;</td></tr>

      <!-- header: mark + studio readout -->
      <tr><td style="padding:34px 40px 10px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="vertical-align:middle;width:64px;">
            <img src="${MARK}" width="56" height="56" alt="${STUDIO}" style="display:block;border:0;width:56px;height:56px;">
          </td>
          <td style="vertical-align:middle;padding-left:16px;">
            <div style="font-family:${SERIF};font-size:22px;font-weight:bold;letter-spacing:1px;color:${C.ink};">FJML <span style="color:${C.accent};">Studio</span></div>
            <div style="font-family:${MONO};font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${C.ink3};padding-top:4px;">Independent Engineering Studio</div>
          </td>
        </tr></table>
      </td></tr>

      <!-- content -->
      <tr><td style="padding:22px 40px 8px;">${kicker(kickerText)}</td></tr>
      <tr><td style="padding:6px 40px 0;">
        <h1 style="margin:0;font-family:${SERIF};font-size:32px;line-height:1.15;font-weight:bold;color:${C.ink};letter-spacing:-0.5px;">${title}</h1>
      </td></tr>

      <tr><td style="padding:20px 40px 36px;">${bodyHtml}</td></tr>

      <!-- footer -->
      <tr><td style="padding:24px 40px;border-top:1px solid ${C.border};background:${C.card2};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
          <td style="font-family:${MONO};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:${C.ink3};">
            ${STUDIO} &nbsp;·&nbsp; Managua &rarr; Remote Worldwide
          </td>
          <td align="right" style="font-family:${MONO};font-size:10px;letter-spacing:2px;color:${C.ink3};">
            <a href="${SITE}" style="color:${C.accent};text-decoration:none;">fjml-studio.web.app</a>
          </td>
        </tr></table>
      </td></tr>

    </table>

    <div style="font-family:${MONO};font-size:10px;letter-spacing:2px;color:${C.ink3};padding-top:18px;">// WE JUST BUILD STUFF</div>

  </td></tr>
</table>
</body></html>`;
}

const firstName = (name = '') => esc(name.trim().split(/\s+/)[0] || 'there');
const refCode = (lead) =>
  'FJML-' + String(Math.abs([...(lead.email || '') + (lead.name || '')].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7)) % 100000).padStart(5, '0');

// ── 1. Studio notification ────────────────────────────────────────────────
export function leadNotificationEmail(lead) {
  const subject = lead.service
    ? `New inquiry — ${lead.service}${lead.package ? ` · ${lead.package}` : ''} (${lead.name})`
    : `New inquiry from ${lead.name}`;

  const body = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${specRow('Name', lead.name)}
      ${specRow('Email', lead.email, { link: `mailto:${lead.email}` })}
      ${specRow('Company', lead.company)}
      ${specRow('Service', lead.service)}
      ${specRow('Package', lead.package)}
      ${specRow('Source', lead.source, { highlight: false })}
    </table>

    <div style="margin:28px 0 0;">
      <div style="font-family:${MONO};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.ink3};">Brief //</div>
      <div style="margin-top:10px;padding:18px 20px;background:${C.bg};border:1px solid ${C.border};border-left:3px solid ${C.accent};font-family:${SERIF};font-size:16px;line-height:1.7;color:${C.ink2};">
        ${esc(lead.message || '(no message provided)').replace(/\n/g, '<br>')}
      </div>
    </div>

    <div style="margin:30px 0 6px;">
      ${button(`Reply to ${firstName(lead.name)}`, `mailto:${lead.email}?subject=${encodeURIComponent('Re: your inquiry — FJML Studio')}`)}
    </div>`;

  const html = shell({
    pre: `${lead.name}${lead.service ? ` · ${lead.service}` : ''} — ${(lead.message || '').slice(0, 90)}`,
    kickerText: 'New Inquiry // Incoming Transmission',
    title: `${esc(lead.name)} wants to build.`,
    bodyHtml: body,
  });

  const text = [
    `NEW INQUIRY — ${STUDIO}`,
    '',
    `Name:    ${lead.name}`,
    `Email:   ${lead.email}`,
    lead.company ? `Company: ${lead.company}` : null,
    lead.service ? `Service: ${lead.service}` : null,
    lead.package ? `Package: ${lead.package}` : null,
    `Source:  ${lead.source || 'contact'}`,
    '',
    'Brief:',
    lead.message || '(no message provided)',
  ].filter((l) => l !== null).join('\n');

  return { subject, html, text };
}

// ── 2. Visitor auto-reply ───────────────────────────────────────────────────
export function leadConfirmationEmail(lead) {
  const ref = refCode(lead);
  const subject = `We got your message — ${STUDIO}`;

  const recap = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      ${specRow('Service', lead.service || 'To be scoped')}
      ${specRow('Package', lead.package || 'Not sure yet')}
      ${specRow('Ref', ref, { highlight: false })}
    </table>`;

  const body = `
    <p style="margin:0 0 18px;font-family:${SERIF};font-size:17px;line-height:1.75;color:${C.ink2};">
      Thanks, <span style="color:${C.accent};font-weight:bold;">${firstName(lead.name)}</span> — your transmission reached the studio. A real engineer reads every inquiry; you'll get a considered reply, usually within <span style="color:${C.accent};font-weight:bold;">24&ndash;48 hours</span>.
    </p>

    <p style="margin:0 0 24px;font-family:${SERIF};font-size:17px;line-height:1.75;color:${C.ink2};">
      Here's what we logged:
    </p>

    ${recap}

    <div style="margin:28px 0 0;">
      <div style="font-family:${MONO};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${C.ink3};">What happens next //</div>
      <div style="margin-top:12px;font-family:${SERIF};font-size:16px;line-height:1.75;color:${C.ink2};">
        We review the brief, sketch the shortest credible path to shipped, and reply with questions or a plan. No bots, no boilerplate.
      </div>
    </div>

    <div style="margin:30px 0 6px;">
      ${button('Explore the studio', SITE)}
    </div>`;

  const html = shell({
    pre: 'Transmission received — a real engineer will reply within 24–48 hours.',
    kickerText: `Transmission Received // ${ref}`,
    title: `Got it, ${firstName(lead.name)}.`,
    bodyHtml: body,
  });

  const text = [
    `TRANSMISSION RECEIVED — ${STUDIO} (${ref})`,
    '',
    `Thanks, ${firstName(lead.name)}. Your message reached the studio.`,
    'A real engineer reads every inquiry — expect a reply within 24–48 hours.',
    '',
    `Service: ${lead.service || 'To be scoped'}`,
    `Package: ${lead.package || 'Not sure yet'}`,
    `Ref:     ${ref}`,
    '',
    `Explore the studio: ${SITE}`,
    '',
    '— FJML Studio · We just build stuff.',
  ].join('\n');

  return { subject, html, text };
}

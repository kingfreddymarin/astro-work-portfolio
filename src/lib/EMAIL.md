# Transactional emails — FJML Studio

Brand-styled email templates for the lead-capture flow. SIGNAL identity
(graphite base, one amber signal accent on the values that matter, mono
"readout" labels, rare large serif). See `BRAND.md`.

## Files

- `email-templates.js` — zero-dependency template functions:
  - `leadNotificationEmail(lead)` → to the studio (new inquiry)
  - `leadConfirmationEmail(lead)` → to the visitor (auto-reply)
  - Each returns `{ subject, html, text }`.
- `public/brand/email-mark.png` — the logo used in the header (must be a
  hosted PNG; SVG and inline data URIs are poorly supported in email).
  Lives under `public/` so it ships with hosting at
  `https://fjml-studio.web.app/brand/email-mark.png`.

`lead` shape: `{ name, email, company, service, package, message, source }`
(the same object written to Firestore in `leads.js`).

## Wiring it up (recommended: Firebase "Trigger Email" extension)

Email must be sent server-side. The lowest-config path:

1. Upgrade the project to the **Blaze** plan.
2. Install the **Trigger Email from Firestore** extension and point it at an
   SMTP provider (Gmail app-password, Resend, SendGrid, etc.). Default
   send collection: `mail`.
3. Add a Cloud Function that fires when a `leads` doc is created and enqueues
   both emails by writing to `mail`:

```js
// functions/index.js  (firebase-functions v2)
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { leadNotificationEmail, leadConfirmationEmail } from './email-templates.js';

initializeApp();
const db = getFirestore();
const STUDIO_INBOX = 'freddymarin.jpg@gmail.com';

export const onLead = onDocumentCreated('leads/{id}', async (event) => {
  const lead = event.data?.data();
  if (!lead) return;

  const notify = leadNotificationEmail(lead);
  const confirm = leadConfirmationEmail(lead);

  await Promise.all([
    db.collection('mail').add({
      to: STUDIO_INBOX,
      replyTo: lead.email,
      message: { subject: notify.subject, html: notify.html, text: notify.text },
    }),
    db.collection('mail').add({
      to: lead.email,
      replyTo: STUDIO_INBOX,
      message: { subject: confirm.subject, html: confirm.html, text: confirm.text },
    }),
  ]);
});
```

Copy `email-templates.js` into `functions/` (functions deploy only uploads the
`functions/` directory) and set `"type": "module"` in `functions/package.json`.

## Previewing

```bash
node --input-type=module -e "
import { leadNotificationEmail, leadConfirmationEmail } from './src/lib/email-templates.js';
import { writeFileSync } from 'node:fs';
const lead = { name:'Freddy', email:'you@example.com', company:'varium', service:'Web Development', package:'Not sure yet', message:'testing', source:'contact' };
writeFileSync('/tmp/notify.html', leadNotificationEmail(lead).html);
writeFileSync('/tmp/confirm.html', leadConfirmationEmail(lead).html);
"
```

Open the files in a browser. (The header logo only resolves once
`email-mark.png` is deployed to hosting.)

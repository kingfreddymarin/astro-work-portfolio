# Leads Backup & Cloud-Cleanup Plan

Keep every inquiry forever in a **local database**, while keeping the cloud
`leads` collection **small** — so Firestore usage stays comfortably inside the
free tier and the console stays clean.

> TL;DR: a scheduled local script pulls new leads via the Admin SDK into a
> local SQLite file, verifies the write, then deletes the backed-up docs from
> Firestore. Append-only locally, prune-after-verify in the cloud.

---

## 1. Goals & principles

- **Never lose a lead.** Local store is the permanent system of record.
- **Keep the cloud lean.** Firestore holds only recent / un-backed-up leads.
- **Stay free.** Reads/writes/deletes for a contact form are a rounding error
  against the free quota; this plan keeps it that way indefinitely.
- **Safe by construction.** Delete from cloud *only after* a verified local
  write. No destructive step runs on a failed/partial backup.
- **Zero secrets in git.** The service-account key is gitignored and never
  committed.

---

## 2. Why the Admin SDK (not the web SDK)

The Firestore rules deny client reads of `leads`:

```
match /leads/{leadId} { allow read, update, delete: if false; allow create: ...; }
```

That's correct and should stay. Backups therefore run **server-side** with a
**service-account key**, which bypasses rules. The key lives only on your
machine (or a future trusted host).

---

## 3. Architecture

```
Firestore (cloud)                 Local machine
┌─────────────────┐   read all    ┌──────────────────────────┐
│  leads/{id}     │ ────────────▶ │  backup-leads.mjs        │
│  (recent only)  │               │   1. fetch new docs      │
│                 │ ◀──────────── │   2. upsert into SQLite  │
└─────────────────┘  delete       │   3. verify count        │
                     (after verify)│   4. prune cloud (opt.)  │
                                   └───────────┬──────────────┘
                                               ▼
                                   data/leads.db  (SQLite, gitignored)
                                   data/exports/leads-YYYYMMDD.jsonl (optional)
```

---

## 4. Prerequisites (one-time)

1. **Service-account key**
   Firebase console → ⚙️ Project settings → **Service accounts** →
   *Generate new private key* → save as `secrets/fjml-studio-admin.json`.
   - Create the folder: `mkdir -p secrets`
   - **Gitignore it** (see §9). Never commit this file.

2. **Local tooling** (in a `scripts/` workspace or repo root dev deps)
   ```bash
   npm i -D firebase-admin better-sqlite3
   ```
   `better-sqlite3` = fast, synchronous, zero-server SQLite. (Swap for plain
   JSONL if you'd rather avoid a native dep — see §7 alt.)

3. **Local store location:** `data/leads.db` (gitignored).

---

## 5. Local schema (SQLite)

```sql
CREATE TABLE IF NOT EXISTS leads (
  id          TEXT PRIMARY KEY,      -- Firestore document id
  name        TEXT,
  email       TEXT,
  company     TEXT,
  service     TEXT,
  package     TEXT,
  message     TEXT,
  source      TEXT,
  user_agent  TEXT,
  page_url    TEXT,
  created_at  TEXT,                  -- ISO 8601 (from Firestore Timestamp)
  backed_up_at TEXT DEFAULT (datetime('now')),
  raw         TEXT                   -- full JSON, future-proofing
);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at);
```

`id` as PRIMARY KEY makes the backup **idempotent** — re-running never
duplicates; an `INSERT OR REPLACE` upserts.

---

## 6. The backup script (design)

`scripts/backup-leads.mjs` — pseudocode of the real implementation:

```js
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import Database from 'better-sqlite3';
import { readFileSync, mkdirSync } from 'node:fs';

const PRUNE_AFTER_DAYS = 30;        // keep last 30 days in the cloud
const DRY_RUN = process.argv.includes('--dry-run');

initializeApp({ credential: cert(JSON.parse(readFileSync('secrets/fjml-studio-admin.json'))) });
const db = getFirestore();
mkdirSync('data', { recursive: true });
const sqlite = new Database('data/leads.db');
// ... run schema from §5 ...

// 1. Pull everything (contact-form volume is tiny; no pagination needed).
const snap = await db.collection('leads').orderBy('createdAt').get();

// 2. Upsert into SQLite inside a transaction.
const upsert = sqlite.prepare(`INSERT OR REPLACE INTO leads
  (id,name,email,company,service,package,message,source,user_agent,page_url,created_at,raw)
  VALUES (@id,@name,@email,@company,@service,@package,@message,@source,@user_agent,@page_url,@created_at,@raw)`);
const tx = sqlite.transaction((rows) => rows.forEach((r) => upsert.run(r)));
tx(snap.docs.map(toRow));

// 3. VERIFY: every fetched id now exists locally. Abort prune if not.
const localCount = sqlite.prepare('SELECT COUNT(*) c FROM leads').get().c;

// 4. PRUNE cloud docs older than N days — only after verification, never on --dry-run.
if (!DRY_RUN) {
  const cutoff = Date.now() - PRUNE_AFTER_DAYS * 864e5;
  for (const d of snap.docs) {
    const verifiedLocally = sqlite.prepare('SELECT 1 FROM leads WHERE id=?').get(d.id);
    const ts = d.get('createdAt')?.toMillis?.() ?? 0;
    if (verifiedLocally && ts < cutoff) await d.ref.delete();
  }
}
```

**Safety rails baked in:**
- Prune only deletes a doc that is confirmed present in SQLite.
- `--dry-run` reports what *would* happen and never deletes.
- Older-than-N-days window means a fresh lead is never deleted before you've
  even seen it (and it's already emailed + pushed to you anyway).

Optional: also dump a daily snapshot to `data/exports/leads-YYYYMMDD.jsonl`
for an extra plain-text copy you can grep/diff.

---

## 7. Pruning policy

| Setting | Recommended | Why |
|---|---|---|
| `PRUNE_AFTER_DAYS` | **30** | Recent leads stay queryable in console; everything is already local. |
| Backup cadence | **weekly** (or daily) | Contact-form volume is low; weekly is plenty. |
| First run | use `--dry-run` | Confirm the local DB fills correctly before any delete. |

> Want a pure archive with an empty cloud? Set `PRUNE_AFTER_DAYS = 0` to prune
> everything that's been verified locally. (Keep ~7–30 days if you like having
> recent entries visible in the console.)

**Alt local store (no native deps):** append each new lead as a line to
`data/leads.jsonl`. Simpler, but no SQL querying. SQLite is recommended.

---

## 8. Scheduling (free, local)

**macOS — launchd (survives reboots):** `~/Library/LaunchAgents/app.fjml.backup.plist`
runs `node scripts/backup-leads.mjs` weekly. Or simplest, **cron**:

```cron
# Sundays 09:00 — backup + prune leads
0 9 * * 0  cd /Users/macbookair/Documents/projects/astro-work-portfolio && /usr/bin/env node scripts/backup-leads.mjs >> data/backup.log 2>&1
```

(Your Mac must be on at that time; pick an hour it usually is, or run it
manually — it's idempotent, run it whenever.)

---

## 9. Security checklist

- [ ] `secrets/` and `data/` added to `.gitignore` (key + DB never committed).
- [ ] Service-account key has only default Firestore access; rotate if leaked
      (console → Service accounts → manage keys).
- [ ] `.env`/keys excluded — verify with `git status` before every commit.
- [ ] Local `leads.db` lives on an encrypted disk (macOS FileVault).
- [ ] Keep an off-machine copy of `leads.db` (Time Machine / cloud drive of
      your choice) so a dead laptop ≠ lost leads.

`.gitignore` additions:
```
# Local-only data & admin credentials — never commit
secrets/
data/
```

---

## 10. Restore / read procedure

- **Query locally:** `sqlite3 data/leads.db "SELECT created_at,name,email,service FROM leads ORDER BY created_at DESC LIMIT 20;"`
- **Re-seed the cloud** (rare): a `restore-leads.mjs` mirror of the backup
  script that reads SQLite and `set()`s docs back into Firestore by id.
- **Export to CSV:** `sqlite3 -header -csv data/leads.db "SELECT * FROM leads;" > leads.csv`

---

## 11. Free-tier impact

Per backup run (even with hundreds of leads):
- **Reads:** one per lead — far below 50,000/day free.
- **Deletes:** one per pruned lead — far below 20,000/day free.
- **Storage:** pruning keeps stored docs (and the 1 GiB free quota) near empty.
- **No Cloud Functions / build** involved — this is a local script.

Net Firebase cost of this backup system: **$0**.

---

## 12. Rollout checklist

1. [ ] Generate service-account key → `secrets/fjml-studio-admin.json`
2. [ ] Add `secrets/` + `data/` to `.gitignore`
3. [ ] `npm i -D firebase-admin better-sqlite3`
4. [ ] Implement `scripts/backup-leads.mjs` (per §6)
5. [ ] Run `node scripts/backup-leads.mjs --dry-run` → confirm local DB fills
6. [ ] Run for real once → confirm prune behaves
7. [ ] Add the cron/launchd schedule (§8)
8. [ ] Set up an off-machine copy of `data/leads.db` (§9)

---

*When you're ready, I can implement `scripts/backup-leads.mjs` (and the restore
script) to match this plan, and wire the `.gitignore` + schedule.*

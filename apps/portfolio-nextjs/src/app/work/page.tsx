'use client';

import Link from 'next/link';

export default function WorkPage() {
  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--nav-h)',
        background: 'var(--nav-bg)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 var(--edge-pad)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
      }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '20px', fontWeight: 'bold' }}>
            FJML <span style={{ color: 'var(--accent)' }}>Studio</span>
          </Link>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '13px', fontFamily: 'Space Mono, monospace' }}>
            <Link href="/about">About</Link>
            <Link href="/work">Work</Link>
            <Link href="/services">Services</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </nav>

      <main style={{ marginTop: 'var(--nav-h)', display: 'flex', flexDirection: 'column' }}>
        <section>
          <h1>Work</h1>
          <p>Case studies and projects coming soon.</p>
        </section>
      </main>

      <footer>
        <p>© 2024 FJML Studio. Independent engineering studio.</p>
      </footer>
    </>
  );
}

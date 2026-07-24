'use client';

import Link from 'next/link';

export default function AboutPage() {
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
          <h1>About FJML Studio</h1>
          <p>
            One engineer. Team-scale output. We ship production systems — from embedded firmware on secure elements to AI-driven automation pipelines — at speeds that seem impossible until you see it happen.
          </p>
          <p>
            We specialize in the work that's usually called "hard": low-level systems where every byte counts, distributed infrastructure where latency kills, and AI orchestration that actually solves problems instead of just calling APIs.
          </p>
          <p style={{ marginTop: '2rem' }}>
            Based in Managua, Nicaragua. Available worldwide, usually by afternoon the next day.
          </p>
        </section>
      </main>

      <footer>
        <p>© 2024 FJML Studio. Independent engineering studio.</p>
      </footer>
    </>
  );
}

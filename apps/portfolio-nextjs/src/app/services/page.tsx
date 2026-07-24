'use client';

import Link from 'next/link';

export default function ServicesPage() {
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
          <h1>Services</h1>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            <div>
              <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Web Development</h3>
              <p>Production-ready web systems. React, Node, Python. Databases, APIs, real-time sync. Performance matters — everything else is details.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>AI & Automation</h3>
              <p>LLM integration and agentic workflows. Document processing, RPA, data pipelines. We don't just call the API — we build systems around it.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Embedded & Mobile</h3>
              <p>Low-level systems. SIM applets, secure enclaves, firmware. Where every byte counts and reliability is non-negotiable.</p>
            </div>

            <div>
              <h3 style={{ color: 'var(--accent)', marginBottom: '1rem' }}>Data & Analytics</h3>
              <p>From the database layer up to the dashboard. BI that's fast, trustworthy, and answers the question on the first click.</p>
            </div>
          </div>

          <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <h2>Ready to build?</h2>
            <p style={{ marginTop: '1rem' }}>
              Tell us what you're solving for. We'll sketch the shortest path to shipped and get back to you within 24–48 hours.
            </p>
            <Link href="/contact" style={{ display: 'inline-block', marginTop: '1.5rem', padding: '12px 24px', background: 'var(--accent)', color: 'var(--bg)' }}>
              Start a Project
            </Link>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2024 FJML Studio. Independent engineering studio.</p>
      </footer>
    </>
  );
}

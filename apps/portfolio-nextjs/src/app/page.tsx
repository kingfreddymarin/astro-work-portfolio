'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
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
        <section style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}>
          <h1 style={{ marginBottom: '1rem' }}>We just build stuff.</h1>
          <p style={{ fontSize: '18px', marginBottom: '2rem', maxWidth: '600px' }}>
            Production systems, shipped fast. From embedded SIM applets to AI agent pipelines — infrastructure that actually works.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/work" style={{ padding: '12px 24px', background: 'var(--accent)', color: 'var(--bg)' }}>
              See the Work
            </Link>
            <Link href="/services" style={{ padding: '12px 24px', border: '1px solid var(--border)' }}>
              Build With Us
            </Link>
          </div>
        </section>

        <section style={{ padding: '60px var(--edge-pad)', borderTop: '1px solid var(--border)' }}>
          <h2 style={{ marginBottom: '2rem' }}>What We Do</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Web Systems</h3>
              <p>Full-stack production apps. React, Node, Python. Databases, APIs, real-time sync. Whatever your bottleneck is, we eliminate it.</p>
            </div>
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>AI & Automation</h3>
              <p>LLM integration and agentic workflows. Document processing, RPA, data pipelines. We don't just call the API — we orchestrate it.</p>
            </div>
            <div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--accent)' }}>Embedded & Mobile</h3>
              <p>Low-level systems where every byte counts. SIM applets, secure enclaves, firmware. Proven on millions of devices.</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>© 2024 FJML Studio. Independent engineering studio.</p>
        <p>Managua → Remote Worldwide</p>
      </footer>
    </>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    service: '',
    package: '',
    message: '',
    specialRequest: false,
    specialEvidence: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus('success');
        setForm({
          name: '',
          email: '',
          company: '',
          service: '',
          package: '',
          message: '',
          specialRequest: false,
          specialEvidence: '',
        });
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        const error = await res.json();
        setErrorMsg(error.message || 'Failed to submit');
        setStatus('error');
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error submitting form');
      setStatus('error');
    }
  };

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
          <h1>Let's Build</h1>
          <p style={{ fontSize: '16px', marginBottom: '3rem' }}>
            Tell us what you're solving for. No forms, no boilerplate — just what matters.
          </p>

          <form onSubmit={handleSubmit} style={{ maxWidth: '600px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontFamily: 'Space Mono, monospace' }}>
                NAME
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontFamily: 'Space Mono, monospace' }}>
                EMAIL
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontFamily: 'Space Mono, monospace' }}>
                COMPANY (optional)
              </label>
              <input
                type="text"
                name="company"
                value={form.company}
                onChange={handleChange}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontFamily: 'Space Mono, monospace' }}>
                SERVICE
              </label>
              <select name="service" value={form.service} onChange={handleChange}>
                <option value="">Select a service</option>
                <option value="web">Web Development</option>
                <option value="ai">AI & Automation</option>
                <option value="embedded">Embedded Systems</option>
                <option value="data">Data & BI</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontFamily: 'Space Mono, monospace' }}>
                PACKAGE (optional)
              </label>
              <input
                type="text"
                name="package"
                value={form.package}
                onChange={handleChange}
                placeholder="e.g., MVP, Full Build"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontFamily: 'Space Mono, monospace' }}>
                BRIEF
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                style={{ minHeight: '120px' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="specialRequest"
                  checked={form.specialRequest}
                  onChange={handleChange}
                  style={{ width: 'auto' }}
                />
                <span style={{ fontSize: '12px', fontFamily: 'Space Mono, monospace' }}>
                  I'm interested in subsidized pricing
                </span>
              </label>
            </div>

            {form.specialRequest && (
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontFamily: 'Space Mono, monospace' }}>
                  EVIDENCE
                </label>
                <textarea
                  name="specialEvidence"
                  value={form.specialEvidence}
                  onChange={handleChange}
                  placeholder="Tell us about your mission"
                  style={{ minHeight: '80px' }}
                />
              </div>
            )}

            {status === 'success' && (
              <div style={{ padding: '12px', background: 'rgba(94, 230, 208, 0.1)', border: '1px solid var(--ok)', borderRadius: 'var(--radius)', marginBottom: '1rem', color: 'var(--ok)' }}>
                ✓ Message received. We'll reply within 24–48 hours.
              </div>
            )}

            {status === 'error' && (
              <div style={{ padding: '12px', background: 'rgba(255, 92, 92, 0.1)', border: '1px solid var(--live)', borderRadius: 'var(--radius)', marginBottom: '1rem', color: 'var(--live)' }}>
                {errorMsg || 'Error submitting form. Try again.'}
              </div>
            )}

            <button type="submit" disabled={status === 'loading'} style={{ opacity: status === 'loading' ? 0.6 : 1 }}>
              {status === 'loading' ? 'Sending...' : 'Send Inquiry'}
            </button>
          </form>
        </section>
      </main>

      <footer>
        <p>© 2024 FJML Studio. Independent engineering studio.</p>
      </footer>
    </>
  );
}

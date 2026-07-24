'use client';

import Link from 'next/link';
import { useState } from 'react';

const services = [
  {
    id: 'web',
    index: '01',
    title: 'Web Development',
    capability: 'We build robust, production-ready web interfaces and full-stack systems — focused on architectural integrity, performance, and solving the business problem the product was built for.',
    whatItInvolves: 'From architectural planning and database design to front-end implementation and cloud deployment, the studio handles the end-to-end lifecycle of web products — scalable, secure, and intuitive for the end-user.',
  },
  {
    id: 'ai',
    index: '02',
    title: 'AI & Automation',
    capability: 'We bridge the gap between complex AI models and practical business automation. We don\'t just "use" AI — we orchestrate it to compress timelines and eliminate manual bottlenecks.',
    whatItInvolves: 'Identifying high-friction business processes and automating them with AI agents, LLM pipelines, and RPA. We build systems that monitor, classify, and route data autonomously — turning days of work into minutes.',
  },
  {
    id: 'embedded',
    index: '03',
    title: 'Mobile & Embedded Systems',
    capability: 'Low-level engineering where security and reliability are non-negotiable. The studio has proven experience deploying code to millions of devices where every byte counts.',
    whatItInvolves: 'Developing secure communication protocols between mobile applications and hardware. We specialize in Secure Element interfacing, SIM Toolkit applets, and cryptography at the device level.',
  },
  {
    id: 'data',
    index: '04',
    title: 'Data & Business Intelligence',
    capability: 'We turn scattered data into decisions. From the SQL layer underneath to the dashboard leadership actually opens, we build BI that\'s fast, trustworthy, and answers the question on the first click.',
    whatItInvolves: 'We connect disconnected systems into a clean, secure data layer, model it properly, and build dashboards on advanced DAX that hold up as you grow — or audit and rescue the reporting you already have.',
  },
];

export default function ServicesPage() {
  const [expandedService, setExpandedService] = useState<string | null>(null);

  return (
    <>
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 'var(--nav-h)',
        background: 'var(--nav-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--edge-pad)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
      }}>
        <Link href="/" style={{ fontSize: '20px', fontWeight: 'bold', display: 'flex', gap: '0.25rem' }}>
          <span>FJML</span>
          <span style={{ color: 'var(--accent)' }}>Studio</span>
        </Link>
      </header>

      <main style={{ marginTop: 'var(--nav-h)', display: 'flex', flexDirection: 'column' }}>
        <section style={{ padding: '60px var(--edge-pad) 40px' }}>
          <div style={{ marginBottom: '3rem' }}>
            <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '12px', letterSpacing: '0.12em', color: 'var(--accent)', textTransform: 'uppercase' }}>
              FJML Studio // Services
            </span>
            <h1 style={{ marginTop: '1rem', marginBottom: '1rem', fontSize: 'clamp(2.5rem, 8vw, 5rem)', fontWeight: 600 }}>
              What we build
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--ink-2)', maxWidth: '600px', lineHeight: 1.7 }}>
              Every project lives at the intersection of problem and tool. We don't pick the tool first — we understand the problem, then select or build the tool that solves it in the shortest credible path.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '2rem', marginTop: '3rem' }}>
            {services.map((service) => (
              <div
                key={service.id}
                style={{
                  padding: '2rem',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => setExpandedService(expandedService === service.id ? null : service.id)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                      color: 'var(--ink-3)',
                      textTransform: 'uppercase',
                    }}>
                      {service.index}
                    </span>
                    <h3 style={{
                      fontSize: '24px',
                      fontWeight: 600,
                      marginTop: '0.5rem',
                      marginBottom: '1rem',
                      color: 'var(--accent)',
                    }}>
                      {service.title}
                    </h3>
                    <p style={{ color: 'var(--ink-2)', lineHeight: 1.7, maxWidth: '600px' }}>
                      {service.capability}
                    </p>
                  </div>
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '20px',
                    color: 'var(--accent)',
                    transition: 'transform 0.2s ease',
                    transform: expandedService === service.id ? 'rotate(45deg)' : 'rotate(0deg)',
                  }}>
                    +
                  </span>
                </div>

                {expandedService === service.id && (
                  <div style={{
                    marginTop: '1.5rem',
                    paddingTop: '1.5rem',
                    borderTop: '1px solid var(--border)',
                  }}>
                    <h4 style={{ color: 'var(--accent)', marginBottom: '1rem', fontFamily: "'Space Mono', monospace", fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      What it involves
                    </h4>
                    <p style={{ color: 'var(--ink-2)', lineHeight: 1.8 }}>
                      {service.whatItInvolves}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '4rem',
            padding: '2rem',
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border)',
            textAlign: 'center',
          }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '28px' }}>Ready to build?</h2>
            <p style={{ marginBottom: '1.5rem', color: 'var(--ink-2)', lineHeight: 1.7 }}>
              Tell us what you're solving for. We'll sketch the shortest path to shipped and get back to you within 24–48 hours.
            </p>
            <Link href="/contact" style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: 'var(--accent)',
              color: 'var(--bg)',
              borderRadius: 'var(--radius)',
              fontFamily: "'Space Mono', monospace",
              fontSize: '12px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}>
              Start a Project
            </Link>
          </div>
        </section>
      </main>

      <footer style={{
        flexShrink: 0,
        padding: '20px var(--edge-pad)',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
        fontSize: '12px',
        color: 'var(--ink-3)',
      }}>
        <p>© 2024 FJML Studio. Independent engineering studio.</p>
      </footer>
    </>
  );
}

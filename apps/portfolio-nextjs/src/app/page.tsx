'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  return (
    <>
      {/* Navigation Header */}
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
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      }}>
        <Link href="/" style={{
          fontSize: '18px',
          fontWeight: '700',
          color: 'var(--ink)',
          display: 'flex',
          gap: '0.5rem',
        }}>
          <span>FJML</span>
          <span style={{ color: 'var(--accent)' }}>Studio</span>
        </Link>
      </header>

      <main style={{
        marginTop: 'var(--nav-h)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Hero Section - Modern Clean */}
        <section id="hero" style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: 'calc(100vh - var(--nav-h))',
          padding: '80px var(--edge-pad)',
          background: 'linear-gradient(135deg, #FFFFFF 0%, #F0F4FF 100%)',
          position: 'relative',
        }}>
          <div style={{ maxWidth: '700px' }}>
            <p style={{
              fontSize: '14px',
              fontWeight: '600',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '1.5rem',
            }}>
              Engineering Studio
            </p>

            <h1 style={{
              fontSize: 'clamp(2.5rem, 8vw, 4rem)',
              fontWeight: '700',
              lineHeight: 1.1,
              marginBottom: '1.5rem',
              color: 'var(--ink)',
            }}>
              We build production systems that scale.
            </h1>

            <p style={{
              fontSize: '1.1rem',
              color: 'var(--ink-2)',
              lineHeight: 1.8,
              marginBottom: '2rem',
              maxWidth: '550px',
            }}>
              Full-stack web, AI automation, and embedded systems. From concept to production—we deliver what works, fast.
            </p>

            <div style={{
              display: 'flex',
              gap: '1rem',
              flexWrap: 'wrap',
            }}>
              <Link href="/services" style={{
                padding: '12px 28px',
                background: 'var(--accent)',
                color: 'white',
                borderRadius: 'var(--radius)',
                fontWeight: '600',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}>
                Explore Services
              </Link>
              <Link href="/contact" style={{
                padding: '12px 28px',
                border: '2px solid var(--accent)',
                color: 'var(--accent)',
                borderRadius: 'var(--radius)',
                fontWeight: '600',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'all 0.2s ease',
              }}>
                Start a Project
              </Link>
            </div>
          </div>

          {/* Floating card */}
          <div style={{
            position: 'absolute',
            bottom: '60px',
            right: '80px',
            background: 'white',
            padding: '20px 24px',
            borderRadius: 'var(--radius)',
            boxShadow: '0 10px 30px rgba(0,102,255,0.1)',
            border: '1px solid var(--border)',
            maxWidth: '240px',
            display: 'none',
            '@media (min-width: 1200px)': {
              display: 'block',
            },
          }}>
            <p style={{ fontSize: '12px', color: 'var(--ink-3)', marginBottom: '8px' }}>CURRENTLY</p>
            <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)', marginBottom: '12px' }}>
              Taking new projects
            </p>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--ok)',
                animation: 'pulse 2s ease-in-out infinite',
              }} />
              <span style={{ fontSize: '12px', color: 'var(--ink-3)' }}>Available now</span>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section style={{
          padding: '80px var(--edge-pad) 60px',
          background: 'var(--bg)',
        }}>
          <h2 style={{
            marginBottom: '3rem',
            fontSize: '2.5rem',
            fontWeight: '700',
          }}>
            Our Capabilities
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
          }}>
            {[
              {
                title: 'Web Development',
                desc: 'Full-stack systems. React, Node, Python. Scalable APIs and real-time sync.',
                icon: '⚡',
              },
              {
                title: 'AI & Automation',
                desc: 'LLM pipelines and agentic workflows. RPA tooling and document AI.',
                icon: '🤖',
              },
              {
                title: 'Embedded Systems',
                desc: 'SIM toolkits, secure enclaves, firmware. Proven at massive scale.',
                icon: '🔐',
              },
              {
                title: 'Data & BI',
                desc: 'Clean data layers and dashboards that answer the right questions.',
                icon: '📊',
              },
            ].map((service, i) => (
              <div key={i} style={{
                padding: '2rem',
                background: 'var(--surface)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                transition: 'all 0.3s ease',
              }}>
                <div style={{
                  fontSize: '32px',
                  marginBottom: '1rem',
                }}>
                  {service.icon}
                </div>
                <h3 style={{
                  marginBottom: '0.75rem',
                  color: 'var(--ink)',
                }}>
                  {service.title}
                </h3>
                <p style={{
                  color: 'var(--ink-2)',
                  fontSize: '14px',
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section style={{
          padding: '80px var(--edge-pad) 60px',
          background: 'var(--accent)',
          textAlign: 'center',
          color: 'white',
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: 'white',
          }}>
            Ready to ship?
          </h2>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '2rem',
            maxWidth: '500px',
            margin: '0 auto 2rem',
            color: 'rgba(255,255,255,0.9)',
          }}>
            Tell us what you're building. We'll sketch the path and get back within 24 hours.
          </p>
          <Link href="/contact" style={{
            display: 'inline-block',
            padding: '12px 32px',
            background: 'white',
            color: 'var(--accent)',
            borderRadius: 'var(--radius)',
            fontWeight: '600',
            fontSize: '14px',
            textDecoration: 'none',
            transition: 'all 0.2s ease',
          }}>
            Start a Conversation
          </Link>
        </section>
      </main>

      <footer style={{
        flexShrink: 0,
        padding: '40px var(--edge-pad)',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
        background: 'var(--surface)',
      }}>
        <p style={{ marginBottom: '0.5rem' }}>© 2024 FJML Studio</p>
        <p style={{ fontSize: '13px', color: 'var(--ink-3)', margin: 0 }}>Building in Managua · Remote Worldwide</p>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
}

'use client';

import { useEffect } from 'react';
// @ts-expect-error — untyped JS data module shared with the Astro original
import { site } from '../data/portfolio.js';
import BrandMark from './BrandMark';
import Switch from './Switch';

const items = [
  { view: 'home', no: '01', label: 'Home' },
  { view: 'about', no: '02', label: 'About' },
  { view: 'work', no: '03', label: 'Work' },
  { view: 'services', no: '04', label: 'Services' },
  { view: 'skills', no: '05', label: 'Skills' },
  { view: 'learning', no: '06', label: 'Learning' },
  { view: 'contact', no: '07', label: 'Contact' },
];

export default function Nav() {
  useEffect(() => {
    /* Disclosure: the [?] next to the location reveals macros / config / hints */
    const helpToggle = document.getElementById('meta-help-toggle');
    const metaExtras = document.getElementById('meta-extras') as HTMLElement | null;

    function setExtras(open: boolean) {
      if (!metaExtras) return;
      metaExtras.hidden = !open;
      helpToggle?.setAttribute('aria-expanded', String(open));
    }
    const onHelpToggle = () => setExtras(metaExtras?.hidden ?? false);
    helpToggle?.addEventListener('click', onHelpToggle);

    // Close: the [×] button, or tapping the backdrop (mobile modal).
    const closeBtn = metaExtras?.querySelector('[data-close-extras]');
    const onClose = () => setExtras(false);
    closeBtn?.addEventListener('click', onClose);

    const onBackdrop = (e: Event) => {
      if (e.target === metaExtras) setExtras(false);
    };
    metaExtras?.addEventListener('click', onBackdrop);

    // Switch Toggles Synchronizer
    const hintsSwitch = document.getElementById('hints-switch') as HTMLInputElement | null;
    const strictSwitch = document.getElementById('strict-switch') as HTMLInputElement | null;
    const legacyHintsBtn = document.getElementById('hints-status');

    let observer: MutationObserver | undefined;
    const onHintsChange = () => legacyHintsBtn?.click();

    if (hintsSwitch && legacyHintsBtn) {
      observer = new MutationObserver(() => {
        const active = legacyHintsBtn.getAttribute('aria-pressed') === 'true';
        if (hintsSwitch.checked !== active) {
          hintsSwitch.checked = active;
        }
      });
      observer.observe(legacyHintsBtn, { attributes: true, attributeFilter: ['aria-pressed'] });

      hintsSwitch.checked = legacyHintsBtn.getAttribute('aria-pressed') === 'true';
      hintsSwitch.addEventListener('change', onHintsChange);
    }

    const onStrictChange = () => {
      if (!strictSwitch) return;
      const active = strictSwitch.checked;
      let config: { strict: boolean } = { strict: false };
      try {
        config = JSON.parse(localStorage.getItem('site-config') || '{}');
      } catch {}
      config.strict = active;
      localStorage.setItem('site-config', JSON.stringify(config));

      if (active) {
        document.documentElement.setAttribute('data-strict', '');
        document.documentElement.removeAttribute('data-style');
        localStorage.removeItem('site-style');
      } else {
        document.documentElement.removeAttribute('data-strict');
      }
      window.location.reload();
    };

    if (strictSwitch) {
      strictSwitch.checked = document.documentElement.hasAttribute('data-strict');
      strictSwitch.addEventListener('change', onStrictChange);
    }

    return () => {
      helpToggle?.removeEventListener('click', onHelpToggle);
      closeBtn?.removeEventListener('click', onClose);
      metaExtras?.removeEventListener('click', onBackdrop);
      observer?.disconnect();
      hintsSwitch?.removeEventListener('change', onHintsChange);
      strictSwitch?.removeEventListener('change', onStrictChange);
    };
  }, []);

  return (
    <>
      <header className="topbar">
        <a
          className="nav-logo"
          href="#home"
          data-view-target="home"
          aria-label={`${site.studio} — home`}
        >
          <BrandMark size={32} />
        </a>
        <button className="menu-toggle" aria-expanded="false" aria-controls="overlay-menu">
          <span className="menu-toggle-text" data-open="Menu" data-close="Close"></span>
          <span className="menu-toggle-icon" aria-hidden="true">
            <span></span>
            <span></span>
          </span>
        </button>
      </header>

      <nav id="overlay-menu" className="overlay-menu" aria-hidden="true" aria-label="Primary">
        <ul className="menu-list">
          {items.map((it, i) => (
            <li className="menu-item" key={it.view} style={{ ['--mi' as string]: i }}>
              <a className="menu-link" href={`#${it.view}`} data-view-target={it.view}>
                <span className="menu-no">{it.no}</span>
                <span className="menu-label">{it.label}</span>
                <span className="menu-arrow" aria-hidden="true">
                  &#8594;
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div className="menu-meta">
          <a href={`mailto:${site.email}`} className="menu-meta-link">
            {site.email}
          </a>
          {site.linkedin && (
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="menu-meta-link"
            >
              LinkedIn &#8599;
            </a>
          )}
          {/* Shortcuts, config & hints — revealed by the [?] next to the location */}
          <div className="meta-extras" id="meta-extras" hidden>
            <button
              className="meta-extras-close"
              type="button"
              data-close-extras
              aria-label="Close"
            >
              CLOSE [×]
            </button>
            <div className="menu-instructions">
              <span className="instr-heading">MACROS //</span>
              <div className="instr-row">
                <span className="instr-prefix">NAV</span>
                <span className="instr-keys">[←] [→] CYCLE</span>
              </div>
              <div className="instr-row">
                <span className="instr-prefix">MENU</span>
                <span className="instr-keys">[M] TOGGLE · [ESC] CLOSE</span>
              </div>
              <div className="instr-row">
                <span className="instr-prefix">TIPS</span>
                <span className="instr-keys">[CTRL] + [.] ROTATE</span>
              </div>
              <div className="instr-row">
                <span className="instr-prefix">JUMP</span>
                <span className="instr-keys">[1]–[7] SECTION</span>
              </div>
              <div className="instr-row">
                <span className="instr-prefix">HINTS</span>
                <span className="instr-keys">[CTRL] + [?] TOGGLE</span>
              </div>
              <div className="instr-row">
                <span className="instr-prefix">CONFIG</span>
                <span className="instr-keys">[/] OPEN CONSOLE</span>
              </div>
            </div>

            {/* Live config readout — populated by SiteChrome */}
            <div className="menu-config" id="menu-config"></div>

            <div
              className="menu-switches"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.1rem',
                width: '100%',
                marginTop: '0.5rem',
                alignItems: 'stretch',
              }}
            >
              <div data-tooltip="Toggle helpful tips toast alerts">
                <Switch id="hints-switch" label="Telemetry Hints" checked />
              </div>
              <div data-tooltip="Enforce standard studio graphite aesthetics">
                <Switch id="strict-switch" label="Strict Branding" />
              </div>
            </div>

            {/* Hidden trigger for backwards compatibility with global event system */}
            <button
              className="hints-status"
              id="hints-status"
              type="button"
              aria-pressed="true"
              style={{ display: 'none' }}
            >
              <span className="hints-dot" aria-hidden="true"></span>
              <span className="hints-text">HINTS</span>
              <span className="hints-state">ON</span>
            </button>
          </div>

          <div className="menu-loc-block">
            <span className="menu-meta-loc">{site.location}</span>
            <button
              className="meta-help-toggle"
              id="meta-help-toggle"
              type="button"
              aria-expanded="false"
              aria-controls="meta-extras"
              aria-label="Show shortcuts &amp; config"
            >
              ?
            </button>
            <button
              className="meta-help-toggle meta-console-btn"
              type="button"
              data-open-console
              aria-label="Open command console"
            >
              /
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}

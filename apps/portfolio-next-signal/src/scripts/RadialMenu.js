// RadialMenu.js — Circular navigation context menu
class RadialContext {
  constructor() {
    this.active = false;
    this.createDom();
    this.initEvents();
  }

  createDom() {
    this.el = document.createElement('div');
    this.el.className = 'radial-context-menu';
    this.el.setAttribute('role', 'menu');
    this.el.hidden = true;
    
    this.el.innerHTML = `
      <div class="radial-ring"></div>
      <div class="radial-items">
        <button class="radial-item" data-view="home" style="--angle: 0deg;" data-tooltip="Home">⌂</button>
        <button class="radial-item" data-view="about" style="--angle: 51.4deg;" data-tooltip="About">ⓘ</button>
        <button class="radial-item" data-view="work" style="--angle: 102.8deg;" data-tooltip="Work">⌘</button>
        <button class="radial-item" data-view="services" style="--angle: 154.2deg;" data-tooltip="Services">⚙</button>
        <button class="radial-item" data-view="dashboard" style="--angle: 205.6deg;" data-tooltip="Dashboard">⌗</button>
        <button class="radial-item radial-console" style="--angle: 257deg;" data-tooltip="Console">[/]</button>
        <button class="radial-item radial-hints" style="--angle: 308.4deg;" data-tooltip="Toggle Hints">?</button>
      </div>
      <button class="radial-center" aria-label="Close menu">FJML</button>
    `;
    document.body.appendChild(this.el);
  }

  initEvents() {
    window.addEventListener('contextmenu', (e) => {
      // Hold Shift key to show the standard browser context menu
      if (e.shiftKey) return;
      
      // Don't intercept right clicks inside text input controls
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }
      
      e.preventDefault();
      this.open(e.clientX, e.clientY);
    });

    window.addEventListener('click', (e) => {
      if (this.active && !this.el.contains(e.target)) {
        this.close();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.active) {
        this.close();
      }
    });

    // Handle button clicks
    this.el.querySelectorAll('.radial-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this.close();

        const btn = e.currentTarget;
        const view = btn.dataset.view;
        if (view) {
          if (window.gotoView) {
            window.gotoView(view);
          } else {
            window.location.hash = '#' + view;
          }
        } else if (btn.classList.contains('radial-console')) {
          const consoleTrigger = document.querySelector('[data-open-console]');
          if (consoleTrigger) {
            consoleTrigger.click();
          }
        } else if (btn.classList.contains('radial-hints')) {
          const hintsStatusBtn = document.getElementById('hints-status');
          if (hintsStatusBtn) {
            hintsStatusBtn.click();
          }
        }
      });
    });

    this.el.querySelector('.radial-center').addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
    });
  }

  open(x, y) {
    this.active = true;
    this.el.hidden = false;
    
    // Bounds check to ensure menu remains on-screen
    const half = 95;
    const px = Math.max(half, Math.min(x, window.innerWidth - half));
    const py = Math.max(half, Math.min(y, window.innerHeight - half));

    this.el.style.left = `${px}px`;
    this.el.style.top = `${py}px`;

    // Force reflow
    void this.el.offsetWidth;

    this.el.classList.add('is-active');
    document.body.classList.add('radial-menu-open');
  }

  close() {
    this.active = false;
    this.el.classList.remove('is-active');
    document.body.classList.remove('radial-menu-open');
    setTimeout(() => {
      if (!this.active) this.el.hidden = true;
    }, 250);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new RadialContext();
});

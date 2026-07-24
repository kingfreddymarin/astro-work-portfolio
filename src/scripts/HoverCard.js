// HoverCard.js — Rich preview cards and tooltips on hover
class HoverCardSystem {
  constructor() {
    this.cardEl = null;
    this.tooltipEl = null;
    this.initHoverCards();
    this.initTooltips();
  }

  initHoverCards() {
    this.cardEl = document.createElement('div');
    this.cardEl.className = 'link-hover-card';
    this.cardEl.hidden = true;
    Object.assign(this.cardEl.style, {
      position: 'fixed',
      zIndex: '100030',
      pointerEvents: 'none',
      opacity: '0',
      transform: 'translateY(10px)',
      transition: 'opacity 0.22s cubic-bezier(0.22, 1, 0.36, 1), transform 0.22s cubic-bezier(0.22, 1, 0.36, 1)'
    });
    document.body.appendChild(this.cardEl);

    // Rich mockup metadata for specific keys
    const previews = {
      promptcraft: {
        title: 'PromptCraft AI',
        desc: 'Advanced prompt engineering lab. Real-time token budget estimations and structural model output validation.',
        spec: 'Vite · React · Gemini Pro API',
        code: 'system_instruction = "You are FJML Ops..."\nresponse = model.generate(prompt)'
      },
      knowledge: {
        title: 'Studio Knowledge Base',
        desc: 'Archival operations manuals and internal specs covering telecom hardware, SIM applets, and agent orchestration patterns.',
        spec: 'Hugo · Static Web · Offline Sync',
        code: 'TABLE blueprints {\n  id UUID PRIMARY KEY,\n  node VARCHAR(32)\n}'
      },
      cca: {
        title: 'Claude Certified Architect',
        desc: 'Curated 30-day curriculum guiding developers from prompt engineering basics to custom MCP server setups.',
        spec: 'Curriculum Roadmap · CCA-F',
        code: 'mcp_server = new McpServer("FJML Node");\nmcp_server.add_tool(sys_telemetry);'
      }
    };

    // Global listener for hover card elements (efficient delegation)
    document.addEventListener('mouseover', (e) => {
      const el = e.target.closest('[data-preview-key]');
      if (!el) return;

      const key = el.getAttribute('data-preview-key');
      const data = previews[key];
      if (!data) return;

      this.cardEl.innerHTML = `
        <div class="hc-frame">
          <span class="cb cb-tl"></span><span class="cb cb-tr"></span>
          <span class="cb cb-bl"></span><span class="cb cb-br"></span>
          <div class="hc-header">
            <span class="hc-prefix">SYS_PREVIEW //</span>
            <span class="hc-title">${data.title}</span>
          </div>
          <p class="hc-desc">${data.desc}</p>
          <div class="hc-divider"></div>
          <div class="hc-meta">
            <span class="hc-meta-label">TECH MATRIX:</span>
            <span class="hc-meta-val">${data.spec}</span>
          </div>
          <pre class="hc-code"><code>${data.code}</code></pre>
        </div>
      `;

      this.cardEl.hidden = false;
      this.positionElement(el, this.cardEl, 12);

      void this.cardEl.offsetWidth;
      this.cardEl.style.opacity = '1';
      this.cardEl.style.transform = 'translateY(0)';
    });

    document.addEventListener('mouseout', (e) => {
      const el = e.target.closest('[data-preview-key]');
      if (!el) return;

      this.cardEl.style.opacity = '0';
      this.cardEl.style.transform = 'translateY(10px)';
      setTimeout(() => {
        if (this.cardEl.style.opacity === '0') this.cardEl.hidden = true;
      }, 220);
    });
  }

  initTooltips() {
    this.tooltipEl = document.createElement('div');
    this.tooltipEl.className = 'custom-tooltip';
    this.tooltipEl.hidden = true;
    Object.assign(this.tooltipEl.style, {
      position: 'fixed',
      zIndex: '100040',
      pointerEvents: 'none',
      opacity: '0',
      transform: 'translateY(5px)',
      transition: 'opacity 0.15s ease, transform 0.15s ease'
    });
    document.body.appendChild(this.tooltipEl);

    document.addEventListener('mouseover', (e) => {
      const el = e.target.closest('[data-tooltip]');
      if (!el) return;

      const text = el.getAttribute('data-tooltip');
      this.tooltipEl.textContent = text;
      this.tooltipEl.hidden = false;

      this.positionElement(el, this.tooltipEl, 8);

      void this.tooltipEl.offsetWidth;
      this.tooltipEl.style.opacity = '1';
      this.tooltipEl.style.transform = 'translateY(0)';
    });

    document.addEventListener('mouseout', (e) => {
      const el = e.target.closest('[data-tooltip]');
      if (!el) return;

      this.tooltipEl.style.opacity = '0';
      this.tooltipEl.style.transform = 'translateY(5px)';
      setTimeout(() => {
        if (this.tooltipEl.style.opacity === '0') this.tooltipEl.hidden = true;
      }, 150);
    });
  }

  positionElement(anchor, floating, offset) {
    const r = anchor.getBoundingClientRect();
    const fr = floating.getBoundingClientRect();

    let left = r.left + (r.width - fr.width) / 2;
    let top = r.top - fr.height - offset;

    // Bounds checking
    if (left < 8) left = 8;
    if (left + fr.width > window.innerWidth - 8) {
      left = window.innerWidth - fr.width - 8;
    }
    
    if (top < 8) {
      top = r.bottom + offset; // Show below if there is no room above
    }

    floating.style.left = `${left}px`;
    floating.style.top = `${top}px`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new HoverCardSystem();
});

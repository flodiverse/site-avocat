/* =========================================================
   Minimal, dependency-free JS
   - Mobile nav toggle
   - Scroll-triggered reveals (IntersectionObserver)
   - Year auto-update in footer
   ========================================================= */
(function () {
  'use strict';

  const WHATSAPP_NUMBER = '40723176164';

  // ---- Mobile nav toggle ----
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      links.setAttribute('data-open', String(!open));
    });
    // Close on link click (mobile)
    links.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 720px)').matches) {
          toggle.setAttribute('aria-expanded', 'false');
          links.setAttribute('data-open', 'false');
        }
      });
    });
  }

  // ---- Scroll reveals ----
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in-view');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
  }

  // ---- Footer year ----
  const yr = document.querySelector('[data-year]');
  if (yr) yr.textContent = String(new Date().getFullYear());

  // ---- WhatsApp floating action button ----
  function injectWhatsAppFab() {
    if (document.querySelector('.whatsapp-fab')) return;

    const isEnglish = (document.documentElement.lang || '').toLowerCase().startsWith('en');
    const message = isEnglish
      ? "Hello, I'd like to schedule a consultation."
      : 'Bună ziua, aș dori să programez o consultație.';
    const tooltip = isEnglish ? 'Chat on WhatsApp' : 'Scrie pe WhatsApp';

    const fab = document.createElement('a');
    fab.className = 'whatsapp-fab';
    fab.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
    fab.target = '_blank';
    fab.rel = 'noopener';
    fab.setAttribute('aria-label', tooltip);

    fab.innerHTML =
      '<span class="whatsapp-fab-icon" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="currentColor">' +
          '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>' +
        '</svg>' +
      '</span>' +
      '<span class="whatsapp-fab-tooltip">' + tooltip + '</span>';

    document.body.appendChild(fab);
  }

  injectWhatsAppFab();

  // ---- Temporary theme previewer (REMOVE after a variant is chosen) ----
  function injectThemeSwitcher() {
    var THEMES = [
      { id: 'verde',          name: 'Crem (actual)',      color: '#f5f1ea', mode: 'light' },
      { id: 'bleumarin1',     name: 'Bleumarin închis 1', color: '#13233f', mode: 'dark' },
      { id: 'bleumarin2',     name: 'Bleumarin închis 2', color: '#172a55', mode: 'dark' },
      { id: 'bleumarinlight', name: 'Bleumarin deschis',  color: '#e9eef5', mode: 'light' },
      { id: 'albastrupraf',   name: 'Bleumarin praf',     color: '#d9e2ee', mode: 'light' },
      { id: 'visiniu1',       name: 'Vișiniu închis 1',   color: '#2c1219', mode: 'dark' },
      { id: 'visiniu2',       name: 'Vișiniu închis 2',   color: '#3a1620', mode: 'dark' },
      { id: 'visiniumediu',   name: 'Vișiniu mediu',      color: '#732d3a', mode: 'dark' },
      { id: 'visiniulight',   name: 'Vișiniu deschis',    color: '#f4ecea', mode: 'light' }
    ];
    var KEY = 'site-theme-preview';

    function apply(id) {
      var root = document.documentElement;
      var theme = null;
      for (var i = 0; i < THEMES.length; i++) { if (THEMES[i].id === id) { theme = THEMES[i]; break; } }
      if (id && id !== 'verde') {
        root.setAttribute('data-theme', id);
        root.setAttribute('data-mode', (theme && theme.mode) || 'light');
      } else {
        root.removeAttribute('data-theme');
        root.removeAttribute('data-mode');
      }
    }

    var saved = 'verde';
    try { saved = localStorage.getItem(KEY) || 'verde'; } catch (e) {}
    apply(saved);

    var style = document.createElement('style');
    style.textContent =
      '.theme-switcher{position:fixed;left:16px;bottom:16px;z-index:9999;background:#fff;' +
      'border:1px solid rgba(0,0,0,.12);border-radius:12px;padding:12px 12px 10px;' +
      'box-shadow:0 12px 34px rgba(0,0,0,.18);font-family:system-ui,-apple-system,sans-serif;width:190px}' +
      '.theme-switcher h5{margin:0 0 8px;font-size:10.5px;letter-spacing:.09em;text-transform:uppercase;color:#666;font-weight:700}' +
      '.theme-switcher button.opt{display:flex;align-items:center;gap:9px;width:100%;border:1px solid transparent;' +
      'background:none;padding:6px 8px;border-radius:8px;cursor:pointer;font-size:13px;color:#222;text-align:left;margin:0}' +
      '.theme-switcher button.opt:hover{background:#f3f3f3}' +
      '.theme-switcher button.opt[aria-pressed="true"]{border-color:#bbb;background:#f0f0f0;font-weight:600}' +
      '.theme-switcher .sw{width:16px;height:16px;border-radius:50%;flex-shrink:0;border:1px solid rgba(0,0,0,.15)}' +
      '.theme-switcher .note{margin-top:8px;font-size:10px;color:#999;line-height:1.35}';
    document.head.appendChild(style);

    var panel = document.createElement('div');
    panel.className = 'theme-switcher';
    panel.innerHTML = '<h5>Temă · previzualizare</h5>';

    THEMES.forEach(function (t) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'opt';
      b.setAttribute('data-id', t.id);
      b.setAttribute('aria-pressed', String(t.id === saved));
      b.innerHTML = '<span class="sw" style="background:' + t.color + '"></span>' + t.name;
      b.addEventListener('click', function () {
        apply(t.id);
        try { localStorage.setItem(KEY, t.id); } catch (e) {}
        panel.querySelectorAll('button.opt').forEach(function (x) {
          x.setAttribute('aria-pressed', String(x.getAttribute('data-id') === t.id));
        });
      });
      panel.appendChild(b);
    });

    var note = document.createElement('div');
    note.className = 'note';
    panel.appendChild(note);

    document.body.appendChild(panel);
  }

  injectThemeSwitcher();
})();

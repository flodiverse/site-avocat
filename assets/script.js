/* =========================================================
   Minimal, dependency-free JS
   - Mobile nav toggle
   - Scroll-triggered reveals (IntersectionObserver)
   - Year auto-update in footer
   ========================================================= */
(function () {
  'use strict';

  const WHATSAPP_NUMBER = '40785117334';

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

  // ---- Toast notification (top-right, auto-dismiss) ----
  function showToast(kind, title, msg) {
    var toast = document.createElement('div');
    toast.className = 'toast' + (kind === 'error' ? ' toast-error' : '');
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    var icon = kind === 'error'
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 7.5v5.5M12 16.5h.01"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.5 2.5L16 9"/></svg>';
    toast.innerHTML =
      '<span class="toast-icon" aria-hidden="true">' + icon + '</span>' +
      '<div class="toast-body">' +
        '<div class="toast-title">' + title + '</div>' +
        '<div class="toast-msg">' + msg + '</div>' +
      '</div>';
    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { toast.classList.add('toast-show'); });
    });
    setTimeout(function () {
      toast.classList.remove('toast-show');
      setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 600);
    }, 5000);
  }

  // ---- Contact form (Web3Forms) — AJAX submit + toast ----
  function initContactForm() {
    var form = document.querySelector('form.form-card[action*="web3forms"]');
    if (!form) return;

    var isEnglish = (document.documentElement.lang || '').toLowerCase().startsWith('en');
    var t = isEnglish
      ? {
          sending: 'Sending…',
          okTitle: 'Thank you!',
          okMsg: 'Your request has been received — I will get back to you shortly.',
          errTitle: 'Oops!',
          errMsg: 'Something went wrong. Please try again, or email us directly.'
        }
      : {
          sending: 'Se trimite…',
          okTitle: 'Mulțumim!',
          okMsg: 'Am primit solicitarea și vă răspund în cel mai scurt timp.',
          errTitle: 'Ups!',
          errMsg: 'A apărut o eroare. Încercați din nou sau scrieți-ne direct pe email.'
        };

    var V = isEnglish
      ? {
          required: 'This field is required.',
          select: 'Please select a practice area.',
          message: 'Please briefly describe your situation.',
          tooShort: 'Please use at least {min} characters.',
          email: 'Please enter a valid email address.',
          consent: 'You must agree before sending the request.',
          either: 'Please provide at least an email or a phone number.'
        }
      : {
          required: 'Acest câmp este obligatoriu.',
          select: 'Vă rugăm să selectați un domeniu.',
          message: 'Vă rugăm să descrieți pe scurt situația.',
          tooShort: 'Textul trebuie să aibă cel puțin {min} caractere.',
          email: 'Introduceți o adresă de email validă.',
          consent: 'Trebuie să bifați acordul pentru a trimite cererea.',
          either: 'Completați cel puțin emailul sau telefonul.'
        };

    // At least one of email / phone must be filled
    var email = form.querySelector('[name="email"]');
    var phone = form.querySelector('[name="phone"]');
    function syncEitherOr() {
      if (!email || !phone) return;
      var filled = email.value.trim() || phone.value.trim();
      email.setCustomValidity(filled ? '' : V.either);
    }
    if (email && phone) {
      email.addEventListener('input', syncEitherOr);
      phone.addEventListener('input', syncEitherOr);
      syncEitherOr();
    }

    // Localized message per failed constraint
    function messageFor(el) {
      var v = el.validity;
      if (v.valueMissing) {
        if (el.type === 'checkbox') return V.consent;
        if (el.tagName === 'SELECT') return V.select;
        if (el.name === 'message') return V.message;
        return V.required;
      }
      if (v.tooShort) return V.tooShort.replace('{min}', el.minLength);
      if (v.typeMismatch) return V.email;
      return '';
    }

    // Replace the browser's default validation bubbles with our text
    form.addEventListener('invalid', function (e) {
      var el = e.target;
      if (el === email && el.validity.customError) return; // keep the either-or message
      el.setCustomValidity(messageFor(el));
    }, true);

    // Clear the message as the user corrects each field
    Array.prototype.forEach.call(form.querySelectorAll('input, select, textarea'), function (el) {
      var ev = (el.tagName === 'SELECT' || el.type === 'checkbox') ? 'change' : 'input';
      el.addEventListener(ev, function () {
        if (el === email || el === phone) { syncEitherOr(); return; }
        el.setCustomValidity('');
      });
    });

    var btn = form.querySelector('button[type="submit"]');
    var btnHtml = btn ? btn.innerHTML : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (btn) { btn.disabled = true; btn.textContent = t.sending; }

      fetch(form.action, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form)
      })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (res.ok && res.d && res.d.success) {
            form.reset();
            showToast('success', t.okTitle, t.okMsg);
          } else {
            showToast('error', t.errTitle, (res.d && res.d.message) || t.errMsg);
          }
        })
        .catch(function () {
          showToast('error', t.errTitle, t.errMsg);
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.innerHTML = btnHtml; }
        });
    });
  }

  initContactForm();
})();

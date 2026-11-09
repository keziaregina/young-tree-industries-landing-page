(function () {
  'use strict';

  // Reveal berarah: masuk dari bawah, menutup ke atas saat section dilewati
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var s;
        if (e.isIntersecting) s = 'in';
        else s = e.boundingClientRect.top < window.innerHeight / 2 ? 'up' : 'down';
        if (s === 'down') e.target.removeAttribute('data-s');
        else e.target.setAttribute('data-s', s);
      });
    }, { threshold: 0.1, rootMargin: '-6% 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.setAttribute('data-s', 'in'); });
  }

  // Panel besar: membuka saat masuk, menutup (mengecil) saat dilewati, mengikuti scroll
  var sects = reduce ? [] : document.querySelectorAll('.panel, .cta');
  var clamp = function (v) { return Math.min(1, Math.max(0, v)); };
  var soft = function (t) { return t * t * (3 - 2 * t); };
  function sectProgress() {
    var h = window.innerHeight;
    sects.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > h + 100) return;
      var enter = soft(clamp((h - r.top) / (h * 0.45)));
      var exit = soft(clamp((h * 0.6 - r.bottom) / (h * 0.55)));
      var sc = 0.94 + 0.06 * enter - 0.07 * exit;
      el.style.transformOrigin = exit > 0 ? '50% 100%' : '50% 0%';
      el.style.transform = 'scale(' + sc.toFixed(4) + ')';
      el.style.opacity = ((0.35 + 0.65 * enter) * (1 - 0.75 * exit)).toFixed(3);
      el.style.borderRadius = (22 + 34 * exit).toFixed(1) + 'px';
    });
  }
  sectProgress();

  // Menu mobile
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });

  // Navbar shadow & tombol ke atas
  var nav = document.getElementById('nav');
  var totop = document.getElementById('totop');
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      nav.classList.toggle('scrolled', y > 10);
      totop.classList.toggle('show', y > 600);
      sectProgress();
      ticking = false;
    });
  }, { passive: true });
  window.addEventListener('resize', sectProgress);
  totop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  // Form (validasi sisi klien; hubungkan ke backend/email service untuk pengiriman nyata)
  var form = document.getElementById('form');
  var msg = document.getElementById('formMsg');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (f) {
      var valid = f.value.trim() !== '' && (f.type !== 'email' || /^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('invalid', !valid);
      if (!valid) ok = false;
    });
    msg.textContent = ok ? 'Terima kasih! Pesan Anda telah kami terima.' : 'Mohon lengkapi semua kolom dengan benar.';
    if (ok) form.reset();
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();

/* ============================================================
   Iqbal & Lusyana — Wedding Invitation
   Runtime. You should not need to edit this file for content —
   everything comes from assets/js/config.js
   ============================================================ */
(function () {
  'use strict';

  var C = window.CONFIG || CONFIG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var set = function (id, v) { var el = document.getElementById(id); if (el) el.textContent = v; };

  /* ---------------- Backgrounds ---------------- */
  var IMG = {
    hero: 'hero-aisle.webp',
    arch: 'arch.webp',
    velvet: 'velvet.webp',
    stationery: 'stationery.webp',
    rings: 'rings.webp'
  };
  $$('.sec__bg, .cover__bg').forEach(function (el) {
    var k = el.getAttribute('data-bg');
    if (IMG[k]) el.style.backgroundImage = 'url("' + IMG[k] + '")';
  });

  /* ---------------- Text tokens ---------------- */
  $$('[data-t]').forEach(function (el) {
    var v = C.text[el.getAttribute('data-t')];
    if (v) el.textContent = v;
  });

  /* ---------------- Couple ---------------- */
  var cp = C.couple;
  set('coverInitials', cp.initials);
  set('coverGroom', cp.groomShort);
  set('coverBride', cp.brideShort);
  set('groomFull', cp.groomFull);
  set('brideFull', cp.brideFull);
  set('groomOrder', cp.groomOrder);
  set('brideOrder', cp.brideOrder);
  set('groomFather', cp.groomFather);
  set('groomMother', cp.groomMother);
  set('brideFather', cp.brideFather);
  set('brideMother', cp.brideMother);
  set('closingNames', cp.groomShort + ' & ' + cp.brideShort);
  set('closingFams', cp.groomFather + ' & ' + cp.groomMother + '  ·  ' + cp.brideFather + ' & ' + cp.brideMother);
  document.title = cp.groomShort + ' & ' + cp.brideShort + ' — Wedding Invitation';

  (function photos() {
    [['groomPhoto', cp.groomPhoto, cp.groomShort], ['bridePhoto', cp.bridePhoto, cp.brideShort]]
      .forEach(function (p) {
        var el = document.getElementById(p[0]);
        if (!el) return;
        if (p[1]) { el.style.backgroundImage = 'url("' + p[1] + '")'; el.innerHTML = ''; }
        else { var t = $('.monogram__txt', el); if (t) t.textContent = (p[2] || '').charAt(0); }
      });
  })();

  (function socials() {
    [['groomIg', cp.groomInstagram], ['brideIg', cp.brideInstagram]].forEach(function (p) {
      var el = document.getElementById(p[0]);
      if (!el) return;
      if (p[1]) { el.href = 'https://instagram.com/' + String(p[1]).replace('@', ''); el.hidden = false; }
    });
  })();

  /* ---------------- Dates ---------------- */
  var WD = new Date(C.weddingDate);
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var pad = function (n) { return n < 10 ? '0' + n : '' + n; };

  // Display the date in the wedding's own timezone, not the viewer's
  var offMin = (function () {
    var m = /([+-])(\d{2}):(\d{2})$/.exec(C.weddingDate);
    return m ? (m[1] === '-' ? -1 : 1) * (parseInt(m[2], 10) * 60 + parseInt(m[3], 10)) : -new Date().getTimezoneOffset();
  })();
  var local = new Date(WD.getTime() + (offMin + new Date().getTimezoneOffset()) * 60000);

  set('coverDate', pad(local.getDate()) + ' . ' + pad(local.getMonth() + 1) + ' . ' + local.getFullYear());
  set('countHeading', local.getDate() + ' ' + MONTHS[local.getMonth()] + ' ' + local.getFullYear());
  set('year', String(new Date().getFullYear()));

  var gcalStamp = function (iso) {
    return new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  /* ---------------- Venue ---------------- */
  var V = C.venue;
  var mapsUrl = V.mapsUrlOverride ||
    ('https://www.google.com/maps/search/?api=1&query=' + V.lat + ',' + V.lng);
  var dirUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + V.lat + ',' + V.lng;

  set('venueName', V.name);
  var addr = $('#venueAddr');
  if (addr) { addr.textContent = V.addressLine; addr.href = mapsUrl; }
  var dir = $('#dirBtn'); if (dir) dir.href = dirUrl;
  var frame = $('#mapFrame');
  if (frame) frame.src = 'https://maps.google.com/maps?q=' + V.lat + ',' + V.lng + '&z=16&hl=en&output=embed';

  var calDesc = 'The wedding of ' + cp.groomFull + ' & ' + cp.brideFull + '. We would be honoured by your presence.';
  var calLocation = V.name + ', ' + V.addressLine;

  var calUrl = function (title, start, end) {
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent(title) +
      '&dates=' + gcalStamp(start) + '/' + gcalStamp(end) +
      '&details=' + encodeURIComponent(calDesc) +
      '&location=' + encodeURIComponent(calLocation) +
      '&sf=true&output=xml';
  };

  var main = C.events[C.events.length - 1] || { start: C.weddingDate, end: C.weddingDate };
  var calBtn = $('#calBtn');
  if (calBtn) calBtn.href = calUrl('Wedding of ' + cp.groomShort + ' & ' + cp.brideShort, C.events[0] ? C.events[0].start : C.weddingDate, main.end);

  /* ---------------- Events ---------------- */
  var ICONS = {
    ring: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="15" cy="25" r="9.5"/><circle cx="26" cy="22" r="9.5"/><path d="M23 9.5l3-3.5 3 3.5-3 3.5z"/><path d="M26 13v-.5"/></svg>',
    glass: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M11 6h8l-2 12a2 2 0 0 1-4 0z"/><path d="M15 18v14M11 34h8"/><path d="M29 6h-8l2 12a2 2 0 0 0 4 0z"/><path d="M25 18v14M21 34h8"/></svg>',
    heart: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M20 32S7 24 7 16a6.5 6.5 0 0 1 13-2 6.5 6.5 0 0 1 13 2c0 8-13 16-13 16z"/></svg>'
  };
  var calIco = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18M8 3v4M16 3v4"/></svg>';

  var list = $('#eventList');
  if (list) {
    list.innerHTML = C.events.map(function (e) {
      return '<article class="evt reveal">' +
        '<div class="evt__ico">' + (ICONS[e.icon] || ICONS.heart) + '</div>' +
        '<h3 class="evt__name">' + esc(e.name) + '</h3>' +
        '<p class="evt__sub">' + esc(e.subtitle || '') + '</p>' +
        '<p class="evt__row">' + esc(e.dateLabel) + '</p>' +
        '<p class="evt__row">' + esc(e.timeLabel) + '</p>' +
        '<a class="evt__cal" target="_blank" rel="noopener" href="' + esc(calUrl(e.name + ' — ' + cp.groomShort + ' & ' + cp.brideShort, e.start, e.end)) + '">' +
        calIco + 'Add to Calendar</a>' +
        '</article>';
    }).join('');
  }

  /* ---------------- Gift ---------------- */
  var giftIco = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><rect x="4" y="8" width="14" height="13" rx="2"/><path d="M8 8V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v11"/></svg>';
  set('giftHeading', C.gift.heading);
  set('giftIntro', C.gift.intro);

  var gc = $('#giftCards');
  if (gc) {
    var html = C.gift.banks.map(function (b) {
      return '<article class="giftcard reveal">' +
        '<p class="giftcard__label">Bank Transfer</p>' +
        '<p class="giftcard__bank">' + esc(b.bankName) + '</p>' +
        '<p class="giftcard__num">' + esc(b.accountNumber) + '</p>' +
        '<p class="giftcard__holder">a.n. ' + esc(b.accountHolder) + '</p>' +
        '<button type="button" class="copy" data-copy="' + esc(b.accountNumber) + '">' + giftIco + '<span>Copy number</span></button>' +
        '</article>';
    }).join('');
    var a = C.gift.address;
    if (a && a.line) {
      html += '<article class="giftcard reveal">' +
        '<p class="giftcard__label">' + esc(a.label || 'Send a gift to') + '</p>' +
        '<p class="giftcard__bank">' + esc(a.recipient) + '</p>' +
        '<p class="giftcard__addr">' + esc(a.line) + '</p>' +
        '<button type="button" class="copy" data-copy="' + esc(a.recipient + ' — ' + a.line) + '">' + giftIco + '<span>Copy address</span></button>' +
        '</article>';
    }
    gc.innerHTML = html;
  }

  /* ---------------- Playlist ---------------- */
  if (C.music.spotifyPlaylist) {
    var pl = $('#playlistLink');
    if (pl) { pl.href = C.music.spotifyPlaylist; pl.hidden = false; }
  }

  /* ---------------- Guest name from ?to= ---------------- */
  (function guest() {
    var q = new URLSearchParams(location.search);
    var name = q.get('to') || q.get('guest') || q.get('kepada');
    if (!name) return;
    name = decodeURIComponent(name.replace(/\+/g, ' ')).slice(0, 60);
    set('guestName', name);
    var b = $('#guestBlock'); if (b) b.hidden = false;
    var f = $('#fName'); if (f) f.value = name;
  })();

  /* ---------------- Toast ---------------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('is-show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-show'); }, 2400);
  }

  /* ---------------- Copy buttons ---------------- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.copy') : null;
    if (!btn) return;
    var txt = btn.getAttribute('data-copy');
    var done = function () {
      btn.classList.add('is-done');
      var lab = $('span', btn); var old = lab.textContent;
      lab.textContent = 'Copied';
      toast('Copied to clipboard');
      setTimeout(function () { btn.classList.remove('is-done'); lab.textContent = old; }, 2000);
    };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(txt).then(done).catch(function () { legacyCopy(txt, done); });
    } else legacyCopy(txt, done);
  });
  function legacyCopy(txt, cb) {
    var ta = document.createElement('textarea');
    ta.value = txt; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); cb(); } catch (err) { toast('Copy failed — please copy manually'); }
    document.body.removeChild(ta);
  }

  /* ---------------- Countdown ---------------- */
  (function countdown() {
    var target = WD.getTime();
    var d = $('#cdD'), h = $('#cdH'), m = $('#cdM'), s = $('#cdS');
    if (!d) return;
    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        $('#countGrid').hidden = true;
        $('#countDone').hidden = false;
        clearInterval(iv);
        return;
      }
      var sec = Math.floor(diff / 1000);
      d.textContent = pad(Math.floor(sec / 86400));
      h.textContent = pad(Math.floor(sec % 86400 / 3600));
      m.textContent = pad(Math.floor(sec % 3600 / 60));
      s.textContent = pad(sec % 60);
    }
    tick();
    var iv = setInterval(tick, 1000);
  })();

  /* ---------------- Reveal on scroll ---------------- */
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (ents) {
    ents.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }) : null;
  function observeReveals() {
    $$('.reveal:not(.is-in)').forEach(function (el) {
      if (io) io.observe(el); else el.classList.add('is-in');
    });
  }
  observeReveals();

  /* ---------------- Music ---------------- */
  var audio = $('#bgm'), musicBtn = $('#musicBtn'), musicReady = false;
  (function music() {
    if (!C.music.file || !audio || !musicBtn) return;
    audio.src = C.music.file;
    audio.volume = 0;
    audio.addEventListener('canplay', function () {
      musicReady = true;
      musicBtn.hidden = false;
    }, { once: true });
    audio.addEventListener('error', function () { musicBtn.hidden = true; });
    audio.load();

    musicBtn.addEventListener('click', function () {
      if (audio.paused) playMusic(); else fadeOut();
    });
  })();

  function playMusic() {
    if (!audio || !musicReady) return;
    var p = audio.play();
    if (p && p.catch) p.catch(function () { });
    musicBtn.classList.add('is-playing');
    musicBtn.setAttribute('aria-pressed', 'true');
    fade(0.45, 900);
  }
  function fadeOut() {
    fade(0, 500, function () { audio.pause(); });
    musicBtn.classList.remove('is-playing');
    musicBtn.setAttribute('aria-pressed', 'false');
  }
  function fade(to, ms, done) {
    if (!audio) return;
    var from = audio.volume, t0 = performance.now();
    (function step(t) {
      var k = Math.min(1, (t - t0) / ms);
      audio.volume = Math.max(0, Math.min(1, from + (to - from) * k));
      if (k < 1) requestAnimationFrame(step); else if (done) done();
    })(t0);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && audio && !audio.paused) fadeOut();
  });

  /* ---------------- Cover gate ---------------- */
  (function gate() {
    var cover = $('#cover'), open = $('#openBtn'), mainEl = $('#main');
    if (!open) return;
    open.addEventListener('click', function () {
      cover.classList.add('is-open');
      document.body.classList.remove('is-locked');
      mainEl.classList.add('is-visible');
      mainEl.setAttribute('aria-hidden', 'false');
      playMusic();
      setTimeout(function () { cover.style.display = 'none'; observeReveals(); }, 950);
      loadWishes();
    });
  })();

  /* ============================================================
     RSVP  →  Google Sheets (Apps Script Web App)
     ============================================================ */
  var ENDPOINT = (C.rsvpEndpoint || '').trim();
  var DEMO = !ENDPOINT;
  var localWishes = [];   // optimistic / demo-mode store (in memory only)

  var form = $('#rsvpForm'), submitBtn = $('#submitBtn'), note = $('#formNote');

  // Hide the guest count when "Not Attending" is picked
  $$('input[name=attendance]').forEach(function (r) {
    r.addEventListener('change', function () {
      var gf = $('#guestsField');
      var no = r.value === 'Not Attending' && r.checked;
      gf.hidden = no;
      if (no) $('#fGuests').value = 0;
      else if (+$('#fGuests').value === 0) $('#fGuests').value = 1;
    });
  });

  $$('.stepper__btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var inp = $('#fGuests');
      var v = (parseInt(inp.value, 10) || 0) + parseInt(b.getAttribute('data-step'), 10);
      inp.value = Math.max(0, Math.min(20, v));
    });
  });

  var msg = $('#fMessage'), msgCount = $('#msgCount');
  if (msg) msg.addEventListener('input', function () { msgCount.textContent = msg.value.length; });

  function fieldError(name, text) {
    var el = $('[data-err="' + name + '"]');
    if (el) el.textContent = text || '';
    var wrap = el ? el.closest('.field') : null;
    if (wrap) wrap.classList.toggle('is-invalid', !!text);
  }

  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = $('#fName').value.trim();
    var att = (form.querySelector('input[name=attendance]:checked') || {}).value;
    var guests = parseInt($('#fGuests').value, 10) || 0;
    var message = msg.value.trim();

    fieldError('name', ''); fieldError('attendance', '');
    var bad = false;
    if (name.length < 2) { fieldError('name', 'Please tell us your name.'); bad = true; }
    if (!att) { fieldError('attendance', 'Please choose one.'); bad = true; }
    if (bad) { note.textContent = ''; return; }

    var payload = {
      name: name,
      attendance: att,
      guests: att === 'Not Attending' ? 0 : guests,
      message: message,
      userAgent: navigator.userAgent.slice(0, 180),
      page: location.href
    };

    submitBtn.classList.add('is-busy');
    submitBtn.disabled = true;
    note.className = 'formnote';
    note.textContent = 'Sending…';

    var finish = function (ok, text) {
      submitBtn.classList.remove('is-busy');
      submitBtn.disabled = false;
      note.className = 'formnote ' + (ok ? 'is-ok' : 'is-bad');
      note.textContent = text;
      if (ok) {
        if (message) {
          prependWish({ name: name, message: message, attendance: att, timestamp: new Date().toISOString() }, true);
        }
        form.reset();
        msgCount.textContent = '0';
        $('#guestsField').hidden = false;
        toast('Thank you — your RSVP is in 💛');
        setTimeout(function () {
          document.getElementById('wishes').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 600);
      }
    };

    if (DEMO) {
      setTimeout(function () {
        localWishes.unshift({ name: name, message: message, attendance: att, timestamp: new Date().toISOString() });
        finish(true, 'Demo mode — connect Google Sheets to save this for real.');
      }, 700);
      return;
    }

    fetch(ENDPOINT, {
      method: 'POST',
      // text/plain keeps this a "simple request" → no CORS preflight,
      // which Apps Script web apps do not answer.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json().catch(function () { return { ok: true }; }); })
      .then(function (res) {
        if (res && res.ok === false) throw new Error(res.error || 'failed');
        finish(true, 'Thank you! Your RSVP has been received.');
        setTimeout(loadWishes, 1200);
      })
      .catch(function () {
        finish(false, 'Something went wrong. Please check your connection and try again.');
      });
  });

  /* ============================================================
     WISHES WALL
     ============================================================ */
  var wishList = $('#wishList'), wishesMeta = $('#wishesMeta'), moreBtn = $('#moreWishes');
  var allWishes = [], shown = 6, loadedOnce = false;

  function fmtWhen(iso) {
    var t = new Date(iso);
    if (isNaN(t)) return '';
    var diff = (Date.now() - t.getTime()) / 1000;
    if (diff < 60) return 'just now';
    if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
    if (diff < 86400) return Math.floor(diff / 3600) + ' hr ago';
    if (diff < 604800) return Math.floor(diff / 86400) + ' d ago';
    return t.getDate() + ' ' + MONTHS[t.getMonth()].slice(0, 3) + ' ' + t.getFullYear();
  }

  function wishHTML(w) {
    var tag = w.attendance === 'Attending' ? '<span class="wish__tag">Attending</span>' : '';
    return '<article class="wish">' +
      '<h3 class="wish__name">' + esc(w.name) + tag + '</h3>' +
      '<p class="wish__meta">' + esc(fmtWhen(w.timestamp)) + '</p>' +
      '<p class="wish__msg">“' + esc(w.message) + '”</p>' +
      '</article>';
  }

  function renderWishes() {
    if (!wishList) return;
    var withMsg = allWishes.filter(function (w) { return w.message && String(w.message).trim(); });
    if (!withMsg.length) {
      wishList.innerHTML = '<p class="wishes__empty">No wishes yet — be the first to leave one above.</p>';
      wishesMeta.textContent = '';
      moreBtn.hidden = true;
      return;
    }
    wishList.innerHTML = withMsg.slice(0, shown).map(wishHTML).join('');
    wishesMeta.textContent = withMsg.length + (withMsg.length === 1 ? ' wish' : ' wishes');
    moreBtn.hidden = withMsg.length <= shown;
  }

  function prependWish(w, isLocal) {
    allWishes.unshift(w);
    if (isLocal) localWishes.unshift(w);
    renderWishes();
  }

  if (moreBtn) moreBtn.addEventListener('click', function () { shown += 6; renderWishes(); });

  function mergeIn(remote) {
    var seen = {};
    var out = [];
    remote.concat(localWishes).forEach(function (w) {
      var k = (w.name || '').toLowerCase() + '|' + (w.message || '');
      if (seen[k]) return;
      seen[k] = 1; out.push(w);
    });
    out.sort(function (a, b) { return new Date(b.timestamp) - new Date(a.timestamp); });
    allWishes = out;
    renderWishes();
  }

  function loadWishes() {
    if (DEMO) { mergeIn([]); return; }
    var url = ENDPOINT + (ENDPOINT.indexOf('?') > -1 ? '&' : '?') + 'action=wishes&limit=200&_=' + Date.now();
    fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (res) { mergeIn((res && res.wishes) || []); loadedOnce = true; })
      .catch(function () { jsonp(url); });
  }

  // JSONP fallback in case CORS is blocked by the browser
  function jsonp(url) {
    var cb = '__wish_cb_' + Date.now();
    window[cb] = function (res) {
      mergeIn((res && res.wishes) || []);
      loadedOnce = true;
      delete window[cb];
      if (s.parentNode) s.parentNode.removeChild(s);
    };
    var s = document.createElement('script');
    s.src = url + '&callback=' + cb;
    s.onerror = function () { if (!loadedOnce) mergeIn([]); };
    document.body.appendChild(s);
  }

  // Near-real-time refresh while the page is open and visible
  setInterval(function () {
    if (!document.hidden && !DEMO) loadWishes();
  }, Math.max(8000, C.wishesRefreshMs || 20000));

  // If the cover is never used (e.g. deep link), still load
  setTimeout(function () { if (!allWishes.length) loadWishes(); }, 2500);
})();

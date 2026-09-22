/* =============================================================
   main.js — renders the landing page from CONFIG.
   No frameworks, no build step. Everything degrades gracefully
   when a config value is left empty.
   ============================================================= */
(function () {
  "use strict";
  var C = window.CONFIG || {};
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return (C.currency || "₹") + n; };
  var esc = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };

  /* ---------- 1. simple text bindings: data-cfg="key" ---------- */
  var derived = {
    priceNow: money(C.currentPrice),
    priceWas: money(C.originalPrice)
  };
  $$("[data-cfg]").forEach(function (el) {
    var k = el.getAttribute("data-cfg");
    var v = (k in derived) ? derived[k] : C[k];
    if (v !== undefined && v !== null && v !== "") el.textContent = v;
  });

  /* headline money phrase, if overridden in config */
  if (C.heroHeadlineMoney) {
    var moneyEl = $("[data-cfg-hero-money]");
    if (moneyEl) moneyEl.textContent = C.heroHeadlineMoney;
  }

  /* ---------- 2. price strikethrough (only if genuinely the old price) ---------- */
  if (C.showStrikethrough && C.originalPrice && C.originalPrice > C.currentPrice) {
    $$("[data-price-was]").forEach(function (el) {
      el.textContent = money(C.originalPrice);
      el.hidden = false;
    });
  }

  /* ---------- 3. support links ---------- */
  $$("[data-cfg-link]").forEach(function (el) {
    var t = el.getAttribute("data-cfg-link");
    if (t === "email" && C.supportEmail) {
      el.href = "mailto:" + C.supportEmail;
      if (!el.textContent.trim()) el.textContent = C.supportEmail;
      else el.textContent = C.supportEmail;
    }
    if (t === "whatsapp") {
      if (C.whatsappNumber) el.href = "https://wa.me/" + C.whatsappNumber;
      else el.remove();
    }
    if (t === "phone" && C.supportPhone) {
      el.href = "tel:" + String(C.supportPhone).replace(/\s/g, "");
      el.textContent = C.supportPhone;
    }
  });

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 4. announcement bar ---------- */
  var ann = document.getElementById("announce");
  if (ann) {
    var parts = [];
    if (C.seatsLeft != null && C.seatsTotal && C.seatsLeft <= C.seatsTotal * 0.35) {
      parts.push("🔥 Seats almost full");
    } else if (C.seatsLeft != null) {
      parts.push("🔥 " + C.seatsLeft + " seats left");
    }
    parts.push("Registration closes before the session starts ⏰");
    ann.innerHTML = parts.join('<span class="sep">—</span>');
  }

  /* ---------- 5. seats + honest deadline ---------- */
  var seatsKnown = C.showSeatsBadge && typeof C.seatsLeft === "number" && C.seatsLeft >= 0;

  if (seatsKnown) {
    $$("[data-seat-chip]").forEach(function (el) {
      el.textContent = C.seatsLeft + " seats left";
      el.hidden = false;
    });
  }

  var meta = document.getElementById("heroMeta");
  if (meta) {
    var html = "";
    if (seatsKnown && C.seatsTotal) {
      var taken = Math.max(0, Math.min(100, Math.round((1 - C.seatsLeft / C.seatsTotal) * 100)));
      html += '<div class="seats-bar"><span style="width:' + taken + '%"></span></div>';
      html += '<p class="seats-text"><b>' + C.seatsLeft + "</b> of " + C.seatsTotal +
              " seats still open</p>";
    } else if (seatsKnown) {
      html += '<p class="seats-text"><b>' + C.seatsLeft + "</b> seats still open</p>";
    }
    if (C.registrationClosesAt) html += '<p class="countdown" id="countdown"></p>';
    meta.innerHTML = html;
  }

  /* A countdown to one real, fixed date. It never resets and it
     disappears once the deadline passes. */
  var cdEl = document.getElementById("countdown");
  if (cdEl && C.registrationClosesAt) {
    var deadline = new Date(C.registrationClosesAt).getTime();
    var tick = function () {
      var diff = deadline - Date.now();
      if (isNaN(deadline)) { cdEl.remove(); return; }
      if (diff <= 0) { cdEl.textContent = "Registration for this session has closed."; return; }
      var d = Math.floor(diff / 864e5),
          h = Math.floor(diff % 864e5 / 36e5),
          m = Math.floor(diff % 36e5 / 6e4);
      cdEl.innerHTML = "Registration closes in <b>" +
        (d ? d + "d " : "") + h + "h " + m + "m</b>";
      setTimeout(tick, 30000);
    };
    tick();
  }

  /* ---------- 6. video: real URL or clean placeholder ---------- */
  (function video() {
    var box = document.getElementById("videoBox");
    if (!box) return;

    var id = null, src = null, url = C.videoUrl || "";
    var yt = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|live\/)|youtu\.be\/)([\w-]{6,})/);
    var vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);

    if (yt) { id = yt[1]; src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0&playsinline=1"; }
    else if (vm) { src = "https://player.vimeo.com/video/" + vm[1] + "?autoplay=1"; }

    if (!src) {
      box.innerHTML =
        '<div class="video__ph"><span class="video__ph-kicker">Workshop preview</span>' +
        '<strong>Build your channel with a clear plan</strong>' +
        '<span>A practical look at the framework covered in this live session.</span></div>';
      return;
    }

    var poster = C.videoPosterUrl ||
      (id ? "https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg" : "");

    var btn = document.createElement("button");
    btn.className = "video__btn";
    btn.type = "button";
    btn.setAttribute("aria-label", "Play the workshop preview");
    if (poster) btn.style.backgroundImage = "url('" + poster + "')";
    btn.innerHTML = '<span class="video__play"><svg width="26" height="30" viewBox="0 0 26 30" aria-hidden="true">' +
                    '<path d="M0 0l26 15L0 30z" fill="#000"/></svg></span>';

    /* The iframe is only created on click: no third-party load on
       first paint, and never any autoplay with sound. */
    btn.addEventListener("click", function () {
      var f = document.createElement("iframe");
      f.src = src;
      f.title = (C.workshopName || "Workshop") + " preview";
      f.loading = "lazy";
      f.allow = "accelerometer; encrypted-media; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      box.innerHTML = "";
      box.appendChild(f);
    });
    box.appendChild(btn);
  })();

  /* ---------- 7. rating strip (hidden unless real numbers exist) ---------- */
  (function rating() {
    var el = document.getElementById("ratingStrip");
    if (!el || C.ratingValue == null) return;
    var full = Math.round(C.ratingValue);
    var stars = "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
    var avas = (C.testimonials || []).filter(function (t) { return t.photo; }).slice(0, 5);
    var avaHtml = avas.length
      ? '<div class="avatars">' + avas.map(function (t) {
          return '<img src="' + esc(t.photo) + '" alt="" loading="lazy" width="44" height="44">';
        }).join("") + "</div>"
      : "";
    el.innerHTML =
      avaHtml +
      '<div class="rating__chip">' + C.ratingValue + ' <span style="color:#000">★</span></div>' +
      '<p class="rating__line">' + (C.ratingCount ? esc(C.ratingCount) + " reviews " : "") +
      "(" + C.ratingValue + " of 5)</p>" +
      (C.ratingSource ? '<p class="rating__src">Source: ' + esc(C.ratingSource) + "</p>" : "");
    el.hidden = false;
  })();

  /* ---------- 8. testimonials ---------- */
  (function testimonials() {
    var wrapEl = document.getElementById("testimonials");
    var sec = document.getElementById("reviews");
    if (!wrapEl || !sec) return;
    var list = (C.showTestimonials && C.testimonials) || [];
    if (!list.length) return;

    var isPlaceholder = list.some(function (t) { return /^\s*\[/.test(t.text || ""); });

    wrapEl.innerHTML = list.map(function (t) {
      var r = Math.max(0, Math.min(5, t.rating || 5));
      var ava = t.photo
        ? '<img class="tcard__ava" src="' + esc(t.photo) + '" alt="" loading="lazy" width="46" height="46">'
        : '<span class="tcard__ava" aria-hidden="true">' + esc((t.name || "?").replace(/[^A-Za-z]/g, "").charAt(0) || "•") + "</span>";
      var where = [t.name, t.city].filter(Boolean).map(esc).join(", ");
      return '<figure class="tcard">' +
               '<blockquote class="tcard__text">“' + esc(t.text) + '”</blockquote>' +
               '<figcaption class="tcard__who">' + ava +
                 "<span><span class=\"tcard__name\">" + where + "</span>" +
                 '<span class="tcard__stars" aria-label="' + r + ' out of 5">' +
                 "★★★★★".slice(0, r) + "</span></span>" +
               "</figcaption></figure>";
    }).join("");

    if (isPlaceholder) {
      var note = document.getElementById("testimonialNote");
      note.textContent = "Development placeholders. Replace them with real testimonials in js/config.js, or set showTestimonials to false.";
      note.hidden = false;
    }
    sec.hidden = false;
  })();

  /* ---------- 9. list sections ---------- */
  var ICON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e9a400" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';

  var cur = document.getElementById("curriculum");
  if (cur) cur.innerHTML = (C.curriculum || []).map(function (c) {
    return '<article class="card reveal"><div class="card__icon">' + ICON + "</div>" +
           "<h3>" + esc(c.title) + "</h3><p>" + esc(c.text) + "</p></article>";
  }).join("");

  var aud = document.getElementById("audience");
  if (aud) aud.innerHTML = (C.audience || []).map(function (a) {
    return '<article class="who reveal"><span class="who__mark" aria-hidden="true"></span>' +
           "<div><h3>" + esc(a.title) + "</h3><p>" + esc(a.text) + "</p></div></article>";
  }).join("");

  var inc = document.getElementById("inclusions");
  if (inc) {
    var tick = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';
    inc.innerHTML = (C.inclusions || []).filter(function (i) { return i.included; })
      .map(function (i) {
        return '<div class="incl"><span class="incl__tick">' + tick + "</span>" +
               "<div><h3>" + esc(i.title) + "</h3><p>" + esc(i.text) + "</p></div></div>";
      }).join("");
  }

  var ag = document.getElementById("agendaList");
  if (ag) ag.innerHTML = (C.agenda || []).map(function (a) {
    return '<div class="agenda__item"><span class="agenda__time">' + esc(a.time) + "</span>" +
           '<span class="agenda__dot" aria-hidden="true"></span>' +
           "<h3>" + esc(a.title) + "</h3><p>" + esc(a.text) + "</p></div>";
  }).join("");

  /* trust — genuine, checkable statements only */
  var tr = document.getElementById("trustList");
  if (tr) {
    var rows = [
      ["Direct UPI payment", "Your UPI PIN stays inside your payment app and never reaches this site."],
      ["Manual confirmation", "Send the UTR/reference on WhatsApp after paying and we will confirm your seat."],
      ["Real support contact", (C.supportEmail || "") + (C.supportPhone ? " · " + C.supportPhone : "")],
      ["Refund policy in writing", "Read it before you pay — linked in the footer."],
      ["Privacy policy", "What we collect, and what we don't."],
      ["Terms & conditions", "What you're agreeing to when you register."]
    ];
    tr.innerHTML = rows.map(function (r) {
      return '<div class="trust__row">' + ICON + "<div><b>" + esc(r[0]) + "</b><span>" + esc(r[1]) + "</span></div></div>";
    }).join("");
  }

  /* ---------- 10. FAQ accordion (animated, keyboard accessible) ---------- */
  (function faq() {
    var el = document.getElementById("faqList");
    if (!el) return;
    el.innerHTML = (C.faqs || []).map(function (f, i) {
      return '<div class="faq__item"><h3>' +
             '<button class="faq__q" type="button" aria-expanded="false" aria-controls="faq-a' + i + '">' +
             esc(f.q) + "</button></h3>" +
             '<div class="faq__a" id="faq-a' + i + '" role="region"><p>' + esc(f.a) + "</p></div></div>";
    }).join("");

    el.addEventListener("click", function (e) {
      var btn = e.target.closest(".faq__q");
      if (!btn) return;
      var item = btn.closest(".faq__item");
      var panel = item.querySelector(".faq__a");
      var open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
      panel.style.height = open ? panel.scrollHeight + "px" : "0px";
    });
    window.addEventListener("resize", function () {
      $$(".faq__item.open .faq__a", el).forEach(function (p) { p.style.height = p.scrollHeight + "px"; });
    });
  })();

  /* ---------- 11. sticky bar: out of the way near the final CTA ---------- */
  (function sticky() {
    var bar = document.getElementById("stickyBar");
    var final = document.querySelector(".final");
    if (!bar || !final || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(function (entries) {
      bar.classList.toggle("is-down", entries[0].isIntersecting);
    }, { threshold: 0.35 }).observe(final);
  })();

  /* ---------- 12. one gentle reveal on cards ---------- */
  (function reveal() {
    var items = $$(".reveal");
    if (!items.length || !("IntersectionObserver" in window) ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(function (i) { i.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (i) { io.observe(i); });
  })();

  /* ---------- 13. carry UTM / referral params into checkout ---------- */
  (function passThrough() {
    var qs = window.location.search;
    if (!qs || qs.length < 2) return;
    $$('a[href^="checkout.html"]').forEach(function (a) {
      a.href = "checkout.html" + qs;
    });
  })();

  /* ---------- 14. Schema.org Event (real details only) ---------- */
  (function schema() {
    var slot = document.getElementById("eventSchema");
    if (!slot) return;
    var data = {
      "@context": "https://schema.org",
      "@type": "Event",
      name: C.workshopName,
      description: C.metaDescription,
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: { "@type": "VirtualLocation", url: C.siteUrl || "" },
      offers: {
        "@type": "Offer",
        price: C.currentPrice,
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        url: (C.siteUrl ? C.siteUrl + "/" : "") + "checkout.html"
      }
    };
    slot.textContent = JSON.stringify(data);
  })();

  /* ---------- 15. page title / meta from config ---------- */
  if (C.metaTitle) document.title = C.metaTitle;
  var md = document.querySelector('meta[name="description"]');
  if (md && C.metaDescription) md.setAttribute("content", C.metaDescription);
})();

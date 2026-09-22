/* =============================================================
  checkout.js
  Validates the form, then hands the customer to UPI.

  This page cannot verify payment. The buyer sends the UTR and screenshot
  by WhatsApp or email, and the seller verifies it manually.
   ============================================================= */
(function () {
  "use strict";
  var C = window.CONFIG || {};
  var $ = function (s) { return document.querySelector(s); };
  var money = function (n) { return (C.currency || "₹") + n; };

  /* ---------- shared bindings ---------- */
  var derived = { priceNow: money(C.currentPrice), priceWas: money(C.originalPrice) };
  Array.prototype.forEach.call(document.querySelectorAll("[data-cfg]"), function (el) {
    var k = el.getAttribute("data-cfg");
    var v = (k in derived) ? derived[k] : C[k];
    if (v !== undefined && v !== null && v !== "") el.textContent = v;
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-cfg-link]"), function (el) {
    var t = el.getAttribute("data-cfg-link");
    if (t === "email" && C.supportEmail) el.href = "mailto:" + C.supportEmail;
    else if (t === "whatsapp" && C.whatsappNumber) el.href = "https://wa.me/" + C.whatsappNumber;
    else if (t === "phone" && C.supportPhone) el.href = "tel:" + String(C.supportPhone).replace(/\s/g, "");
  });
  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();

  var whenEl = $("#sumWhen");
  if (whenEl) whenEl.textContent = [C.workshopDate, C.workshopTime, C.duration, C.format]
    .filter(Boolean).join(" · ");

  /* ---------- pricing state ---------- */
  var base = Number(C.currentPrice) || 0;
  var discount = 0;

  function renderTotals() {
    $("#sumBase").textContent = money(base);
    var row = $("#sumDiscountRow");
    if (discount > 0) { row.hidden = false; $("#sumDiscount").textContent = "− " + money(discount); }
    else { row.hidden = true; }
    var total = Math.max(0, base - discount);
    $("#sumTotal").textContent = money(total);
    var span = document.querySelector('#payBtn [data-cfg="priceNow"]');
    if (span) span.textContent = money(total);
    return total;
  }
  renderTotals();

  /* ---------- coupons (only if you've configured real ones) ---------- */
  var coupons = C.coupons || {};
  if (Object.keys(coupons).length) {
    $("#couponWrap").hidden = false;
    $("#applyCoupon").addEventListener("click", function () {
      var code = ($("#coupon").value || "").trim().toUpperCase();
      var msg = $("#couponMsg");
      if (!code) { msg.className = "coupon__msg no"; msg.textContent = "Enter a code first."; return; }
      if (coupons[code]) {
        discount = Number(coupons[code]) || 0;
        msg.className = "coupon__msg ok";
        msg.textContent = code + " applied — " + money(discount) + " off.";
      } else {
        discount = 0;
        msg.className = "coupon__msg no";
        msg.textContent = "That code isn't valid for this workshop.";
      }
      renderTotals();
    });
  }

  /* ---------- validation ---------- */
  var rules = {
    name:  function (v) { return v.trim().length >= 2 && /[A-Za-z\u0900-\u097F]/.test(v); },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v.trim()); },
    phone: function (v) { return /^[6-9]\d{9}$/.test(v.replace(/\D/g, "")); }
  };

  function setError(id, bad) {
    var f = $("#f-" + id);
    if (f) f.classList.toggle("err", !!bad);
    return !bad;
  }

  ["name", "email", "phone"].forEach(function (id) {
    var input = $("#" + id);
    input.addEventListener("blur", function () {
      if (input.value) setError(id, !rules[id](input.value));
    });
    input.addEventListener("input", function () { setError(id, false); });
  });

  $("#phone").addEventListener("input", function (e) {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
  });

  /* ---------- payment handoff ---------- */
  var payBtn = $("#payBtn");
  var hasUpi = C.paymentMethod === "upi" && !!(C.upiId && /^[^\s@]+@[^\s@]+$/.test(C.upiId));

  if (!hasUpi) {
    $("#setupNotice").hidden = false;
    payBtn.disabled = true;
  }

  $("#regForm").addEventListener("submit", function (e) {
    e.preventDefault();

    var data = {
      name:  $("#name").value.trim(),
      email: $("#email").value.trim(),
      phone: $("#phone").value.replace(/\D/g, "")
    };

    var ok = true;
    ["name", "email", "phone"].forEach(function (id) {
      var valid = rules[id](data[id] || "");
      if (!setError(id, !valid)) ok = false;
    });
    if (!ok) {
      var firstBad = document.querySelector(".field.err input");
      if (firstBad) { firstBad.focus(); firstBad.scrollIntoView({ block: "center", behavior: "smooth" }); }
      return;
    }

    /* Keep the details locally so the success page can greet them by
       name. This is a convenience only — it is never proof of payment. */
    try {
      sessionStorage.setItem("reg", JSON.stringify({
        name: data.name, email: data.email, phone: data.phone, at: Date.now()
      }));
    } catch (err) { /* private mode: not important */ }

    payBtn.disabled = true;
    payBtn.textContent = "Opening your UPI app…";

    if (hasUpi) {
      var upiUrl = "upi://pay?pa=" + encodeURIComponent(C.upiId) +
        "&pn=" + encodeURIComponent(C.upiPayeeName || C.brandName || "Workshop") +
        "&am=" + encodeURIComponent(String(Math.max(0, base - discount))) +
        "&cu=INR&tn=" + encodeURIComponent(("Workshop - " + data.name).slice(0, 45));
      var nextStep = $("#upiNextStep");
      if (nextStep) nextStep.hidden = false;
      var confirmLink = $("#upiConfirmLink");
      if (confirmLink && C.whatsappNumber) {
        confirmLink.href = "https://wa.me/" + C.whatsappNumber + "?text=" + encodeURIComponent(
          "Hi, I paid ₹" + Math.max(0, base - discount) + " for " +
          (C.workshopName || "the workshop") + ". My name is " + data.name +
          ", email is " + data.email + ", phone is +91" + data.phone +
          ". My UTR/payment reference is: . I will attach my payment screenshot."
        );
      }
      var emailLink = $("#upiEmailLink");
      if (emailLink && C.supportEmail) {
        var subject = "Payment confirmation - " + (C.workshopName || "Workshop");
        var body = "Hi,\n\nI paid ₹" + Math.max(0, base - discount) + " for " +
          (C.workshopName || "the workshop") + ".\n\nName: " + data.name +
          "\nEmail: " + data.email + "\nPhone: +91" + data.phone +
          "\nUTR/payment reference: " +
          "\n\nI have attached my payment screenshot.";
        emailLink.href = "mailto:" + C.supportEmail + "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(body);
      }
      window.location.href = upiUrl;
      payBtn.disabled = false;
      payBtn.textContent = "Open UPI app again";
      return;
    }

  });
})();

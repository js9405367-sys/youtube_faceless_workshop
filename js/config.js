/* =============================================================
   SITE CONFIG — edit this file only.
   Everything on every page reads from here.
  Check the launch settings below before publishing.
   ============================================================= */

const CONFIG = {

  /* ---------- Brand ---------- */
  brandName: "Faceless YouTube Workshop",
  workshopName: "The Faceless YouTube Workshop",
  tagline: "A 3-hour live session on building a faceless YouTube channel",

  /* The gold phrase in the hero headline. Only claim a range you can
     actually stand behind — it is the line people screenshot.        */
  heroHeadlineMoney: "making ₹50K–₹1L extra",

  /* ---------- Schedule (shown across all pages) ---------- */
  workshopDate: "25th September",
  workshopDay: "Friday",
  workshopTime: "11:00 AM IST",
  duration: "3 Hours",
  format: "LIVE Online Workshop",
  platform: "Zoom",

  /* ---------- Registration deadline (real, fixed date) ----------
     Used for the honest countdown. Set it to the actual moment
     registration closes. ISO format, with timezone offset.
     Set to null to hide the countdown entirely.                 */
  registrationClosesAt: "2026-09-25T10:30:00+05:30",

  /* ---------- Seats ----------
     A manually configured seat limit. Update it yourself.
     Nothing here auto-decreases or resets. Set seatsLeft to null
     to hide all seat messaging.                                  */
  seatsTotal: 200,
  seatsLeft: 37,
  showSeatsBadge: true,

  /* ---------- Pricing ----------
     originalPrice is only displayed if showStrikethrough is true.
      Only set it true if ₹299 is genuinely your normal price.     */
  currency: "₹",
    originalPrice: 299,
  currentPrice: 29,
  showStrikethrough: true,

  /* ---------- Payment ----------
      Direct UPI works on a static GitHub Pages site and does not need
      a payment gateway. Buyers pay your UPI ID in their own app, then
      send the UTR/reference to you for manual verification.

    Set upiId and upiPayeeName before publishing. */
  paymentMethod: "upi",
  upiId: "6398299060@ybl",
  upiPayeeName: "Faceless YouTube Workshop",

  /* ---------- Video ----------
     Paste a YouTube/Vimeo watch or embed URL. Leave blank to show
     a clean placeholder instead of a fake video.                 */
  videoUrl: "",                                    // optional YouTube or Vimeo URL
  videoPosterUrl: "",                              // optional custom thumbnail

  /* ---------- Ratings ----------
     Leave ratingValue null until you have real numbers. The whole
     rating strip disappears when it is null.                     */
  ratingValue: null,                               // e.g. 4.8
  ratingCount: null,                               // e.g. "15K+"
  ratingSource: "",                                // e.g. "Google Reviews" — say where it comes from

  /* ---------- Testimonials ----------
      Every entry below is a PLACEHOLDER for development.
      Replace with real ones or set showTestimonials to false.     */
  showTestimonials: false,
  testimonials: [],

  /* ---------- What you'll learn ---------- */
  curriculum: [
    { title: "How faceless channels work",  text: "The formats that work without ever being on camera, and why they scale." },
    { title: "Finding a niche",             text: "How to pick a topic with real search demand instead of guessing." },
    { title: "Content creation workflow",   text: "A start-to-finish process for turning an idea into a finished video." },
    { title: "AI-assisted research",        text: "Using AI tools for research and scripting without sounding like a robot." },
    { title: "Thumbnails and titles",       text: "What makes people click, and how to test your way to better ones." },
    { title: "Monetisation basics",         text: "How the YouTube Partner Programme works and what the requirements are." },
    { title: "Analytics that matter",       text: "The handful of numbers worth watching, and what to change when they dip." },
    { title: "A publishing system",         text: "Building a schedule you can actually keep while working full time." }
  ],

  /* ---------- Who it's for ---------- */
  audience: [
    { title: "Working professionals", text: "You have evenings and weekends, not a free calendar." },
    { title: "Students",              text: "You want a skill that compounds before you graduate." },
    { title: "Freelancers",           text: "You want income that isn't billed by the hour." },
    { title: "Complete beginners",    text: "You've never uploaded a video and that's fine." },
    { title: "Camera-shy creators",   text: "You want to publish without your face or voice being the product." }
  ],

  /* ---------- What you get ----------
     Set included:false for anything you are not actually giving.
     Excluded items are simply not rendered.                      */
  inclusions: [
    { title: "3-hour live workshop",   text: "Taught live, with questions answered as we go.", included: true },
    { title: "Practical walkthroughs", text: "Real examples worked through on screen.",        included: true },
    { title: "Live Q&A",               text: "A dedicated block at the end for your questions.", included: true },
    { title: "Templates and resources", text: "[Only keep this if you actually provide them.]", included: false },
    { title: "Session recording",      text: "[Only keep this if you actually provide it.]",   included: false },
    { title: "Community access",       text: "[Only keep this if it actually exists.]",        included: false }
  ],

  /* ---------- Agenda ---------- */
  agenda: [
    { time: "11:00", title: "Introduction",          text: "What the session covers and how to get the most from it." },
    { time: "11:20", title: "The YouTube opportunity", text: "Where faceless content sits in the platform today." },
    { time: "12:00", title: "Finding a niche",       text: "Demand research, and judging whether a topic is worth it." },
    { time: "12:40", title: "The content system",    text: "Research, script, voice, visuals, edit, publish." },
    { time: "13:20", title: "Monetisation",          text: "How channels earn, and the requirements involved." },
    { time: "13:45", title: "Live Q&A",              text: "Open floor." },
    { time: "14:00", title: "Closing and next steps", text: "What to do in the first week after the workshop." }
  ],

  /* ---------- FAQs ---------- */
  faqs: [
    { q: "Is the workshop live?",
      a: "Yes. It runs live online, so you can ask questions during the session." },
    { q: "Is it suitable for complete beginners?",
      a: "Yes. No prior YouTube experience is assumed. Everything starts from zero." },
    { q: "Do I need an existing YouTube channel?",
      a: "No. You can attend with nothing set up. Creating a channel is free and takes a few minutes." },
    { q: "Will I have to show my face?",
      a: "No. The whole session is about formats that work without appearing on camera." },
    { q: "What equipment do I need?",
      a: "A laptop or phone and a stable internet connection to attend. For making videos afterwards, a basic laptop and a usable microphone are enough to start." },
    { q: "How long is the workshop?",
      a: "About three hours, including the Q&A." },
    { q: "Will I get a recording?",
      a: "No recording is included. The workshop is delivered live, with time for questions during the session." },
    { q: "What is the refund policy?",
      a: "It is set out in full on the refund policy page linked in the footer. Please read it before paying." },
    { q: "How do I get the joining link?",
      a: "After you pay by UPI, send the UTR/payment reference on WhatsApp. Once we verify it, we send the joining link to the email address you entered." },
    { q: "How do I contact support?",
      a: "Email or WhatsApp us using the details in the footer. We reply within one working day." }
  ],

  /* ---------- Contact ---------- */
  supportEmail: "sharnoor440@gmail.com",
  supportPhone: "+91 84492 81088",
  whatsappNumber: "918449281088",                  // digits only, with country code
  businessName: "Faceless YouTube Workshop",
  supportHours: "Mon–Sat, 10:00 AM – 7:00 PM IST",

  /* ---------- Social ---------- */
  social: { youtube: "", instagram: "", linkedin: "", twitter: "" },

  /* ---------- Coupons ----------
     Optional. Purely cosmetic here: the real amount charged is
    whatever your payment instructions are set to. Only add a coupon
    here if you have also arranged the matching discounted payment.
     Example: { "EARLY20": 20 } = ₹20 off.                        */
  coupons: {},

  /* ---------- SEO ---------- */
  siteUrl: "",                                     // optional public GitHub Pages URL
  metaTitle: "Faceless YouTube Workshop — 3-hour live session",
  metaDescription: "A live 3-hour online workshop on building a faceless YouTube channel around a full-time job. Limited seats.",
  ogImage: ""                                      // optional, e.g. "images/og.jpg"
};

if (typeof window !== "undefined") window.CONFIG = CONFIG;

# youtube_faceless_workshop
Master the art of running automated, faceless YouTube channels. Includes starter scripts, video editing automation workflows, AI prompt templates, and resource guides from the workshop.
# Workshop landing page

A mobile-first landing page and registration flow for a paid live online workshop.
Plain HTML, CSS and JavaScript — no build step, no dependencies, no server.
It runs as-is on GitHub Pages at `https://<your-username>.github.io/<repo-name>/`.

---

## Put it online (about 5 minutes)

1. Create a new repository on GitHub — public, no README.
2. Upload every file and folder here, keeping the structure intact.
3. Repository → **Settings → Pages**.
4. Under *Build and deployment*, set Source = **Deploy from a branch**, Branch = **main**, folder = **/ (root)**. Save.
5. Wait a minute, then open the URL GitHub shows you. HTTPS is on by default.

To update anything later, edit the file on GitHub and commit. The site rebuilds itself.

---

## Edit the content

**Everything you need to customize lives in one file: `js/config.js`.** You never need to touch the HTML.

Before publishing, check these settings:

| Setting | What it does |
| --- | --- |
| `workshopDate`, `workshopTime`, `duration` | The pill strip in the hero, order summary, confirmation page |
| `seatsLeft`, `seatsTotal` | The "seats left" badges and the progress bar |
| `registrationClosesAt` | The countdown. One fixed date — it never resets |
| `originalPrice`, `currentPrice` | Pricing everywhere, including the struck-through price |
| `paymentMethod`, `upiId` | Direct UPI payment settings |
| `upiPayeeName` | Name shown in the buyer's UPI app |
| `videoUrl` | The hero video. Blank shows a placeholder instead |
| `supportEmail`, `supportPhone`, `whatsappNumber` | Every support link on the site |
| `siteUrl` | Optional public GitHub Pages URL for SEO metadata |

Some things are switched off until they are real:

- `ratingValue: null` → the whole rating strip is hidden.
- `showTestimonials: false` → the reviews section disappears.
- Testimonials written in `[square brackets]` render with a visible "development placeholder" note, so a placeholder can never quietly go live as a real review.
- Any item in `inclusions` with `included: false` is simply not shown.

---

## Connect payments (direct UPI)

This version works on GitHub Pages and can be linked from an Instagram ad. It
opens the buyer's UPI app with the amount prefilled; no gateway account or
secret key is needed.

1. Set `paymentMethod: "upi"` in `js/config.js`.
2. Replace `upiId` with your real UPI ID and replace `upiPayeeName` with the
   name buyers should see.
3. Replace `whatsappNumber` with your WhatsApp Business number, including the
   country code and digits only.
4. Test with a small payment. The buyer sends the UTR/payment reference in the
   WhatsApp link shown after payment, and you verify it manually before sending
   the joining link.

GitHub Pages cannot verify UPI payments or automatically send messages to both
people. The buyer must send the UTR and screenshot through WhatsApp or email,
and you verify the payment manually before sending the joining link.

---

## The pages

| File | What it is |
| --- | --- |
| `index.html` | Landing page |
| `checkout.html` | Collects name, email, phone, then opens the buyer's UPI app |
| `success.html` | Legacy confirmation page; direct UPI confirmation happens from checkout |
| `failed.html` | Friendly failure page. Does not claim money was taken |
| `privacy.html`, `terms.html`, `refund.html` | Privacy, terms, and refund policies |
| `contact.html` | Support details |

---

## Before you publish — checklist

- [ ] `upiId` and `upiPayeeName` are correct and tested with a small payment
- [ ] `supportEmail`, `supportPhone` and `whatsappNumber` are correct
- [ ] Read the Terms, Privacy and Refund pages and confirm you will honour them
- [ ] Add `videoUrl` if you want a real video instead of the preview state
- [ ] Testimonials replaced with real ones, or `showTestimonials: false`
- [ ] `ratingValue` left `null` unless you have genuine review numbers and can say where they come from
- [ ] `seatsLeft` reflects your real cap, and you update it yourself
- [ ] `registrationClosesAt` set to the real deadline
- [ ] Struck-through `originalPrice` removed unless ₹499 is genuinely your normal price — showing a discount that never existed is illegal under India's Consumer Protection Act

## Notes on what this deliberately doesn't do

- No timer that resets every time the page loads.
- No "17 people bought in the last 10 minutes" popups.
- No invented reviews, earnings screenshots, subscriber counts or credentials.
- No success page that appears just because someone clicked a button.

Those things convert in the short run and are the exact patterns that get payment
gateways to freeze accounts and attract chargebacks. The urgency here is real:
a seat cap you control and a deadline you set.

## Adding a video

Add a public YouTube or Vimeo URL to `videoUrl` in `js/config.js`. The video
loads only when a visitor presses play.

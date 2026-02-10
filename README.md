# Torn Gainz

**Torn Gainz** is a desktop-first web app designed to help Torn players optimize gym training, compare jump methods, and estimate costs — without compromising privacy or ethical data use.

The project is intentionally pragmatic: it focuses on clarity, control, and transparency over gimmicks or dark patterns.

---

## Current Status

🚧 **Active development**
The app is functional at the UI and state-management level, with the calculator logic still in progress.

### What works today
- Global light/dark theme toggle
- Desktop-first, responsive layout (no horizontal scrolling)
- Shared application state for:
  - Optional Torn API key
  - Consent & telemetry preferences
- Setup/Home page with:
  - API key entry, test, save, and clear flows
  - Clear distinction between API mode and manual mode
  - Explicit consent gating for telemetry
- About and Policy pages (content complete, styling pending)

### What’s still in progress
- Calculator UI layout and interaction design
- Calculator logic (gym gains, cost estimates, jump comparisons)
- Final styling pass for About / Policy text
- Mobile optimization (planned as a dedicated mobile app, not a responsive web afterthought)

---

## Design Principles

### Optional API Usage
- The Torn API key is **optional**
- All calculator functionality will be available in **manual mode**
- API mode exists to reduce friction, not to gate features

### Privacy & Ethics First
- Privacy and ethical data practices are **core values**
- No hidden telemetry
- All data usage is opt-in and explicitly explained
- Telemetry levels are user-controlled and consent-gated

### Desktop-First
- Torn is predominantly played on desktop
- The web app targets desktop ergonomics and clarity first
- A native mobile app is planned instead of forcing awkward responsive compromises

---

## Telemetry (Planned Behavior)

Telemetry is **off by default**.

When enabled (with explicit consent), it may be used to:
- Improve calculator accuracy
- Understand aggregate usage patterns (not individual behavior)
- Guide future feature development

No data is sold, shared, or repurposed beyond what is explicitly stated in the Policy.

---

## Tech Stack

- **SvelteKit** (Svelte 5)
- **TypeScript**
- CSS variables for theming (light/dark)
- Local-first state, with optional persistence

No external UI frameworks — layout and components are intentionally lightweight and readable.

---

## Local Development

npm install

npm run dev

Then open:

http://localhost:5173

## Roadmap (Short Term)

- Build calculator UI skeleton (inputs, sections, modes)
- Wire calculator UI to shared app state (API vs manual, consent)
- Implement core calculator logic
- Polish About & Policy typography
- Internal validation and edge-case handling

## Credits

Developed and maintained by EevieTheFox [3942777]

© 2026

## Disclaimer

Torn Gainz is an independent tool and is not affiliated with Torn Ltd.
Use of the Torn API is subject to Torn’s own terms and rate limits.
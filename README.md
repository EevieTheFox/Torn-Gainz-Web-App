# Torn Gainz

**Torn Gainz** is a player-developed web application designed to help Torn players **optimize their gym gains** through transparent modeling, consent-first design, and respectful use of the Torn API.

This repository currently represents the **foundational architecture phase** of the project.

---

## Project Status

⚠️ **Early Development / Architecture Phase**

At this stage, Torn Gainz focuses on:

- ethical data boundaries
- explicit user consent modeling
- clear separation between client, domain, and server concerns
- a working SvelteKit scaffold wired to the consent system

No production features are finalized yet.

---

## Key Principles

- **Player-developed**: Built by a Torn player, for Torn players
- **Consent-first**: No telemetry or data collection without explicit opt-in
- **Minimal by default**: Full functionality without sharing data
- **API-respectful**: Designed to comply with Torn’s API usage guidelines
- **Transparent architecture**: Data flows and permissions are explicit and inspectable

---

## Current Architecture

The project is structured around clear conceptual layers:

### `src/lib/consent/`
Defines consent state and derives allowed actions from that consent.

- Consent levels
- Capability derivation (what the app is allowed to do)

### `src/lib/domain/`
Pure domain models representing user context and behavior.

- Local-only data definitions
- Manual fallback logic (e.g. faction permissions)

### `src/lib/policy/`
Policy enforcement at the type level.

- Explicit “never collected” data fields
- Guardrails against accidental scope creep

### `src/lib/telemetry/`
Type definitions for opt-in telemetry payloads.

- Basic anonymized telemetry
- Rich tuning events (opt-in only)

### `src/lib/server/`
Server-side schema enforcement and validation.

- Strict payload validation
- Designed for future Workers endpoints

---

## Frontend

- Built with **SvelteKit (TypeScript)**
- Currently includes a **development playground page** that:
  - imports the consent model
  - derives capabilities in real time
  - demonstrates policy enforcement in action

This page exists purely to validate architecture and is not user-facing yet.

---

## Data & Privacy

A full **Data Retention, Fair Use, and API Usage Policy** has been written and versioned before implementation.

Key guarantees:

- API keys are never stored without explicit opt-in
- Telemetry is disabled by default
- Anonymous mode is the default
- Rich data collection requires explicit, informed consent
- Users can revoke consent at any time

---

## Development Setup

```sh
npm install
npm run dev

---

## Project Roadmap

Planned items:

- Local encrypted persistence (IndexedDB + WebCrypto)
- Torn API proxy endpoints (Cloudflare workers)
- Feedback, bug reports, and results submission
- Optional opt-in telemetry with strick enforcement
- Calculator UI and Jump modeling

---

## Author

EevieTheFox
Torn player & developer

---

## Disclaimer
Torn Gainz is an independent, third-party project and is not affiliated with, endorsed by, or operated by Torn.
## 1. Guiding Principles

This application is built around four principles:

1. User control – You decide what data is shared and when.
2. Minimal collection – Only data required for estimator functionality is accessed.
3. Explicit consent – Remote storage never occurs without opt-in consent.
4. API respect – All Torn API access follows Torn’s API documentation and fair use expectations.

This app is fully usable without providing an API key.

<br>

---

<br>

## 2. Required API Access Level

Opt-in automation and telemetry functionality requires a Limited Access Torn API key to retrieve user battle stats and other information relevant to gym training.

Users may optionally generate a Custom key restricted only to the selections listed below.

No Full Access key is required or requested.

<br>

---

<br>

## 3. API Selections Used (Exact Endpoints)

Torn Gainz retrieves only the following selections:

User:
- bars
- battlestats
- education
- gym
- inventory
- job

Company:
- profile

Property:
- property

Faction:
- upgrades*

<span class='hint'>**Only if the user has faction permission granted by faction leadership. If not available, this endpoint is not used.*</span>

Market

- itemmarket

The application does not access:

- Messages

- Attacks

- Logs

- Financial transactions

- Communications

- Personal identifiers beyond stat context

- Any unrelated endpoints

<br>

---

<br>

## 4. Three Levels of Consent
### Level 1 — Basic (Manual mode only)

- No API key required

- No data stored

- All calculations performed from user-entered values

- Nothing transmitted to any server

This mode involves zero external data access.

<br>

### Level 2 — Limited Consent (Automated data fetching)

- Limited Access API key required

- Opt-in required

- API key stored locally on your device only

- Stored using browser-provided cryptography (Web Crypto API)

- Used only to pull the selections listed in Section 3

- Never transmitted to any remote database

- Never stored remotely

This mode allows automatic calculations while maintaining local-only control.

<br>

### Level 3 — Full Consent (User telemetry and tool improvement)

- Limited Access API key required

- Secondary opt-in required

- API key stored remotely in encrypted form

- Performs scheduled retrieval (e.g., daily) of relevant stat data

- Used for individual user trend mapping and model improvement purposes only

Remote storage safeguards:

- API keys encrypted at rest

- Access restricted to service functions only

- Used solely for documented selections in Section 3

- Revocable at any time

Remote storage never occurs without explicit consent.

<br>

---

<br>

## 5. Torn API Disclosure

| Consent Level   | Data Storage                                               | Data Sharing        | Purpose of Use                      | Key Storage                | Access Level |
|-----------------|------------------------------------------------------------|---------------------|-------------------------------------|----------------------------|--------------|
| For All Levels  | Varies                                                     | Varies              | Public community tool               | Varies                     | Varies       |
| Manual          | None                                                       | Nobody              | Manual estimation only              | No key                     | None         |
| Limited Consent | Local device only                                          | Nobody              | Automated estimation using API data | Stored locally, not shared | Limited      |
| Full Consent    | Persistent Encrypted remote storage until account deletion | Service owner only  | Scheduled telemetry & model tuning  | Stored remotely, encrypted | Limited      |

<span class='hint'>Telemetry features are disabled by default.</span>

<br>

---

<br>

## 6. Proxy Usage

In some environments, Torn’s API cannot be reliably called directly from a browser. In such cases:

- Requests may pass through a stateless proxy server.

- API keys exist only in memory during the request.

- Keys are never logged.

- Keys are never cached.

- Keys are never shared with third parties.

<br>

---

<br>

## 7. Telemetry and Model Improvement

### Basic Telemetry (Optional)

If enabled:

Collected data may include:

- Jump type selected

- Gym tier

- Bucketed stat ranges

- Rounded cost/efficiency metrics

- Estimator predictions

Not collected:

- API key

- Username

- Torn ID

- Faction name

- Exact stat values

- Persistent personal identifiers

This data cannot be used to identify individual players.

<br>

### Scheduled Telemetry (Full Consent Only)

If full consent is granted:

- Timestamped stat totals may be stored.

- Derived gain metrics (predicted vs observed) may be stored.

- Retrieval may occur on a daily schedule.

Still not stored:

- Username or ID

- Communications

- Financial logs

- Any unrelated personal data

Raw snapshots are retained only as long as necessary and may be aggregated or deleted.

<br>

---

<br>

## 8. Rate Limiting and Fair Use

The application enforces API safeguards:

- Requests are throttled.

- Failed or invalid keys are not retried aggressively.

- Rate-limit responses halt automated requests.

- Only minimum necessary endpoints are accessed.

The app does not perform scraping or unrelated polling.

<br>

---

<br>

## 9. Revocation and Deletion

You may revoke consent at any time.

Upon revocation:

- Scheduled retrieval stops immediately.

- Stored API keys (if any) are deleted.

- Non-aggregated telemetry data is deleted where applicable.

Aggregated, anonymized statistics may remain for analytical purposes but cannot identify individuals.

<br>

---

<br>

## 10. Data Never Collected

This application never collects:

- Torn passwords

- Session cookies

- Direct messages

- Financial transaction histories

- Account recovery information

- Any data unrelated to estimator functionality

<br>

---

<br>

## 11. Policy Changes

Material changes to:

- API selections

- Data storage practices

- Telemetry behavior

Will:

- Increment the version number

- Require renewed consent

<span class='hint'>Minor formatting or clarification updates may increment the patch version without renewed consent.</span>

<br>

---

<br>

## Plain English Summary

- You can use the app with no API and no storage.

- A Limited Access key is required for automatic calculations.

- Only the specific endpoints listed are used.

- Faction perks are retrieved only if you have permission.

- Remote storage requires explicit full consent.

- You can revoke consent and delete stored data at any time.
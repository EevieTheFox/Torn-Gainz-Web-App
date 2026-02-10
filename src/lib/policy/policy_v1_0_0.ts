export const POLICY_VERSION = "1.0.0";
export const POLICY_VALID_AS_OF = "February 9th, 2026";

export const POLICY_TEXT = `
Data Retention, Fair Use, and API Usage Policy
(Jump Estimator Web App)

1. Guiding Principles
This application is built around four core principles:
User control – You decide what data is shared and when.


Minimal collection – Only data that directly improves functionality or estimator accuracy is collected.


Explicit consent – No data is collected or stored remotely without clear, opt-in permission.


API respect – Torn API keys and data are handled according to Torn’s API documentation and community expectations.


This app is fully usable without sharing any data beyond your local device.

2. API Key Handling
Local-only by default
Your Torn API key is never required to use the app.


If you choose to use API-assisted features, your API key is:


stored only on your own device


encrypted using modern browser cryptography


never transmitted to any database owned or controlled by this app


Proxy usage
Because Torn’s API does not reliably support direct browser requests, API calls may be proxied through a stateless server to fetch data. In those cases:
Your API key is transmitted only in memory


Your key is never logged, stored, or cached


Your key is never shared with third parties


Optional secure storage (explicit opt-in only)
If—and only if—you explicitly opt into rich telemetry, your API key may be securely stored to allow automated daily stat retrieval. In this case:
The key is encrypted at rest


The key is used only for the endpoints explicitly described in this policy


The key can be revoked and deleted at any time


The app never stores API keys without your explicit consent.

3. Telemetry and Model Improvement Data
All telemetry is opt-in and disabled by default.
3.1 Basic Telemetry (Anonymous)
If you opt in to basic telemetry:
The app may collect anonymized, non-identifying data about how the estimator is used


This data is used solely to improve estimator accuracy and robustness


Examples of data collected:
Jump type selected


Approximate stat range (bucketed)


Gym tier


Cost and efficiency metrics (rounded or normalized)


Estimator predictions (not real outcomes)


What is not collected:
Your Torn username or ID


Your faction name


Your API key


Exact battle stat values


Any persistent personal identifier


This data cannot be used to identify you.

3.2 Rich Telemetry (Explicit, Separate Opt-In)
If you additionally opt in to rich telemetry:
The app may securely retrieve your battle stats on a scheduled basis (e.g., daily)


This allows the app to compare predicted gains vs observed gains to improve model accuracy


What may be stored:
Timestamped stat totals


Gym tier and relevant training context


Derived gain and error metrics (predicted vs observed)


What is still not stored:
Torn username or ID


Faction name


Any non-essential personal data


Raw snapshots are retained only as long as necessary for model tuning and may be periodically aggregated or deleted.

4. Manual Feedback and Result Sharing
You may submit feedback or jump results without enabling telemetry.
Feature requests
Anonymous by default


No account data or snapshots attached unless explicitly enabled


Used only for product development


Jump result submissions
Fully voluntary


Auto-filled from your local data (when available)


Editable before submission


Used to validate and improve estimator accuracy


Manual submissions are treated as user-provided data and are never cross-referenced with stored telemetry unless you explicitly opt in.

5. Consent and Transparency
Before any telemetry is enabled:
You must explicitly opt in


You must confirm you have read this policy


Telemetry cannot be enabled without your confirmation


Consent records are retained only to demonstrate compliance and may be revoked at any time.

6. Revocation and Deletion
You may revoke consent at any time.
When you revoke:
Future telemetry collection stops immediately


Stored API keys (if any) are deleted


Non-aggregated telemetry data is deleted where applicable


Aggregated, anonymized statistical data may be retained for analytical purposes but cannot be traced back to individual users.

7. Fair Use and Purpose Limitation
All collected data is used solely for:
improving estimator accuracy


fixing bugs


enhancing user experience


Data is never:
sold


shared with third parties


used for advertising


used to track individual players



8. Compliance with Torn API Guidelines
This app is designed to comply with Torn’s API documentation and community standards, including:
Secure handling of API keys


Minimal and purpose-specific data usage


Respect for user consent and privacy


If Torn’s API policies change, this policy will be updated accordingly.

9. Changes to This Policy
Material changes to this policy will:
increment the policy version


require renewed consent for telemetry features



10. Summary (Plain English)
You can use the app with zero data sharing.


Telemetry is optional, off by default, and transparent.


API keys are never stored unless you explicitly allow it.


You can opt out and delete your data at any time.


Minor revisions (e.g., formatting, link updates, or clarifications that do not expand data collection or usage) may increment the patch version without requiring renewed consent.

Policy Version 1.0.0 - Valid as of February 9th 2026

`.trim();

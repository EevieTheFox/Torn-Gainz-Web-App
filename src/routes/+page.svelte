<script lang="ts">
  import type { ConsentState } from "$lib/consent/consent_levels";
  import { capabilitiesFromConsent } from "$lib/consent/allowed_actions";

  let consent: ConsentState = {
    policyVersion: "1.0.0",
    telemetryLevel: "none"
  };

  $: caps = capabilitiesFromConsent(consent);
</script>

<h1>Torn Gainz — Dev Playground</h1>

<section style="display:flex; gap:24px; flex-wrap:wrap;">
  <div style="min-width:320px;">
    <h2>Consent State</h2>

    <label>
      Policy version:
      <input bind:value={consent.policyVersion} />
    </label>

    <label style="display:block; margin-top:12px;">
      Telemetry level:
      <select bind:value={consent.telemetryLevel}>
        <option value="none">none</option>
        <option value="basic">basic</option>
        <option value="rich">rich</option>
      </select>
    </label>

    <label style="display:block; margin-top:12px;">
      consentGivenAt:
      <input
        placeholder="ISO timestamp or empty"
        bind:value={consent.consentGivenAt}
      />
    </label>

    <label style="display:block; margin-top:12px;">
      revokedAt:
      <input
        placeholder="ISO timestamp or empty"
        bind:value={consent.revokedAt}
      />
    </label>
  </div>

  <div style="min-width:320px;">
    <h2>Derived Capabilities</h2>
    <pre>{JSON.stringify(caps, null, 2)}</pre>
  </div>
</section>

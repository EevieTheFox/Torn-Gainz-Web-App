export async function sendTelemetry(
    consent: ConsentState,
    evt: BasicTelemetryEvent | RichTuningEvent
) {
    const caps = capabilitiesFromConsent(consent);

    if (evt.kind === "basic_telemetry" && !caps.canSendBasicTelemetry) return;
    if (evt.kind === "rich_tuning" && !caps.canSendRichTelemetry) return;

    await fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(evt),
    });
}

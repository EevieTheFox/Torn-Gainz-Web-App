export interface Capabilities {
    canSendBasicTelemetry: boolean;
    canSendRichTelemetry: boolean;
    canStoreApiKeyRemotely: boolean;    // only true for rich
}

export function capabilitiesFromConsent(c: ConsentState): Capabilities {
    const active = !!c.consentGivenAt && !c.revokedAt;
    return {
        canSendBasicTelemetry: active && (c.telemetryLevel === "basic" || c.telemetryLevel === "rich"),
        canSendRichTelemetry:  active && c.telemetryLevel === "rich",
        canStoreApiKeyRemotely: active && c.telemetryLevel === "rich",
    };
}

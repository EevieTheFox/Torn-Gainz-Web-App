export type TelemetryLevel = "none" | "basic" | "rich";

export interface ConsentState {
    policyVersion: string;              // e.g. "1.0.0"
    policyViewedAt?: string;            // ISO timestamp
    consentGivenAt?: string;            // ISO timestamp
    telemetryLevel: TelemetryLevel;     // none/basic/rich
    revokedAt?: string;                // ISO timestamp
}

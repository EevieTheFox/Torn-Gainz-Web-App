import type { ConsentState, TelemetryLevel } from './consent_levels';

export type UiConsentState = {
    telemetryLevel: TelemetryLevel;
    consentLevelLabel: string;   // "Local Only" / "Telemetry: Basic" / "Telemetry: Rich"
    canUseAutoMode: boolean;     // depends on API key presence (not telemetry)
};

export function getUiConsentState(args: {
    consent: ConsentState;
    hasApiKey: boolean;
}): UiConsentState {
    const { consent, hasApiKey } = args;

    const consentLevelLabel =
        consent.telemetryLevel === 'none'
            ? 'Local Only'
            : consent.telemetryLevel === 'basic'
                ? 'Telemetry: Basic'
                : 'Telemetry: Rich';

    return {
        telemetryLevel: consent.telemetryLevel,
        consentLevelLabel,
        canUseAutoMode: hasApiKey
    };
}

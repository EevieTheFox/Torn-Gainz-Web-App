export interface BasicTelemetryEvent {
    kind: "basic_telemetry";
    appVersion: string;
    ts: string; // ISO
    mode: "api-assisted" | "manual";
    jumpType: EstimatorConfig["jumpType"];

    buckets: {
        statBand: "0-50m" | "50-200m" | "200m-1b" | "1b+";
        gymTier: "basic" | "premium" | "specialist" | "unknown";
        happyTarget: "0-10k" | "10k-50k" | "50k-100k" | "100k+";
        energyBudget: "0-199" | "200-299" | "300-399" | "400+";
    };

    rounded: {
        costPerHappy: number;        // e.g. nearest 100
        costPerEnergy: number;       // e.g. nearest 100
        predictedGainPerEnergy: number; // e.g. 3 sig figs
        predictedGainPerDollar: number; // e.g. 3 sig figs
    };
}

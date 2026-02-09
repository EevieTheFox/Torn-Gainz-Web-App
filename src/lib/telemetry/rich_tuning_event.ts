export interface RichTuningEvent {
    kind: "rich_tuning";
    appVersion: string;
    ts: string; // ISO
    jumpType: EstimatorConfig["jumpType"];
    buckets: BasicTelemetryEvent["buckets"];

    predicted: {
        gainTotal: number;        // rounded
        gainPerEnergy: number;    // rounded
    };

    observed: {
        gainTotal: number;        // rounded
        gainPerEnergy: number;    // rounded
    };

    error: {
        deltaAbs: number;         // rounded
        deltaPct: number;         // rounded (e.g. -0.12 = -12%)
    };

    adherence: "exact" | "close" | "approx" | "messy";
    notes?: string; // optional
}

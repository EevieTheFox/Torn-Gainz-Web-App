import { z } from "zod";

export const BasicTelemetrySchema = z.object({
    kind: z.literal("basic_telemetry"),
    appVersion: z.string(),
    ts: z.string(),
    mode: z.enum(["api-assisted", "manual"]),
    jumpType: z.enum(["edvd","candy","99k","custom"]),
    buckets: z.object({
        statBand: z.enum(["0-50m","50-200m","200m-1b","1b+"]),
        gymTier: z.enum(["basic","premium","specialist","unknown"]),
        happyTarget: z.enum(["0-10k","10k-50k","50k-100k","100k+"]),
        energyBudget: z.enum(["0-199","200-299","300-399","400+"]),
    }),
    rounded: z.object({
        costPerHappy: z.number(),
        costPerEnergy: z.number(),
        predictedGainPerEnergy: z.number(),
        predictedGainPerDollar: z.number(),
    }),
}).strict();

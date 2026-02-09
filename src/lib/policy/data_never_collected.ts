type Never = {
    apiKey?: never;
    tornUserId?: never;
    username?: never;
    factionName?: never;
    ipAddress?: never;
    deviceId?: never;
};

export type SafeTelemetry = (BasicTelemetryEvent | RichTuningEvent) & Never;

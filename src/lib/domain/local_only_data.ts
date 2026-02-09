export interface LocalSecrets {
    // Stored encrypted in IndexedDB; never transmitted.
    tornApiKey?: string;
    // Optional: if you do passphrase-lock later
    keyDerivation?: { saltB64: string; iterations: number };
}

export interface UserContext {
    fetchedAt: string; // ISO
    source: "api" | "manual";

    battleStats?: { str: number; spd: number; def: number; dex: number; total: number };

    gym?: { tier: "basic" | "premium" | "specialist" | "unknown"; name?: string };
    perks?: {
        education?: Record<string, number>;  // e.g. { "gym_gains_pct": 10 }
        property?: Record<string, number>;
        job?: Record<string, number>;
        faction?: Record<string, number>;    // may be manual fallback if no permission
        factionSource?: "api" | "manual" | "unavailable";
    };

    // Optional if you use it in the estimator
    resources?: { currentHappy?: number; energyCap?: number };
}

export interface MarketContext {
    fetchedAt: string; // ISO
    prices: Record<string, number>; // key by item slug or id string
}

export interface EstimatorConfig {
    mode: "api-assisted" | "manual";
    jumpType: "edvd" | "candy" | "99k" | "custom";
    targetHappy: number;
    energyBudget: number;

    // Advanced overrides (your “customize everything” mode):
    modifiers?: Record<string, number | boolean | string>;
}

export interface EstimatorOutput {
    computedAt: string; // ISO
    predicted: {
        gainTotal: number;
        gainPerEnergy: number;
        gainPerDollar: number;
        costPerHappy: number;
        costPerEnergy: number;
    };
    ranking?: Array<{ label: string; score: number }>;
}

export interface RunSnapshot {
    id: string;        // uuid
    createdAt: string; // ISO
    userContext: UserContext;
    market: MarketContext;
    config: EstimatorConfig;
    output: EstimatorOutput;
}

import { browser } from "$app/environment";
import { writable } from "svelte/store";

export type Theme = "light" | "dark";
const KEY = "tg_theme";

function systemTheme(): Theme {
    if (!browser) return "dark";
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function readSavedTheme(): Theme | null {
    if (!browser) return null;
    const v = localStorage.getItem(KEY);
    return v === "light" || v === "dark" ? v : null;
}

function apply(theme: Theme) {
    if (!browser) return;
    document.documentElement.dataset.theme = theme;
}

const initial: Theme = (browser ? readSavedTheme() : null) ?? systemTheme();

export const theme = writable<Theme>(initial);

if (browser) {
    // apply immediately and persist on changes
    apply(initial);
    theme.subscribe((t) => {
        apply(t);
        localStorage.setItem(KEY, t);
    });

    // follow system theme only if user hasn't chosen explicitly
    const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
    mq?.addEventListener?.("change", () => {
        if (readSavedTheme()) return;
        theme.set(systemTheme());
    });
}

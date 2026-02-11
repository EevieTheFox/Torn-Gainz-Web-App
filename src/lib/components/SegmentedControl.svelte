<script lang="ts">
    export type SegOption<T extends string> = {
        value: T;
        label: string;
        disabled?: boolean;
    };

    export let options: SegOption<any>[] = [];
    export let value: string;
    export let size: 'md' | 'sm' = 'md';
    export let ariaLabel = 'Segmented control';

    const sizes = {
        md: 'seg seg-md',
        sm: 'seg seg-sm'
    };

    function onSelect(opt: SegOption<any>) {
        if (opt.disabled) return;
        // Dispatch a standard input event so parent can bind:value
        value = opt.value;
        const e = new Event('input', { bubbles: true });
        // @ts-expect-error - Svelte binding pattern
        dispatchEvent?.(e);
    }
</script>

<div class={sizes[size]} role="radiogroup" aria-label={ariaLabel}>
    {#each options as opt (opt.value)}
        <button
                type="button"
                class:selected={opt.value === value}
                class:disabled={!!opt.disabled}
                disabled={!!opt.disabled}
                role="radio"
                aria-checked={opt.value === value}
                on:click={() => onSelect(opt)}
        >
            {opt.label}
        </button>
    {/each}
</div>

<style>
    .seg {
        display: inline-flex;
        border: 1px solid var(--border, rgba(255,255,255,0.12));
        border-radius: 14px;
        overflow: hidden;
        background: rgba(255,255,255,0.03);
    }
    .seg button {
        border: none;
        background: transparent;
        color: inherit;
        padding: 10px 14px;
        cursor: pointer;
        font: inherit;
        opacity: 0.9;
    }
    .seg button:hover { background: rgba(255,255,255,0.05); }
    .seg button.selected {
        background: rgba(255,255,255,0.10);
        opacity: 1;
    }
    .seg button.disabled {
        opacity: 0.35;
        cursor: not-allowed;
    }
    .seg-md button { padding: 10px 14px; }
    .seg-sm button { padding: 7px 10px; font-size: 0.92em; }
</style>

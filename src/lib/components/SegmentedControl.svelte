<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export type SegOption<T = string> = {
        value: T;
        label: string;
        disabled?: boolean;
        title?: string;
    };

    export let options: SegOption[] = [];
    export let value: string;              // selected value
    export let disabled: boolean = false;  // disables whole control

    // Size flags that map to your CSS selectors
    // "small" affects the wrapper radius, "sm" affects button padding/font
    export let small: boolean = false;     // adds .small to wrapper
    export let sm: boolean = false;        // adds .sm to buttons

    export let ariaLabel: string = "Segmented control";

    const dispatch = createEventDispatcher<{ change: { value: string } }>();

    function select(v: string) {
        if (disabled) return;
        if (v === value) return;
        value = v;
        dispatch("change", { value: v });
    }

    // Optional keyboard nav; remove if you want *exactly* prior behavior
    function onKeydown(e: KeyboardEvent) {
        if (disabled) return;

        const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
        if (!keys.includes(e.key)) return;

        e.preventDefault();

        const enabled = options.filter(o => !o.disabled);
        if (enabled.length === 0) return;

        const idx = enabled.findIndex(o => o.value === value);
        let nextIdx = idx;

        if (e.key === "ArrowLeft") nextIdx = idx <= 0 ? enabled.length - 1 : idx - 1;
        if (e.key === "ArrowRight") nextIdx = idx >= enabled.length - 1 ? 0 : idx + 1;
        if (e.key === "Home") nextIdx = 0;
        if (e.key === "End") nextIdx = enabled.length - 1;

        select(enabled[nextIdx].value);
    }
</script>

<div
        class="seg-wrap {small ? 'small' : ''}"
        role="radiogroup"
        aria-label={ariaLabel}
        on:keydown={onKeydown}
>
    {#each options as opt (opt.value)}
        <button
                type="button"
                class="segbtn {sm ? 'sm' : ''} {opt.value === value ? 'selected' : ''}"
                role="radio"
                aria-checked={opt.value === value}
                disabled={disabled || opt.disabled}
                title={opt.title}
                on:click={() => select(opt.value)}
        >
            {opt.label}
        </button>
    {/each}
</div>

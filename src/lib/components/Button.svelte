<script lang="ts">
    import type { HTMLButtonAttributes } from 'svelte/elements'

    type LmButtonProps = HTMLButtonAttributes & {
        class?: string
        fullWidth?: boolean
    }

    let { children, class: className = '', fullWidth = false, ...rest }: LmButtonProps = $props()

    // TO DO implement secondary button also and potentially buy button with svg icon
    // TO DO add support for svg icon?
</script>

<button
    type="button"
    {...rest}
    class={`magento-svelte-button tw-px-4 tw-py-2 tw-border tw-border-green-pea tw-bg-green-pea p-2 tw-text-white active:tw-bg-tannenbaum active:tw-border-tannenbaum active:tw-text-white hover:tw-bg-tannenbaum hover:tw-border-tannenbaum hover:tw-text-white disabled:tw-cursor-not-allowed disabled:tw-opacity-50 ${className} ${fullWidth && 'tw-w-full'}`}
>
    {@render children?.()}
</button>

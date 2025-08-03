<script lang="ts">
    import { slide } from 'svelte/transition'
    import { cubicIn } from 'svelte/easing'
    import type { Snippet } from 'svelte'
    import Overlay from './Overlay.svelte'
    import IconCross from '../IconsDynamic/IconCross.svelte'
    import { scrollLock } from '../helpers';

    type Props = {
        header: Snippet
        body: Snippet
        showSheet: boolean
    }

    let { header, body, showSheet = $bindable(false) }: Props = $props()

    $effect(() => {
      scrollLock(showSheet)
    })
</script>

<Overlay show={showSheet} onclick={() => (showSheet = false)} />
{#if showSheet}
    <div
        class="tw-w-[600px] tw-h-full tw-fixed tw-top-0 tw-border tw-bg-white tw-right-0 tw-z-[110] tw-flex tw-flex-col"
        transition:slide={{ axis: 'x', duration: 400, easing: cubicIn }}
    >
        <div class="tw-flex tw-justify-between tw-p-6">
            <h5>{@render header?.()}</h5>
            <button
                class="tw-clear-button"
                onclick={() => (showSheet = false)}><IconCross /></button
            >
        </div>
        {@render body?.()}
    </div>
{/if}

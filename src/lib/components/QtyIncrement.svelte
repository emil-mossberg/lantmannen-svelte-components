<script lang="ts">
    import { onMount, onDestroy } from 'svelte'

    import {
        combine,
        isInteger,
        min,
        required,
        qtyIncrements,
    } from '../validators/validators'

    import InfoIcon from '../../lib/Icons/icon-info.svg'

    type Props = {
        qtyIncrement?: number
        qty: number
        id: string
    }

    let { qtyIncrement = 1, id, qty = $bindable() }: Props = $props()

    // TO DO can this also be in validation logic
    let error: string | null = $state('')

    // TO DO hardcoded min qty
    const validators = combine(
        required(),
        min(1),
        isInteger(),
        qtyIncrements(qtyIncrement)
    )

    function validate() {
        error = validators(qty)
    }

    const decrement = () => {
        if (qty <= qtyIncrement) return
        qty -= qtyIncrement
    }

    const increment = () => {
        qty += qtyIncrement
    }

    const updateValue = (e: Event) => {
        // TO DO WIP
    }



    // TO DO remove below when fixed bug
    let inputEl: HTMLInputElement

    const original = Object.getOwnPropertyDescriptor(
        HTMLInputElement.prototype,
        'value'
    )

    // if (original) {
    //     Object.defineProperty(HTMLInputElement.prototype, 'value', {
    //         get() {
    //             return original.get?.call(this)
    //         },
    //         set(val) {
    //             console.warn('[value SET]', val)
    //             console.trace('Set by:')
    //             return original.set?.call(this, val)
    //         },
    //         configurable: true,
    //     })
    // }

    // onMount(() => {
    //     const observer = new MutationObserver(() => {
    //         console.log('Mutation observed. DOM value:', inputEl.value)
    //     })

    //     observer.observe(inputEl, {
    //         childList: false,
    //         attributes: true,
    //         characterData: true,
    //         subtree: false,
    //     })

    //     const interval = setInterval(() => {
    //         if (inputEl.value !== String(qty)) {
    //             console.log(
    //                 '%cExternal change detected!',
    //                 'color: red;',
    //                 'DOM value:',
    //                 inputEl.value,
    //                 'expected qty:',
    //                 qty
    //             )
    //         }
    //     }, 200)

    //     return () => {
    //         observer.disconnect()
    //         clearInterval(interval)
    //     }
    // })
</script>

{#snippet qtyButton(
    customClass: string,
    sign: string,
    action: () => void,
    disabled = false
)}
    <button
        type="button"
        class={`svelte-qty-button-fix tw-h-[44px] text-[1.25rem] flex tw-justify-center tw-items-center tw-w-[44px] tw-border-alto tw-bg-alto tw-bg-opacity-30 tw-text-green-pea ${customClass} disabled:text-charcoal disabled:tw-cursor-not-allowed disabled:hover:tw-bg-opacity-30 disabled:hover:tw-bg-alto  ${disabled ? 'text-charcoal tw-cursor-not-allowed hover:tw-bg-opacity-30 hover:tw-bg-alto' : 'hover:tw-bg-green-pea hover:tw-text-white'}`}
        onclick={action}
        {disabled}>{sign}</button
    >
{/snippet}
<!-- Note on usage of fix for stacking context with z-10 and z-20, this is to manipulate order that elements are on top of each other to fix the box shadow of focus ring -->
<div class="svelte-component">
    <div class="tw-relative tw-flex tw-rounded">
        {@render qtyButton(
            'tw-border-0 tw-border-t tw-border-b tw-border-l tw-rounded-bl tw-rounded-tl tw-focus:z-20',
            '-',
            decrement,
            qty <= qtyIncrement
        )}

        <input
            bind:this={inputEl}
            class="tw-h-[44px] !tw-w-[64px] tw-border tw-border-alto tw-text-center tw-text-[0.75rem] tw-focus:z-10"
            id={`qty-${id}`}
            name="qty"
            type="number"
            bind:value={qty}
            oninput={updateValue}
            onblur={validate}
        />

        {@render qtyButton(
            'tw-border-0 tw-border-t tw-border-b tw-border-r tw-rounded-br tw-rounded-tr',
            '+',
            increment
        )}

        {#if error}
            <div
                class="tw-absolute tw-rounded tw-border-cerulean tw-border-2 tw-py-2 tw-px-4 tw-top-[-64px] tw-bg-white tw-flex tw-items-center tw-gap-2"
            >
                <img src={InfoIcon} alt="" /><span class="tw-whitespace-nowrap"
                    >{error}</span
                >
            </div>
        {/if}
    </div>
</div>

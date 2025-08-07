<script lang="ts">
  import { t } from 'svelte-i18n'

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
    error?: string | null
  }

  let {
    qtyIncrement = 1,
    id,
    qty = $bindable(),
    error = $bindable(),
  }: Props = $props()

  const validators = combine(
    required($t('notAllowed')),
    min(1, $t('atleast1')),
    isInteger(),
    qtyIncrements(
      qtyIncrement,
      $t('multipleOf', { values: { count: qtyIncrement } }),
    ),
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
    const target = e.target as HTMLInputElement
    const value = target.value.trim()
    if (value === '' || !validators(value)) {
      error = null
    }
  }
</script>

{#snippet qtyButton(
  customClass: string,
  sign: string,
  action: () => void,
  disabled = false,
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
      qty <= qtyIncrement,
    )}

    <input
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
      increment,
    )}

    {#if error}
      <div
        class="tw-absolute tw-rounded tw-border-cerulean tw-border-2 tw-py-2 tw-px-4 tw-top-[-64px] tw-bg-white tw-flex tw-items-center tw-gap-2 tw-w-max"
      >
        <img src={InfoIcon} alt="" /><span>{error}</span>
      </div>
    {/if}
  </div>
</div>

<script lang="ts">
  import {
    combine,
    isInteger,
    min,
    required,
    qtyIncrements,
  } from "../lib/validators/validators";

  import infoIcon from "../assets/icons/icon-info.svg";

  type Props = {
    qty: number;
    qtyIncrement?: number;
	id: string;
  };

  let { qtyIncrement = 1, qty = $bindable(), id }: Props = $props();

  let info = $state("");
  // TO DO can this also be in validation logic
  let error: string | null = $state("");

  // TO DO hardcoded min and qty increment update this
  const validators = combine(
    required(),
    min(1),
    isInteger(),
    qtyIncrements(qtyIncrement)
  );

  function validate() {
    console.log("ran?");
    error = validators(qty);
  }

  const decrement = () => {
    if (qty <= qtyIncrement) return;
    qty -= qtyIncrement;
  };

  const increment = () => {
    qty += qtyIncrement;
  };
</script>

{#snippet qtyButton(
  customClass: string,
  sign: string,
  action: () => void,
  disabled = false
)}
  <button
    type="button"
    class={`svelte-qty-button-fix tw-h-[44px] text-[1.25rem] flex tw-justify-center tw-items-center tw-w-[44px] tw-border-alto tw-bg-alto tw-bg-opacity-30 tw-text-green-pea ${customClass} disabled:text-charcoal disabled:tw-cursor-not-allowed disabled:hover:tw-bg-opacity-30 disabled:hover:tw-bg-alto  ${disabled ? "text-charcoal tw-cursor-not-allowed hover:tw-bg-opacity-30 hover:tw-bg-alto" : "hover:tw-bg-green-pea hover:tw-text-white"}`}
    onclick={action}
    {disabled}>{sign}</button
  >
{/snippet}
<!-- Note on usage of fix for stacking context with z-10 and z-20, this is to manipulate order that elements are on top of each other to fix the box shadow of focus ring -->
<div class="svelte-component">
  <div class="tw-relative tw-flex tw-rounded">
    {#if info}
      <span
        class="tw-small-label tw-absolute tw-left-1/2 tw-top-[-22px] tw--translate-x-1/2 tw--translate-y-1/2 tw-transform tw-rounded tw-border-2 tw-border-info-border tw-bg-white tw-py-2 tw-pl-8 tw-pr-4"
      >
        <img
          src={infoIcon}
          alt="info svg"
          class="tw-absolute tw-left-[6px] tw-top-[4px]"	
        />
        <span class="tw-whitespace-nowrap">{info}</span>
      </span>
    {/if}
    {@render qtyButton(
      "tw-border-t tw-border-b tw-border-l tw-rounded-bl tw-rounded-tl tw-focus:z-20",
      "-",
      decrement,
      qty <= qtyIncrement
    )}

    <input
      class="tw-h-[44px] tw-w-[64px] tw-border tw-border-alto tw-text-center tw-text-[0.75rem] tw-focus:z-10"
	  id={`qty-${id}`}
	  name="qty"
      type="number"
      bind:value={qty}
      oninput={validate}
      onblur={validate}
    />

    {@render qtyButton(
      "tw-border-t tw-border-b tw-border-r tw-rounded-br tw-rounded-tr",
      "+",
      increment
    )}
  </div>
  {#if error}
    <p class="tw-text-red-600 tw-text-sm">{error}</p>
  {/if}
</div>

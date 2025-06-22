<script lang="ts">
	import infoIcon from '../assets/icons/icon-info.svg'

	type Props = {
		qty: number
		qtyIncrement?: number
	}

	let { qtyIncrement = 1, qty = $bindable() }: Props = $props()

	let info = $state('')

	const decrement = () => {
		if (qty <= qtyIncrement) return
		qty -= qtyIncrement
	}

	const increment = () => {
		qty += qtyIncrement
	}

	const validateQty = () => {
		if (qty === 0) {
			info = 'TO DO add correct phrase - no qty'
		} else if (qty % qtyIncrement !== 0) {
			info = 'TO DO add correct phrase - no wrong multiple'
		} else {
			info = ''
		}
	}
</script>

{#snippet qtyButton(customClass: string, sign: string, action: () => void, disabled = false)}
	<button
		class={`tw-h-[44px] tw-w-[44px] tw-border-color-border1 tw-bg-qty-inc-bg tw-text-button-primary-bg ${customClass} disabled:tw-opacity-50 disabled:tw-cursor-not-allowed ${disabled ? 'tw-opacity-50 tw-cursor-not-allowed' : 'hover:tw-bg-button-primary-hover-bg hover:tw-text-white'}`}
		onclick={action} disabled={disabled}>{sign}</button
	>
{/snippet}

<!-- Note on usage of fix for stacking context with z-10 and z-20, this is to manipulate order that elements are on top of each other to fix the box shadow of focus ring -->
<div class="tw-relative tw-flex tw-rounded">
	{#if info}
		<span
			class="tw-small-label tw-absolute tw-left-1/2 tw-top-[-22px] tw--translate-x-1/2 tw--translate-y-1/2 tw-transform tw-rounded tw-border-2 tw-border-info-border tw-bg-white tw-py-2 tw-pl-8 tw-pr-4"
		>
			<img src={infoIcon} alt="info svg" class="tw-absolute tw-left-[6px] tw-top-[4px]" />
			<span class="tw-whitespace-nowrap">{info}</span>
		</span>
	{/if}
	{@render qtyButton('tw-border-t tw-border-b tw-border-l tw-rounded-bl tw-rounded-tl tw-focus:z-20', '-', decrement, qty <= qtyIncrement)}

	<input
		class="tw-h-[44px] tw-w-[64px] tw-border tw-border-color-border1 tw-text-center tw-text-[0.75rem] tw-focus:z-10"
		type="number"
		bind:value={qty}
		onchange={validateQty}
	/>

	{@render qtyButton('tw-border-t tw-border-b tw-border-r tw-rounded-br tw-rounded-tr', '+', increment)}
</div>
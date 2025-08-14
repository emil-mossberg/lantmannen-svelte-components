<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'

  import IconCart from '@lib/IconsDynamic/IconCart.svelte'
  import IconPlus from '@lib/Icons/icon-plus.svg'
  import Spinner from '@lib/components/Spinner.svelte'

  type LmCirleButtonProps = HTMLButtonAttributes & {
    showSpinner?: boolean
  }

  let { showSpinner = false, disabled, ...rest }: LmCirleButtonProps = $props()
</script>

<button
  type="button"
  {...rest}
  class="tw-flex tw-rounded-full tw-min-w-[44px] tw-min-h-[44px] tw-clear-button tw-relative disabled:tw-pointer-events-none"
  {disabled}
>
  {#if !showSpinner}
    <IconCart type="green" {disabled} />
    <img
      src={IconPlus}
      alt="icon plus"
      class="tw-absolute tw-w-[10px] tw-h-[10px] tw-bg-white tw-rounded-full tw-top-[7px] tw-right-[7px] tw-p-[2px]"
    />
  {:else}
    <div
      class="tw-min-w-[44px] tw-min-h-[44px] tw-rounded-full tw-bg-charcoal tw-opacity-30 tw-flex tw-items-center tw-justify-center"
    >
      <Spinner />
    </div>
  {/if}
</button>

<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements'

  import IconCart from '../../lib/IconsDynamic/IconCart.svelte'
  import IconPlus from '../Icons/icon-plus.svg'


  let { disabled, ...rest }: HTMLButtonAttributes = $props()

</script>

<button
  type="button"
  {...rest}
  class="tw-flex tw-rounded-full tw-min-w-[44px] tw-min-h-[44px] tw-clear-button tw-relative"
  ><IconCart type="green" {disabled} />
  <img
    src={IconPlus}
    alt="icon plus"
    class="tw-absolute tw-w-[10px] tw-h-[10px] tw-bg-white tw-rounded-full tw-top-[7px] tw-right-[7px] tw-p-[2px]"
  />
</button>

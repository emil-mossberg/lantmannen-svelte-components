<script lang="ts">
  import type { Snippet } from 'svelte'

  import IconCross from '../IconsDynamic/IconCross.svelte'
  import Overlay from './Overlay.svelte'
  import { scrollLock } from '../helpers'

  type Props = {
    textButton: string
    header: string
    body: Snippet
    showModal?: boolean
  }

  let { header, body, showModal = $bindable(false) }: Props = $props()

  $effect(() => {
    scrollLock(showModal)
  })
</script>

<Overlay show={showModal} />
{#if showModal}
  <div
    class="tw-fixed tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-[120] tw-bg-white tw-p-6 tw-border tw-w-[500px]"
  >
    <div class="tw-flex tw-justify-between tw-mb-4">
      <h5>{header}</h5>
      <button class="tw-clear-button" onclick={() => (showModal = false)}
        ><IconCross />
      </button>
    </div>
    <div>{@render body?.()}</div>
  </div>
{/if}

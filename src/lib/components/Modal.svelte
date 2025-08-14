<script lang="ts">
  import type { Snippet } from 'svelte'

  import IconCross from '@lib/IconsDynamic/IconCross.svelte'
  import Overlay from '@lib/components/Overlay.svelte'
  import { scrollLock, createMoveElement } from '@lib/utils/helpers'

  type Props = {
    textButton: string
    header: string
    body: Snippet
    showModal?: boolean
  }

  let { header, body, showModal = $bindable(false) }: Props = $props()

  // This makes it easier to use the modal in places where styling can cause problems, such as magentos widgets
  const moveToDestination = createMoveElement('svelte-modal-mount')

  $effect(() => {
    scrollLock(showModal)
  })
</script>

{#if showModal}
  <div {@attach moveToDestination}>
    <Overlay show={showModal} />
    <div
      class="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-z-[120]"
    >
      <div class=" tw-bg-white tw-p-6 tw-border tw-w-[500px]">
        <div class="tw-flex tw-justify-between tw-mb-4">
          <h5>{header}</h5>
          <button class="tw-clear-button" onclick={() => (showModal = false)}
            ><IconCross />
          </button>
        </div>
        <div>{@render body?.()}</div>
      </div>
    </div>
  </div>
{/if}

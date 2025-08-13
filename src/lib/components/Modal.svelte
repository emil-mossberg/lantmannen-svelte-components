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

  // This makes it easier to use the modal in places where styling can cause problems, such as widgets
  function moveToDestination(element: HTMLElement) {

    // TO DO something about the hard coding
    const target = document.getElementById('svelte-modal-mount')

    if(target) {
      target.appendChild(element)
    } else {
      console.warn('Target element #destination not found')
    }  
  }


  $effect(() => {
    scrollLock(showModal)
  })
</script>

<Overlay show={showModal} />
{#if showModal}
  <div
    class="tw-fixed tw-inset-0 tw-flex tw-items-center tw-justify-center tw-z-[120]"
    {@attach moveToDestination}
  >
    <div class=" tw-bg-white tw-p-6 tw-border tw-w-[500px]">
      <div class="tw-flex tw-justify-between tw-mb-4">
        <h5>{header}</h5>
        <div>{showModal}</div>
        
        <button class="tw-clear-button" onclick={() => (showModal = false)}
          ><IconCross />
        </button>
      </div>
      <div>{@render body?.()}</div>
    </div>
  </div>
{/if}

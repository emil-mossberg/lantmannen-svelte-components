<script lang="ts">
  type Props = {
    show: boolean
    onclick?: () => void // This can be used to connect close on click overlay
  }

  const { show, onclick }: Props = $props()

  // This makes it easier to use the modal in places where styling can cause problems, such as widgets
  function moveToDestination(element: HTMLElement) {
    // TO DO something about the hard coding
    const target = document.getElementById('svelte-modal-mount')

    if (target) {
      target.appendChild(element)
    } else {
      console.warn('Target element #destination not found')
    }
  }

  
</script>

{#if show}
  <button
    {@attach moveToDestination}  
    class="tw-fixed tw-inset-0 tw-bg-black tw-z-[110] tw-s-overlay hover:tw-bg-black"
    aria-label="overlay"
    onclick={() => onclick?.()}
  ></button>
{/if}

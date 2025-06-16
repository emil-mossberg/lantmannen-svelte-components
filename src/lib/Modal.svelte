<script lang="ts">
  import Button from "../lib/Button.svelte";

  type Props = {
    textButton: string;
  };

  const { textButton }: Props = $props();

  // TO DO investigate alternative to slots
  let showModal = $state(false);

  // Toggle scrolling when opening modal
  $effect(() => {
    if(showModal) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "";
    }
  })

</script>

{#if showModal}
  <div class="tw-fixed tw-inset-0 tw-bg-black tw-z-110 tw-s-overlay"></div>
  <div
    class="tw-fixed tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-[120] tw-bg-white tw-p-6 tw-border tw-w-[500px]"
  >
    <button onclick={() => (showModal = false)}>Stäng</button>
    <slot></slot>
  </div>
{/if}

<Button text={textButton} onclick={() => (showModal = true)} />

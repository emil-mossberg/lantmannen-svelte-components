<script lang="ts">
  type Props = {
    show: boolean;
    onclick?: () => void; // Can be used to wire close on click overlay
  };

  const { show, onclick }: Props = $props();
</script>

{#if show}
  <button class="tw-fixed tw-inset-0 tw-bg-black tw-z-110 tw-s-overlay hover:tw-bg-black" aria-label="overlay"  onclick={() => onclick?.()}  

  ></button>
{/if}

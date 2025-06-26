<script lang="ts">
  type Props = {
    parentHover: boolean;
  };

  let { parentHover }: Props = $props();
</script>

<div
  class={`tw-text-charcoal hover:tw-text-white tw-group tw-grid tw-h-[30px] tw-w-[30px] tw-place-items-center tw-rounded-full tw-border tw-border-transparent hover:-tw-border-tannenbaum hover:tw-bg-tannenbaum tw-transform tw-transition tw-duration-300 ${parentHover ? "tw-border-tannenbaum tw-bg-tannenbaum" : ""}`}
>
  <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" class="{`${parentHover ? 'tw-text-white' : ''}`}"
    
    ><path d="M11.95.636l1.414 1.414L2.05 13.364.636 11.95z" fill="currentColor" /><path fill="currentColor"
      d="M2.05.636L13.364 11.95l-1.414 1.414L.636 2.05z"
    /></svg
  >
</div>

<script lang="ts">
  import { slide } from "svelte/transition";
  import { cubicIn } from "svelte/easing";

  let visible = $state(false);
</script>

<button
  class="fixed right-0 top-0 border border-green-700 p-2 bg-tannenbaum"
  onclick={() => (visible = !visible)}
>
  Leveransplaneraren
</button>
{#if visible}
  <div
    class="w-[600px] h-full fixed top-0 border bg-gray-300 right-0"
    transition:slide={{ axis: "x", duration: 400, easing: cubicIn }}
  >
    <div class="flex justify-between p-4">
      <h1>Leveransplaneraren</h1>
      <button class="" onclick={() => (visible = false)}> Close </button>
    </div>
  </div>
{/if}

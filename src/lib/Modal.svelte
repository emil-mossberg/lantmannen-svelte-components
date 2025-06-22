<script lang="ts">
  import { t } from "svelte-i18n";

  import type { Snippet } from "svelte";
  import Button from "../lib/Button.svelte";
  import Overlay from "./Overlay.svelte";

  type Props = {
    textButton: string;
    header: Snippet;
    body: Snippet;
  };

  const { textButton, header, body }: Props = $props();

  let showModal = $state(false);

  // Toggle scrolling when opening modal
  $effect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });
</script>

<div>HELLO</div>
<Overlay show={showModal} />
{#if showModal}
  <div
    class="tw-fixed tw-top-1/2 tw-left-1/2 tw-transform tw--translate-x-1/2 tw--translate-y-1/2 tw-z-[120] tw-bg-white tw-p-6 tw-border tw-w-[500px]"
  >
    <div class="tw-flex tw-justify-between">
      <h5>{@render header?.()}</h5>
      <button onclick={() => (showModal = false)}>Stäng</button>
    </div>
    <div>{@render body?.()}</div>
  </div>
{/if}
<div>{$t("welcome")}</div>
<Button text={textButton} onclick={() => (showModal = true)} />

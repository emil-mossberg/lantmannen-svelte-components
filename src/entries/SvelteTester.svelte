<script lang="ts">
  import IconChevron from "../lib/IconsDynamic/IconChevron.svelte";
  import IconCross from "../lib/IconsDynamic/IconCross.svelte";
  import Button from "../lib/Button.svelte";

  let parentHover = $state(false);
  let isActive = $state(false);
</script>

<div>SVELTE TESTER!!</div>
<Button onclick={() => (parentHover = !parentHover)}>Parent hover</Button>
<Button onclick={() => (isActive = !isActive)}>isActive</Button>
<IconChevron {parentHover} {isActive} />
<IconCross {parentHover} {isActive} />

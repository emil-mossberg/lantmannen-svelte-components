<script lang="ts">
  import IconChevron from "../lib/IconsDynamic/IconChevron.svelte";
  import IconCross from "../lib/IconsDynamic/IconCross.svelte";
  import Button from "../lib/Button.svelte";

  let parentHover = $state(false)
  let isActive = $state(false)
</script>

<div>SVELTE TESTER</div>
<Button text="Parent hover" onclick={() => parentHover = !parentHover} />
  <Button text="isActive" onclick={() => isActive = !isActive} />
<IconChevron {parentHover} {isActive} />
<IconCross {parentHover} {isActive} />


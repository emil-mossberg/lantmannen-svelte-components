<script lang="ts">
  import IconChevron from "../lib/IconsDynamic/IconChevron.svelte";
  import IconCross from "../lib/IconsDynamic/IconCross.svelte";
  import Button from "../lib/Button.svelte";
  import ButtonTest from "../lib/ButtonTest.svelte";

  let parentHover = $state(false)
  let isActive = $state(false)

  
</script>

<div>SVELTE TESTER!!</div>
<ButtonTest class="tw-bg-red-700" type="submit">Test</ButtonTest>
<Button text="Parent hover" onclick={() => parentHover = !parentHover} />
  <Button text="isActive" onclick={() => isActive = !isActive} />
<IconChevron {parentHover} {isActive} />
<IconCross {parentHover} {isActive} />




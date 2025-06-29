<script lang="ts">
  type Props = {
    label: string
  };

  let { label }: Props = $props();
</script>

<div>HELLO Im dynamic</div>
<div>{label}</div>

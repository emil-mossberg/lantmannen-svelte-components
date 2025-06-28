<script lang="ts">
  type Props = {
    deliveryFrom: string;
    deliveryTo: string;
  };

  let { deliveryFrom = $bindable(), deliveryTo }: Props = $props();
</script>

<div class="tw-mb-3">
  <label class="tw-block" for="">Önskat leveransintervall:</label>
  <div class="tw-flex tw-gap-3">
    <input type="text" bind:value={deliveryFrom} />
    <span>{` - ${deliveryTo}`}</span>
  </div>
</div>

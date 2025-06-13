<script lang="ts">
  type Props = {
    deliveryFrom: string;
    deliveryTo: string;
  };

  let { deliveryFrom = $bindable(), deliveryTo }: Props = $props();
</script>

<div class="mb-3">
  <label class="block !mb-0" for="">Önskat leveransintervall:</label>
  <div>
    <input type="text" class="!h-[30px] border px-2 py-1 !w-auto !rounded-none" bind:value={deliveryFrom} />
    <span>{` - ${deliveryTo}`}</span>
  </div>
</div>

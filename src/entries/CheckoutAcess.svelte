<script lang="ts">
    import DeliveryPlanner from './DeliveryPlanner.svelte'
    import bridgeSingleton from '../lib/stores/MagentoSvelteBridge.svelte'
</script>

{#if bridgeSingleton.showDeliveryPlanner}
    <DeliveryPlanner />
{:else}
    <div>Old cart flow, implement</div>
{/if}

<script lang="ts">
    import { useBridgeSingleton } from '../lib/stores/useBridgeSingleton.svelte'
    import DeliveryPlanner from './DeliveryPlanner.svelte'

    const { showDeliveryPlanner } = useBridgeSingleton
</script>

{#if showDeliveryPlanner}
    <DeliveryPlanner />
{:else}
    <div>Old cart flow, implement</div>
{/if}

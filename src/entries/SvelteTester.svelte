<script lang="ts">
    import pssFetch from '../lib/stores/PssFetch.svelte'
</script>

<div>TEST TEST {pssFetch.cartInfo?.pay_campaign_id}</div>
{#await pssFetch.pssProto('2')}
    <p>Loading PSS Campaign...</p>
{:then campaign}
    {campaign.title}
{/await}

<script lang="ts">
    import type { Component, ComponentProps } from 'svelte'

    import { bulkDeliveryMethods, packageDeliveryMethods } from '../dummyData'

    let parentHover = $state(false)
    let isActive = $state(false)

    import Dynamic from '../lib/components/test/Dynamic.svelte'

    function withProps<TComponent extends Component<any>>(
        component: TComponent,
        props: ComponentProps<TComponent>
    ) {
        // TO DO what can I do here now?
    }

    withProps(Dynamic, { label: 'bar' })
</script>


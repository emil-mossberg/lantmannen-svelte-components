<script lang="ts">
    import type { Component, ComponentProps } from 'svelte'

    import { bulkDeliveryMethods, packageDeliveryMethods } from '../dummyData'

    import DatePicker from '../lib/components/DatePicker.svelte'

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

<DatePicker
    date="2025-06-12"
    dateDisabled="2025-06-24"
    hoverDistance={3}
    disabledDates={['2025-06-08', '2025-06-15']}
/>

<script lang="ts">
    import type { Component, ComponentProps } from 'svelte'
    import SelectWrapper from '../lib/components/SelectWrapper.svelte'

    import { bulkDeliveryMethods, packageDeliveryMethods } from '../dummyData'

    import DatePicker from '../lib/components/DatePicker.svelte'

    let test = $state()

    let parentHover = $state(false)
    let isActive = $state(false)

    import Dynamic from '../lib/components/test/Dynamic.svelte'
    import Wrapper from '../lib/components/test/Wrapper.svelte'

    function withProps<TComponent extends Component<any>>(
        component: TComponent,
        props: ComponentProps<TComponent>
    ) {
        // TO DO what can I do here now?
    }

    withProps(Dynamic, { label: 'bar' })

    import Test from '../lib/components/Test.svelte'

    let object = $state({ count: 0 })
    // let count = $state(0);
</script>

<div>SVELTE TESTER!!</div>
<DatePicker
    date="2025-06-12"
    dateDisabled="2025-06-24"
    hoverDistance={3}
    disabledDates={['2025-06-08', '2025-06-15']}
/>

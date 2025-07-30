<script lang="ts">
    import type { Component, ComponentProps } from 'svelte'

    import { bulkDeliveryMethods, packageDeliveryMethods } from '../dummyData'

    let parentHover = $state(false)
    let isActive = $state(false)

    import Dynamic from '../lib/components/test/Dynamic.svelte'

    function wait(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms))
    }

    function dummyNumber(value: number, delay: number): Promise<number> {
        return new Promise((resolve) => {
            setTimeout(() => resolve(value), delay)
        })
    }

    function withProps<TComponent extends Component<any>>(
        component: TComponent,
        props: ComponentProps<TComponent>
    ) {
    }

    withProps(Dynamic, { label: 'bar' })

    let count = $state(0)

    const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms))

    $effect(() => {
        console.log(count)

        return () => {
            console.log('clean up')
        }
    })


    let test = $state(dummyNumber(20, 1000))
    let test2 = $state(dummyNumber(10, 3000))

</script>

<div>TEST TEST</div>

<div>{count}</div>
<button onclick={() => count++}>COUNT</button>
{#await test}
	<p>...rolling</p>
{:then number}
	<p>you rolled a {number}!</p>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
{#await test2}
	<p>...rolling</p>
{:then number}
	<p>you rolled a {number}!</p>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
HELLO
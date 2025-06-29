<script lang="ts">
	import type { Component } from 'svelte';

	interface Props {
		// only components that have at most the "prop"
		// property required can be passed
		DynamicComponent: Component<{ label: string }>;
	}

	let { DynamicComponent }: Props = $props();
</script>

<DynamicComponent label="foo" />
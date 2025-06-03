<script lang="ts">
	type Props = {
		disabled?: boolean
		text: string
		class?: string
		onclick: () => void
	}

	const { text, onclick, disabled = false, class: className = '' }: Props = $props()
</script>

<button
	{onclick}
	class={`disabled:opacity-50' bg-blue-500 p-2 font-bold text-white shadow disabled:cursor-not-allowed ${className}`}
	{disabled}>{text}</button
>

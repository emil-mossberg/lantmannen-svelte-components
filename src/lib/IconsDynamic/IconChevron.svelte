<script lang="ts">
		type Props = {
		isActive: boolean
		parentHover: boolean
	}

    let { isActive, parentHover }: Props = $props()
</script>

<div
	class="{`tw-text-charcoal hover:tw-text-white tw-group tw-grid tw-h-[30px] tw-w-[30px] tw-place-items-center tw-rounded-full tw-border tw-border-transparent hover:-tw-border-tannenbaum hover:tw-bg-tannenbaum tw-transform tw-transition tw-duration-300 ${isActive ? 'tw-rotate-180' : ''} ${parentHover ? 'tw-border-tannenbaum tw-bg-tannenbaum' : ''}`}"
>
	<svg
		width="16"
		height="10"
		xmlns="http://www.w3.org/2000/svg"
		class="{`${parentHover ? 'tw-text-white' : ''}`}"
		><path
			d="M15.747.77A.867.867 0 0 0 14.52.766L7.994 7.268 1.48.754A.867.867 0 1 0 .254 1.98L7.38 9.105a.864.864 0 0 0 1.225.002l7.14-7.112a.866.866 0 0 0 .002-1.226z"
			fill="currentColor"
			fill-rule="evenodd"
		/></svg
	>
</div>
<script lang="ts">
    import IconInfo from '../../lib/Icons/icon-info.svg'

    type Props = {
        text: string
        fullWidth?: boolean
    }

    const { text }: Props = $props()
</script>

<div
    class="tw-border-2 tw-border-cerulean tw-rounded tw-p-4 tw-shadow-lm tw-flex tw-gap-2 tw-items-center"
>
    <img src={IconInfo} alt="info icon" />
    {text}
</div>

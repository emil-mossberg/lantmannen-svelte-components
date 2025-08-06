<script lang="ts" generics="T">
    // Note: once new select element is in major browser we can stop using svelte-select
    import Select from 'svelte-select'

    type Props = {
        items: T[]
        text: string
        itemId: string
        label: string
        value: {} | null
        disabled?: boolean
        placeholder?: string
    }

    const id = $props.id()

    let {
        label,
        itemId,
        items,
        value = $bindable(),
        disabled = false,
        text,
        placeholder,
    }: Props = $props()

    const isStringArray = typeof items[0] === 'string'
    const resolvedLabel = label ?? (isStringArray ? undefined : 'label')
    const resolvedItemId = itemId ?? (isStringArray ? undefined : 'id')
</script>

<div class="tw-mb-3 magento-svelte-select leading-none">
    <label class="tw-block tw-font-bold tw-mb-1" for={id}>{text}</label>
    <Select
        {id}
        bind:value
        {items}
        {placeholder}
        label={resolvedLabel}
        itemId={resolvedItemId}
        {disabled}
        --border-radius="0px"
        --list-border-radius="0px"
        --item-is-active-bg="#F4EEE6"
        --item-is-active-color="#201E1A"
        --item-hover-bg="#F4EEE6"
        --item-hover-color="#201E1A"
        --border-focused="2px solid #0192D0"
        --selected-item-padding="8px 12px"
        --padding="0px"
        clearable={false}
    />
</div>

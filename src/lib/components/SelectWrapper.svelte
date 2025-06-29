<script lang="ts" generics="T">
  // Note: once new select element is in major browser we can stop using svelte-select
  import Select from "svelte-select";

  type Props = {
    items: T[];
    text: string,
    itemId: string;
    label: string,
    value: {} | null;
    disabled?: boolean;
    placeholder?: string;
    id?: string;
  };

  let {
    label,
    itemId,
    items,
    value = $bindable(),
    disabled = false,
    text,
    id = `select-${Math.random().toString(36).substr(2, 9)}`,
    placeholder 
  }: Props = $props();


    const isStringArray = typeof items[0] === 'string';
    const resolvedLabel = label ?? (isStringArray ? undefined : 'label');
    const resolvedItemId = itemId ?? (isStringArray ? undefined : 'id');
</script>

<div class="tw-mb-3 magento-svelte-select">
  <label class="tw-block" for={id}>{text}</label>
  <Select
    id={id}
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
    clearable={false}
  />
</div>

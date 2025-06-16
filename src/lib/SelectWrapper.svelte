<script lang="ts" generics="T">
  // Note: once new select element is in major browser we can stop using svelte-select
  import Select from "svelte-select";

  type Props = {
    items: T[];
    text: string,
    itemId: string;
    label: string,
    value: {};
    disabled?: boolean;
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
  }: Props = $props();

    const isStringArray = typeof items[0] === 'string';
    const resolvedLabel = label ?? (isStringArray ? undefined : 'label');
    const resolvedItemId = itemId ?? (isStringArray ? undefined : 'id');
</script>

<div class="tw-mb-3 svelte-component">
  <label class="tw-block" for={id}>{text}</label>
  <Select
    id={id}
    bind:value
    {items}
    label={resolvedLabel}
    itemId={resolvedItemId}
    {disabled}
    --border-radius="0px"
    --list-border-radius="0px"
    clearable={false}
  />
</div>

<script lang="ts" generics="T">
  type Props = {
    label: string;
    value: string;
    onchange?: () => void;
    options: T[];
    disable?: boolean;
    valueFormatter?: (value: T) => string;
    labelFormatter?: (value: T) => string;
  };

  let {
    label,
    options,
    value = $bindable(),
    valueFormatter,
    labelFormatter,
    disable = false,
  }: Props = $props();
</script>

<div class="mb-3">
  <label class="block !mb-0">{label}</label>
  <select
    bind:value
    class="border border-gray-200 w-full px-2 py-1"
    disabled={disable}
  >
    {#each options as option}
      <option value={valueFormatter ? valueFormatter(option) : option}
        >{labelFormatter ? labelFormatter(option) : option}</option
      >
    {/each}
  </select>
</div>

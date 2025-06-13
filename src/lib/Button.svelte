<script lang="ts">
  type Props = {
    disabled?: boolean;
    text: string;
    class?: string;
    onclick: () => void;
  };

  const {
    text,
    onclick,
    disabled = false,
    class: className = "",
  }: Props = $props();
</script>

<button
  {onclick}
  class={`disabled:opacity-50' border border-green-pea bg-green-pea border-green-700 p-2 text-white hover:bg-tannenbaum hover:border-tannenbaum hover:text-white disabled:cursor-not-allowed ${className}`}
  {disabled}>{text}</button
>

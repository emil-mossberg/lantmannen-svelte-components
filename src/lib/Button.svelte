<script lang="ts">
  type Props = {
    disabled?: boolean;
    text: string;
    type?: "button" | "submit" | "reset" | null | undefined; // TO DO move to type, does it exist?
    class?: string;
    onclick: () => void;
  };

  const {
    text,
    type = "button",
    onclick,
    disabled = false,
    class: className = "",
  }: Props = $props();
</script>

<button
  {type}
  {onclick}
  class={`tw-px-4 tw-py-2 tw-border tw-border-green-pea tw-bg-green-pea p-2 tw-text-white active:tw-bg-tannenbaum active:tw-border-tannenbaum active:tw-text-white hover:tw-bg-tannenbaum hover:tw-border-tannenbaum hover:tw-text-white disabled:tw-cursor-not-allowed disabled:tw-opacity-50 ${className}`}
  {disabled}>{text}</button
>

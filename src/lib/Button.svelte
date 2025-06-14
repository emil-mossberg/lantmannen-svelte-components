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
  class={`disabled:opacity-50' border border-green-pea bg-green-pea p-2 text-white hover:bg-tannenbaum hover:border-tannenbaum hover:text-white disabled:cursor-not-allowed ${className}`}
  {disabled}>{text}</button
>

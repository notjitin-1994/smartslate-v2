<script lang="ts">
  import { onMount } from "svelte";
  import { tweened } from "svelte/motion";
  import { cubicOut } from "svelte/easing";
  import { fade } from "svelte/transition";

  // --- Props ---
  export let value: number;
  export let title: string;
  export let icon: string; // Expecting SVG path data

  // --- Animation ---
  const animatedValue = tweened(0, {
    duration: 1500,
    easing: cubicOut,
  });

  onMount(() => {
    animatedValue.set(value);
  });
</script>

<div
  class="stat-card"
  in:fade={{ duration: 600, delay: 200, easing: cubicOut }}
>
  <div class="icon-wrapper">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="icon"
    >
      <path d={icon} />
    </svg>
  </div>
  <div class="text-wrapper">
    <p class="title">{title}</p>
    <p class="value">{Math.round($animatedValue)}</p>
  </div>
</div>

<style>
  .stat-card {
    display: flex;
    align-items: center;
    background-color: #1f2937; /* bg-gray-800 */
    border-radius: 0.75rem; /* rounded-xl */
    padding: 1.5rem; /* p-6 */
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
    border: 1px solid #374151; /* border-gray-700 */
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }
  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(75, 192, 192, 0.2),
      0 4px 6px -2px rgba(75, 192, 192, 0.1); /* shadow-lg with accent */
  }
  .icon-wrapper {
    flex-shrink: 0;
    margin-right: 1rem; /* mr-4 */
    background-color: rgba(75, 192, 192, 0.1);
    padding: 0.75rem; /* p-3 */
    border-radius: 9999px; /* rounded-full */
  }
  .icon {
    width: 2rem; /* w-8 h-8 */
    height: 2rem;
    color: #4fd1c5; /* text-teal-300 */
  }
  .text-wrapper {
    flex-grow: 1;
  }
  .title {
    font-size: 0.875rem; /* text-sm */
    font-weight: 500; /* font-medium */
    color: #9ca3af; /* text-gray-400 */
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .value {
    font-size: 2.25rem; /* text-4xl */
    font-weight: 800; /* font-extrabold */
    color: #f9fafb; /* text-gray-50 */
  }
</style>
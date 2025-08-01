<script lang="ts">
  import { onMount, tick } from "svelte";
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement,
    Filler,
    type ChartData,
    type ChartOptions,
  } from "chart.js";
  import { fade } from "svelte/transition";
  import { sineOut } from "svelte/easing";

  // --- Props ---
  export let data: { date: string; count: number }[] = [];

  // --- Chart.js Registration ---
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement,
    Filler,
  );

  // --- Component State ---
  let canvasElement: HTMLCanvasElement;
  let chartInstance: ChartJS | null = null;

  // --- Chart Configuration ---
  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
      easing: "easeInOutQuart",
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#9CA3AF", // text-gray-400
        },
      },
      y: {
        grid: {
          color: "#374151", // border-gray-700
        },
        ticks: {
          color: "#9CA3AF", // text-gray-400
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,
        backgroundColor: "#1F2937", // bg-gray-800
        titleColor: "#F9FAFB", // text-gray-50
        bodyColor: "#D1D5DB", // text-gray-300
        borderColor: "#374151", // border-gray-700
        borderWidth: 1,
        callbacks: {
          label: (context) => ` Signups: ${context.parsed.y}`,
        },
      },
    },
  };

  // --- Lifecycle Management ---
  onMount(() => {
    // The chart is created here, after the canvas element is mounted.
    return () => {
      // This cleanup function is crucial to prevent memory leaks.
      chartInstance?.destroy();
    };
  });

  // --- Reactive Chart Update ---
  $: if (data && canvasElement) {
    const labels = data.map((d) => {
      const date = new Date(d.date);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    });
    const values = data.map((d) => d.count);

    const chartData: ChartData<"line"> = {
      labels,
      datasets: [
        {
          label: "New Users",
          data: values,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: (context) => {
            if (!context.chart.ctx) return "rgba(75, 192, 192, 0)";
            const ctx = context.chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, 200);
            gradient.addColorStop(0, "rgba(75, 192, 192, 0.5)");
            gradient.addColorStop(1, "rgba(75, 192, 192, 0)");
            return gradient;
          },
          tension: 0.4,
          fill: true,
          pointBackgroundColor: "rgba(75, 192, 192, 1)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgba(75, 192, 192, 1)",
        },
      ],
    };

    // If a chart instance already exists, update it. Otherwise, create a new one.
    if (chartInstance) {
      chartInstance.data = chartData;
      chartInstance.update();
    } else {
      chartInstance = new ChartJS(canvasElement, {
        type: "line",
        data: chartData,
        options: chartOptions,
      });
    }
  }
</script>

<div
  class="chart-container"
  in:fade={{ duration: 800, easing: sineOut, delay: 200 }}
>
  <canvas bind:this={canvasElement} />
</div>

<style>
  .chart-container {
    position: relative;
    height: 300px;
    width: 100%;
    background-color: #111827; /* bg-gray-900 */
    border-radius: 0.75rem; /* rounded-xl */
    padding: 1.5rem; /* p-6 */
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
  }
</style>
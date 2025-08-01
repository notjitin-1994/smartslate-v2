<script lang="ts">
  import { onMount } from "svelte";
  import { getFunctions, httpsCallable } from "firebase/functions";
  import { auth } from "$lib/services/firebase";
  import { authStore, type AuthState } from "$lib/stores/authStore";
  import StatCard from "$lib/components/admin/dashboard/stat-card.svelte";
  import UserSignupsChart from "$lib/components/admin/dashboard/user-signups-chart.svelte";
  import { fade } from "svelte/transition";

  // --- Data State ---
  let stats: {
    totalUsers: number;
    totalCourses: number;
    newInquiriesThisMonth: number;
  } | null = null;
  let userSignups: { date: string; count: number }[] = [];
  let isLoading = true;
  let error: string | null = null;

  // --- Icon Paths ---
  const icons = {
    users:
      "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    courses:
      "M12 6.253v11.494m-5.249-8.494L12 12.75l5.249-4.991M21.75 12a9.75 9.75 0 11-19.5 0 9.75 9.75 0 0119.5 0z",
    inquiries:
      "M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M3 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839-4.685a2.25 2.25 0 00-1.183-1.981l-6.478-3.488a2.25 2.25 0 00-2.366 0l-6.478 3.488A2.25 2.25 0 003 10.806V9",
  };

  // --- Data Fetching ---
  onMount(() => {
    const unsubscribe = authStore.subscribe(async ($auth: AuthState) => {
      if ($auth.loading) return;

      isLoading = true;
      if (!$auth.user) {
        error = "Authentication required to view dashboard.";
        isLoading = false;
        return;
      }

      try {
        const functions = getFunctions();
        const idToken = await $auth.user.getIdToken(true);

        if (!idToken) {
          throw new Error("Authentication token not available.");
        }

      const headers = { authorization: `Bearer ${idToken}` };

      // --- API Calls in Parallel ---
      const getStats = httpsCallable(functions, "api");
      const getUserSignups = httpsCallable(
        functions,
        "api",
      );

      const [statsResult, userSignupsResult] = await Promise.all([
        getStats({ headers }),
        getUserSignups({ headers }),
      ]);

      stats = statsResult.data as any;
      userSignups = userSignupsResult.data as any;
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      error = "Failed to load dashboard data. Please try again later.";
    } finally {
      isLoading = false;
    }
    });

    return () => unsubscribe();
  });
</script>

<svelte:head>
  <title>Admin Dashboard</title>
</svelte:head>

<div class="dashboard-container">
  <h1 class="dashboard-title">Executive Dashboard</h1>

  {#if isLoading}
    <div class="grid-container">
      {#each Array(3) as _}
        <div class="skeleton-card" />
      {/each}
    </div>
    <div class="skeleton-chart" />
  {:else if error}
    <div class="error-message">{error}</div>
  {:else if stats}
    <div in:fade={{ duration: 500 }}>
      <div class="grid-container">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={icons.users}
        />
        <StatCard
          title="Total Courses"
          value={stats.totalCourses}
          icon={icons.courses}
        />
        <StatCard
          title="New Inquiries (Month)"
          value={stats.newInquiriesThisMonth}
          icon={icons.inquiries}
        />
      </div>

      <div class="chart-section">
        <h2 class="chart-title">New User Signups (Last 30 Days)</h2>
        <UserSignupsChart data={userSignups} />
      </div>
    </div>
  {/if}
</div>

<style>
  .dashboard-container {
    padding: 2rem;
    background-color: #111827; /* bg-gray-900 */
    min-height: 100vh;
  }
  .dashboard-title {
    font-size: 2.25rem; /* text-4xl */
    font-weight: 800; /* font-extrabold */
    color: #f9fafb; /* text-gray-50 */
    margin-bottom: 2rem;
  }
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2.5rem;
  }
  .chart-section {
    margin-top: 2.5rem;
  }
  .chart-title {
    font-size: 1.5rem; /* text-2xl */
    font-weight: 700; /* font-bold */
    color: #d1d5db; /* text-gray-300 */
    margin-bottom: 1rem;
  }
  .skeleton-card {
    height: 120px;
    background-color: #1f2937; /* bg-gray-800 */
    border-radius: 0.75rem; /* rounded-xl */
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  .skeleton-chart {
    height: 300px;
    background-color: #1f2937; /* bg-gray-800 */
    border-radius: 0.75rem; /* rounded-xl */
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  @keyframes pulse {
    50% {
      opacity: 0.5;
    }
  }
  .error-message {
    color: #fca5a5; /* text-red-400 */
    background-color: #450a0a; /* bg-red-900 */
    padding: 1rem;
    border-radius: 0.5rem; /* rounded-lg */
  }
</style>

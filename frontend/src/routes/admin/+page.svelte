<script lang="ts">
	// For now, the main admin page will be a simple dashboard.
	// The UserManagement component will be on its own route.
</script>

<div class="dashboard-container">
	<h1 class="dashboard-title">Admin Dashboard</h1>
	<p class="dashboard-welcome">
		Welcome to the SmartSlate Admin Panel. Use the sidebar to navigate through the management
		sections.
	</p>
</div>

<style>
	.dashboard-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.dashboard-title {
		font-size: 2rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0;
	}

	.dashboard-welcome {
		font-size: 1rem;
		color: var(--text-secondary);
		max-width: 60ch;
	}
</style>
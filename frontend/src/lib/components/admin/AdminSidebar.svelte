<script lang="ts">
	import { page } from '$app/stores';
</script>

<aside class="admin-sidebar">
	<div class="sidebar-header">
		<h2 class="sidebar-title">Admin Menu</h2>
	</div>
	<nav class="sidebar-nav">
		<a href="/admin" class:active={$page.url.pathname === '/admin'}>Dashboard</a>
		<a href="/admin/users" class:active={$page.url.pathname === '/admin/users'}>Users</a>
		<a href="/admin/content" class:active={$page.url.pathname === '/admin/content'}>Content</a>
	</nav>
</aside>

<style>
	.admin-sidebar {
		width: 250px;
		background-color: var(--background-secondary);
		border-right: var(--border-subtle);
		padding: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-xl);
	}

	.sidebar-header {
		padding-bottom: var(--space-md);
		border-bottom: var(--border-subtle);
	}

	.sidebar-title {
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--text-primary);
		margin: 0;
	}

	.sidebar-nav {
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
	}

	.sidebar-nav a {
		color: var(--text-secondary);
		text-decoration: none;
		font-size: 0.95rem;
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-md);
		transition: var(--transition-fast);
	}

	.sidebar-nav a:hover {
		background-color: var(--background-tertiary);
		color: var(--text-primary);
	}

	.sidebar-nav a.active {
		background-color: var(--primary-accent);
		color: var(--background);
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.admin-sidebar {
			width: 100%;
			border-right: none;
			border-radius: var(--radius-lg);
			animation: fade-in 0.3s ease-out;
		}

		.sidebar-header {
			display: none;
		}
	}

	@keyframes fade-in {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
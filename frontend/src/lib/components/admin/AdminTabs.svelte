<script lang="ts">
	import { page } from '$app/stores';
</script>

<nav class="admin-tabs">
	<a href="/admin" class:active={$page.url.pathname === '/admin'}>Dashboard</a>
	<a href="/admin/users" class:active={$page.url.pathname.startsWith('/admin/users')}>Users</a>
	<a href="/admin/content" class:active={$page.url.pathname.startsWith('/admin/content')}>Content</a>
</nav>

<style>
	.admin-tabs {
		display: none;
		width: 100%;
		background-color: var(--background-secondary);
		border-radius: var(--radius-lg);
		border: var(--border-subtle);
		overflow: hidden;
		margin-bottom: var(--space-md);
	}

	.admin-tabs a {
		display: inline-block;
		width: 33.333%;
		padding: var(--space-md) 0;
		text-align: center;
		text-decoration: none;
		color: var(--text-secondary);
		font-weight: 500;
		font-size: 0.9rem;
		transition: var(--transition-fast);
		border-bottom: 2px solid transparent;
	}

	.admin-tabs a:hover {
		background-color: var(--background-tertiary);
	}

	.admin-tabs a.active {
		color: var(--primary-accent);
		border-bottom-color: var(--primary-accent);
	}

	@media (max-width: 768px) {
		.admin-tabs {
			display: flex;
		}
	}
</style>
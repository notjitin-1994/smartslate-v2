<script lang="ts">
	import { page } from '$app/stores';
	import { mobileMenuStore } from '$lib/stores/mobileMenuStore';

	let isMenuOpen = false;
	mobileMenuStore.subscribe((state) => {
		isMenuOpen = state.isOpen;
	});

	const navItems = [
		{
			href: '/admin',
			label: 'Dashboard',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`
		},
		{
			href: '/admin/users',
			label: 'Users',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`
		},
		{
			href: '/admin/content',
			label: 'Content',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`
		}
	];
</script>

<nav class="mobile-nav" class:menu-open={isMenuOpen}>
	{#each navItems as item}
		<a
			href={item.href}
			class="nav-link"
			class:active={$page.url.pathname === item.href ||
				($page.url.pathname.startsWith(item.href) && item.href !== '/admin')}
		>
			<span class="nav-icon">{@html item.icon}</span>
			<span class="nav-label">{item.label}</span>
		</a>
	{/each}
</nav>

<style>
	.mobile-nav {
		display: none; /* Hidden by default, shown via media query in layout */
		position: fixed;
		bottom: var(--space-md);
		left: var(--space-md);
		right: var(--space-md);
		background-color: rgba(13, 27, 42, 0.8);
		backdrop-filter: blur(10px);
		border-radius: var(--radius-lg);
		border: 1px solid var(--border-color);
		box-shadow: var(--shadow-lg);
		padding: var(--space-sm);
		z-index: 1000;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}

	.mobile-nav.menu-open {
		display: none;
	}

	.nav-link {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-xs);
		color: var(--text-secondary);
		text-decoration: none;
		padding: var(--space-sm);
		border-radius: var(--radius-md);
		transition: var(--transition-fast);
		flex-grow: 1;
		text-align: center;
	}

	.nav-link.active {
		color: var(--primary-accent);
	}

	.nav-icon :global(svg) {
		width: 22px;
		height: 22px;
	}

	.nav-label {
		font-size: 0.75rem;
		font-weight: 500;
	}

	@media (min-width: 769px) {
		.mobile-nav {
			display: none;
		}
	}
</style>

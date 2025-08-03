<script lang="ts">
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/authStore';

	const navItems = [
		{
			href: '/admin',
			label: 'Dashboard',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`,
			roles: ['smartslateAdmin', 'smartslateManager']
		},
		{
			href: '/admin/users',
			label: 'User Management',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
			roles: ['smartslateAdmin']
		},
		{
			href: '/admin/courses',
			label: 'Course Management',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>`,
			roles: ['smartslateAdmin', 'smartslateManager']
		},
		{
			href: '/admin/inquiries',
			label: 'Inquiry Management',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>`,
			roles: ['smartslateAdmin', 'smartslateManager']
		},
		{
			href: '/admin/solara-interests',
			label: 'Solara Interests',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,
			roles: ['smartslateAdmin', 'smartslateManager']
		},
		{
			href: '/admin/ssa-interests',
			label: 'SSA Interests',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>`,
			roles: ['smartslateAdmin', 'smartslateManager']
		}
	];
</script>

<nav class="admin-tabs">
	{#each navItems as item}
		{#if $authStore.role && item.roles.includes($authStore.role)}
			<a
				href={item.href}
				class="nav-link"
				class:active={$page.url.pathname === item.href ||
					($page.url.pathname.startsWith(item.href) && item.href !== '/admin')}
			>
				<span class="nav-icon">{@html item.icon}</span>
				<span class="nav-label">{item.label}</span>
			</a>
		{/if}
	{/each}
</nav>

<style>
	.admin-tabs {
		display: none;
	}

	@media (min-width: 769px) {
		.admin-tabs {
			display: flex;
			gap: var(--space-sm);
			background-color: var(--container-bg);
			padding: var(--space-sm);
			border-radius: var(--radius-md);
			border: 1px solid var(--border-color);
			margin-top: var(--space-xl);
			margin-bottom: var(--space-xl);
			width: fit-content;
			margin-left: auto;
			margin-right: auto;
		}

		.nav-link {
			display: flex;
			align-items: center;
			gap: var(--space-sm);
			padding: var(--space-sm) var(--space-md);
			border-radius: var(--radius-sm);
			color: var(--text-secondary);
			font-weight: 500;
			transition: var(--transition-fast);
		}

		.nav-link:hover {
			background-color: var(--background-light);
			color: var(--text-primary);
		}

		.nav-link.active {
			background-color: var(--secondary-accent);
			color: white;
		}

		.nav-icon {
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.nav-icon :global(svg) {
			width: 18px;
			height: 18px;
		}
	}
</style>

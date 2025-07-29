<script lang="ts">
	import '../../app.css';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import Header from '$lib/components/pages/common/Header.svelte';
	import Footer from '$lib/components/pages/common/Footer.svelte';
	import AdminSidebar from '$lib/components/admin/AdminSidebar.svelte';
	import AdminTabs from '$lib/components/admin/AdminTabs.svelte';

	let unsubscribe: () => void;

	onMount(() => {
		unsubscribe = authStore.subscribe((store) => {
			if (browser) {
				// Redirect if not loading and not an admin
				if (store.user && !store.loading && !store.isAdmin) {
					goto('/');
				}
				// Redirect if not loading and not logged in
				if (!store.user && !store.loading) {
					goto('/');
				}
			}
		});

		return () => {
			if (unsubscribe) {
				unsubscribe();
			}
		};
	});
</script>

<div class="admin-layout">
	<Header />
	<div class="admin-main-content-wrapper">
		<AdminTabs />
		<div class="admin-main-content">
			<AdminSidebar />
			<main class="admin-page-content">
				<slot />
			</main>
		</div>
	</div>
	<Footer />
</div>

<style>
	.admin-layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background-color: var(--background);
	}

	.admin-main-content-wrapper {
		flex-grow: 1;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: var(--space-lg);
	}

	.admin-main-content {
		display: flex;
		gap: var(--space-lg);
	}

	.admin-page-content {
		flex-grow: 1;
		padding: var(--space-lg);
		background-color: var(--background-secondary);
		border-radius: var(--radius-lg);
		border: var(--border-subtle);
	}

	@media (max-width: 768px) {
		.admin-main-content-wrapper {
			padding: var(--space-md);
			margin-top: var(--space-lg);
		}

		.admin-main-content {
			flex-direction: column;
		}

		.admin-main-content :global(.admin-sidebar) {
			display: none;
		}

		.admin-page-content {
			padding: var(--space-md);
		}
	}
</style>
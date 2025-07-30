<script lang="ts">
	import '../../app.css';
	import { goto } from '$app/navigation';
	import { authStore } from '$lib/stores/authStore';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import Header from '$lib/components/pages/common/Header.svelte';
	import AdminMobileNav from '$lib/components/admin/AdminMobileNav.svelte';
	import ToastContainer from '$lib/components/common/ToastContainer.svelte';
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
	<div class="admin-main-content">
		<AdminTabs />
		<main class="admin-page-content">
			<slot />
		</main>
	</div>
	<AdminMobileNav />
	<ToastContainer />
</div>

<style>
	.admin-layout {
		height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.admin-main-content {
		flex-grow: 1;
		overflow-y: auto;
		padding: 0 var(--space-xl);
	}

	.admin-page-content {
		padding-top: var(--space-xl);
	}

	@media (max-width: 768px) {
		.admin-main-content {
			padding: 0 var(--space-lg);
		}
		.admin-page-content {
			padding-top: var(--space-lg);
			padding-bottom: 100px; /* Add padding for mobile nav */
		}
	}
</style>
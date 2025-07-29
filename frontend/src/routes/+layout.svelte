<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { onAuthStateChanged } from 'firebase/auth';
	import { auth } from '$lib/firebase';
	import { authStore } from '$lib/stores/authStore';
	import AuthModal from '$lib/components/common/AuthModal.svelte';
	import { authModalStore } from '$lib/stores/authModalStore';

	let isModalOpen = false;

	authModalStore.subscribe((state) => {
		isModalOpen = state.isOpen;
	});

	onMount(() => {
		authStore.setLoading();
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			authStore.setUser(user);
		});

		return () => unsubscribe();
	});
</script>

<div class="layout-wrapper" class:modal-open={isModalOpen}>
	<slot />
</div>

{#if isModalOpen}
	<AuthModal />
{/if}

<style>
	.layout-wrapper.modal-open > :global(#main-content),
	.layout-wrapper.modal-open > :global(footer) {
		filter: blur(5px);
		pointer-events: none;
		user-select: none;
	}
</style>
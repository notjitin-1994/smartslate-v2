<script lang="ts">
	import '../../app.css';
	import { authStore } from '$lib/stores/authStore';
	import AuthModal from '$lib/components/common/auth-modal.svelte';
	import { authModalStore } from '$lib/stores/authModalStore';
	import { mobileMenuStore } from '$lib/stores/mobileMenuStore';

	let isModalOpen = false;
	let isMobileMenuOpen = false;

	authModalStore.subscribe((state) => {
		isModalOpen = state.isOpen;
	});

	mobileMenuStore.subscribe((state) => {
		isMobileMenuOpen = state.isOpen;
	});
</script>

<div class="layout-wrapper" class:modal-open={isModalOpen} class:menu-open={isMobileMenuOpen}>
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

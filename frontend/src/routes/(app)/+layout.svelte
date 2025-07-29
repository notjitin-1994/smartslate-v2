<script lang="ts">
	import '../../app.css';
	import { authStore } from '$lib/stores/authStore';
	import AuthModal from '$lib/components/common/AuthModal.svelte';
	import { authModalStore } from '$lib/stores/authModalStore';

	let isModalOpen = false;

	authModalStore.subscribe((state) => {
		isModalOpen = state.isOpen;
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
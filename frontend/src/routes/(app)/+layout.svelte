<script lang="ts">
	import '../../app.css';
	import { authStore } from '$lib/stores/authStore';
	import AuthModal from '$lib/components/common/auth-modal.svelte';
	import { authModalStore } from '$lib/stores/authModalStore';
	import { mobileMenuStore } from '$lib/stores/mobileMenuStore';
	import SolaraInterestModal from '$lib/components/common/SolaraInterestModal.svelte';
	import { solaraInterestModalStore } from '$lib/stores/solaraInterestModalStore';
	import ToastContainer from '$lib/components/common/toast-container.svelte';
	import { contactUsModalStore } from '$lib/stores/contactUsModalStore';
	import ContactUsModal from '$lib/components/common/ContactUsModal.svelte';
	import { fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	export let data;

	let isModalOpen = false;
	let isMobileMenuOpen = false;
	let isSolaraModalOpen = false;
	let isContactUsModalOpen = false;

	authModalStore.subscribe((state) => {
		isModalOpen = state.isOpen;
	});

	mobileMenuStore.subscribe((state) => {
		isMobileMenuOpen = state.isOpen;
	});

	solaraInterestModalStore.subscribe((isOpen) => {
		isSolaraModalOpen = isOpen;
	});

	contactUsModalStore.subscribe((state) => {
		isContactUsModalOpen = state.isOpen;
	});
</script>

<div
	class="layout-wrapper"
	class:modal-open={isModalOpen || isSolaraModalOpen || isContactUsModalOpen}
	class:menu-open={isMobileMenuOpen}
>
	{#key data.pathname}
		<div
			in:fade={{ duration: 300, delay: 300, easing: quintOut }}
			out:fade={{ duration: 300, easing: quintOut }}
		>
			<slot />
		</div>
	{/key}
</div>

{#if isModalOpen}
	<AuthModal />
{/if}
{#if isContactUsModalOpen}
	<ContactUsModal />
{/if}
<SolaraInterestModal />
<ToastContainer />

<style>
	.layout-wrapper.modal-open > :global(#main-content),
	.layout-wrapper.modal-open > :global(footer) {
		filter: blur(5px);
		pointer-events: none;
		user-select: none;
	}
</style>

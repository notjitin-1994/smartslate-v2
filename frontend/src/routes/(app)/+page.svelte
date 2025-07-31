<script lang="ts">
	import { tick } from 'svelte';
	import Header from '$lib/components/pages/common/Header.svelte';
	import Hero from '$lib/components/pages/landing/Hero.svelte';
	import NewTalentParadox from '$lib/components/pages/landing/talent-paradox-reimagined/NewTalentParadox.svelte';
	import Framework from '$lib/components/pages/landing/Framework.svelte';
	import ROICalculator from '$lib/components/pages/landing/ROICalculator.svelte';
	import Partners from '$lib/components/pages/landing/Partners.svelte';
	import Footer from '$lib/components/pages/common/Footer.svelte';

	let revealedSections = {
		paradox: false,
		framework: false,
		roi: false,
		partners: false
	};

	let paradoxSection: HTMLElement;
	let frameworkSection: HTMLElement;
	let roiSection: HTMLElement;
	let partnersSection: HTMLElement;

	async function revealNext(section: keyof typeof revealedSections) {
		revealedSections[section] = true;
		await tick(); // Wait for the DOM to update

		let elementToScrollTo;
		switch (section) {
			case 'paradox':
				elementToScrollTo = paradoxSection;
				break;
			case 'framework':
				elementToScrollTo = frameworkSection;
				break;
			case 'roi':
				elementToScrollTo = roiSection;
				break;
			case 'partners':
				elementToScrollTo = partnersSection;
				break;
		}

		if (elementToScrollTo) {
			const headerHeight = 80; // Approximate height of the sticky header
			const elementRect = elementToScrollTo.getBoundingClientRect();
			const elementTop = elementRect.top + window.pageYOffset;
			const offsetPosition = elementTop - headerHeight;

			window.scrollTo({
				top: offsetPosition,
				behavior: 'smooth'
			});
		}
	}
</script>

<Header />

<main id="main-content">
	<Hero on:revealNext={() => revealNext('paradox')} />
	{#if revealedSections.paradox}
		<div bind:this={paradoxSection}>
			<NewTalentParadox on:revealNext={() => revealNext('framework')} />
		</div>
	{/if}
	{#if revealedSections.framework}
		<div bind:this={frameworkSection}>
			<Framework on:revealNext={() => revealNext('roi')} />
		</div>
	{/if}
	{#if revealedSections.roi}
		<div bind:this={roiSection}>
			<ROICalculator on:revealNext={() => revealNext('partners')} />
		</div>
	{/if}
	{#if revealedSections.partners}
		<div bind:this={partnersSection}>
			<Partners />
		</div>
	{/if}
</main>

<Footer />

<style>
	main {
		/* Creates space for the sticky floating header */
		margin-top: var(--space-lg);
	}
</style>

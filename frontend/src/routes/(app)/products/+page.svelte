<script lang="ts">
	import Container from '$lib/components/pages/common/Container.svelte';
	import Header from '$lib/components/pages/common/Header.svelte';
	import Footer from '$lib/components/pages/common/Footer.svelte';
	import ProductSection from '$lib/components/pages/products/ProductSection.svelte';
	import IgniteInfographic from '$lib/components/pages/products/IgniteInfographic.svelte';
	import StrategicSkillsInfographic from '$lib/components/pages/products/StrategicSkillsInfographic.svelte';
	import SolaraInfographic from '$lib/components/pages/products/SolaraInfographic.svelte';
	import { flip } from 'svelte/animate';
	import { solaraInterestModalStore } from '$lib/stores/solaraInterestModalStore';

	interface Product {
		heading: string;
		tagline: string;
		description: string;
		features: { icon: string; text: string }[];
		cta: { text: string; link?: string; icon?: string };
		secondaryCta?: { text: string; link: string };
		reverse?: boolean;
		status?: 'live' | 'coming-soon';
	}

	const products: Product[] = [
		{
			heading: 'Ignite Series',
			tagline: 'From Classroom to Career: A Direct Pipeline to Verified Talent',
			description:
				"We bridge the critical gap between academic knowledge and real-world impact. Our pre-built courses are engineered in collaboration with industry leaders to cultivate the next generation of market-ready professionals. We transform promising students into high-performing new hires, creating a seamless talent pipeline for leading companies.",
			features: [
				{
					icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9a9 9 0 1 1 9 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75a9 9 0 0 0-9 0m9 0a9 9 0 0 1-9 0m9 0h-9m9 0h-9" /></svg>`,
					text: '<strong>Industry-Forged Curriculum:</strong> Market-driven courses designed with industry leaders to build in-demand skills.'
				},
				{
					icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>`,
					text: '<strong>A Trusted Signal for Top Talent:</strong> Smartslate Certification validates career-focused education and de-risks hiring for businesses.'
				},
				{
					icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>`,
					text: '<strong>A Commitment to Excellence:</strong> Rigorous, earned certification ensures every professional is ready to make an immediate impact.'
				}
			],
			cta: {
				text: 'Explore our Courses',
				link: '/products/ignite',
				icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="book-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" /></svg>`
			},
			secondaryCta: { text: 'Learn more', link: '/products/ignite' }
		},
		{
			heading: 'Strategic Skills Architecture',
			tagline: 'Your Vision, Our Blueprint: Bespoke Learning Solutions',
			description:
				'This service is for companies and institutions that need exclusive, customized content created for their specific organizational needs. We build your learning solutions from the ground up, tailored to your vision.',
			features: [
				{
					icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>`,
					text: 'Fully Customized Content: Built from the ground up for your needs.'
				},
				{
					icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" /></svg>`,
					text: 'Exclusive & Private: Courses are not publicly available and belong to the client.'
				},
				{
					icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" /></svg>`,
					text: 'Targeted Skill Development: Directly addresses identified skill gaps within an organization.'
				}
			],
			cta: {
				text: 'Set up your Strategic Skills Architecture',
				link: '/products/ssa',
				icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="static-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" /></svg>`
			},
			secondaryCta: { text: 'Learn more', link: '/products/ssa' },
			reverse: true
		},
		{
			heading: 'Solara',
			tagline: 'The Future of Learning: An All-in-One AI-Powered Platform',
			description:
				"For too long, learning has been fragmented, inefficient, and impossible to measure effectively. That era is over. Enter Solara, the singular, intelligent platform engineered to unify every facet of learning design and delivery. We're not just improving the old model; we are building its replacement—an engine for continuous growth and unparalleled insight. The future of learning isn’t coming. It's being built, and Solara is the blueprint.",
			features: [
				{
					icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>`,
					text: '<strong>Solara Compass:</strong> Instantly translate stakeholder needs into actionable learning requirements.'
				},
				{
					icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>`,
					text: '<strong>Solara Architect:</strong> Transform raw content into structured learning blueprints automatically.'
				},
				{
					icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 01-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 013.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 013.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 01-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.575L16.5 21.75l-.398-1.175a3.375 3.375 0 00-2.456-2.456L12.75 18l1.175-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.175a3.375 3.375 0 002.456 2.456L20.25 18l-1.175.398a3.375 3.375 0 00-2.456 2.456z" /></svg>`,
					text: '<strong>Solara Genesis:</strong> Build powerful, interactive learning experiences with an AI-assisted authoring tool.'
				},
				{
					icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>`,
					text: "<strong>Solara Odyssey:</strong> Deliver personalized learning journeys and host all your courses in one place."
				},
				{
					icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
					text: '<strong>Solara Prism:</strong> Unlock deep, actionable insights into learning effectiveness with AI-powered analytics.'
				}
			],
			cta: {
				text: 'Register Interest & Support Development',
				icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="heart-icon"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>`,
				link: undefined
			},
			secondaryCta: { text: 'Learn more', link: '/products/solara' },
			status: 'coming-soon'
		}
	];

	function handleSolaraCtaClick() {
		solaraInterestModalStore.open();
	}
</script>

<Header />

<main id="main-content">
	<Container>
		<div class="hero-section">
			<h1>Our Products</h1>
		<p>
			Discover our suite of solutions designed to bridge the talent gap and empower organizations to
			thrive.
		</p>
	</div>

	<div class="products-grid">
		{#each products as product, i}
			<ProductSection
				heading={product.heading}
				tagline={product.tagline}
				description={product.description}
				features={product.features}
				cta={product.cta}
				on:ctaClick={product.heading === 'Solara' ? handleSolaraCtaClick : () => {}}
				secondaryCta={product.secondaryCta}
				reverse={product.reverse}
				status={product.status}
			>
				<svelte:fragment slot="visual">
					{#if product.heading === 'Ignite Series'}
						<IgniteInfographic />
					{:else if product.heading === 'Strategic Skills Architecture'}
						<StrategicSkillsInfographic />
					{:else if product.heading === 'Solara'}
						<SolaraInfographic />
					{/if}
				</svelte:fragment>
			</ProductSection>
		{/each}
	</div>
	</Container>
</main>

<Footer />

<style>
	main {
		padding-top: var(--space-xxl);
	}
	.hero-section {
		text-align: left;
		padding-bottom: var(--space-xxl);
	}

	.hero-section h1 {
		font-size: 3.5rem;
		font-weight: 700;
		color: var(--text-primary);
	}

	.hero-section p {
		font-size: 1.25rem;
		color: var(--text-secondary);
		max-width: 60ch;
		margin: var(--space-md) 0 0;
	}

	.products-grid {
		display: flex;
		flex-direction: column;
		gap: var(--space-xxl);
	}

	.visual-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.visual-placeholder span {
		font-size: 2rem;
		font-weight: 700;
		color: var(--text-muted);
		opacity: 0.5;
		transform: rotate(-15deg);
	}
</style>
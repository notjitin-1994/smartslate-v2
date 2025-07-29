<script lang="ts">
	import { fade } from 'svelte/transition';
	import { School, Building, ArrowRight, Lightbulb, BarChart, Users, Zap } from 'lucide-svelte';
	import Container from '$lib/components/common/Container.svelte';

	type PartnerType = 'institutions' | 'businesses';

	let activeTab: PartnerType = 'institutions';

	const content = {
		institutions: {
			title: 'Educational Institutions',
			pitch: 'Stand out by embedding real-world, in-demand skills directly into your curriculum.',
			benefits: [
				{ icon: School, text: 'Industry-Informed Curriculum' },
				{ icon: Zap, text: 'AI-Powered Learning' },
				{ icon: Users, text: 'Enhanced Graduate Employability' }
			],
			cta: 'Explore Our Programs'
		},
		businesses: {
			title: 'Business Leaders',
			pitch: 'Stop the endless search for the perfect hire and start cultivating the skills you need.',
			benefits: [
				{ icon: Lightbulb, text: 'Targeted Upskilling at Scale' },
				{ icon: BarChart, text: 'AI-Driven Performance Insights' },
				{ icon: Users, text: 'Boost Retention & Innovation' }
			],
			cta: 'Learn More'
		}
	};

	let activeContent = content[activeTab];

	$: activeContent = content[activeTab];
</script>

<section class="partners-section">
	<Container>
		<div class="section-header">
			<h2>Who We <span class="accent">Partner</span> With</h2>
			<p>
				We collaborate with forward-thinking organizations to build the future of education and
				workforce development.
			</p>
		</div>

		<div class="tabs-wrapper">
			<div class="tab-buttons">
				<button class:active={activeTab === 'institutions'} on:click={() => (activeTab = 'institutions')} >
					<School size={20} />
					<span>Educational Institutions</span>
				</button>
				<button class:active={activeTab === 'businesses'} on:click={() => (activeTab = 'businesses')} >
					<Building size={20} />
					<span>Business Leaders</span>
				</button>
			</div>

			<div class="tab-content">
				{#key activeTab}
					<div class="content-card" in:fade={{ duration: 300 }}>
						<h3>{activeContent.title}</h3>
						<p class="pitch">{activeContent.pitch}</p>
						<ul class="benefits-list">
							{#each activeContent.benefits as benefit}
								<li>
									<svelte:component this={benefit.icon} size={22} />
									<span>{benefit.text}</span>
								</li>
							{/each}
						</ul>
						<div class="cta-wrapper">
							<button class="cta-button primary">
								{activeContent.cta}
								<ArrowRight size={16} />
							</button>
							<button class="cta-button secondary">Contact Us</button>
						</div>
					</div>
				{/key}
			</div>
		</div>
	</Container>
</section>

<style>
	.partners-section {
		padding: var(--section-padding);
		background-color: var(--background-primary);
	}

	.section-header {
		text-align: left;
		margin-bottom: 4rem;
	}

	.section-header h2 {
		font-family: var(--font-family-heading);
		font-size: 3rem;
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: 1rem;
	}

	.section-header p {
		font-size: 1.2rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
	}

	.accent {
		color: var(--secondary-accent);
	}

	.tabs-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}

	.tab-buttons {
		display: inline-flex;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 999px;
		padding: 0.5rem;
		border: 1px solid rgba(255, 255, 255, 0.1);
	}

	.tab-buttons button {
		background: transparent;
		border: none;
		color: var(--color-text-secondary);
		padding: 0.75rem 1.5rem;
		border-radius: 999px;
		font-size: var(--font-size-medium);
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.tab-buttons button.active {
		background: var(--secondary-accent);
		color: var(--button-text);
		box-shadow: 0 4px 15px rgba(var(--rgb-secondary-accent), 0.3);
	}

	.tab-content {
		width: 100%;
		max-width: 900px;
	}

	.content-card {
		background: rgba(13, 15, 28, 0.5);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1.5rem;
		padding: 3rem;
	}

	.content-card h3 {
		font-family: var(--font-family-heading);
		font-size: var(--font-size-h3);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: 1rem;
	}

	.pitch {
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		margin-bottom: 2.5rem;
	}

	.benefits-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.benefits-list li {
		display: flex;
		align-items: center;
		gap: 1rem;
		font-size: var(--font-size-large);
		font-weight: 500;
		color: var(--color-text-primary);
	}

	.benefits-list li svg {
		color: var(--secondary-accent);
	}

	.cta-wrapper {
		margin-top: 3rem;
		display: flex;
		gap: 1rem;
	}

	.cta-button {
		padding: 0.875rem 1.75rem;
		font-size: var(--font-size-medium);
		font-weight: 700;
		border-radius: 999px;
		cursor: pointer;
		transition: all 0.3s ease;
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		border: 1px solid transparent;
	}

	.cta-button.primary {
		background: var(--primary-accent);
		color: var(--button-text);
		border-color: var(--primary-accent);
	}

	.cta-button.primary:hover {
		background: #fff;
		border-color: #fff;
	}

	.cta-button.secondary {
		background: transparent;
		color: var(--primary-accent);
		border-color: var(--primary-accent);
	}

	.cta-button.secondary:hover {
		background: rgba(255, 255, 255, 0.1);
	}
</style>
<script lang="ts">
	import { fade } from 'svelte/transition';
	import { School, Building, ArrowRight, Lightbulb, BarChart, Users, Zap } from 'lucide-svelte';
	import Container from '$lib/components/pages/common/Container.svelte';

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
			<div class="tab-content">
				<div class="tab-buttons">
					<button
						class:active={activeTab === 'institutions'}
						on:click={() => (activeTab = 'institutions')}
					>
						<School size={20} />
						<span>Educational Institutions</span>
					</button>
					<button
						class:active={activeTab === 'businesses'}
						on:click={() => (activeTab = 'businesses')}
					>
						<Building size={20} />
						<span>Business Leaders</span>
					</button>
				</div>
				{#key activeTab}
					<div class="content-body" in:fade={{ duration: 300 }}>
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
		padding: var(--space-xxl) 0;
		background-color: var(--background);
	}

	.section-header {
		text-align: left;
		margin-bottom: var(--space-xl);
	}

	.section-header h2 {
		font-size: 3rem;
		margin-bottom: var(--space-md);
	}

	.section-header p {
		font-size: 1.2rem;
		color: var(--text-secondary);
		line-height: 1.6;
		max-width: 60ch;
	}

	.accent {
		color: var(--primary-accent);
	}

	.tabs-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.tab-buttons {
		display: flex;
		border-bottom: 1px solid var(--border-subtle);
		margin-bottom: var(--space-xl);
	}

	.tab-buttons button {
		background: transparent;
		border: none;
		color: var(--text-secondary);
		padding: var(--space-md) var(--space-lg);
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: var(--transition-medium);
		display: flex;
		align-items: center;
		gap: var(--space-sm);
		border-bottom: 3px solid transparent;
		margin-bottom: -1px; /* Align with parent border */
	}

	.tab-buttons button:hover {
		color: var(--text-primary);
	}

	.tab-buttons button.active {
		color: var(--secondary-accent);
		border-bottom-color: var(--secondary-accent);
	}

	.tab-content {
		width: 100%;
		background: rgba(13, 15, 28, 0.5);
		border: var(--border-default);
		border-radius: var(--radius-lg);
		padding: var(--space-xl);
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.content-body {
		padding: var(--space-xl);
	}

	.content-body h3 {
		font-size: 2rem;
		font-weight: 700;
		color: var(--primary-shade-darker);
		margin-bottom: var(--space-md);
	}

	.pitch {
		font-size: 1.125rem;
		color: var(--primary-shade-dark);
		margin-bottom: var(--space-xl);
	}

	.benefits-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.benefits-list li {
		display: flex;
		align-items: center;
		gap: var(--space-md);
		font-size: 1.1rem;
		font-weight: 500;
		color: var(--primary-shade-darker);
	}

	.benefits-list li svg {
		color: var(--secondary-accent);
	}

	.cta-wrapper {
		margin-top: var(--space-xl);
		display: flex;
		gap: var(--space-md);
	}

	.cta-button {
		padding: var(--space-sm) var(--space-lg);
		font-size: 1rem;
		font-weight: 700;
		border-radius: var(--radius-md);
		cursor: pointer;
		transition: var(--transition-fast);
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		border: 1px solid transparent;
	}

	.cta-button.primary {
		background: var(--secondary-accent);
		color: #ffffff;
		border-color: var(--secondary-accent);
	}

	.cta-button.primary:hover {
		opacity: 0.9;
	}

	.cta-button.secondary {
		background: transparent;
		color: var(--secondary-accent);
		border-color: var(--secondary-accent);
	}

	.cta-button.secondary:hover {
		background: var(--secondary-accent);
		color: #ffffff;
	}

	@media (max-width: 768px) {
		.tab-buttons {
			/* No change needed for column layout, but we can improve spacing */
			gap: var(--space-sm);
			border-bottom: none;
		}

		.tab-buttons button {
			width: 100%;
			justify-content: center;
			border-bottom: 1px solid var(--border-subtle);
			border-radius: var(--radius-md);
		}

		.tab-buttons button.active {
			background-color: rgba(255, 255, 255, 0.05);
			border-bottom-color: transparent;
		}

		.content-body {
			padding: var(--space-lg);
		}

		.cta-wrapper {
			flex-direction: column;
		}

		.cta-button {
			width: 100%;
			justify-content: center;
		}
	}
</style>
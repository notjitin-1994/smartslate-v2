<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { Zap, Network, Layers, ChevronRight } from 'lucide-svelte';
	import AnimatedButton from '$lib/components/common/animated-button.svelte';
	import RupeeIcon from '$lib/components/common/rupee-icon.svelte';

	const dispatch = createEventDispatcher();

	const frameworkSteps = [
		{
			id: 'ignite',
			icon: Zap,
			title: 'Ignite Series',
			subtitle: 'AI-Powered Learning',
			description:
				'Experience the future of education with our pre-built AI-assisted courses, featuring your personal AI tutor.',
			buttonText: 'Explore our Courses',
			href: '/courses'
		},
		{
			id: 'architecture',
			icon: Network,
			title: 'Strategic Skill Architecture',
			subtitle: 'Future-Proof Workforce',
			description:
				'We conduct comprehensive skill gap analysis and design custom learning ecosystems that evolve with your needs.',
			buttonText: 'Create your Strategic Skills Architecture',
			href: '/solutions'
		},
		{
			id: 'solara',
			icon: Layers,
			title: 'Solara',
			subtitle: 'End-to-End Learning Platform',
			description:
				'Revolutionize learning content creation with our all-in-one platform featuring interactive elements and a custom interaction builder.',
			buttonText: 'Learn More',
			href: '/solara'
		}
	];

	let visible: { [key: string]: boolean } = {};

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						visible[entry.target.id] = true;
					}
				});
			},
			{
				threshold: 0.5
			}
		);

		const steps = document.querySelectorAll('.framework-step');
		steps.forEach((step) => {
			observer.observe(step);
		});

		return () => {
			steps.forEach((step) => {
				observer.unobserve(step);
			});
		};
	});
</script>

<section class="framework-section">
	<div class="container">
		<div class="section-header">
			<h2>The Smartslate <span class="accent">Framework</span></h2>
			<p>
				We don't just train; we <span class="accent">transform</span>. Our integrated ecosystem
				bridges the critical gap between education and industry.
			</p>
		</div>

		<div class="steps-container">
			{#each frameworkSteps as step, i (step.id)}
				<div class="framework-step" id={step.id}>
					{#if visible[step.id]}
						<div class="step-card" in:fly={{ y: 50, duration: 800, delay: i * 100 }}>
							<div>
								<div class="icon-wrapper">
									<svelte:component this={step.icon} size={36} />
								</div>
								<h3>{step.title}</h3>
								<h4>{step.subtitle}</h4>
								<p>{step.description}</p>
							</div>
							<a href={step.href} class="cta-button">
								<span>{step.buttonText}</span>
								<div class="arrow-wrapper">
									<ChevronRight size={20} />
								</div>
							</a>
						</div>
					{/if}
				</div>
			{/each}
		</div>
		<div class="roi-button-container">
			<AnimatedButton
				text="Unearth your ROI"
				icon={RupeeIcon}
				on:click={() => dispatch('revealNext')}
			/>
		</div>
	</div>
</section>

<style>
	.framework-section {
		padding: var(--space-xxl) 0;
		background-color: var(--background);
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 var(--space-lg);
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
		margin: 0;
		max-width: 60ch;
	}

	.accent {
		color: var(--primary-accent);
	}

	.steps-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-lg);
	}

	.framework-step {
		min-height: 300px; /* Ensure observer triggers */
	}

	.icon-wrapper {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: var(--space-md);
		background-color: transparent;
		border: 2px solid var(--secondary-accent);
		border-radius: 50%;
		margin-bottom: var(--space-lg);
		color: var(--secondary-accent);
		transition: var(--transition-medium);
	}

	.step-card {
		background: rgba(255, 255, 255, 0.05);
		border: var(--border-default);
		border-radius: var(--radius-lg);
		padding: var(--space-xl) var(--space-lg);
		height: 100%;
		transition: var(--transition-medium);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.step-card:hover {
		transform: translateY(-10px);
		box-shadow: var(--shadow-lg);
		border-color: var(--primary-accent);
	}

	.step-card:hover .icon-wrapper {
		transform: scale(1.1) rotate(5deg);
		background-color: var(--secondary-accent);
		border-color: var(--secondary-accent);
		color: var(--text-primary);
	}

	.step-card h3 {
		font-size: clamp(1.2rem, 2.5vw, 1.75rem);
		color: var(--primary-shade-darker);
		margin-bottom: var(--space-sm);
	}

	.step-card h4 {
		font-size: 1rem;
		color: var(--primary-shade-dark);
		margin-bottom: var(--space-md);
		font-weight: 500;
	}

	.step-card p {
		color: var(--primary-shade-darker);
		line-height: 1.6;
		margin-bottom: var(--space-lg);
	}

	.cta-button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		text-align: center;
		padding: var(--space-lg) var(--space-xl);
		background-color: transparent;
		color: var(--primary-accent);
		border: 2px solid var(--primary-accent);
		border-radius: var(--radius-lg);
		text-decoration: none;
		transition: var(--transition-fast);
		font-weight: 700;
	}

	.cta-button:hover {
		background-color: var(--secondary-accent);
		color: var(--text-primary);
		border-color: var(--secondary-accent);
	}

	.cta-button .arrow-wrapper {
		transition: var(--transition-fast);
	}

	.cta-button:hover .arrow-wrapper {
		transform: translateX(4px);
	}

	@media (max-width: 768px) {
		.steps-container {
			grid-template-columns: 1fr;
			gap: var(--space-xl);
		}

		.section-header h2 {
			font-size: 2.5rem;
		}

		.section-header p {
			font-size: 1rem;
		}
	}

	.roi-button-container {
		text-align: left;
		margin-top: var(--space-xl);
	}

</style>

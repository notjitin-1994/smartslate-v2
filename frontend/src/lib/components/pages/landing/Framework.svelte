<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { Zap, Network, Layers } from 'lucide-svelte';

	const frameworkSteps = [
		{
			id: 'ignite',
			icon: Zap,
			title: 'Ignite Series',
			subtitle: 'AI-Powered Learning',
			description:
				'Experience the future of education with our pre-built AI-assisted courses, featuring your personal AI tutor.'
		},
		{
			id: 'architecture',
			icon: Network,
			title: 'Strategic Skill Architecture',
			subtitle: 'Future-Proof Workforce',
			description:
				'We conduct comprehensive skill gap analysis and design custom learning ecosystems that evolve with your needs.'
		},
		{
			id: 'solara',
			icon: Layers,
			title: 'Solara',
			subtitle: 'End-to-End Learning Platform',
			description:
				'Revolutionize learning content creation with our all-in-one platform featuring interactive elements and a custom interaction builder.'
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
						<div
							class="step-card"
							in:fly={{ y: 50, duration: 800, delay: i * 100 }}
						>
							<div class="icon-wrapper">
								<svelte:component this={step.icon} size={36} />
							</div>
							<h3>{step.title}</h3>
							<h4>{step.subtitle}</h4>
							<p>{step.description}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.framework-section {
		padding: 6rem 0;
		background-color: var(--background-primary);
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 1.5rem;
	}

	.section-header {
		text-align: left;
		margin-bottom: 4rem;
	}

	.section-header h2 {
		font-family: var(--font-heading);
		font-size: 3rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 1rem;
	}

	.section-header p {
		font-size: 1.2rem;
		color: var(--text-secondary);
		margin: 0;
	}

	.accent {
		color: var(--secondary-accent);
	}

	.steps-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
	}

	.framework-step {
		min-height: 300px; /* Ensure observer triggers */
	}

	.icon-wrapper {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		background-color: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		margin-bottom: 1.5rem;
		color: var(--secondary-accent);
		transition: transform 0.3s ease;
	}

	.step-card {
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1rem;
		padding: 2rem;
		height: 100%;
		transition:
			transform 0.3s ease,
			box-shadow 0.3s ease;
	}

	.step-card:hover {
		transform: translateY(-10px);
		box-shadow:
			0 0 15px rgba(var(--rgb-secondary-accent), 0.3),
			0 0 30px rgba(var(--rgb-secondary-accent), 0.2),
			0 0 45px rgba(var(--rgb-secondary-accent), 0.1);
	}

	.step-card:hover .icon-wrapper {
		transform: scale(1.1) rotate(5deg);
	}

	.step-card h3 {
		font-family: var(--font-heading);
		font-size: 1.75rem;
		color: var(--primary-accent);
		margin-bottom: 0.5rem;
	}

	.step-card h4 {
		font-size: 1rem;
		color: var(--text-secondary);
		margin-bottom: 1.5rem;
		font-weight: 500;
	}

	.step-card p {
		color: var(--text-primary);
		line-height: 1.6;
	}

	@media (max-width: 768px) {
		.steps-container {
			grid-template-columns: 1fr;
		}

		.section-header h2 {
			font-size: 2.5rem;
		}

		.section-header p {
			font-size: 1rem;
		}
	}
</style>
<script lang="ts">
	import { fade } from 'svelte/transition';
	import Container from '$lib/components/common/Container.svelte';
	import EmployabilityCrisis from './talent-paradox/EmployabilityCrisis.svelte';
	import SkillsGap from './talent-paradox/SkillsGap.svelte';
	import IndustryDemand from './talent-paradox/IndustryDemand.svelte';
	import EconomicImpact from './talent-paradox/EconomicImpact.svelte';
	import { ShieldAlert, Puzzle, TrendingUp, Landmark } from 'lucide-svelte';

	type Section = 'crisis' | 'gap' | 'demand' | 'impact';

	let activeSection: Section = 'crisis';

	const sections = {
		crisis: {
			label: 'The Employability Crisis',
			component: EmployabilityCrisis,
			icon: ShieldAlert
		},
		gap: {
			label: 'The Critical Skills Gap',
			component: SkillsGap,
			icon: Puzzle
		},
		demand: {
			label: 'Evolving Industry Demand',
			component: IndustryDemand,
			icon: TrendingUp
		},
		impact: {
			label: 'The Economic Impact',
			component: EconomicImpact,
			icon: Landmark
		}
	};
</script>

<section class="talent-paradox-section">
	<Container>
		<div class="grid-layout">
			<div class="left-panel">
				<div class="section-header">
					<h2>
						The <span class="accent">Talent Paradox</span>: A
						<span class="accent">Crisis</span> of Scale
					</h2>
					<p>
						India's potential is immense, but it's constrained by a persistent skills gap. The
						numbers paint a clear picture of a crisis of scale.
					</p>
				</div>

				<div class="button-group">
					{#each Object.entries(sections) as [key, { label, icon }]}
						<button
							class:active={activeSection === key}
							on:click={() => (activeSection = key as Section)}
						>
							<svelte:component this={icon} size={20} />
							<span>{label}</span>
						</button>
					{/each}
				</div>
			</div>

			<div class="right-panel">
				{#key activeSection}
					<div in:fade={{ duration: 300 }}>
						<svelte:component this={sections[activeSection].component} />
					</div>
				{/key}
			</div>
		</div>
	</Container>
</section>

<style>
	.talent-paradox-section {
		padding: 6rem 0;
		background-color: transparent;
	}

	.grid-layout {
		display: grid;
		grid-template-columns: 1fr 1.25fr;
		gap: 4rem;
		align-items: flex-start;
	}

	.left-panel {
		position: sticky;
		top: 8rem; /* Adjust based on header height */
	}

	.section-header h2 {
		font-family: var(--font-heading);
		font-size: 3rem;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 1rem;
	}

.accent {
		color: var(--secondary-accent);
	}
	.section-header p {
		font-size: 1.125rem;
		color: var(--text-secondary);
		line-height: 1.6;
		max-width: 700px;
	}

	.button-group {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 2.5rem;
	}

	.button-group button {
		background: transparent;
		border: 1px solid var(--border-color);
		color: var(--text-secondary);
		padding: 1rem 1.5rem;
		border-radius: 8px;
		text-align: left;
		font-size: 1rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		box-shadow: 0 0 0px rgba(167, 218, 219, 0);
	}

	.button-group button:not(.active) {
		box-shadow: 0 0 15px rgba(167, 218, 219, 0.2);
		animation: pulse 2.5s infinite cubic-bezier(0.4, 0, 0.6, 1);
	}

	.button-group button:hover {
		background-color: rgba(167, 218, 219, 0.1);
		border-color: rgba(167, 218, 219, 0.3);
		color: var(--primary-accent);
		transform: translateY(-2px);
	}

	.button-group button.active {
		background-color: var(--secondary-accent);
		color: var(--button-text);
		border-color: var(--secondary-accent);
		font-weight: 600;
		animation: none;
		box-shadow: 0 5px 15px rgba(167, 218, 219, 0.4);
	}

	.right-panel {
		min-height: 400px; /* Ensure panel has height for transitions */
		transition: transform 0.3s ease, box-shadow 0.3s ease;
	}

	.right-panel:hover {
		transform: translateY(-5px);
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
	}

	@media (max-width: 992px) {
		.grid-layout {
			grid-template-columns: 1fr;
			gap: 3rem;
		}
		.left-panel {
			position: static;
			top: auto;
			display: contents; /* Allows children to be grid items */
		}

		/* Reorder the elements for the mobile layout */
		.section-header {
			grid-row: 1;
		}
		.right-panel {
			grid-row: 2;
		}
		.button-group {
			grid-row: 3;
		}
	}

	@media (max-width: 768px) {
		.talent-paradox-section {
			padding: 4rem 0;
		}
		.section-header h2 {
			font-size: 2.25rem;
		}
	}
	@keyframes pulse {
		0%,
		100% {
			box-shadow: 0 0 15px rgba(167, 218, 219, 0.2);
		}
		50% {
			box-shadow: 0 0 25px rgba(167, 218, 219, 0.4);
		}
	}
</style>
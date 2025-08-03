<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { createEventDispatcher } from 'svelte';
	import { PlusCircle, MinusCircle, LayoutGrid } from 'lucide-svelte';
	import Container from '$lib/components/pages/common/Container.svelte';
	import AnimatedButton from '$lib/components/common/animated-button.svelte';
	import EconomicEquationInfographic from './EconomicEquationInfographic.svelte';
	import EmployabilityCrisisInfographic from './EmployabilityCrisisInfographic.svelte';
	import CriticalSkillsShiftInfographic from './CriticalSkillsShiftInfographic.svelte';
	import HiddenOpportunityInfographic from './HiddenOpportunityInfographic.svelte';

	const dispatch = createEventDispatcher();

	type Section = 'economic' | 'employability' | 'skills' | 'opportunity';

	let revealed: Partial<Record<Section, boolean>> = {};

	function toggle(section: Section) {
		revealed[section] = !revealed[section];
	}
</script>

<section class="talent-paradox-reimagined">
	<Container>
		<div class="section-header">
			<h2>
				India's <span class="accent-animate">Talent Paradox</span>: Bridging the
				<span class="accent-animate">Billion-Person Opportunity Gap</span>
			</h2>
			<p>
				India's potential is a force of nature. But this immense human capital is facing a
				widening chasm between aspiration and reality. This isn't just a challenge; it's a
				multi-trillion-dollar crisis of scale. Let's break it down.
			</p>
		</div>

		<div class="subsection">
			<button
				class="section-header interactive cta-button"
				class:revealed={revealed.economic}
				on:click={() => toggle('economic')}
			>
				<div class="header-content">
					<h3>
						The <span class="accent-animate">Economic Equation</span>: A Nation's
						<span class="accent-animate">Potential on the Line</span>
					</h3>
					<p>
						The talent paradox isn't just an abstract challenge; it's a direct threat to our
						economic momentum. When a nation's workforce can't keep pace with digital
						transformation, the cost is measured in lost growth and missed opportunities.
					</p>
				</div>
				<div class="icon-wrapper">
					{#if revealed.economic}
						<MinusCircle />
					{:else}
						<PlusCircle />
					{/if}
				</div>
			</button>
			{#if revealed.economic}
				<div transition:slide|local={{ duration: 500, easing: quintOut }}>
					<EconomicEquationInfographic source="Based on World Bank and national economic projections." />
				</div>
			{/if}
		</div>

		<div class="subsection">
			<button
				class="section-header interactive cta-button"
				class:revealed={revealed.employability}
				on:click={() => toggle('employability')}
			>
				<div class="header-content">
					<h3>
						The <span class="accent-animate">Employability Crisis</span>: The Gap Between
						<span class="accent-animate">Campus and Career</span>
					</h3>
					<p>
						The root of the economic risk lies in a fundamental disconnect between education and
						industry. We have millions of graduates, but are they truly ready for the modern
						workplace?
					</p>
				</div>
				<div class="icon-wrapper">
					{#if revealed.employability}
						<MinusCircle />
					{:else}
						<PlusCircle />
					{/if}
				</div>
			</button>
			{#if revealed.employability}
				<div transition:slide|local={{ duration: 500, easing: quintOut }}>
					<EmployabilityCrisisInfographic source="Data from NASSCOM, AICTE, and industry surveys." />
				</div>
			{/if}
		</div>

		<div class="subsection">
			<button
				class="section-header interactive cta-button"
				class:revealed={revealed.skills}
				on:click={() => toggle('skills')}
			>
				<div class="header-content">
					<h3>The <span class="accent-animate">Moving Target of Talent</span></h3>
					<p>
						The skills that defined a valuable employee yesterday are quickly becoming obsolete. By
						2030, the very definition of "core skill" will be transformed.
					</p>
				</div>
				<div class="icon-wrapper">
					{#if revealed.skills}
						<MinusCircle />
					{:else}
						<PlusCircle />
					{/if}
				</div>
			</button>
			{#if revealed.skills}
				<div transition:slide|local={{ duration: 500, easing: quintOut }}>
					<CriticalSkillsShiftInfographic source="Analysis from World Economic Forum 'Future of Jobs' report." />
				</div>
			{/if}
		</div>

		<div class="subsection">
			<button
				class="section-header interactive cta-button"
				class:revealed={revealed.opportunity}
				on:click={() => toggle('opportunity')}
			>
				<div class="header-content">
					<h3>Your <span class="accent-animate">Workforce is Ready to Evolve</span></h3>
					<p>
						Here is the most hopeful part of the paradox. The desire to adapt is already there. Your
						future leaders and innovators aren't waiting to be told; they are actively seeking ways
						to stay relevant.
					</p>
				</div>
				<div class="icon-wrapper">
					{#if revealed.opportunity}
						<MinusCircle />
					{:else}
						<PlusCircle />
					{/if}
				</div>
			</button>
			{#if revealed.opportunity}
				<div transition:slide|local={{ duration: 500, easing: quintOut }}>
					<HiddenOpportunityInfographic source="LinkedIn Learning and Coursera workforce trend reports." />
				</div>
			{/if}
		</div>

		<div class="section-header final-cta">
			<h4>Your <span class="accent-animate">Workforce is Ready to Evolve</span></h4>
			<p>
				Understanding the problem is the first step. Solving it is the next. Smartslate is
				designed to be the bridge across this divide—connecting motivated talent with the
				future-focused skills your company needs to thrive.
		</p>
		<AnimatedButton
			text="Discover our Framework"
			icon={LayoutGrid}
			on:click={() => dispatch('revealNext')}
		/>
	</div>
	</Container>
</section>

<style>
	.talent-paradox-reimagined {
		background-color: var(--color-background-dark);
		color: var(--color-text-light);
		padding: var(--space-xxl) 0;
		border-top: 1px solid var(--color-border-subtle);
	}

	.section-header {
		text-align: left;
		margin-bottom: var(--space-lg);
	}

	.section-header.interactive {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		padding: var(--space-md);
		border-radius: var(--border-radius-md);
		transition: background-color 0.2s ease-in-out;
		width: 100%;
		background: none;
		border: 1px solid var(--color-border-subtle);
		text-align: left;
		color: inherit;
		font-family: inherit;
		cursor: pointer;
	}

	.section-header.interactive:hover {
		background-color: rgba(255, 255, 255, 0.05);
	}

	.header-content {
		flex-grow: 1;
	}

	.icon-wrapper {
		flex-shrink: 0;
		margin-left: var(--space-lg);
		color: var(--primary-accent);
		transition: transform 0.3s ease-in-out;
		cursor: pointer;
		animation: pulse-glow 2s infinite ease-in-out;
	}

	@keyframes pulse-glow {
		0%,
		100% {
			filter: drop-shadow(0 0 4px rgba(167, 218, 219, 0.5));
		}
		50% {
			filter: drop-shadow(0 0 8px rgba(167, 218, 219, 0.9));
		}
	}

	.section-header h2 {
		font-size: 3rem;
		margin-bottom: var(--space-md);
		color: var(--text-primary);
		font-weight: 700;
	}

	.section-header h3 {
		font-size: 1.75rem;
		margin-bottom: var(--space-sm);
		color: var(--text-primary);
		font-weight: 600;
	}

	.section-header h4 {
		font-size: 1.5rem;
		margin-bottom: var(--space-sm);
		color: var(--text-primary);
		font-weight: 600;
	}

	.section-header p {
		font-size: 1.125rem;
		color: var(--text-secondary);
		line-height: 1.6;
		max-width: 75ch;
		margin-top: 0;
	}

	.subsection {
		border-bottom: 1px solid var(--color-border-subtle);
		padding-bottom: var(--space-lg);
		margin-bottom: var(--space-lg);
	}

	.final-cta {
		margin-top: var(--space-xxl);
		text-align: left;
	}

	.final-cta p {
		max-width: 65ch;
		margin-left: 0;
		margin-right: 0;
		margin-bottom: var(--space-lg);
	}

	.accent-animate {
		color: var(--primary-accent);
		font-weight: 600;
	}

	/* Animate static headers on load */
	.section-header:not(.interactive) .accent-animate {
		opacity: 0;
		animation: fadeInAccent 1s ease-in-out 0.5s forwards;
	}

	/* Transition interactive headers on reveal */
	.interactive .accent-animate {
		transition: all 0.5s ease-in-out;
		color: var(--text-secondary);
		font-weight: 500;
	}

	.interactive.revealed .accent-animate {
		color: var(--primary-accent);
		font-weight: 600;
	}

	@keyframes color-change-once {
		from {
			color: var(--text-primary);
		}
		to {
			color: var(--primary-accent);
		}
	}

	@keyframes fadeInAccent {
		to {
			opacity: 1;
		}
	}
	.cta-button {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		text-align: center;
		padding: var(--space-sm) var(--space-lg);
		background-color: transparent;
		color: var(--secondary-accent);
		border: 1px solid var(--secondary-accent);
		border-radius: var(--radius-md);
		text-decoration: none;
		transition: var(--transition-fast);
		font-weight: 500;
	}

	.cta-button:hover {
		background-color: var(--secondary-accent);
		color: var(--text-primary);
		border-color: var(--secondary-accent);
	}

	@media (max-width: 768px) {
		.section-header h2 {
			font-size: 2.5rem;
		}
		.section-header p {
			font-size: 1rem;
		}
		.section-header.interactive {
			flex-direction: column;
			align-items: flex-start;
		}
		.icon-wrapper {
			margin-left: 0;
			margin-top: var(--space-md);
		}
	}
</style>
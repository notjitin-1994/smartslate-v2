<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Briefcase, GraduationCap, User, ArrowRight } from 'lucide-svelte';

	const dispatch = createEventDispatcher();

	const personas = [
		{
			id: 'educator',
			title: 'Academic Leader',
			icon: GraduationCap,
			description: `Focus on <strong class="highlight">student employability</strong> & <strong class="highlight">industry partnerships</strong>.`,
			color: 'purple'
		},
		{
			id: 'businessman',
			title: 'Corporate Leader',
			icon: Briefcase,
			description: `Focus on <strong class="highlight">ROI</strong>, <strong class="highlight">productivity</strong> & <strong class="highlight">talent retention</strong>.`,
			color: 'blue'
		},
		{
			id: 'student',
			title: 'Aspiring Professional',
			icon: User,
			description: `Focus on <strong class="highlight">career acceleration</strong> & <strong class="highlight">dream job readiness</strong>.`,
			color: 'cyan'
		}
	];

	function selectPersona(id: string) {
		dispatch('select', { persona: id });
	}
</script>

<div class="persona-selector-grid">
	{#each personas as persona (persona.id)}
		<div class="persona-card" on:click={() => selectPersona(persona.id)} on:keypress={() => selectPersona(persona.id)} role="button" tabindex="0">
			<div class="card-content">
				<div class="icon-wrapper">
					<svelte:component this={persona.icon} size={24} />
				</div>
				<h3>{persona.title}</h3>
				<p class="description">{@html persona.description}</p>
			</div>
			<div class="action">
				<span>Calculate My Benefits</span>
				<ArrowRight size={16} />
			</div>
		</div>
	{/each}
</div>
<div class="footer-note">
	<p>
		Not sure?
		<button on:click={() => selectPersona('educator')}>Start with Academic Leader</button>
	</p>
</div>

<style>
	.persona-selector-grid {
		display: grid;
		grid-template-columns: 1fr; /* Mobile-first: single column */
		gap: 2rem;
		justify-content: center;
	}

	@media (min-width: 768px) {
		.persona-selector-grid {
			grid-template-columns: repeat(3, 1fr); /* 3 columns for tablet and up */
		}
	}

	.persona-card {
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 1rem;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.persona-card:hover {
		transform: translateY(-8px);
		border-color: rgba(167, 218, 219, 0.5);
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
	}

	.card-content {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		flex-grow: 1;
	}

	.icon-wrapper {
		color: var(--secondary-accent);
		background: rgba(167, 218, 219, 0.1);
		width: 48px;
		height: 48px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	h3 {
		font-family: var(--font-family-heading);
		font-size: var(--font-size-xl);
		font-weight: 600;
		color: var(--color-text-primary);
	}

	.description {
		font-size: var(--font-size-medium);
		color: var(--color-text-secondary);
		line-height: 1.7;
		flex-grow: 1;
	}

	.description :global(strong.highlight) {
		color: var(--color-text-primary);
		font-weight: 600;
	}

	.action {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-weight: 600;
		font-size: var(--font-size-medium);
		color: var(--secondary-accent);
		margin-top: 1.5rem;
		transition: all 0.2s ease;
	}

	.persona-card:hover .action {
		color: #ffffff;
		transform: translateX(4px);
	}

	.footer-note {
		text-align: center;
		margin-top: 3rem;
		font-size: var(--font-size-medium);
		color: var(--color-text-secondary);
	}

	.footer-note button {
		background: none;
		border: none;
		color: var(--secondary-accent);
		font-weight: 600;
		cursor: pointer;
		text-decoration: underline;
		text-underline-offset: 4px;
		transition: color 0.2s ease;
	}

	.footer-note button:hover {
		color: var(--primary-accent-dark);
	}
</style>
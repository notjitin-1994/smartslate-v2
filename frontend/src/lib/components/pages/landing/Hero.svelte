<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Container from '$lib/components/pages/common/Container.svelte';
	import { ChevronDown } from 'lucide-svelte';
	import AnimatedButton from '$lib/components/common/animated-button.svelte';

	const dispatch = createEventDispatcher();
</script>

<section>
	<Container>
		<div class="content">
			<h1>
				Build Your <span class="accent">Future-Ready</span> <span class="accent">Workforce</span>
			</h1>
			<p>
				India is on the cusp of a major economic expansion, fueled by its vibrant young population.
				However, a
				<strong>significant skills gap</strong> threatens progress—companies need
				<strong>job-ready talent</strong> but emerging professionals aren't yet prepared.
			</p>
			<p>
				The future of business is being written in India, yet a <strong>silent crisis</strong>
				threatens to derail it all. Millions of ambitious individuals are entering the workforce, but
				they lack the specific, critical skills your company needs to innovate and compete. This
				<strong>talent paradox</strong> isn't just a statistic—it's a
				<strong>direct threat to your bottom line and future success</strong>.
			</p>
			<AnimatedButton
				text="Uncover the Crisis"
				icon={ChevronDown}
				on:click={() => dispatch('revealNext')}
			/>
		</div>
	</Container>
</section>

<style>
	section {
		position: relative;
		min-height: 60vh;
		display: flex;
		align-items: center;
		padding: var(--space-xl) 0;
		overflow: hidden;
	}

	.content {
		width: 100%;
		text-align: left;
		z-index: 1;
	}

	h1 {
		font-size: 3rem;
		margin-bottom: var(--space-lg);
		max-width: 20ch; /* Limit line length for readability */
	}

	.accent {
		color: var(--primary-accent);
	}

	p {
		font-size: 1.1rem;
		margin-bottom: var(--space-md);
		max-width: 65ch; /* Optimal reading length */
		color: var(--text-secondary);
	}

	strong {
		color: var(--text-primary);
		font-weight: 700;
	}

	/* Removed component-specific media query. Styles are now handled globally in app.css */
</style>

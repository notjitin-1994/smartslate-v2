<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let visible = false;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					visible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.1 }
		);

		const element = document.querySelector('.infographic-container');
		if (element) observer.observe(element);

		return () => {
			if (element) observer.unobserve(element);
		};
	});

	const features = [
		{
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>`,
			title: 'Solara Compass',
			description: 'Answer guided questions to automatically generate a complete Learning Needs Analysis with delivery models and timelines.'
		},
		{
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>`,
			title: 'Solara Architect',
			description: 'Upload raw content in any format and let our AI intelligently structure it into a comprehensive storyboard.'
		},
		{
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 01-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 013.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 013.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 01-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.575L16.5 21.75l-.398-1.175a3.375 3.375 0 00-2.456-2.456L12.75 18l1.175-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.175a3.375 3.375 0 002.456 2.456L20.25 18l-1.175.398a3.375 3.375 0 00-2.456 2.456z" /></svg>`,
			title: 'Solara Genesis',
			description: 'Bring storyboards to life with 150+ interactions or create your own with our AI-powered, low-code builder.'
		},
		{
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>`,
			title: 'Solara Odyssey',
			description: 'Host new and legacy courses (SCORM/xAPI) while our AI delivers unique, personalized learning paths for every user.'
		},
		{
			icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`,
			title: 'Solara Prism',
			description: 'Go beyond standard metrics with AI-powered analytics that provide deep, actionable insights into learner effectiveness.'
		}
	];
</script>

<div class="infographic-container" in:fade={{ duration: 600 }}>
	<div class="infographic">
		{#each features as feature, i (i)}
			<div
				class="feature"
				in:fly={{
					y: 50,
					duration: 600,
					delay: i * 100,
					easing: quintOut
				}}
				out:fade
			>
				<div class="icon">
					{@html feature.icon}
				</div>
				<h3 class="title">{feature.title}</h3>
				<p class="description">{feature.description}</p>
			</div>
		{/each}

		<div
			class="sparkle"
			class:visible
			in:fade={{
				delay: 1000,
				duration: 1000
			}}
		>
			<div class="sparkle-dot dot-1"></div>
			<div class="sparkle-dot dot-2"></div>
		</div>
	</div>
</div>

<style>
	.infographic-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}

	.infographic {
		position: relative;
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--space-lg);
		counter-reset: feature;
	}

	.feature {
		position: relative;
		padding: 2rem 1.5rem;
		background: var(--container-bg);
		border-radius: 12px;
		box-shadow: var(--shadow-lg);
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		z-index: 1;
		overflow: hidden;
		border: 1px solid var(--border-color);
	}

	.feature::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 4px;
		background: linear-gradient(90deg, #4F46E5, #7C3AED);
	}

	.feature:hover {
		transform: translateY(-5px);
		box-shadow: var(--shadow-xl);
	}

	.icon {
		margin-bottom: 1.5rem;
		opacity: 0.9;
		color: var(--text-secondary);
	}

	.icon :global(svg) {
		width: 40px;
		height: 40px;
	}

	.title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 1rem;
		line-height: 1.3;
	}

	.description {
		color: var(--text-secondary);
		line-height: 1.6;
		font-size: 0.95rem;
	}

	.sparkle {
		position: absolute;
		width: 100%;
		height: 100%;
		pointer-events: none;
		opacity: 0;
		transition: opacity 1s ease;
	}

	.sparkle.visible {
		opacity: 1;
	}

	.sparkle-dot {
		position: absolute;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: linear-gradient(135deg, #8B5CF6, #4F46E5);
		filter: blur(1px);
		opacity: 0;
	}

	.dot-1 {
		top: 20%;
		left: 15%;
		animation: float 6s ease-in-out infinite;
	}

	.dot-2 {
		top: 60%;
		right: 20%;
		animation: float 7s ease-in-out 1s infinite;
	}

	@keyframes float {
		0%,
		100% {
			transform: translateY(0) scale(1);
			opacity: 0.7;
		}
		50% {
			transform: translateY(-20px) scale(1.2);
			opacity: 1;
		}
	}

	@media (max-width: 768px) {
		.infographic {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.feature {
			padding: 1.5rem;
		}
	}
</style>
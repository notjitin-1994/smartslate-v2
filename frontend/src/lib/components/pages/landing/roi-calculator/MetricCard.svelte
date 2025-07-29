<script lang="ts">
	import type { SvelteComponent, ComponentType } from 'svelte';
	import { Info, type Icon as IconType } from 'lucide-svelte';

	export let icon: ComponentType<IconType>;
	export let title: string;
	export let value: number;
	export let unit: string = '';
	export let description: string;
	export let source: string;
	export let isCurrency: boolean = false;

	$: formattedValue = isCurrency
		? `₹${Math.round(value).toLocaleString('en-IN')}`
		: `${Math.round(value).toLocaleString()}${unit}`;
</script>

<div class="metric-card">
	<div class="card-header">
		<div class="icon-wrapper">
			<svelte:component this={icon} size={24} />
		</div>
		<div class="tooltip-wrapper">
			<Info size={16} />
			<span class="tooltip-text">{source}</span>
		</div>
	</div>
	<h3>{title}</h3>
	<p class="value">{formattedValue}</p>
	<p class="description">{description}</p>
</div>

<style>
	.metric-card {
		background: var(--background);
		padding: 1.5rem;
		border-radius: 1rem;
		border: 1px solid var(--color-border);
		display: flex;
		flex-direction: column;
		text-align: left;
		height: 100%;
		transition: all 0.3s ease;
	}

    .metric-card:hover {
        transform: translateY(-4px);
        border-color: var(--primary-accent-faded);
    }

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1rem;
	}

	.icon-wrapper {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: hsla(var(--raw-primary-accent), 0.1);
		color: var(--primary-accent);
	}

	h3 {
		font-family: var(--font-family-heading);
		font-size: var(--font-size-large);
		font-weight: 700;
		color: var(--color-text-primary);
		margin-bottom: 0.5rem;
	}

	.value {
		font-family: var(--font-family-heading);
		font-size: 2.25rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin-bottom: 0.75rem;
	}

	.description {
		font-size: var(--font-size-small);
		color: var(--color-text-secondary);
		line-height: 1.6;
		flex-grow: 1;
	}

	.tooltip-wrapper {
		position: relative;
		color: var(--color-text-secondary);
	}

	.tooltip-wrapper .tooltip-text {
		visibility: hidden;
		width: 220px;
		background-color: var(--background-light);
		color: var(--color-text-primary);
		text-align: center;
		border-radius: 0.5rem;
		padding: 0.75rem;
		position: absolute;
		z-index: 1;
		bottom: 125%;
		left: 50%;
		margin-left: -110px;
		opacity: 0;
		transition: opacity 0.3s;
		font-size: var(--font-size-small);
		border: 1px solid var(--color-border);
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.tooltip-wrapper:hover .tooltip-text {
		visibility: visible;
		opacity: 1;
	}
</style>
<script lang="ts">
	import type { ComponentType } from 'svelte';
	import type { SvelteComponent } from 'svelte';

	export let text: string;
	export let icon: any;
	export let href: string | undefined = undefined;
	export let customClass: string | undefined = undefined;
	export let variant: 'primary' | 'secondary' = 'primary';

	const Tag = href ? 'a' : 'button';
</script>

<svelte:element
	this={Tag}
	{href}
	class="animated-btn {customClass ? customClass : ''}"
	class:secondary={variant === 'secondary'}
	on:click
	role={Tag === 'button' ? undefined : 'button'}
>
	<span>{text}</span>
	<svelte:component this={icon} size={'1.1em'} />
</svelte:element>

<style>
	.animated-btn {
		background-color: var(--secondary-accent);
		color: #ffffff;
		border: 1px solid transparent;
		padding: var(--space-md) var(--space-lg);
		font-family: var(--font-body);
		font-size: 1.1rem;
		font-weight: 700;
		cursor: pointer;
		border-radius: var(--radius-md);
		transition: var(--transition-fast);
		box-shadow: var(--shadow-md);
		display: inline-flex;
		align-items: center;
		gap: var(--space-sm);
		text-decoration: none;
	}

	.animated-btn:hover {
		transform: translateY(-2px);
		box-shadow: var(--shadow-lg);
	}

	.animated-btn:hover :global(svg) {
		color: var(--brand-accent-indigo);
	}

	.animated-btn.secondary {
		background-color: transparent;
		border-color: var(--secondary-accent);
		color: var(--secondary-accent);
	}

	.animated-btn.secondary:hover {
		background-color: var(--secondary-accent);
		color: var(--color-background-dark);
	}
</style>

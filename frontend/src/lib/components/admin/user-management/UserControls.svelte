<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let searchTerm = '';

	const dispatch = createEventDispatcher();

	function handleInput() {
		dispatch('search', searchTerm);
	}
</script>

<div class="controls-container">
	<input
		type="text"
		class="search-input"
		placeholder="Search by name or email..."
		bind:value={searchTerm}
		on:input={handleInput}
	/>
</div>

<style>
	.controls-container {
		margin-bottom: var(--space-lg);
	}
	.search-input {
		width: 100%;
		max-width: 320px;
		padding: var(--space-sm) var(--space-md);
		background-color: var(--color-background-tertiary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		color: var(--color-text-primary);
		font-size: 0.9rem;
	}
	.search-input::placeholder {
		color: var(--color-text-secondary);
	}
</style>

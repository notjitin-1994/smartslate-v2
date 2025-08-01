<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let currentPage: number;
	export let totalItems: number;
	export let itemsPerPage: number;

	$: totalPages = Math.ceil(totalItems / itemsPerPage);

	const dispatch = createEventDispatcher();

	function goToPage(page: number) {
		if (page < 1 || page > totalPages) return;
		currentPage = page;
		dispatch('pageChange', { page });
	}

	$: paginationRange = (() => {
		const delta = 1;
		const range = [];
		const left = currentPage - delta;
		const right = currentPage + delta + 1;
		let l;

		for (let i = 1; i <= totalPages; i++) {
			if (i === 1 || i === totalPages || (i >= left && i < right)) {
				range.push(i);
			}
		}

		const rangeWithDots = [];
		for (const i of range) {
			if (l) {
				if (i - l === 2) {
					rangeWithDots.push(l + 1);
				} else if (i - l !== 1) {
					rangeWithDots.push('...');
				}
			}
			rangeWithDots.push(i);
			l = i;
		}

		return rangeWithDots;
	})();
</script>

<div class="pagination-controls">
	<button
		class="btn-arrow"
		disabled={currentPage === 1}
		on:click={() => goToPage(currentPage - 1)}
		aria-label="Previous page"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-chevron-left"
			><path d="m15 18-6-6 6-6" /></svg
		>
	</button>
	<div class="page-numbers">
		{#each paginationRange as page}
			{#if typeof page === 'number'}
				<button
					class="btn-page"
					class:active={currentPage === page}
					on:click={() => goToPage(page)}
				>
					{page}
				</button>
			{:else}
				<span class="dots">...</span>
			{/if}
		{/each}
	</div>
	<button
		class="btn-arrow"
		disabled={currentPage === totalPages}
		on:click={() => goToPage(currentPage + 1)}
		aria-label="Next page"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-chevron-right"
			><path d="m9 18 6-6-6-6" /></svg
		>
	</button>
</div>

<style>
	.pagination-controls {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--space-sm);
	}

	.page-numbers {
		display: flex;
		gap: var(--space-xs);
	}

	.btn-arrow,
	.btn-page {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid transparent;
		background-color: transparent;
		color: var(--text-secondary);
		border-radius: var(--radius-sm);
		transition: var(--transition-fast);
		cursor: pointer;
		font-size: 0.875rem;
	}

	.btn-arrow {
		padding: var(--space-xs);
	}

	.btn-page {
		min-width: 32px;
		height: 32px;
	}

	.btn-arrow:hover:not(:disabled),
	.btn-page:hover:not(.active) {
		background-color: var(--bg-secondary);
		color: var(--text-primary);
	}

	.btn-arrow:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	.btn-page.active {
		background-color: var(--primary-accent);
		color: #020c1b;
		font-weight: 600;
	}

	.dots {
		display: flex;
		align-items: center;
		padding: 0 var(--space-xs);
		color: var(--text-secondary);
	}
</style>

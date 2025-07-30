<script lang="ts">
	export let currentPage: number;
	export let totalItems: number;
	export let itemsPerPage: number;

	$: totalPages = Math.ceil(totalItems / itemsPerPage);

	function goToPage(page: number) {
		if (page < 1 || page > totalPages) return;
		currentPage = page;
	}
</script>

<div class="pagination-controls">
	<span class="page-info">Page {currentPage} of {totalPages}</span>
	<div class="buttons">
		<button
			class="btn btn-secondary"
			disabled={currentPage === 1}
			on:click={() => goToPage(currentPage - 1)}
		>
			Previous
		</button>
		<button
			class="btn btn-secondary"
			disabled={currentPage === totalPages}
			on:click={() => goToPage(currentPage + 1)}
		>
			Next
		</button>
	</div>
</div>

<style>
	.pagination-controls {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-md) 0;
	}
	.buttons {
		display: flex;
		gap: var(--space-sm);
	}
	.page-info {
		color: var(--text-secondary);
	}
</style>

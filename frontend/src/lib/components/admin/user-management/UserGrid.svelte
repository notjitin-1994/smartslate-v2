<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { User, Role } from './types'; // Assuming types are moved to a separate file
	import UserCard from './UserCard.svelte';
	import Pagination from '$lib/components/common/Pagination.svelte';

	export let users: User[] = [];
	export let currentPage: number;
	export let totalItems: number;
	export let itemsPerPage: number;

	const dispatch = createEventDispatcher();

	function forwardEvent(event: any) {
		dispatch(event.type, event.detail);
	}
</script>

<div class="grid-container">
	{#each users as user (user.uid)}
		<UserCard {user} on:delete on:setRole on:viewProfile />
	{/each}
</div>

{#if totalItems > itemsPerPage}
	<div class="pagination-wrapper">
		<Pagination bind:currentPage {totalItems} {itemsPerPage} />
	</div>
{/if}

<style>
	.grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: var(--space-lg);
		margin-bottom: var(--space-xl);
	}
	.pagination-wrapper {
		display: flex;
		justify-content: center;
		margin-top: var(--space-xl);
	}
</style>

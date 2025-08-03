<script lang="ts">
	import { auth } from '$lib/services/firebase';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { Timestamp } from 'firebase/firestore';
	import type { SolaraInterest } from './types';
	import Modal from '$lib/components/common/Modal.svelte';

	type SortableColumns = keyof SolaraInterest;

	// --- Component State ---
	const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
	let allInterests: SolaraInterest[] = [];
	let isModalOpen = false;
	let selectedInterest: SolaraInterest | null = null;
	let isLoading = true;
	let error: string | null = null;

	// --- Filtering, Sorting State ---
	let filters = {
		name: '',
		email: '',
		interest: 'all',
		startDate: '',
		endDate: ''
	};
	let sortColumn: SortableColumns = 'createdAt';
	let sortDirection: 'asc' | 'desc' = 'desc';

	// --- API Fetching Logic ---
	async function callAdminFunction(path: string) {
		if (!browser) return;
		const user = auth.currentUser;
		if (!user) throw new Error('Authentication required.');

		try {
			const idToken = await user.getIdToken();
			const url = `https://us-central1-${projectId}.cloudfunctions.net/api/admin/${path}`;
			const response = await fetch(url, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${idToken}` }
			});
			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Request to ${path} failed with status ${response.status}: ${errorText}`);
			}
			return response.json();
		} catch (error) {
			console.error(`Error in callAdminFunction for path ${path}:`, error);
			throw error;
		}
	}

	onMount(async () => {
		isLoading = true;
		try {
			const data = await callAdminFunction('solara-interests');
			allInterests = data.interests;
			error = null;
		} catch (err: any) {
			error = err.message || 'Failed to fetch Solara interests.';
		} finally {
			isLoading = false;
		}
	});

	// --- Reactive Data Processing ---
	$: uniqueInterestTypes = ['all', 'use', 'invest', 'develop'];

	$: filteredAndSortedInterests = (() => {
		let processed = [...allInterests];

		// --- Column-specific Filtering ---
		Object.keys(filters).forEach((key) => {
			const filterValue = filters[key as keyof typeof filters];
			if (!filterValue || filterValue === 'all') return;

			processed = processed.filter((item) => {
				if (key === 'startDate') {
					const itemDate = new Date(item.createdAt._seconds * 1000);
					const filterDate = new Date(filterValue);
					return itemDate >= filterDate;
				}
				if (key === 'endDate') {
					const itemDate = new Date(item.createdAt._seconds * 1000);
					const filterDate = new Date(filterValue);
					// Add 1 day to include the end date fully
					filterDate.setDate(filterDate.getDate() + 1);
					return itemDate < filterDate;
				}

				const itemValue = item[key as keyof SolaraInterest];
				if (typeof itemValue === 'string' && typeof filterValue === 'string') {
					return itemValue.toLowerCase().includes(filterValue.toLowerCase());
				}
				return itemValue === filterValue;
			});
		});

		// --- Sorting ---
		processed.sort((a, b) => {
			const aValue = a[sortColumn];
			const bValue = b[sortColumn];

			if (aValue === undefined && bValue === undefined) return 0;
			if (aValue === undefined) return 1;
			if (bValue === undefined) return -1;

			let comparison = 0;
			if (aValue > bValue) comparison = 1;
			else if (aValue < bValue) comparison = -1;

			return sortDirection === 'desc' ? comparison * -1 : comparison;
		});

		return processed;
	})();

	// --- Event Handlers ---
	function handleSort(column: SortableColumns) {
		if (sortColumn === column) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = column;
			sortDirection = 'asc';
		}
	}

	function formatDate(timestamp: any, short = false) {
		if (!timestamp || typeof timestamp._seconds !== 'number') return 'N/A';
		const date = new Date(timestamp._seconds * 1000);
		if (short) {
			return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
		}
		return date.toLocaleDateString();
	}

	function openModal(interest: SolaraInterest) {
		selectedInterest = interest;
		isModalOpen = true;
	}

	function formatInterestType(interest: string) {
		switch (interest) {
			case 'use':
				return 'Using Solara';
			case 'invest':
				return 'Investing in Solara';
			case 'develop':
				return 'Developing for Solara';
			default:
				return interest;
		}
	}
</script>

<div class="solara-interest-management-container">
	<h1 class="page-title">Solara Interest Management</h1>

	{#if isLoading}
		<div class="skeleton-table">
			<div class="skeleton-row"></div>
			<div class="skeleton-row"></div>
		</div>
	{:else if error}
		<div class="error-message">
			<p><strong>Error:</strong> {error}</p>
		</div>
	{:else if allInterests.length === 0}
		<p class="no-items-message">No Solara interests have been received yet.</p>
	{:else}
		<!-- Desktop Table -->
		<div class="table-wrapper desktop-only">
			<table>
				<thead>
					<tr>
						<th on:click={() => handleSort('createdAt')} class="sortable">
							Date
							{#if sortColumn === 'createdAt'}{sortDirection === 'asc' ? '▲' : '▼'}{/if}
						</th>
						<th on:click={() => handleSort('name')} class="sortable">
							Name
							{#if sortColumn === 'name'}{sortDirection === 'asc' ? '▲' : '▼'}{/if}
						</th>
						<th on:click={() => handleSort('email')} class="sortable">
							Email
							{#if sortColumn === 'email'}{sortDirection === 'asc' ? '▲' : '▼'}{/if}
						</th>
						<th on:click={() => handleSort('interest')} class="sortable">
							Interest Type
							{#if sortColumn === 'interest'}{sortDirection === 'asc' ? '▲' : '▼'}{/if}
						</th>
					</tr>
					<!-- Filter Row -->
					<tr>
						<td class="filter-cell">
							<input type="date" bind:value={filters.startDate} class="filter-input" />
							<input type="date" bind:value={filters.endDate} class="filter-input" />
						</td>
						<td class="filter-cell">
							<input
								type="text"
								placeholder="Filter name..."
								bind:value={filters.name}
								class="filter-input"
							/>
						</td>
						<td class="filter-cell">
							<input
								type="text"
								placeholder="Filter email..."
								bind:value={filters.email}
								class="filter-input"
							/>
						</td>
						<td class="filter-cell">
							<select bind:value={filters.interest} class="filter-input">
								{#each uniqueInterestTypes as type}
									<option value={type}
										>{type === 'all' ? 'All Types' : formatInterestType(type)}</option
									>
								{/each}
							</select>
						</td>
					</tr>
				</thead>
				<tbody>
					{#if filteredAndSortedInterests.length === 0}
						<tr>
							<td colspan="4" class="no-items-message">
								No Solara interests match your current filter criteria.
							</td>
						</tr>
					{/if}
					{#each filteredAndSortedInterests as interest}
						<tr>
							<td class="align-top">{formatDate(interest.createdAt)}</td>
							<td class="align-top">{interest.name}</td>
							<td class="align-top">{interest.email}</td>
							<td class="align-top">{formatInterestType(interest.interest)}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<!-- Mobile List -->
		<div class="mobile-only">
			<div class="mobile-filter-bar">
				<input
					type="text"
					placeholder="Search by name..."
					bind:value={filters.name}
					class="filter-input"
				/>
			</div>
			<ul class="interest-list">
				{#if filteredAndSortedInterests.length === 0}
					<li class="no-items-message">No Solara interests match your current filter criteria.</li>
				{/if}
				{#each filteredAndSortedInterests as interest}
					<li class="interest-item" on:click={() => openModal(interest)}>
						<div class="item-date">{formatDate(interest.createdAt, true)}</div>
						<div class="item-details">
							<span class="item-name">{interest.name}</span>
							<span class="item-type">{formatInterestType(interest.interest)}</span>
						</div>
						<div class="item-arrow">&rsaquo;</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

{#if selectedInterest}
	<Modal bind:isOpen={isModalOpen} title="Solara Interest Details">
		<div class="interest-details">
			<p><strong>Name:</strong> {selectedInterest.name}</p>
			<p><strong>Email:</strong> {selectedInterest.email}</p>
			<p><strong>Interest Type:</strong> {formatInterestType(selectedInterest.interest)}</p>
			<p><strong>Submitted:</strong> {formatDate(selectedInterest.createdAt)}</p>
		</div>
	</Modal>
{/if}

<style>
	.solara-interest-management-container {
		padding: var(--space-xl);
		background-color: var(--color-background-secondary);
		border-radius: var(--radius-lg);
	}
	.page-title {
		font-size: 2rem;
		font-weight: 600;
		margin-bottom: var(--space-lg);
		color: var(--color-text-primary);
	}
	.error-message,
	.no-items-message {
		text-align: center;
		padding: var(--space-xl);
		color: var(--color-text-secondary);
	}
	.table-wrapper {
		overflow-x: auto;
	}
	table {
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed;
	}
	th,
	td {
		padding: var(--space-md);
		text-align: left;
		border-bottom: 1px solid var(--border-color);
		vertical-align: top;
	}
	th {
		font-weight: 600;
		color: var(--text-secondary);
		position: relative;
	}
	th.sortable {
		cursor: pointer;
		user-select: none;
	}
	th.sortable:hover {
		color: var(--color-text-primary);
	}
	tbody tr:hover {
		background-color: var(--background-light);
	}
	.filter-cell {
		padding: var(--space-sm);
	}
	.filter-input {
		width: 100%;
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-md);
		border: 1px solid var(--border-color);
		background-color: var(--color-background-tertiary);
		color: var(--color-text-primary);
		font-size: 0.9rem;
		transition:
			border-color 0.2s,
			box-shadow 0.2s;
	}

	.filter-input:focus {
		outline: none;
		border-color: var(--color-primary);
		box-shadow: 0 0 0 2px var(--color-primary-light);
	}

	.filter-input::placeholder {
		color: var(--color-text-disabled);
	}

	/* Custom styling for the select dropdown arrow */
	select.filter-input {
		appearance: none;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 0.5rem center;
		background-size: 1.5em 1.5em;
		padding-right: 2.5rem; /* Make space for the arrow */
	}

	/* Custom styling for the date picker icon */
	input[type='date'].filter-input::-webkit-calendar-picker-indicator {
		filter: invert(0.6);
		cursor: pointer;
	}
	input[type='date'].filter-input::-webkit-calendar-picker-indicator:hover {
		filter: invert(0.8);
	}

	.filter-cell input[type='date'] {
		margin-bottom: var(--space-xs);
	}
	.skeleton-table .skeleton-row {
		height: 50px;
		background-color: var(--color-background-tertiary);
		border-radius: var(--radius-sm);
		margin-bottom: var(--space-md);
		animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}
	.mobile-only {
		display: none;
	}
	.desktop-only {
		display: block;
	}

	/* --- Mobile List Styles --- */
	.interest-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.interest-item {
		display: flex;
		align-items: center;
		padding: var(--space-md);
		border-bottom: 1px solid var(--border-color);
		cursor: pointer;
		transition: background-color 0.2s;
	}
	.interest-item:hover {
		background-color: var(--background-light);
	}
	.item-date {
		font-size: 0.9rem;
		font-weight: 600;
		color: var(--color-primary);
		margin-right: var(--space-lg);
		flex-shrink: 0;
	}
	.item-details {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}
	.item-name {
		font-weight: 600;
		color: var(--color-text-primary);
	}
	.item-type {
		font-size: 0.9rem;
		color: var(--color-text-secondary);
	}
	.item-arrow {
		font-size: 1.5rem;
		color: var(--color-text-secondary);
	}
	.mobile-filter-bar {
		margin-bottom: var(--space-lg);
	}

	/* --- Responsive Breakpoints --- */
	@media (max-width: 768px) {
		.desktop-only {
			display: none;
		}
		.mobile-only {
			display: block;
		}
		.solara-interest-management-container {
			padding: var(--space-lg);
		}
		.page-title {
			font-size: 1.5rem;
		}
	}

	@media (max-width: 1024px) {
		.table-wrapper {
			overflow-x: auto;
		}
		th,
		td {
			white-space: nowrap;
		}
	}
</style>

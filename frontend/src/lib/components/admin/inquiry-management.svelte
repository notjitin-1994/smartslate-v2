<script lang="ts">
	import { auth } from '$lib/services/firebase';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { Timestamp } from 'firebase/firestore';
	import type { Inquiry } from './types';
	import Modal from '$lib/components/common/Modal.svelte';

	type SortableColumns = keyof Inquiry;

	// --- Component State ---
	const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
	let allInquiries: Inquiry[] = [];
	let isModalOpen = false;
	let selectedInquiry: Inquiry | null = null;
	let isLoading = true;
	let error: string | null = null;

	// --- Filtering, Sorting State ---
	let filters = {
		name: '',
		email: '',
		phone: '',
		organization: '',
		inquiryType: 'all',
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
			const data = await callAdminFunction('inquiries');
			allInquiries = data.inquiries;
			error = null;
		} catch (err: any) {
			error = err.message || 'Failed to fetch inquiries.';
		} finally {
			isLoading = false;
		}
	});

	// --- Reactive Data Processing ---
	$: uniqueInquiryTypes = ['all', ...new Set(allInquiries.map((i) => i.inquiryType))];

	$: filteredAndSortedInquiries = (() => {
		let processed = [...allInquiries];

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

				const itemValue = item[key as keyof Inquiry];
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

	function openModal(inquiry: Inquiry) {
		selectedInquiry = inquiry;
		isModalOpen = true;
	}
</script>

<div class="inquiry-management-container">
	<h1 class="page-title">Inquiry Management</h1>

	{#if isLoading}
		<div class="skeleton-table">
			<div class="skeleton-row"></div>
			<div class="skeleton-row"></div>
		</div>
	{:else if error}
		<div class="error-message">
			<p><strong>Error:</strong> {error}</p>
		</div>
	{:else if allInquiries.length === 0}
		<p class="no-items-message">No inquiries have been received yet.</p>
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
						<th on:click={() => handleSort('phone')} class="sortable">
							Phone
							{#if sortColumn === 'phone'}{sortDirection === 'asc' ? '▲' : '▼'}{/if}
						</th>
						<th on:click={() => handleSort('organization')} class="sortable">
							Organization
							{#if sortColumn === 'organization'}{sortDirection === 'asc' ? '▲' : '▼'}{/if}
						</th>
						<th on:click={() => handleSort('inquiryType')} class="sortable">
							Type
							{#if sortColumn === 'inquiryType'}{sortDirection === 'asc' ? '▲' : '▼'}{/if}
						</th>
						<th>Message</th>
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
							<input
								type="text"
								placeholder="Filter phone..."
								bind:value={filters.phone}
								class="filter-input"
							/>
						</td>
						<td class="filter-cell">
							<input
								type="text"
								placeholder="Filter organization..."
								bind:value={filters.organization}
								class="filter-input"
							/>
						</td>
						<td class="filter-cell">
							<select bind:value={filters.inquiryType} class="filter-input">
								{#each uniqueInquiryTypes as type}
									<option value={type}>{type === 'all' ? 'All Types' : type}</option>
								{/each}
							</select>
						</td>
						<td class="filter-cell"></td>
					</tr>
				</thead>
				<tbody>
					{#if filteredAndSortedInquiries.length === 0}
						<tr>
							<td colspan="7" class="no-items-message">
								No inquiries match your current filter criteria.
							</td>
						</tr>
					{/if}
					{#each filteredAndSortedInquiries as inquiry}
						<tr>
							<td class="align-top">{formatDate(inquiry.createdAt)}</td>
							<td class="align-top">{inquiry.name}</td>
							<td class="align-top">{inquiry.email}</td>
							<td class="align-top">{inquiry.phone || '--'}</td>
							<td class="align-top">{inquiry.organization || '--'}</td>
							<td class="align-top">{inquiry.inquiryType}</td>
							<td class="message-cell align-top">{inquiry.message}</td>
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
					placeholder="Search by name, company..."
					bind:value={filters.name}
					class="filter-input"
				/>
			</div>
			<ul class="inquiry-list">
				{#if filteredAndSortedInquiries.length === 0}
					<li class="no-items-message">No inquiries match your current filter criteria.</li>
				{/if}
				{#each filteredAndSortedInquiries as inquiry}
					<li class="inquiry-item" on:click={() => openModal(inquiry)}>
						<div class="item-date">{formatDate(inquiry.createdAt, true)}</div>
						<div class="item-details">
							<span class="item-name">{inquiry.name}</span>
							<span class="item-company">{inquiry.organization || 'N/A'}</span>
						</div>
						<div class="item-arrow">&rsaquo;</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

{#if selectedInquiry}
	<Modal bind:isOpen={isModalOpen} title="Inquiry Details">
		<div class="inquiry-details">
			<p><strong>Name:</strong> {selectedInquiry.name}</p>
			<p><strong>Email:</strong> {selectedInquiry.email}</p>
			<p><strong>Phone:</strong> {selectedInquiry.phone || 'N/A'}</p>
			<p><strong>Organization:</strong> {selectedInquiry.organization || 'N/A'}</p>
			<p><strong>Type:</strong> {selectedInquiry.inquiryType}</p>
			<hr />
			<p><strong>Message:</strong></p>
			<p>{selectedInquiry.message}</p>
		</div>
	</Modal>
{/if}

<style>
	.inquiry-management-container {
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
	.message-cell {
		white-space: pre-wrap;
		word-break: break-word;
		min-width: 250px;
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
	.inquiry-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.inquiry-item {
		display: flex;
		align-items: center;
		padding: var(--space-md);
		border-bottom: 1px solid var(--border-color);
		cursor: pointer;
		transition: background-color 0.2s;
	}
	.inquiry-item:hover {
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
	.item-company {
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
		.inquiry-management-container {
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
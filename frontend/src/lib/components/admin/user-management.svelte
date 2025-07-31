<script lang="ts">
	import { auth } from '$lib/services/firebase';
	import { authStore } from '$lib/stores/authStore';
	import { browser } from '$app/environment';
	import { toastStore } from '$lib/stores/toastStore';
	import { onMount } from 'svelte';
	import ConfirmationModal from '$lib/components/admin/user-management/ConfirmationModal.svelte';
	import type { User, Role } from './user-management/types';

	type SortableColumns = keyof User | 'role';

	// --- Component State ---
	const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
	let allUsers: User[] = [];
	let isLoading = true;
	let error: string | null = null;
	let isModalOpen = false;
	let userToDelete: { userId: string; userName: string } | null = null;

	// --- Filtering, Sorting State ---
	let filters = {
		displayName: '',
		email: '',
		role: 'all'
	};
	let sortColumn: SortableColumns = 'displayName';
	let sortDirection: 'asc' | 'desc' = 'asc';

	// --- API Fetching Logic ---
	async function callAdminFunction(
		path: string,
		method: 'GET' | 'POST' = 'POST',
		data: object = {}
	) {
		if (!browser) return;
		const user = auth.currentUser;
		if (!user) throw new Error('Authentication required.');

		try {
			const idToken = await user.getIdToken();
			const url = `https://us-central1-${projectId}.cloudfunctions.net/api/admin/${path}`;
			const options: RequestInit = {
				method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${idToken}`
				}
			};
			if (method !== 'GET') {
				options.body = JSON.stringify(data);
			}
			const response = await fetch(url, options);
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

	onMount(() => {
		if (browser && $authStore.user && !$authStore.loading) {
			fetchUsers();
		}
	});

	async function fetchUsers() {
		isLoading = true;
		try {
			const data = await callAdminFunction('users', 'GET');
			allUsers = data.users;
			error = null;
		} catch (err: any) {
			error = err.message || 'Failed to fetch users.';
		} finally {
			isLoading = false;
		}
	}

	// --- Reactive Data Processing ---
	$: availableRoles = ['all', 'admin', 'editor', 'viewer']; // Example roles

	$: filteredAndSortedUsers = (() => {
		let processed = [...allUsers];

		// --- Filtering ---
		if (filters.displayName) {
			processed = processed.filter((user) =>
				user.displayName?.toLowerCase().includes(filters.displayName.toLowerCase())
			);
		}
		if (filters.email) {
			processed = processed.filter((user) =>
				user.email?.toLowerCase().includes(filters.email.toLowerCase())
			);
		}
		if (filters.role && filters.role !== 'all') {
			processed = processed.filter(
				(user) => user.customClaims?.role === filters.role
			);
		}

		// --- Sorting ---
		processed.sort((a, b) => {
			const aValue = sortColumn === 'role' ? a.customClaims?.role : a[sortColumn as keyof User];
			const bValue = sortColumn === 'role' ? b.customClaims?.role : b[sortColumn as keyof User];

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

	async function setRole(userId: string, newRole: Role) {
		try {
			await callAdminFunction('setUserRole', 'POST', { uid: userId, role: newRole });
			allUsers = allUsers.map((u) =>
				u.uid === userId ? { ...u, customClaims: { ...u.customClaims, role: newRole } } : u
			);
			toastStore.add(`User role successfully updated.`, 'success');
		} catch (err: any) {
			toastStore.add(`Error: ${err.message}`, 'error');
		}
	}

	function handleDeleteRequest(userId: string, userName: string) {
		userToDelete = { userId, userName };
		isModalOpen = true;
	}

	async function confirmDelete() {
		if (!userToDelete) return;
		const { userId, userName } = userToDelete;
		try {
			await callAdminFunction('deleteUser', 'POST', { uid: userId });
			allUsers = allUsers.filter((u) => u.uid !== userId);
			toastStore.add(`User ${userName} successfully deleted.`, 'success');
		} catch (err: any) {
			toastStore.add(`Error: ${err.message}`, 'error');
		} finally {
			isModalOpen = false;
			userToDelete = null;
		}
	}

	function cancelDelete() {
		isModalOpen = false;
		userToDelete = null;
	}
</script>

<ConfirmationModal
	isOpen={isModalOpen}
	title="Delete User"
	message={`Are you sure you want to permanently delete ${userToDelete?.userName}? This action cannot be undone.`}
	on:confirm={confirmDelete}
	on:cancel={cancelDelete}
/>

<div class="user-management-container">
	<h1 class="page-title">User Management</h1>

	{#if isLoading}
		<div class="skeleton-table">
			<div class="skeleton-row"></div>
			<div class="skeleton-row"></div>
		</div>
	{:else if error}
		<div class="error-message">
			<p><strong>Error:</strong> {error}</p>
		</div>
	{:else if allUsers.length === 0}
		<p class="no-items-message">No users found.</p>
	{:else}
		<!-- Desktop Table -->
		<div class="table-wrapper desktop-only">
			<table>
				<thead>
					<tr>
						<th on:click={() => handleSort('displayName')} class="sortable">
							User
							{#if sortColumn === 'displayName'}{sortDirection === 'asc' ? '▲' : '▼'}{/if}
						</th>
						<th on:click={() => handleSort('email')} class="sortable">
							Email
							{#if sortColumn === 'email'}{sortDirection === 'asc' ? '▲' : '▼'}{/if}
						</th>
						<th on:click={() => handleSort('role')} class="sortable">
							Role
							{#if sortColumn === 'role'}{sortDirection === 'asc' ? '▲' : '▼'}{/if}
						</th>
						<th>Actions</th>
					</tr>
					<!-- Filter Row -->
					<tr>
						<td class="filter-cell">
							<input
								type="text"
								placeholder="Filter by name..."
								bind:value={filters.displayName}
								class="filter-input"
							/>
						</td>
						<td class="filter-cell">
							<input
								type="text"
								placeholder="Filter by email..."
								bind:value={filters.email}
								class="filter-input"
							/>
						</td>
						<td class="filter-cell">
							<select bind:value={filters.role} class="filter-input">
								{#each availableRoles as role}
									<option value={role}>{role === 'all' ? 'All Roles' : role}</option>
								{/each}
							</select>
						</td>
						<td class="filter-cell"></td>
					</tr>
				</thead>
				<tbody>
					{#if filteredAndSortedUsers.length === 0}
						<tr>
							<td colspan="4" class="no-items-message">
								No users match your current filter criteria.
							</td>
						</tr>
					{/if}
					{#each filteredAndSortedUsers as user}
						<tr>
							<td>{user.displayName || 'N/A'}</td>
							<td>{user.email}</td>
							<td>{user.customClaims?.role || 'N/A'}</td>
							<td class="actions-cell">
								<select
									class="action-select"
									value={user.customClaims?.role || ''}
									on:change={(e) => setRole(user.uid, e.currentTarget.value as Role)}
								>
									<option disabled value="">Set Role</option>
									<option value="admin">Admin</option>
									<option value="editor">Editor</option>
									<option value="viewer">Viewer</option>
								</select>
								<button
									class="action-button delete"
									on:click={() => handleDeleteRequest(user.uid, user.displayName || user.email || 'user')}
								>
									Delete
								</button>
							</td>
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
					placeholder="Search by name or email..."
					bind:value={filters.displayName}
					class="filter-input"
				/>
			</div>
			<ul class="user-list">
				{#if filteredAndSortedUsers.length === 0}
					<li class="no-items-message">No users match your current filter criteria.</li>
				{/if}
				{#each filteredAndSortedUsers as user}
					<li class="user-item">
						<div class="item-details">
							<span class="item-name">{user.displayName || 'N/A'}</span>
							<span class="item-email">{user.email}</span>
							<span class="item-role">Role: {user.customClaims?.role || 'N/A'}</span>
						</div>
						<div class="item-actions">
							<button
								class="action-button delete"
								on:click={() => handleDeleteRequest(user.uid, user.displayName || user.email || 'user')}
							>
								Delete
							</button>
						</div>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>

<style>
	.user-management-container {
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
	}
	th,
	td {
		padding: var(--space-md);
		text-align: left;
		border-bottom: 1px solid var(--border-color);
		vertical-align: middle;
	}
	th {
		font-weight: 600;
		color: var(--text-secondary);
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
	}
	.actions-cell {
		display: flex;
		gap: var(--space-sm);
		align-items: center;
	}
	.action-select,
	.action-button {
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
		border: 1px solid var(--border-color);
		background-color: var(--color-background-tertiary);
		color: var(--color-text-primary);
		cursor: pointer;
	}
	.action-button.delete {
		background-color: var(--color-danger-bg);
		color: var(--color-danger-text);
		border-color: var(--color-danger-border);
	}
	.action-button.delete:hover {
		background-color: var(--color-danger-bg-hover);
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
	.user-list {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.user-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: var(--space-md);
		border-bottom: 1px solid var(--border-color);
	}
	.item-details {
		display: flex;
		flex-direction: column;
	}
	.item-name {
		font-weight: 600;
		color: var(--color-text-primary);
	}
	.item-email,
	.item-role {
		font-size: 0.9rem;
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
		.user-management-container {
			padding: var(--space-lg);
		}
		.page-title {
			font-size: 1.5rem;
		}
	}
</style>

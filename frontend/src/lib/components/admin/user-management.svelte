<script lang="ts">
	import { auth } from '$lib/services/firebase';
	import { authStore } from '$lib/stores/authStore';
	import { browser } from '$app/environment';
	import { toastStore } from '$lib/stores/toastStore';
	import { onMount } from 'svelte';
	import ConfirmationModal from '$lib/components/admin/user-management/ConfirmationModal.svelte';
	import UserControls from './user-management/UserControls.svelte';
	import UserGrid from './user-management/UserGrid.svelte';
	import type { User, Role } from './user-management/types';

	const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

	let allUsers: User[] = [];
	let filteredUsers: User[] = [];
	let isLoading = true;
	let error: string | null = null;
	let searchTerm = '';

	let isModalOpen = false;
	let userToDelete: { userId: string; userName: string } | null = null;

	// Pagination state
	let currentPage = 1;
	const itemsPerPage = 20;
	$: paginatedUsers = filteredUsers.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	async function callAdminFunction(
		path: string,
		method: 'GET' | 'POST' = 'POST',
		data: object = {}
	) {
		if (!browser) return;

		const user = auth.currentUser;
		if (!user) {
			throw new Error('Authentication required.');
		}

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
			filterUsers();
			error = null;
		} catch (err: any) {
			error = err.message || 'Failed to fetch users.';
		} finally {
			isLoading = false;
		}
	}

	async function setRole(userId: string, newRole: Role) {
		try {
			await callAdminFunction('setUserRole', 'POST', { uid: userId, role: newRole });
			allUsers = allUsers.map((u) =>
				u.uid === userId ? { ...u, customClaims: { ...u.customClaims, role: newRole } } : u
			);
			filterUsers();
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
			filterUsers();
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

	function filterUsers() {
		currentPage = 1; // Reset to first page on search
		if (!searchTerm) {
			filteredUsers = allUsers;
			return;
		}
		const lowerCaseSearchTerm = searchTerm.toLowerCase();
		filteredUsers = allUsers.filter(
			(user) =>
				user.displayName?.toLowerCase().includes(lowerCaseSearchTerm) ||
				user.email?.toLowerCase().includes(lowerCaseSearchTerm)
		);
	}

	$: filterUsers();
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

	<UserControls bind:searchTerm />

	{#if isLoading}
		<div class="skeleton-grid">
			{#each Array(8) as _}
				<div class="skeleton-card"></div>
			{/each}
		</div>
	{:else if error}
		<div class="error-message">
			<p><strong>Error:</strong> {error}</p>
		</div>
	{:else if filteredUsers.length === 0}
		<p class="no-users-message">No users found matching your search.</p>
	{:else}
		<UserGrid
			users={paginatedUsers}
			bind:currentPage
			totalItems={filteredUsers.length}
			{itemsPerPage}
			on:delete={(e) => handleDeleteRequest(e.detail.userId, e.detail.userName)}
			on:setRole={(e) => setRole(e.detail.userId, e.detail.newRole)}
		/>
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
	.no-users-message {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: var(--space-xl);
		color: var(--color-text-secondary);
	}

	.skeleton-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: var(--space-lg);
	}

	.skeleton-card {
		background-color: var(--color-background-tertiary);
		border-radius: var(--radius-lg);
		height: 220px; /* Adjust to match UserCard height */
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
</style>

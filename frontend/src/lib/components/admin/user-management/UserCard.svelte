<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { User, Role } from './types';

	export let user: User;

	const dispatch = createEventDispatcher();

	const VALID_ROLES: Role[] = [
		'smartslateAdmin',
		'smartslateManager',
		'smartslateClientManager',
		'learner'
	];

	function displayRole(role: Role | undefined): string {
		if (role === 'smartslateAdmin') return 'Owner';
		return role
			? role
					.replace('smartslate', '')
					.replace(/([A-Z])/g, ' $1')
					.trim()
			: 'Learner';
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function handleDelete() {
		dispatch('delete', {
			userId: user.uid,
			userName: user.displayName || user.email || 'user'
		});
	}

	function handleSetRole(event: Event) {
		const newRole = (event.currentTarget as HTMLSelectElement).value as Role;
		dispatch('setRole', { userId: user.uid, newRole });
	}

	function handleViewProfile() {
		dispatch('viewProfile', user.uid);
	}
</script>

<div class="user-card">
	<div class="card-header">
		<img
			src={user.photoURL ||
				`https://api.dicebear.com/6.x/initials/svg?seed=${user.displayName || user.email}`}
			alt="avatar"
			class="avatar"
		/>
		<div class="user-details">
			<h3 class="user-name">{user.displayName || 'N/A'}</h3>
			<p class="user-email">{user.email}</p>
		</div>
	</div>
	<div class="card-body">
		<div class="info-row">
			<span class="info-label">Joined:</span>
			<span class="info-value">{formatDate(user.metadata.creationTime)}</span>
		</div>
		<div class="info-row">
			<span class="info-label">Role:</span>
			<select
				class="role-select"
				value={user.customClaims?.role || 'learner'}
				on:change={handleSetRole}
			>
				{#each VALID_ROLES as role}
					<option value={role}>{displayRole(role)}</option>
				{/each}
			</select>
		</div>
	</div>
	<div class="card-footer">
		<a href={`/admin/users/${user.uid}`} class="btn-secondary">View Details</a>
		<button class="btn-danger" on:click={handleDelete}>Delete</button>
	</div>
</div>

<style>
	.user-card {
		background-color: var(--color-background-tertiary);
		border-radius: var(--radius-lg);
		padding: var(--space-lg);
		display: flex;
		flex-direction: column;
		gap: var(--space-md);
		border: 1px solid var(--color-border);
		transition: all 0.2s ease-in-out;
	}

	.user-card:hover {
		transform: translateY(-4px);
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
		border-color: var(--color-primary-light);
	}

	.card-header {
		display: flex;
		align-items: center;
		gap: var(--space-md);
	}

	.avatar {
		width: 48px;
		height: 48px;
		border-radius: 50%;
		object-fit: cover;
		border: 2px solid var(--color-primary);
	}

	.user-details {
		flex: 1;
	}

	.user-name {
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0;
	}

	.user-email {
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		margin: 0;
		word-break: break-all;
	}

	.card-body {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
		font-size: 0.9rem;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.info-label {
		color: var(--color-text-secondary);
		font-weight: 500;
	}

	.info-value {
		color: var(--color-text-primary);
	}

	.role-select {
		background-color: var(--color-background-secondary);
		color: var(--color-text-primary);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-md);
		padding: 6px 10px;
		font-size: 0.875rem;
		width: 150px; /* Adjust as needed */
	}

	.card-footer {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-sm);
		margin-top: auto; /* Pushes footer to the bottom */
		padding-top: var(--space-md);
		border-top: 1px solid var(--color-border);
	}

	.btn-secondary,
	.btn-danger {
		padding: 8px 16px;
		border-radius: var(--radius-md);
		font-weight: 500;
		text-decoration: none;
		text-align: center;
		transition: background-color 0.2s;
	}

	.btn-secondary {
		background-color: var(--color-background-secondary);
		color: var(--color-text-primary);
		border: 1px solid var(--color-border);
	}

	.btn-secondary:hover {
		background-color: var(--color-border);
	}

	.btn-danger {
		background-color: transparent;
		color: var(--color-danger);
		border: 1px solid var(--color-danger);
	}

	.btn-danger:hover {
		background-color: rgba(239, 68, 68, 0.1);
	}
</style>

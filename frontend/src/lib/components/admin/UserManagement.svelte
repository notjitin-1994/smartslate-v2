<script lang="ts">
  import { auth } from '$lib/firebase';
  import { authStore } from '$lib/stores/authStore';
  import { browser } from '$app/environment';
  import { toastStore } from '$lib/stores/toastStore';
  import { onMount } from 'svelte';
  import Pagination from '$lib/components/common/Pagination.svelte';

  // This is your Firebase project ID.
  // It's best practice to load this from environment variables.
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

  type User = {
    uid: string;
    email: string | undefined;
    displayName: string | undefined;
    metadata: {
      creationTime: string;
    };
    customClaims?: {
      [key: string]: any;
    };
  };

  let users: User[] = [];
  let isLoading = true;
  let error: string | null = null;
  let currentPage = 1;
  let itemsPerPage = 10; // Default value

  $: totalItems = users.length;
  $: paginatedUsers = users.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  onMount(() => {
    if (browser) {
      const rowHeight = 70; // Approximate height of a table row
      const headerFooterHeight = 200; // Approximate combined height of header, footer, and other UI elements
      const availableHeight = window.innerHeight - headerFooterHeight;
      itemsPerPage = Math.floor(availableHeight / rowHeight);
    }
  });

  /**
   * A helper function to make authenticated calls to our backend admin functions.
   * It automatically includes the user's auth token in the header.
   * @param functionName The name of the cloud function to call.
   * @param data The JSON payload to send to the function.
   */
  async function callAdminFunction(path: string, method: 'GET' | 'POST' = 'POST', data: object = {}) {
    if (!browser) return;

    const user = auth.currentUser;
    if (!user) {
      console.error("No user is currently signed in.");
      throw new Error("Authentication required.");
    }

    try {
      const idToken = await user.getIdToken();
      // All requests now go to the single 'api' endpoint, with the specific action determined by the path.
      const url = `https://us-central1-${projectId}.cloudfunctions.net/api/${path}`;

      const options: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`,
        },
      };

      if (method !== 'GET') {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Network response was not ok.', {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(`Request to ${path} failed with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error(`Error in callAdminFunction for path ${path}:`, error);
      throw error;
    }
  }

  // Reactive statement to fetch users when the user is authenticated
  $: if (browser && $authStore.user && !$authStore.loading) {
    isLoading = true;
    // We now call setAdminClaim with a dummy UID to get the user list.
    // This is a workaround for the restrictive IAM policy.
    // Fetch the list of users with a GET request to the new endpoint.
    callAdminFunction('admin/users', 'GET')
      .then(data => {
        users = data.users;
        error = null;
      })
      .catch((err: any) => {
        console.error('Error fetching users:', err);
        error = err.message || 'Failed to fetch users.';
      })
      .finally(() => {
        isLoading = false;
      });
  } else if (browser && !$authStore.loading) {
    // Handle the case where the user is not logged in
    isLoading = false;
    users = [];
    // Optionally set an error message if you want to inform the user
    // error = "Please log in to view user data.";
  }


  async function setAdmin(uid: string) {
    try {
      await callAdminFunction('admin/setAdminClaim', 'POST', { uid });
      users = users.map(u => u.uid === uid ? { ...u, customClaims: { ...u.customClaims, admin: true } } : u);
      toastStore.add('User successfully promoted to admin.', 'success');
    } catch (err: any) {
      console.error('Error setting admin claim:', err);
      toastStore.add(`Error: ${err.message}`, 'error');
    }
  }

  async function deleteUser(uid: string) {
    // A simple browser confirm is acceptable here for a destructive action.
    if (!confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await callAdminFunction('admin/deleteUser', 'POST', { uid });
      users = users.filter(u => u.uid !== uid);
      toastStore.add('User successfully deleted.', 'success');
    } catch (err: any) {
      console.error('Error deleting user:', err);
      toastStore.add(`Error: ${err.message}`, 'error');
    }
  }
</script>

<div class="user-management-container">
	<h1 class="page-title">User Management</h1>

	{#if isLoading}
		<div class="loading-spinner"></div>
	{:else if error}
		<div class="error-message">
			<p><strong>Error:</strong> {error}</p>
		</div>
	{:else if users.length === 0}
		<p>No users found.</p>
	{:else}
		<div class="user-list-desktop table-wrapper">
			<table class="table">
				<thead>
					<tr>
						<th>User</th>
						<th>Created At</th>
						<th>Role</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each paginatedUsers as user (user.uid)}
						<tr class="table-row" style="--animation-order: {user.uid}">
							<td>
								<div class="user-info">
									<span class="user-name">{user.displayName || 'N/A'}</span>
									<span class="user-email">{user.email || user.uid}</span>
								</div>
							</td>
							<td>{new Date(user.metadata.creationTime).toLocaleDateString()}</td>
							<td>
								{#if user.customClaims?.admin}
									<span class="badge admin">Admin</span>
								{:else}
									<span class="badge user">User</span>
								{/if}
							</td>
							<td>
								<div class="action-buttons">
									<button
										class="btn btn-secondary"
										on:click={() => setAdmin(user.uid)}
										disabled={user.customClaims?.admin === true}
									>
										Make Admin
									</button>
									<button class="btn btn-danger" on:click={() => deleteUser(user.uid)}>
										Delete
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<div class="user-list-mobile">
			{#each paginatedUsers as user (user.uid)}
				<div class="user-card" style="--animation-order: {user.uid}">
					<div class="user-info">
						<span class="user-name">{user.displayName || 'N/A'}</span>
						<span class="user-email">{user.email || user.uid}</span>
					</div>
					<div class="user-details">
						<div class="detail-item">
							<span class="detail-label">Created At</span>
							<span class="detail-value"
								>{new Date(user.metadata.creationTime).toLocaleDateString()}</span
							>
						</div>
						<div class="detail-item">
							<span class="detail-label">Role</span>
							<span class="detail-value">
								{#if user.customClaims?.admin}
									<span class="badge admin">Admin</span>
								{:else}
									<span class="badge user">User</span>
								{/if}
							</span>
						</div>
					</div>
					<div class="action-buttons">
						<button
							class="btn btn-secondary"
							on:click={() => setAdmin(user.uid)}
							disabled={user.customClaims?.admin === true}
						>
							Make Admin
						</button>
						<button class="btn btn-danger" on:click={() => deleteUser(user.uid)}>
							Delete
						</button>
					</div>
				</div>
			{/each}
		</div>
		<Pagination bind:currentPage {totalItems} {itemsPerPage} />
	{/if}
</div>

<style>
	.user-management-container {
		animation: fade-in 0.5s ease-out;
	}
	.page-title {
		font-size: 2.5rem;
		margin-bottom: var(--space-xl);
	}
	.loading-spinner {
		border: 4px solid rgba(255, 255, 255, 0.2);
		border-left-color: var(--primary-accent);
		border-radius: 50%;
		width: 40px;
		height: 40px;
		animation: spin 1s linear infinite;
		margin: var(--space-xxl) auto;
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	.error-message {
		background-color: rgba(239, 68, 68, 0.1);
		border: 1px solid var(--color-error);
		color: var(--color-error);
		padding: var(--space-lg);
		border-radius: var(--radius-md);
	}
	.user-list-desktop {
		display: block;
	}
	.user-list-mobile {
		display: none;
	}
	@media (max-width: 768px) {
		.user-list-desktop {
			display: none;
		}
		.user-list-mobile {
			display: grid;
			grid-template-columns: 1fr;
			gap: var(--space-md);
		}
		.user-card {
			display: block;
			background-color: var(--container-bg);
			border-radius: var(--radius-lg);
			padding: var(--space-lg);
			border: 1px solid var(--border-color);
			animation: fade-in-row 0.5s ease-out forwards;
			opacity: 0;
			transform: translateY(10px);
			animation-delay: calc(var(--animation-order) * 50ms);
		}
		.user-info {
			margin-bottom: var(--space-lg);
		}
		.user-details {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: var(--space-md);
			margin-bottom: var(--space-lg);
		}
		.detail-item {
			display: flex;
			flex-direction: column;
			gap: var(--space-xs);
		}
		.detail-label {
			font-size: 0.75rem;
			color: var(--text-muted);
			text-transform: uppercase;
		}
		.action-buttons {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: var(--space-sm);
		}
	}
	@keyframes fade-in-row {
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.user-name {
		font-weight: 700;
		color: var(--text-primary);
	}
	.user-email {
		font-size: 0.875rem;
		color: var(--text-muted);
	}
	.badge {
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
		font-size: 0.75rem;
		font-weight: 700;
		text-transform: uppercase;
	}
	.badge.admin {
		background-color: rgba(34, 197, 94, 0.1);
		color: var(--color-success);
	}
	.badge.user {
		background-color: rgba(100, 116, 139, 0.1);
		color: var(--text-secondary);
	}
	.btn-danger {
		background-color: transparent;
		border: 1px solid var(--color-error);
		color: var(--color-error);
	}
	.btn-danger:hover {
		background-color: var(--color-error);
		color: white;
	}
</style>
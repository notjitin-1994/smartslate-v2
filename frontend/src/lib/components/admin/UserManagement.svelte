<script lang="ts">
  import { auth } from '$lib/firebase';
  import { authStore } from '$lib/stores/authStore';
  import { browser } from '$app/environment';

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

  /**
   * A helper function to make authenticated calls to our backend admin functions.
   * It automatically includes the user's auth token in the header.
   * @param functionName The name of the cloud function to call.
   * @param data The JSON payload to send to the function.
   */
  async function callAdminFunction(functionName: string, data: object = {}) {
    if (!browser) return; // Don't run on server

    const user = auth.currentUser; // Get the live user object

    // Null check is critical
    if (!user) {
        console.error("No user is currently signed in.");
        // Optionally, handle this with a user-facing error
        return;
    }

    try {
        const idToken = await user.getIdToken();
        const url = `https://us-central1-${projectId}.cloudfunctions.net/${functionName}`;

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`,
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Network response was not ok.', {
            status: response.status,
            statusText: response.statusText,
            body: errorText,
          });
          throw new Error(`Request failed with status ${response.status}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error in callAdminFunction:", error);
        throw error; // Re-throw the error to be caught by the caller
    }
  }

  // Reactive statement to fetch users when the user is authenticated
  $: if (browser && $authStore.user && !$authStore.loading) {
    isLoading = true;
    // We now call setAdminClaim with a dummy UID to get the user list.
    // This is a workaround for the restrictive IAM policy.
    callAdminFunction('setAdminClaim', { uid: 'dummy-uid-for-listing' })
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
    if (!confirm('Are you sure you want to make this user an admin?')) {
      return;
    }

    try {
      await callAdminFunction('setAdminClaim', { uid });
      users = users.map(u => u.uid === uid ? { ...u, customClaims: { ...u.customClaims, admin: true } } : u);
      alert('User successfully promoted to admin.');
    } catch (err: any) {
      console.error('Error setting admin claim:', err);
      alert(`Error: ${err.message}`);
    }
  }

  async function deleteUser(uid: string) {
    if (!confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await callAdminFunction('deleteUser', { uid });
      users = users.filter(u => u.uid !== uid);
      alert('User successfully deleted.');
    } catch (err: any) {
      console.error('Error deleting user:', err);
      alert(`Error: ${err.message}`);
    }
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">User Management</h1>

  {#if isLoading}
    <p>Loading users...</p>
  {:else if error}
    <div class="text-red-500 bg-red-100 p-4 rounded">
      <p><strong>Error:</strong> {error}</p>
    </div>
  {:else if users.length === 0}
    <p>No users found.</p>
  {:else}
    <div class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full">
        <thead class="bg-gray-800 text-white">
          <tr>
            <th class="w-1/3 py-3 px-4 uppercase font-semibold text-sm text-left">User (Email/UID)</th>
            <th class="w-1/4 py-3 px-4 uppercase font-semibold text-sm text-left">Created At</th>
            <th class="w-1/6 py-3 px-4 uppercase font-semibold text-sm text-left">Role</th>
            <th class="w-1/4 py-3 px-4 uppercase font-semibold text-sm text-left">Actions</th>
          </tr>
        </thead>
        <tbody class="text-gray-700">
          {#each users as user (user.uid)}
            <tr class="hover:bg-gray-100">
              <td class="w-1/3 py-3 px-4">
                <div class="font-bold">{user.displayName || 'N/A'}</div>
                <div class="text-sm text-gray-500">{user.email || user.uid}</div>
              </td>
              <td class="w-1/4 py-3 px-4">{new Date(user.metadata.creationTime).toLocaleDateString()}</td>
              <td class="w-1/6 py-3 px-4">
                {#if user.customClaims?.admin}
                  <span class="bg-green-200 text-green-800 py-1 px-3 rounded-full text-xs">Admin</span>
                {:else}
                  <span class="bg-gray-200 text-gray-800 py-1 px-3 rounded-full text-xs">User</span>
                {/if}
              </td>
              <td class="w-1/4 py-3 px-4">
                <button
                  class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2 text-sm disabled:bg-gray-400"
                  on:click={() => setAdmin(user.uid)}
                  disabled={user.customClaims?.admin === true}
                >
                  Make Admin
                </button>
                <button
                  class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm"
                  on:click={() => deleteUser(user.uid)}
                >
                  Delete
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>

<style>
  /* Scoped styles for the component */
  .container {
    max-width: 1200px;
  }
</style>
// src/lib/stores/authStore.ts

import { writable } from 'svelte/store';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '$lib/firebase';

interface AppUser extends User {
	customClaims?: {
		admin?: boolean;
	};
}

interface AuthState {
	user: AppUser | null;
	loading: boolean;
	error: Error | null;
	isAdmin: boolean;
}

function createAuthStore() {
	const { subscribe, set } = writable<AuthState>({
		user: null,
		loading: true, // Assume loading until the first auth state check completes
		error: null,
		isAdmin: false
	});

	const listen = () => {
		onAuthStateChanged(
			auth,
			async (user) => {
				if (user) {
					const tokenResult = await user.getIdTokenResult(true); // Force refresh
					const isAdmin = tokenResult.claims.admin === true;
					const appUser: AppUser = {
						...user,
						customClaims: {
							admin: isAdmin
						}
					};
					set({ user: appUser, loading: false, error: null, isAdmin });
				} else {
					set({ user: null, loading: false, error: null, isAdmin: false });
				}
			},
			(error) => {
				set({ user: null, loading: false, error, isAdmin: false });
			}
		);
	};

  listen(); // Start listening when the store is created

  return {
    subscribe,
  };
}

export const authStore = createAuthStore();
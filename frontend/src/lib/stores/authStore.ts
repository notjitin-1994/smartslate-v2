// src/lib/stores/authStore.ts

import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

function createAuthStore() {
  const { subscribe, set } = writable<AuthState>({
    user: null,
    loading: true, // Assume loading until the first auth state check completes
    error: null,
  });

  return {
    subscribe,
    setUser: (user: User | null) => set({ user, loading: false, error: null }),
    setLoading: () => set({ user: null, loading: true, error: null }),
    setError: (error: Error) => set({ user: null, loading: false, error }),
  };
}

export const authStore = createAuthStore();
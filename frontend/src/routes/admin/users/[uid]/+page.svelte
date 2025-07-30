<script lang="ts">
	import type { PageData } from './$types';
	import { get } from 'svelte/store';
	import { authStore } from '$lib/stores/authStore';
	import { PUBLIC_API_URL } from '$lib/config';
	import ConfirmationModal from '$lib/components/admin/user-management/ConfirmationModal.svelte';
	import { toastStore } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import ProgressBar from '$lib/components/admin/user-management/ProgressBar.svelte';

	export let data: PageData;

	let { user, courses, enrollments, progress } = data;

	let showDeleteModal = false;
	let selectedRole = user?.customClaims?.role || 'learner';
	// Use a Set for efficient O(1) lookups and modifications
	let enrolledCourses = new Set(enrollments || []);

	const roles = [
		{ value: 'smartslateAdmin', label: 'Owner' },
		{ value: 'smartslateManager', label: 'Manager' },
		{ value: 'smartslateClientManager', label: 'Client Manager' },
		{ value: 'learner', label: 'Learner' }
	];

	async function handleUpdateRole() {
		const authUser = get(authStore).user;
		if (!authUser || !user) return;

		try {
			const token = await authUser.getIdToken();
			const response = await fetch(`${PUBLIC_API_URL}/admin/setUserRole`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ uid: user.uid, role: selectedRole })
			});

			if (!response.ok) {
				throw new Error('Failed to update role');
			}

			toastStore.add('User role updated successfully', 'success');
		} catch (error) {
			toastStore.add('Failed to update role', 'error');
		}
	}

	async function handleEnrollmentChange(courseId: string, isEnrolled: boolean) {
		const authUser = get(authStore).user;
		if (!authUser || !user) return;

		// Update the local state immediately for a responsive UI
		if (isEnrolled) {
			enrolledCourses.add(courseId);
		} else {
			enrolledCourses.delete(courseId);
		}
		// Trigger reactivity
		enrolledCourses = enrolledCourses;

		try {
			const token = await authUser.getIdToken();
			const response = await fetch(`${PUBLIC_API_URL}/admin/user/${user.uid}/enrollments`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ enrollments: Array.from(enrolledCourses) })
			});

			if (!response.ok) {
				throw new Error('Failed to update enrollments');
			}

			toastStore.add('Enrollments updated successfully', 'success');
		} catch (error) {
			toastStore.add('Failed to update enrollments', 'error');
			// Revert optimistic update on failure
			if (isEnrolled) {
				enrolledCourses.delete(courseId);
			} else {
				enrolledCourses.add(courseId);
			}
			enrolledCourses = enrolledCourses;
		}
	}

	async function handleToggleUserStatus() {
		const authUser = get(authStore).user;
		if (!authUser || !user) return;

		try {
			const token = await authUser.getIdToken();
			const response = await fetch(`${PUBLIC_API_URL}/admin/toggleUserStatus`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ uid: user.uid, disabled: !user.disabled })
			});

			if (!response.ok) {
				throw new Error('Failed to update user status');
			}

			user.disabled = !user.disabled;
			toastStore.add(`User ${user.disabled ? 'disabled' : 'enabled'} successfully`, 'success');
		} catch (error) {
			toastStore.add('Failed to update user status', 'error');
		}
	}

	async function handleDeleteUser() {
		const authUser = get(authStore).user;
		if (!authUser || !user) return;

		try {
			const token = await authUser.getIdToken();
			await fetch(`${PUBLIC_API_URL}/admin/deleteUser`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ uid: user.uid })
			});
			toastStore.add('User deleted successfully', 'success');
			goto('/admin/users');
		} catch (error) {
			toastStore.add('Failed to delete user', 'error');
		} finally {
			showDeleteModal = false;
		}
	}

	async function handleImpersonate() {
		const authUser = get(authStore).user;
		if (!authUser || !user) return;

		try {
			const token = await authUser.getIdToken();
			const response = await fetch(`${PUBLIC_API_URL}/admin/impersonateUser`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({ uid: user.uid })
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.error || 'Failed to impersonate user.');
			}

			const result = await response.json();
			const customToken = result.customToken;

			if (customToken) {
				const url = `/impersonate#token=${customToken}`;
				window.open(url, '_blank');
				toastStore.add('Impersonation session started in a new tab.', 'success');
			} else {
				throw new Error('No custom token returned.');
			}
		} catch (error) {
			console.error('Impersonation error:', error);
			toastStore.add((error as Error).message || 'Failed to impersonate user.', 'error');
		}
	}
</script>

<div class="container mx-auto p-8">
	{#if user}
		<header class="mb-8 flex items-center space-x-4">
			<img
				src={user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`}
				alt="User Avatar"
				class="h-24 w-24 rounded-full"
			/>
			<div>
				<h1 class="text-3xl font-bold text-gray-800">{user.displayName}</h1>
				<p class="text-gray-600">{user.email}</p>
			</div>
		</header>

		<div class="grid grid-cols-1 gap-8 md:grid-cols-3">
			<div class="md:col-span-2">
				<div class="rounded-lg bg-white p-6 shadow-md">
					<h2 class="mb-4 text-xl font-semibold text-gray-700">User Information</h2>
					<dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
						<div class="sm:col-span-1">
							<dt class="text-sm font-medium text-gray-500">UID</dt>
							<dd class="mt-1 text-sm text-gray-900">{user.uid}</dd>
						</div>
						<div class="sm:col-span-1">
							<dt class="text-sm font-medium text-gray-500">Created At</dt>
							<dd class="mt-1 text-sm text-gray-900">
								{new Date(user.metadata.creationTime).toLocaleDateString()}
							</dd>
						</div>
						<div class="sm:col-span-1">
							<dt class="text-sm font-medium text-gray-500">Last Sign In</dt>
							<dd class="mt-1 text-sm text-gray-900">
								{new Date(user.metadata.lastSignInTime).toLocaleDateString()}
							</dd>
						</div>
					</dl>
				</div>

				<!-- Course Enrollments Card -->
				<div class="mt-8 rounded-lg bg-white p-6 shadow-md">
					<h2 class="mb-4 text-xl font-semibold text-gray-700">Course Enrollments</h2>
					<div class="space-y-4">
						{#if courses.length > 0}
							{#each courses as course (course.id)}
								<label class="flex items-center">
									<input
										type="checkbox"
										class="h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
										checked={enrolledCourses.has(course.id)}
										on:change={(e) => handleEnrollmentChange(course.id, e.currentTarget.checked)}
									/>
									<span class="ml-3 text-sm text-gray-700">{course.name}</span>
								</label>
							{/each}
						{:else}
							<p class="text-sm text-gray-500">No courses available.</p>
						{/if}
					</div>
				</div>
			</div>

			<div class="md:col-span-2">
				<!-- User Progress Card -->
				<div class="mt-8 rounded-lg bg-white p-6 shadow-md">
					<h2 class="mb-4 text-xl font-semibold text-gray-700">User Progress</h2>
					<div class="space-y-4">
						{#if progress && progress.length > 0}
							{#each progress as courseProgress (courseProgress.courseId)}
								<ProgressBar
									courseName={courseProgress.courseName}
									progress={courseProgress.progress}
								/>
							{/each}
						{:else}
							<p class="text-sm text-gray-500">No progress data available.</p>
						{/if}
					</div>
				</div>
			</div>

			<div class="md:col-span-1">
				<div class="rounded-lg bg-white p-6 shadow-md">
					<h2 class="mb-4 text-xl font-semibold text-gray-700">Account Actions</h2>
					<div class="space-y-4">
						<div>
							<label for="role" class="block text-sm font-medium text-gray-700">Role</label>
							<select
								id="role"
								name="role"
								class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
								bind:value={selectedRole}
								on:change={handleUpdateRole}
							>
								{#each roles as role}
									<option value={role.value}>{role.label}</option>
								{/each}
							</select>
						</div>
						<div>
							<button
								on:click={handleToggleUserStatus}
								class="w-full rounded-md px-4 py-2 text-white {user.disabled
									? 'bg-green-500 hover:bg-green-600'
									: 'bg-yellow-500 hover:bg-yellow-600'}"
							>
								{user.disabled ? 'Enable' : 'Disable'} Account
							</button>
						</div>
						<div>
							<button
								on:click={handleImpersonate}
								class="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
							>
								Login as User
							</button>
						</div>
						<div>
							<button
								on:click={() => (showDeleteModal = true)}
								class="w-full rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
							>
								Delete User
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<p>User not found.</p>
	{/if}
</div>

<ConfirmationModal
	isOpen={showDeleteModal}
	title="Delete User"
	message="Are you sure you want to delete this user? This action cannot be undone."
	on:confirm={handleDeleteUser}
	on:cancel={() => (showDeleteModal = false)}
/>

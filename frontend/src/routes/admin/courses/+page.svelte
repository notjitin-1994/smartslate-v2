<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { auth } from '$lib/services/firebase';
	import { authStore } from '$lib/stores/authStore';
	import { toastStore } from '$lib/stores/toastStore';
	import Modal from '$lib/components/common/Modal.svelte';
	import ConfirmationModal from '$lib/components/admin/user-management/ConfirmationModal.svelte';

	// --- Types ---
	interface Course {
		id: string;
		title: string;
		description: string;
		published: boolean;
		createdAt: any;
	}

	// --- Component State ---
	const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
	let courses: Course[] = [];
	let isLoading = true;
	let error: string | null = null;

	// --- Modal State ---
	let isCourseModalOpen = false;
	let isDeleteModalOpen = false;
	let currentCourse: Partial<Course> = {};
	let courseToDelete: Course | null = null;
	let isEditMode = false;

	// --- API Fetching Logic ---
	async function callAdminFunction(
		path: string,
		method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
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
			// DELETE might not return a body
			if (method === 'DELETE' || response.status === 204) {
				return;
			}
			return response.json();
		} catch (error) {
			console.error(`Error in callAdminFunction for path ${path}:`, error);
			throw error;
		}
	}

	onMount(() => {
		const unsubscribe = authStore.subscribe((store) => {
			if (browser && store.user && !store.loading) {
				fetchCourses();
				unsubscribe();
			}
		});
	});

	async function fetchCourses() {
		isLoading = true;
		try {
			const data = await callAdminFunction('courses');
			courses = data.courses;
			error = null;
		} catch (err: any) {
			error = err.message || 'Failed to fetch courses.';
		} finally {
			isLoading = false;
		}
	}

	// --- CRUD Handlers ---
	function openNewCourseModal() {
		isEditMode = false;
		currentCourse = { title: '', description: '' };
		isCourseModalOpen = true;
	}

	function openEditCourseModal(course: Course) {
		isEditMode = true;
		currentCourse = { ...course };
		isCourseModalOpen = true;
	}

	async function handleSaveCourse() {
		if (!currentCourse.title) {
			toastStore.add('Title is required.', 'error');
			return;
		}

		try {
			if (isEditMode && currentCourse.id) {
				// Update existing course
				await callAdminFunction(`courses/${currentCourse.id}`, 'PUT', {
					title: currentCourse.title,
					description: currentCourse.description
				});
				courses = courses.map((c) => (c.id === currentCourse.id ? { ...c, ...currentCourse } : c));
				toastStore.add('Course updated successfully.', 'success');
			} else {
				// Create new course
				const newCourse = await callAdminFunction('courses', 'POST', {
					title: currentCourse.title,
					description: currentCourse.description
				});
				courses = [newCourse, ...courses];
				toastStore.add('Course created successfully.', 'success');
			}
			isCourseModalOpen = false;
		} catch (err: any) {
			toastStore.add(`Error: ${err.message}`, 'error');
		}
	}

	async function togglePublish(course: Course) {
		try {
			await callAdminFunction(`courses/${course.id}/publish`, 'PATCH', {
				published: !course.published
			});
			courses = courses.map((c) =>
				c.id === course.id ? { ...c, published: !c.published } : c
			);
			toastStore.add(
				`Course successfully ${!course.published ? 'published' : 'unpublished'}.`,
				'success'
			);
		} catch (err: any) {
			toastStore.add(`Error: ${err.message}`, 'error');
		}
	}

	function openDeleteModal(course: Course) {
		courseToDelete = course;
		isDeleteModalOpen = true;
	}

	async function confirmDelete() {
		if (!courseToDelete) return;
		try {
			await callAdminFunction(`courses/${courseToDelete.id}`, 'DELETE');
			courses = courses.filter((c) => c.id !== courseToDelete?.id);
			toastStore.add('Course deleted successfully.', 'success');
		} catch (err: any) {
			toastStore.add(`Error: ${err.message}`, 'error');
		} finally {
			isDeleteModalOpen = false;
			courseToDelete = null;
		}
	}

	function formatDate(timestamp: any) {
		if (!timestamp || typeof timestamp._seconds !== 'number') return 'N/A';
		return new Date(timestamp._seconds * 1000).toLocaleDateString();
	}
</script>

<div class="page-container">
	<div class="page-header">
		<h1 class="page-title">Course Management</h1>
		<button class="create-button" on:click={openNewCourseModal}>+ Create New Course</button>
	</div>

	{#if isLoading}
		<div class="skeleton-table">
			<div class="skeleton-row"></div>
			<div class="skeleton-row"></div>
		</div>
	{:else if error}
		<div class="error-message">
			<p><strong>Error:</strong> {error}</p>
		</div>
	{:else if courses.length === 0}
		<p class="no-items-message">No courses found. Click "Create New Course" to get started.</p>
	{:else}
		<div class="table-wrapper">
			<table>
				<thead>
					<tr>
						<th>Title</th>
						<th>Status</th>
						<th>Created Date</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each courses as course}
						<tr>
							<td class="course-title">{course.title}</td>
							<td>
								<span class="status-badge" class:published={course.published}>
									{course.published ? 'Published' : 'Unpublished'}
								</span>
							</td>
							<td>{formatDate(course.createdAt)}</td>
							<td class="actions-cell">
								<button class="action-button" on:click={() => openEditCourseModal(course)}
									>Edit</button
								>
								<button
									class="action-button"
									class:publish={!course.published}
									class:unpublish={course.published}
									on:click={() => togglePublish(course)}
								>
									{course.published ? 'Unpublish' : 'Publish'}
								</button>
								<button class="action-button delete" on:click={() => openDeleteModal(course)}
									>Delete</button
								>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/if}
</div>

<!-- Course Create/Edit Modal -->
<Modal bind:isOpen={isCourseModalOpen} title={isEditMode ? 'Edit Course' : 'Create New Course'}>
	<form on:submit|preventDefault={handleSaveCourse} class="course-form">
		<div class="form-group">
			<label for="title">Title</label>
			<input
				id="title"
				type="text"
				bind:value={currentCourse.title}
				placeholder="e.g., Introduction to SvelteKit"
				required
			/>
		</div>
		<div class="form-group">
			<label for="description">Description</label>
			<textarea
				id="description"
				bind:value={currentCourse.description}
				placeholder="A brief summary of the course content."
				rows="4"
			></textarea>
		</div>
		<div class="form-actions">
			<button type="button" class="button secondary" on:click={() => (isCourseModalOpen = false)}
				>Cancel</button
			>
			<button type="submit" class="button primary">Save Course</button>
		</div>
	</form>
</Modal>

<!-- Delete Confirmation Modal -->
<ConfirmationModal
	isOpen={isDeleteModalOpen}
	title="Delete Course"
	message={`Are you sure you want to permanently delete "${courseToDelete?.title}"? This action cannot be undone.`}
	on:confirm={confirmDelete}
	on:cancel={() => (isDeleteModalOpen = false)}
/>

<style>
	.page-container {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}
	.page-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-md);
	}
	.page-title {
		font-size: 2rem;
		font-weight: 700;
		color: var(--text-primary);
		margin: 0;
	}
	.create-button {
		background-color: var(--primary-accent);
		color: white;
		border: none;
		padding: var(--space-sm) var(--space-lg);
		border-radius: var(--radius-md);
		font-weight: 600;
		cursor: pointer;
		transition: var(--transition-fast);
	}
	.create-button:hover {
		background-color: var(--primary-accent-dark);
	}
	.table-wrapper {
		overflow-x: auto;
		background-color: var(--container-bg);
		border: 1px solid var(--border-color);
		border-radius: var(--radius-lg);
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
	tbody tr:last-child td {
		border-bottom: none;
	}
	.course-title {
		font-weight: 600;
		color: var(--text-primary);
	}
	.status-badge {
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-full);
		font-size: 0.8rem;
		font-weight: 600;
		background-color: var(--border-color);
		color: var(--text-secondary);
	}
	.status-badge.published {
		background-color: var(--success-bg);
		color: var(--success-text);
	}
	.actions-cell {
		display: flex;
		gap: var(--space-sm);
	}
	.action-button {
		padding: var(--space-xs) var(--space-sm);
		border-radius: var(--radius-sm);
		border: 1px solid var(--border-color);
		background-color: var(--container-bg-light);
		color: var(--text-primary);
		cursor: pointer;
		font-size: 0.9rem;
	}
	.action-button.publish {
		background-color: var(--success-bg);
		color: var(--success-text);
		border-color: var(--success-border);
	}
	.action-button.unpublish {
		background-color: var(--warning-bg);
		color: var(--warning-text);
		border-color: var(--warning-border);
	}
	.action-button.delete {
		background-color: var(--danger-bg);
		color: var(--danger-text);
		border-color: var(--danger-border);
	}
	.course-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}
	.form-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}
	.form-group label {
		font-weight: 600;
	}
	.form-group input,
	.form-group textarea {
		width: 100%;
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-md);
		border: 1px solid var(--border-color);
		background-color: var(--background-light);
	}
	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--space-md);
		margin-top: var(--space-md);
	}
	.button {
		padding: var(--space-sm) var(--space-lg);
		border-radius: var(--radius-md);
		border: none;
		font-weight: 600;
		cursor: pointer;
	}
	.button.primary {
		background-color: var(--primary-accent);
		color: white;
	}
	.button.secondary {
		background-color: var(--border-color);
		color: var(--text-primary);
	}
	.error-message,
	.no-items-message {
		text-align: center;
		padding: var(--space-xl);
		color: var(--text-secondary);
		background-color: var(--container-bg);
		border-radius: var(--radius-lg);
	}
	.skeleton-table .skeleton-row {
		height: 60px;
		background-color: var(--border-color);
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
</style>
import type { PageLoad } from './$types';
import { get } from 'svelte/store';
import { authStore } from '$lib/stores/authStore';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_API_URL } from '$lib/config';

export const load: PageLoad = async ({ params, fetch }) => {
	const { uid } = params;
	const authUser = get(authStore).user;

	if (!authUser) {
		throw redirect(307, '/');
	}

	try {
		const token = await authUser.getIdToken();
		const headers = { Authorization: `Bearer ${token}` };

		// Fetch user, courses, and enrollments in parallel for efficiency
		const [userResponse, coursesResponse, enrollmentsResponse, progressResponse] =
			await Promise.all([
				fetch(`${PUBLIC_API_URL}/admin/user/${uid}`, { headers }),
				fetch(`${PUBLIC_API_URL}/admin/courses`, { headers }),
				fetch(`${PUBLIC_API_URL}/admin/user/${uid}/enrollments`, { headers }),
				// Mocking the progress endpoint
				Promise.resolve(
					new Response(
						JSON.stringify({
							progress: [
								{ courseId: 'course-1', courseName: 'Introduction to Svelte', progress: 75 },
								{ courseId: 'course-2', courseName: 'Advanced Svelte', progress: 50 },
								{ courseId: 'course-3', courseName: 'SvelteKit for Beginners', progress: 25 }
							]
						}),
						{ status: 200, headers: { 'Content-Type': 'application/json' } }
					)
				)
			]);

		if (!userResponse.ok) {
			throw new Error(`Failed to fetch user: ${userResponse.statusText}`);
		}
		if (!coursesResponse.ok) {
			throw new Error(`Failed to fetch courses: ${coursesResponse.statusText}`);
		}
		if (!enrollmentsResponse.ok) {
			throw new Error(`Failed to fetch enrollments: ${enrollmentsResponse.statusText}`);
		}
		if (!progressResponse.ok) {
			throw new Error(`Failed to fetch progress: ${progressResponse.statusText}`);
		}

		const { user } = await userResponse.json();
		const { courses } = await coursesResponse.json();
		const { enrollments } = await enrollmentsResponse.json();
		const { progress } = await progressResponse.json();

		return {
			user,
			courses,
			enrollments,
			progress
		};
	} catch (error) {
		console.error('Error loading user page data:', error);
		return {
			user: null,
			courses: [],
			enrollments: [],
			progress: [],
			error: 'Could not load user data.'
		};
	}
};

<script lang="ts">
	import Container from '$lib/components/pages/common/Container.svelte';
	import { authStore } from '$lib/stores/authStore';
</script>

<Container>
	<div class="profile-page">
		{#if $authStore.user}
			<h1>Welcome, {$authStore.user.displayName || 'User'}</h1>
			<p>This is your profile page.</p>
			<div class="profile-details">
				{#if $authStore.user.photoURL}
					<img src={$authStore.user.photoURL} alt="User avatar" class="profile-avatar" />
				{/if}
				<p><strong>Email:</strong> {$authStore.user.email}</p>
				<p><strong>UID:</strong> {$authStore.user.uid}</p>
			</div>
		{:else if $authStore.loading}
			<p>Loading profile...</p>
		{:else}
			<p>Please sign in to view your profile.</p>
		{/if}
	</div>
</Container>

<style>
	.profile-page {
		padding: var(--space-xl) 0;
		color: var(--text-primary);
	}

	.profile-details {
		margin-top: var(--space-lg);
		background-color: var(--background-secondary);
		padding: var(--space-lg);
		border-radius: var(--radius-md);
	}

	.profile-avatar {
		width: 100px;
		height: 100px;
		border-radius: 50%;
		object-fit: cover;
		margin-bottom: var(--space-md);
	}
</style>
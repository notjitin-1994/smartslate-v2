<script lang="ts">
	import { contactUsModalStore } from '$lib/stores/contactUsModalStore';
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { auth, addInquiry } from '$lib/services/firebase';
	import { toastStore } from '$lib/stores/toastStore';

	// Form State
	let name = '';
	let email = '';
	let message = '';
	let loading = false;
	let error: string | null = null;

	let inquiryType: string | null = null;
	contactUsModalStore.subscribe((value) => {
		inquiryType = value.inquiryType;
	});

	function closeModal() {
		contactUsModalStore.closeModal();
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();
		loading = true;
		error = null;

		try {
			const currentUser = auth.currentUser;
			await addInquiry({
				name,
				email,
				message,
				inquiryType,
				userId: currentUser?.uid
			});

			toastStore.add('Your message has been sent successfully!', 'success');
			closeModal();
		} catch (e: any) {
			error = 'There was an error submitting your inquiry. Please try again.';
			toastStore.add(error, 'error');
			console.error('Inquiry submission error:', e);
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		const handleKeydown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				closeModal();
			}
		};
		window.addEventListener('keydown', handleKeydown);

		// Pre-fill user data if available
		const currentUser = auth.currentUser;
		if (currentUser) {
			name = currentUser.displayName || '';
			email = currentUser.email || '';
		}

		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<div class="auth-modal-backdrop" on:click={closeModal} transition:fade={{ duration: 200 }}>
	<div
		class="auth-modal-container"
		on:click|stopPropagation
		transition:fly={{ y: 20, duration: 300, easing: quintOut }}
	>
		<button class="close-button" on:click={closeModal} aria-label="Close modal">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg
			>
		</button>

		<div class="auth-modal-content">
			<div class="form-container">
				<h2 class="title">Contact <span style="color: var(--primary-accent);">Us</span></h2>
				<p class="subtitle">
					We're here to help. Inquiries for
					<span class="inquiry-type">{inquiryType || 'General'}</span>
				</p>

				<form class="auth-form" on:submit={handleSubmit}>
					<div class="input-group">
						<label for="name">Full Name</label>
						<input
							type="text"
							id="name"
							placeholder="Your Name"
							bind:value={name}
							required
							disabled={loading}
						/>
					</div>
					<div class="input-group">
						<label for="email">Email Address</label>
						<input
							type="email"
							id="email"
							placeholder="you@example.com"
							bind:value={email}
							required
							disabled={loading}
						/>
					</div>
					<div class="input-group">
						<label for="message">Message</label>
						<textarea
							id="message"
							placeholder="How can we help you?"
							bind:value={message}
							required
							disabled={loading}
							rows="4"
						></textarea>
					</div>

					{#if error}
						<p class="error-message">{error}</p>
					{/if}
					<button type="submit" class="btn-primary" disabled={loading}>
						{#if loading}
							<span class="loader"></span> Submitting...
						{:else}
							Submit Inquiry
						{/if}
					</button>
				</form>
			</div>
		</div>
	</div>
</div>

<style>
	.auth-modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		padding: var(--space-md);
	}

	.auth-modal-container {
		background-color: #1a202c;
		color: var(--text-primary);
		border-radius: var(--radius-lg);
		padding: var(--space-xl);
		width: 100%;
		max-width: 480px;
		position: relative;
		box-shadow: var(--shadow-lg);
		border: var(--border-subtle);
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
	}

	.close-button {
		position: absolute;
		top: var(--space-md);
		right: var(--space-md);
		background: transparent;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		padding: var(--space-xs);
		line-height: 0;
	}

	.close-button:hover {
		color: var(--text-primary);
	}

	.auth-modal-content {
		text-align: center;
	}

	.form-container {
		width: 100%;
	}

	.title {
		font-size: 1.75rem;
		font-weight: 600;
		margin-bottom: var(--space-sm);
	}

	.subtitle {
		color: var(--text-secondary);
		margin-bottom: var(--space-xl);
	}

	.inquiry-type {
		font-weight: bold;
		color: var(--primary-accent);
	}

	.auth-form {
		display: flex;
		flex-direction: column;
		gap: var(--space-lg);
		text-align: left;
	}

	.input-group {
		display: flex;
		flex-direction: column;
		gap: var(--space-sm);
	}

	.input-group label {
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--text-secondary);
	}

	.input-group input,
	.input-group textarea {
		background-color: rgba(255, 255, 255, 0.05);
		border: var(--border-subtle);
		border-radius: var(--radius-md);
		padding: var(--space-md);
		color: var(--text-primary);
		font-size: 1rem;
		width: 100%;
		font-family: inherit; /* Ensure textarea inherits font */
	}

	.input-group input:focus,
	.input-group textarea:focus {
		outline: none;
		border-color: var(--primary-accent);
		box-shadow: 0 0 0 2px var(--primary-accent-translucent);
	}

	.input-group textarea {
		resize: vertical;
		min-height: 80px;
	}

	.btn-primary {
		background-color: var(--secondary-accent);
		color: var(--text-primary);
		font-weight: bold;
		padding: var(--space-md);
		border-radius: var(--radius-md);
		border: none;
		cursor: pointer;
		transition: var(--transition-fast);
		margin-top: var(--space-md);
		display: flex;
		justify-content: center;
		align-items: center;
		gap: var(--space-sm);
	}

	.btn-primary:hover:not(:disabled) {
		opacity: 0.9;
	}

	.btn-primary:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.error-message {
		color: var(--destructive);
		font-size: 0.9rem;
		text-align: center;
		margin-top: calc(-1 * var(--space-md));
		margin-bottom: var(--space-sm);
	}

	.loader {
		width: 16px;
		height: 16px;
		border: 2px solid #fff;
		border-bottom-color: transparent;
		border-radius: 50%;
		display: inline-block;
		box-sizing: border-box;
		animation: rotation 1s linear infinite;
	}

	@keyframes rotation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
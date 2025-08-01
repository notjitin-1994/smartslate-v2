<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { solaraInterestModalStore } from '$lib/stores/solaraInterestModalStore';
	import { getFirestore, collection, addDoc } from 'firebase/firestore';
	import { app } from '$lib/services/firebase';
	import { toastStore } from '$lib/stores/toastStore';

	const firestore = getFirestore(app);
	let name = '';
	let email = '';
	let interest: ('use' | 'invest' | 'develop' | null) = null;
	let loading = false;

	const handleSubmit = async () => {
		if (!name || !email || !interest) {
			toastStore.add('Please fill out all fields.', 'error');
			return;
		}

		loading = true;
		try {
			await addDoc(collection(firestore, 'solara_interest'), {
				name,
				email,
				interest,
				submittedAt: new Date()
			});
			toastStore.add('Thank you for your interest! We will be in touch.', 'success');
			solaraInterestModalStore.close();
			name = '';
			email = '';
			interest = null;
		} catch (error) {
			console.error('Error submitting interest:', error);
			toastStore.add('Something went wrong. Please try again.', 'error');
		} finally {
			loading = false;
		}
	};
</script>

{#if $solaraInterestModalStore}
	<div
		class="modal-overlay"
		transition:fade={{ duration: 200 }}
		on:click={solaraInterestModalStore.close}
	>
		<div
			class="modal-content"
			in:fly={{ duration: 300, y: -20, easing: quintOut }}
			out:fade={{ duration: 200 }}
			on:click|stopPropagation
		>
			<button class="close-button" on:click={solaraInterestModalStore.close}>&times;</button>
			<h2>Register Your Interest in Solara</h2>
			<p>
				Be a part of the future of learning. Let us know how you'd like to get involved with
				Solara.
			</p>

			<form on:submit|preventDefault={handleSubmit}>
				<div class="form-group">
					<label for="name">Name</label>
					<input type="text" id="name" bind:value={name} placeholder="Your Name" required />
				</div>
				<div class="form-group">
					<label for="email">Email</label>
					<input type="email" id="email" bind:value={email} placeholder="your@email.com" required />
				</div>
				<div class="form-group">
					<label>I'm interested in:</label>
					<div class="interest-options">
						<button
							type="button"
							class:selected={interest === 'use'}
							on:click={() => (interest = 'use')}
						>
							Using Solara
						</button>
						<button
							type="button"
							class:selected={interest === 'invest'}
							on:click={() => (interest = 'invest')}
						>
							Investing in Solara
						</button>
						<button
							type="button"
							class:selected={interest === 'develop'}
							on:click={() => (interest = 'develop')}
						>
							Developing for Solara
						</button>
					</div>
				</div>
				<div class="form-actions">
					<button type="submit" class="btn btn-primary" disabled={loading}>
						{loading ? 'Submitting...' : 'Submit'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal-content {
		background-color: var(--background-light);
		padding: 2rem;
		border-radius: var(--radius-lg);
		width: 90%;
		max-width: 420px;
		position: relative;
		box-shadow: var(--shadow-xl);
	}

	.close-button {
		position: absolute;
		top: 1rem;
		right: 1rem;
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: var(--text-secondary);
	}

	h2 {
		margin-bottom: 1rem;
		color: var(--text-primary);
	}

	p {
		margin-bottom: 2rem;
		color: var(--text-secondary);
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	label {
		display: block;
		margin-bottom: 0.5rem;
		color: var(--text-secondary);
	}

	input {
		width: 100%;
		padding: 0.75rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-color);
		background-color: var(--container-bg);
		color: var(--text-primary);
	}

	.interest-options {
		display: flex;
		gap: 1rem;
	}

	.interest-options button {
		flex: 1;
		padding: 0.75rem;
		border-radius: var(--radius-md);
		border: 1px solid var(--border-color);
		background-color: var(--container-bg);
		color: var(--text-secondary);
		cursor: pointer;
		transition: background-color 0.2s, color 0.2s;
	}

	.interest-options button.selected {
		background-color: var(--primary-accent);
		color: #1e1b4b; /* Dark Indigo for high contrast */
		border-color: var(--primary-accent);
		font-weight: 600;
	}

	.form-actions {
		display: flex;
		justify-content: center;
		margin-top: 2rem;
	}
</style>
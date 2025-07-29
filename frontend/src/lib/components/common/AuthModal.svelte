<script lang="ts">
	import { authModalStore } from '$lib/stores/authModalStore';
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import SocialButton from './SocialButton.svelte';
	import { onMount } from 'svelte';

	type Tab = 'signin' | 'signup';
	let activeTab: Tab = 'signin';
	let showContent = true;

	function closeModal() {
		authModalStore.update((state) => ({ ...state, isOpen: false }));
	}

	function switchTab(newTab: Tab) {
		if (newTab === activeTab) return;

		showContent = false;
		setTimeout(() => {
			activeTab = newTab;
			showContent = true;
		}, 200); // Corresponds to the fade duration
	}

	onMount(() => {
		const handleKeydown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				closeModal();
			}
		};

		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
		};
	});

	// SVG icons for social buttons
	const icons = {
		google: `<path d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.19,4.73C14.76,4.73 16.04,5.7 17.26,6.88L19.43,4.72C17.56,2.93 15.1,2 12.19,2C6.92,2 2.71,6.62 2.71,12C2.71,17.38 6.92,22 12.19,22C17.6,22 21.54,18.33 21.54,12.29C21.54,11.88 21.48,11.49 21.35,11.1Z" fill-rule="evenodd" clip-rule="evenodd"></path>`,
		microsoft: `<path d="M11.4,21H3V12.5H11.4V21ZM21,21H12.6V12.5H21V21ZM11.4,11.5H3V3H11.4V11.5ZM21,11.5H12.6V3H21V11.5Z"></path>`,
		sso: `<path d="M14,7H10A1,1,0,0,0,9,8V10A1,1,0,0,0,10,11H14A1,1,0,0,0,15,10V8A1,1,0,0,0,14,7ZM12,10A1,1,0,1,1,13,9,1,1,0,0,1,12,10Z"></path><path d="M20,14H4a2,2,0,0,0-2,2v6H22V16A2,2,0,0,0,20,14ZM12,20a2,2,0,1,1,2-2A2,2,0,0,1,12,20Z"></path>`
	};
</script>

<div
	class="auth-modal-backdrop"
	on:click={closeModal}
	transition:fade={{ duration: 200 }}
>
	<div
		class="auth-modal-container"
		on:click|stopPropagation
		transition:fly={{ y: 20, duration: 300, easing: quintOut }}
	>
		<button class="close-button" on:click={closeModal}>
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
		</button>

		<div class="tabs">
			<button class:active={activeTab === 'signin'} on:click={() => switchTab('signin')}>Sign In</button>
			<button class:active={activeTab === 'signup'} on:click={() => switchTab('signup')}>Create Account</button>
		</div>

		<div class="auth-modal-content">
			{#if showContent}
				<div class="form-container" transition:fade={{ duration: 200 }}>
					{#if activeTab === 'signin'}
						<h2 class="title">
							<span style="color: var(--primary-accent);">Welcome</span> back
						</h2>
						<p class="subtitle">Sign in to your account to continue</p>

						<form class="auth-form">
							<div class="input-group">
								<label for="email">Email Address or Phone Number</label>
								<input type="text" id="email" placeholder="you@example.com" />
							</div>
							<div class="input-group">
								<label for="password">Password</label>
								<input type="password" id="password" />
							</div>
							<button type="submit" class="btn-primary">Sign In</button>
						</form>

						<div class="separator">Or continue with</div>

						<div class="social-logins">
							<SocialButton provider="Google" icon={icons.google} />
							<SocialButton provider="Microsoft" icon={icons.microsoft} />
							<SocialButton provider="SSO" icon={icons.sso} />
						</div>
					{:else}
						<h2 class="title">
							Create your <span style="color: var(--primary-accent);">Account</span>
						</h2>
						<p class="subtitle">Get started with SmartSlate</p>

						<form class="auth-form">
							<div class="input-group">
								<label for="name">Full Name</label>
								<input type="text" id="name" placeholder="Your Name" />
							</div>
							<div class="input-group">
								<label for="signup-email">Email Address</label>
								<input type="email" id="signup-email" placeholder="you@example.com" />
							</div>
							<div class="input-group">
								<label for="signup-password">Password</label>
								<input type="password" id="signup-password" />
							</div>
							<button type="submit" class="btn-primary">Create Account</button>
						</form>
					{/if}
				</div>
			{/if}
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

	.tabs {
		display: grid;
		grid-template-columns: 1fr 1fr;
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: var(--radius-md);
		padding: var(--space-xs);
	}

	.tabs button {
		background: transparent;
		border: none;
		color: var(--text-secondary);
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-sm);
		cursor: pointer;
		font-weight: 500;
		transition: var(--transition-fast);
	}

	.tabs button.active {
		background-color: var(--background);
		color: var(--text-primary);
		font-weight: 600;
		box-shadow: var(--shadow-sm);
	}

	.auth-modal-content {
		text-align: center;
		min-height: 450px; /* Prevents layout shift when switching tabs */
		position: relative;
		display: flex;
		align-items: center;
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

	.input-group input {
		background-color: rgba(255, 255, 255, 0.05);
		border: var(--border-subtle);
		border-radius: var(--radius-md);
		padding: var(--space-md);
		color: var(--text-primary);
		font-size: 1rem;
		width: 100%;
	}

	.input-group input:focus {
		outline: none;
		border-color: var(--primary-accent);
		box-shadow: 0 0 0 2px var(--primary-accent-translucent);
	}

	.btn-primary {
		background-color: var(--primary-accent);
		color: var(--background);
		font-weight: bold;
		padding: var(--space-md);
		border-radius: var(--radius-md);
		border: none;
		cursor: pointer;
		transition: var(--transition-fast);
		margin-top: var(--space-md);
	}

	.btn-primary:hover {
		opacity: 0.9;
	}

	.separator {
		display: flex;
		align-items: center;
		text-align: center;
		color: var(--text-secondary);
		margin: var(--space-xl) 0;
		font-size: 0.9rem;
	}

	.separator::before,
	.separator::after {
		content: '';
		flex: 1;
		border-bottom: 1px solid var(--border-subtle);
	}

	.separator:not(:empty)::before {
		margin-right: 0.5em;
	}

	.separator:not(:empty)::after {
		margin-left: 0.5em;
	}

	.social-logins {
		display: flex;
		gap: var(--space-md);
	}
</style>
<script lang="ts">
	import logo from '$lib/assets/images/Final-Dark-BG.png';
	import Container from '$lib/components/pages/common/Container.svelte';
	import { authModalStore } from '$lib/stores/authModalStore';
	import { fly, fade } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { onMount } from 'svelte';

	let showProductsDropdown = false;
	let isMobileMenuOpen = false;

	function toggleMobileMenu() {
		isMobileMenuOpen = !isMobileMenuOpen;
	}

	function closeMobileMenu() {
		isMobileMenuOpen = false;
	}

	function openAuthModal() {
		authModalStore.update((state) => ({ ...state, isOpen: true }));
	}

	// Prevent body scroll when mobile menu is open
	$: {
		if (typeof document !== 'undefined') {
			if (isMobileMenuOpen) {
				document.body.classList.add('no-scroll');
			} else {
				document.body.classList.remove('no-scroll');
			}
		}
	}
</script>

<header>
	<div class="header-background" />
	<Container>
		<div class="content">
			<a href="/" class="logo-link" on:click={closeMobileMenu}>
				<img src={logo} alt="SmartSlate Logo" />
			</a>

			<div class="nav-and-actions">
				<!-- Desktop Nav -->
				<nav class="desktop-nav">
					<div
						class="dropdown-container"
						on:mouseenter={() => (showProductsDropdown = true)}
						on:mouseleave={() => (showProductsDropdown = false)}
					>
						<a href="/products" class="dropdown-toggle">Products</a>
						{#if showProductsDropdown}
							<div class="dropdown-menu" transition:fly={{ y: -10, duration: 200, easing: quintOut }}>
								<a href="/products/ignite">Ignite Series</a>
								<a href="/products/ssa">Strategic Skills Architecture</a>
								<a href="/products/solara">Solara</a>
							</div>
						{/if}
					</div>
					<a href="/difference">The Smartslate Difference</a>
					<a href="/partner">Partner & Collaborate</a>
				</nav>

				<div class="actions">
					<button on:click={openAuthModal} class="btn-signin">Sign In</button>
				</div>
			</div>

			<!-- Hamburger Button -->
			<button
				class="hamburger"
				class:is-active={isMobileMenuOpen}
				on:click={toggleMobileMenu}
				aria-label="Open menu"
			>
				<span />
				<span />
				<span />
			</button>
		</div>
	</Container>

	<!-- Mobile Nav Panel -->
	{#if isMobileMenuOpen}
		<div
			class="mobile-nav-backdrop"
			on:click={closeMobileMenu}
			transition:fade={{ duration: 300 }}
		/>
		<aside class="mobile-nav-panel" transition:fly={{ duration: 300, x: '100%', easing: quintOut }}>
			<div class="mobile-nav-header">
				<h2 class="mobile-nav-title">Menu</h2>
			</div>
			<nav class="mobile-nav">
				<a href="/products" on:click={closeMobileMenu}>Products</a>
				<div class="mobile-dropdown">
					<a href="/products/ignite" on:click={closeMobileMenu}>Ignite Series</a>
					<a href="/products/ssa" on:click={closeMobileMenu}>Strategic Skills Architecture</a>
					<a href="/products/solara" on:click={closeMobileMenu}>Solara</a>
				</div>
				<a href="/difference" on:click={closeMobileMenu}>The Smartslate Difference</a>
				<a href="/partner" on:click={closeMobileMenu}>Partner & Collaborate</a>
			</nav>
			<div class="mobile-actions">
				<hr />
				<button
					on:click={() => {
						closeMobileMenu();
						openAuthModal();
					}}
					class="btn-signin"
				>
					Sign In
				</button>
			</div>
		</aside>
	{/if}
</header>

<style>
	header {
		position: sticky;
		top: var(--space-md);
		z-index: 10;
		max-width: 1200px;
		margin: 0 auto;
		width: calc(100% - var(--space-lg));
	}

	.header-background {
		position: absolute;
		inset: 0;
		background-color: rgba(9, 21, 33, 0.25); /* Using a specific rgba for the glass effect */
		backdrop-filter: blur(12px);
		border: var(--border-subtle);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-lg);
	}

	.content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		padding: var(--space-md) 0;
	}

	.logo-link img {
		height: 28px;
		display: block;
	}

	.nav-and-actions {
		display: flex;
		align-items: center;
		gap: var(--space-lg);
	}

	/* --- Desktop Navigation --- */
	.desktop-nav {
		display: flex;
		align-items: center;
		gap: var(--space-lg);
	}

	.desktop-nav a {
		color: var(--text-primary);
		text-decoration: none;
		font-size: 0.9rem;
		position: relative;
		transition: var(--transition-fast);
	}

	.desktop-nav a:hover {
		color: var(--primary-accent);
	}

	.dropdown-container {
		position: relative;
	}

	.dropdown-menu {
		position: absolute;
		top: calc(100% + var(--space-md));
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--background);
		border: var(--border-subtle);
		border-radius: var(--radius-md);
		padding: var(--space-sm) 0;
		min-width: 240px;
		z-index: 11;
		box-shadow: var(--shadow-lg);
		display: flex;
		flex-direction: column;
	}

	.dropdown-menu a {
		padding: var(--space-sm) var(--space-lg);
		white-space: nowrap;
		font-size: 0.9rem;
		color: var(--text-secondary);
	}

	.dropdown-menu a:hover {
		background-color: var(--primary-accent);
		color: var(--background);
		text-decoration: none;
	}

	.actions .btn-signin,
	.mobile-actions .btn-signin {
		background-color: var(--secondary-accent);
		color: #ffffff;
		padding: var(--space-sm) var(--space-md);
		border-radius: var(--radius-sm);
		text-decoration: none;
		font-weight: bold;
		font-size: 0.9rem;
		transition: var(--transition-fast);
		border: none;
		cursor: pointer;
		font-family: inherit;
	}

	.actions .btn-signin:hover {
		opacity: 0.9;
	}

	/* --- Hamburger & Mobile Nav --- */
	.hamburger {
		display: none; /* Hidden by default */
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		z-index: 1001;
		width: 44px;
		height: 44px;
		position: relative;
	}

	.hamburger span {
		display: block;
		width: 25px;
		height: 3px;
		background-color: var(--text-primary);
		transition: var(--transition-medium);
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		border-radius: var(--radius-sm);
	}

	.hamburger span:nth-child(1) {
		top: 10px;
	}
	.hamburger span:nth-child(2) {
		top: 20px;
	}
	.hamburger span:nth-child(3) {
		top: 30px;
	}

	.hamburger.is-active {
		position: fixed;
		top: calc(var(--space-md) + var(--space-md));
		right: var(--space-md);
	}

	.hamburger.is-active span:nth-child(1) {
		transform: translate(-50%, 10px) rotate(45deg);
	}
	.hamburger.is-active span:nth-child(2) {
		opacity: 0;
	}
	.hamburger.is-active span:nth-child(3) {
		transform: translate(-50%, -10px) rotate(-45deg);
	}

	.mobile-nav-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.3);
		backdrop-filter: blur(5px);
		z-index: 998;
	}

	.mobile-nav-panel {
		position: fixed;
		top: 0;
		right: 0;
		width: 80%;
		max-width: 320px;
		height: 100%;
		background-color: var(--background);
		z-index: 999;
		padding: var(--space-xl);
		box-shadow: var(--shadow-lg);
		display: flex;
		flex-direction: column;
	}

	.mobile-nav-header {
		padding-bottom: var(--space-lg);
		border-bottom: var(--border-subtle);
	}

	.mobile-nav-title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--primary-accent);
		margin: 0;
	}

	.mobile-nav {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-lg);
		padding-top: var(--space-lg);
	}

	.mobile-nav a {
		text-decoration: none;
		font-size: 1.1rem;
		font-family: var(--font-body);
	}

	.mobile-nav > a {
		color: var(--text-primary);
		font-weight: 500;
	}

	.mobile-dropdown {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-md);
		margin-top: calc(-1 * var(--space-sm));
		padding-left: var(--space-md);
		border-left: var(--border-subtle);
	}

	.mobile-dropdown a {
		color: var(--primary-shade-dark);
	}

	.mobile-actions {
		margin-top: auto;
		padding-top: var(--space-lg);
	}

	.mobile-actions hr {
		border: none;
		border-top: var(--border-subtle);
		margin-bottom: var(--space-lg);
	}

	.mobile-actions .btn-signin {
		display: block;
		width: 100%;
		text-align: center;
		background-color: var(--secondary-accent);
		color: #ffffff;
		padding: var(--space-md) var(--space-lg);
		border-radius: var(--radius-md);
		text-decoration: none;
		font-weight: bold;
		font-size: 1.1rem;
	}

	/* --- Responsive Breakpoint --- */
	@media (max-width: 768px) {
		.nav-and-actions {
			display: none;
		}
		.hamburger {
			display: flex;
		}
		.content {
			padding: var(--space-sm) 0; /* Reduce padding on mobile */
		}
	}
</style>
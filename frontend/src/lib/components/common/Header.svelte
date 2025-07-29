<script lang="ts">
	import logo from '$lib/assets/images/Final-Dark-BG.png';
	import Container from '$lib/components/common/Container.svelte';
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

	// Prevent body scroll and blur main content when mobile menu is open
	onMount(() => {
		const mainContent = document.getElementById('main-content');
		const footer = document.querySelector('footer');

		const unsubscribe = () => {
			if (isMobileMenuOpen) {
				document.body.classList.add('no-scroll');
				mainContent?.classList.add('blurred');
				footer?.classList.add('blurred');
			} else {
				document.body.classList.remove('no-scroll');
				mainContent?.classList.remove('blurred');
				footer?.classList.remove('blurred');
			}
		};
		unsubscribe(); // initial check
		return unsubscribe;
	});

	$: {
		if (typeof document !== 'undefined') {
			const mainContent = document.getElementById('main-content');
			const footer = document.querySelector('footer');
			if (isMobileMenuOpen) {
				document.body.classList.add('no-scroll');
				mainContent?.classList.add('blurred');
				footer?.classList.add('blurred');
			} else {
				document.body.classList.remove('no-scroll');
				mainContent?.classList.remove('blurred');
				footer?.classList.remove('blurred');
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
					<a href="/signin" class="btn-signin">Sign In</a>
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
				<a href="/signin" class="btn-signin" on:click={closeMobileMenu}>Sign In</a>
			</div>
		</aside>
	{/if}
</header>

<style>
	header {
		position: sticky;
		top: 1rem;
		z-index: 10;
		max-width: 1200px;
		margin: 0 auto;
		width: calc(100% - 2rem);
	}

	.header-background {
		position: absolute;
		inset: 0;
		background-color: rgba(9, 21, 33, 0.25);
		backdrop-filter: blur(12px);
		border: 1px solid rgba(167, 218, 219, 0.1);
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
	}

	.content {
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		padding: 1rem 0;
	}

	.logo-link img {
		height: 28px;
		display: block;
	}

	.nav-and-actions {
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	/* --- Desktop Navigation --- */
	.desktop-nav {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	.desktop-nav a {
		color: var(--primary-accent);
		text-decoration: none;
		font-size: 0.9rem;
		position: relative;
	}

	.desktop-nav a:hover {
		text-decoration: underline;
	}

	.dropdown-container {
		position: relative;
	}

	.dropdown-menu {
		position: absolute;
		top: calc(100% + 1rem);
		left: 50%;
		transform: translateX(-50%);
		background-color: var(--background);
		border: 1px solid rgba(167, 218, 219, 0.2);
		border-radius: 8px;
		padding: 0.5rem 0;
		min-width: 240px;
		z-index: 11;
		box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
		display: flex;
		flex-direction: column;
	}

	.dropdown-menu a {
		padding: 0.75rem 1.5rem;
		white-space: nowrap;
		font-size: 0.9rem;
	}

	.dropdown-menu a:hover {
		background-color: var(--secondary-accent);
		color: var(--button-text);
		text-decoration: none;
	}

	.actions .btn-signin {
		background-color: var(--secondary-accent);
		color: var(--button-text);
		padding: 0.5rem 1.25rem;
		border-radius: 6px;
		text-decoration: none;
		font-weight: bold;
		font-size: 0.9rem;
		transition: background-color 0.2s ease;
	}

	.actions .btn-signin:hover {
		background-color: #c1f0f0;
	}

	/* --- Hamburger & Mobile Nav --- */
	.hamburger {
		display: none;
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
		z-index: 1001;
		width: 25px;
		height: 21px;
		position: relative;
	}

	.hamburger span {
		display: block;
		width: 25px;
		height: 3px;
		background-color: var(--primary-accent);
		transition: all 0.3s ease-in-out;
		position: absolute;
		left: 0;
		border-radius: 3px;
	}

	.hamburger span:nth-child(1) { top: 0; }
	.hamburger span:nth-child(2) { top: 9px; }
	.hamburger span:nth-child(3) { top: 18px; }

	.hamburger.is-active {
		position: fixed;
		top: calc(1rem + 1rem);
		right: 1rem;
	}

	.hamburger.is-active span:nth-child(1) {
		transform: translateY(9px) rotate(45deg);
	}
	.hamburger.is-active span:nth-child(2) {
		opacity: 0;
	}
	.hamburger.is-active span:nth-child(3) {
		transform: translateY(-9px) rotate(-45deg);
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
		padding: 2rem;
		box-shadow: -10px 0 30px rgba(0, 0, 0, 0.2);
		display: flex;
		flex-direction: column;
	}

	.mobile-nav-header {
		padding-bottom: 1.5rem;
		border-bottom: 1px solid rgba(167, 218, 219, 0.1);
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
		gap: 1.5rem;
		padding-top: 1.5rem;
	}

	.mobile-nav a {
		text-decoration: none;
		font-size: 1.1rem;
		font-family: var(--font-body);
	}

	.mobile-nav > a {
		color: var(--primary-accent);
		font-weight: 500;
	}

	.mobile-dropdown {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
		margin-top: -0.5rem;
		padding-left: 1rem;
		border-left: 1px solid rgba(167, 218, 219, 0.2);
	}

	.mobile-dropdown a {
		color: var(--secondary-accent);
	}

	.mobile-actions {
		margin-top: auto;
		padding-top: 1.5rem;
	}

	.mobile-actions hr {
		border: none;
		border-top: 1px solid rgba(167, 218, 219, 0.1);
		margin-bottom: 1.5rem;
	}

	.mobile-actions .btn-signin {
		display: block;
		width: 100%;
		text-align: center;
		background-color: var(--secondary-accent);
		color: var(--button-text);
		padding: 0.75rem 1.25rem;
		border-radius: 6px;
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
			display: block;
		}
	}
</style>
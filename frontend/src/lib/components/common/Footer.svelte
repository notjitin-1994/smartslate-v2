<footer>
	<div class="logo-wrapper">
		<img src="/src/lib/assets/images/Final-Dark-BG.png" alt="SmartSlate Logo" class="footer-logo" />
	</div>
	<div class="footer-text">
		<p class="tagline">Revolutionizing the way the World learns.</p>
		<p class="copyright">© 2025 SmartSlate. All rights reserved.</p>
	</div>
</footer>

<style>
	footer {
		text-align: center;
		padding: 1rem; /* Simplified and reduced padding */
		margin-top: 4rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem; /* Reduced gap */
	}

	.footer-logo {
		height: 18px; /* Increased size by 20% */
		width: auto;
		/* margin-bottom: 0.5rem; */ /* Removed, spacing now handled by parent gap */
	}

	.footer-text {
		display: flex;
		flex-wrap: wrap; /* Allow wrapping on small screens */
		justify-content: center;
		align-items: center;
		gap: 0.5rem 1rem; /* Vertical and horizontal gap */
	}

	.tagline {
		font-size: var(--font-size-large);
		color: var(--color-text-secondary);
		/* font-style: italic; */ /* Removed italic style */
		margin: 0;
	}

	.copyright {
		font-size: var(--font-size-small);
		color: var(--color-text-tertiary);
		margin: 0;
	}
</style>

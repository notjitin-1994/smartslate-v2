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
		padding: var(--space-lg);
		margin-top: var(--space-xl);
		border-top: var(--border-subtle);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: var(--space-md);
	}

	.footer-logo {
		height: 18px;
		width: auto;
	}

	.footer-text {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: var(--space-sm) var(--space-md);
	}

	.tagline {
		font-size: 1rem;
		color: var(--text-secondary);
		margin: 0;
	}

	.copyright {
		font-size: 0.875rem;
		color: var(--primary-shade-dark);
		margin: 0;
	}

	@media (max-width: 768px) {
		.footer-logo {
			height: 24px; /* Increase logo size for better visibility */
		}

		.footer-text {
			flex-direction: column;
			gap: var(--space-sm);
		}
	}
</style>

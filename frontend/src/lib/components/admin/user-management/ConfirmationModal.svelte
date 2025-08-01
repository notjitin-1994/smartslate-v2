<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Modal from '$lib/components/common/Modal.svelte';

	export let isOpen = false;
	export let title = 'Are you sure?';
	export let message = 'This action cannot be undone.';

	const dispatch = createEventDispatcher();

	function confirm() {
		dispatch('confirm');
	}

	function cancel() {
		dispatch('cancel');
	}
</script>

<Modal {isOpen} on:close={cancel}>
	<h3 class="title">{title}</h3>
	<p class="message">{message}</p>

	<div slot="footer" class="footer-actions">
		<button type="button" class="btn-secondary" on:click={cancel}>
			Cancel
		</button>
		<button type="button" class="btn-danger" on:click={confirm}>
			Confirm
		</button>
	</div>
</Modal>

<style>
	.title {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text-primary);
	}
	.message {
		margin-top: 0.5rem;
		color: var(--color-text-secondary);
	}
	.footer-actions {
		display: flex;
		justify-content: flex-end;
		gap: 0.5rem;
		margin-top: 1.5rem;
	}

	/* Basic Button Styles (can be extracted to a global stylesheet) */
	.btn-secondary,
	.btn-danger {
		padding: 0.5rem 1rem;
		border-radius: var(--radius-md);
		font-weight: 500;
		border: 1px solid transparent;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.btn-secondary {
		background-color: var(--color-background-secondary);
		color: var(--color-text-primary);
		border-color: var(--color-border);
	}

	.btn-secondary:hover {
		background-color: var(--color-background-tertiary);
	}

	.btn-danger {
		background-color: #dc2626; /* red-600 */
		color: white;
	}

	.btn-danger:hover {
		background-color: #b91c1c; /* red-700 */
	}
</style>

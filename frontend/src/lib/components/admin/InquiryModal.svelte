<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Inquiry } from './types';

	export let isOpen: boolean;
	export let inquiry: Inquiry | null;

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}

	function formatDate(timestamp: any) {
		if (!timestamp || typeof timestamp._seconds !== 'number') return 'N/A';
		return new Date(timestamp._seconds * 1000).toLocaleString();
	}
</script>

{#if isOpen && inquiry}
	<div class="modal-backdrop" on:click={closeModal}>
		<div class="modal-content" on:click|stopPropagation>
			<button class="modal-close-button" on:click={closeModal}>&times;</button>
			<h2>Inquiry Details</h2>
			<div class="details-grid">
				<div><strong>Name:</strong> {inquiry.name}</div>
				<div><strong>Email:</strong> {inquiry.email}</div>
				<div><strong>Phone:</strong> {inquiry.phone || '--'}</div>
				<div><strong>Company:</strong> {inquiry.company || '--'}</div>
				<div><strong>Date:</strong> {formatDate(inquiry.createdAt)}</div>
				<div><strong>Type:</strong> {inquiry.inquiryType}</div>
				<div class="full-width"><strong>Message:</strong></div>
				<div class="message-box full-width">{inquiry.message}</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.6);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}
	.modal-content {
		background-color: var(--color-background-secondary);
		padding: var(--space-xl);
		border-radius: var(--radius-lg);
		width: 90%;
		max-width: 600px;
		position: relative;
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
	}
	.modal-close-button {
		position: absolute;
		top: var(--space-md);
		right: var(--space-md);
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: var(--color-text-secondary);
	}
	h2 {
		margin-top: 0;
		margin-bottom: var(--space-lg);
		color: var(--color-text-primary);
	}
	.details-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-md);
	}
	.details-grid div {
		color: var(--color-text-secondary);
	}
	.details-grid strong {
		color: var(--color-text-primary);
	}
	.full-width {
		grid-column: 1 / -1;
	}
	.message-box {
		background-color: var(--color-background-tertiary);
		padding: var(--space-md);
		border-radius: var(--radius-md);
		white-space: pre-wrap;
		word-break: break-word;
		margin-top: var(--space-sm);
	}
</style>
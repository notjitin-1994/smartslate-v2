<script lang="ts">
	import { createEventDispatcher } from 'svelte';

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

{#if isOpen}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
		on:click={cancel}
		on:keydown
	>
		<div
			class="transform rounded-lg bg-white p-6 shadow-xl transition-all sm:w-full sm:max-w-lg"
			role="dialog"
			aria-modal="true"
			aria-labelledby="modal-title"
			on:click|stopPropagation
			on:keydown
		>
			<h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">{title}</h3>
			<div class="mt-2">
				<p class="text-sm text-gray-500">{message}</p>
			</div>
			<div class="mt-4 flex justify-end space-x-2">
				<button
					type="button"
					class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
					on:click={cancel}
				>
					Cancel
				</button>
				<button
					type="button"
					class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:text-sm"
					on:click={confirm}
				>
					Confirm
				</button>
			</div>
		</div>
	</div>
{/if}

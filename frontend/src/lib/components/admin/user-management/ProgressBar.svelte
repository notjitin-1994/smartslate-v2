<script lang="ts">
	export let progress: number;
	export let courseName: string;
</script>

<div class="w-full">
	<div class="flex justify-between mb-1">
		<span class="text-base font-medium text-gray-700">{courseName}</span>
		<span class="text-sm font-medium text-gray-700">{progress}%</span>
	</div>
	<div class="w-full bg-gray-200 rounded-full h-2.5">
		<div class="bg-blue-600 h-2.5 rounded-full" style="width: {progress}%"></div>
	</div>
</div>

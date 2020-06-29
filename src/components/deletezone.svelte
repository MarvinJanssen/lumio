<script>
	export var classname;

	import SortableList from './sortablelist.svelte';

	var delete_options = {
		group: 'symbols'
	};
</script>
<SortableList bind:classname options={delete_options}></SortableList>
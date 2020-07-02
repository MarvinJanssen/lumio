<script>
	/*
	A wrapper around Sortable of the 'svelte-sortablejs' package. It will do for now, but in the future
	this component will be replaced by a custom sortable Svelte Action, making everything more flexible.
	*/

	export var id = undefined;
	export var classname = undefined;
	export var list;
	export var options = {};
	export var symbol = null;

	import {onMount} from 'svelte';
	import {flip} from 'svelte/animate';
	import {create_animation} from 'svelte/internal';
	// import Sortable from 'svelte-sortablejs';
	import Sortable from './sortablelist.svelte';
	import {Symbol,Reference,Value} from '../lumio';
	import {construct_symbol,uid} from '../utils';
	import reference from '../reference';

	var chosen_old_index = null;

	var can_drop = function(event)
		{
		if (event.to.classList.contains('delete_zone'))
			return true;
		if (event.to === event.from)
			return true; // reorder
		if (!list[chosen_old_index])
			{
			console.error('old index out of bounds',chosen_old_index);
			return false;
			}
		var symbol = list[chosen_old_index].symbol;
		var is_reference = symbol instanceof Reference;
		var chosen_reference = reference.index[symbol.name || symbol.type];
		if (event.to.dataset.document) // looks like any function can go in the root in Clarity SDK, so we will allow it for now
			return (chosen_reference && chosen_reference.type === 'function') || (is_reference && symbol.type === 'function');
		if (chosen_reference)
			{
			if (chosen_reference.root) // symbol can only go in the document root
				return !!event.to.dataset.document;
			}
		else if (!is_reference)
			return false; // unknown symbol
		var to_reference = reference.index[event.to.dataset.symbol_name];
		if (to_reference && typeof to_reference.max_input === 'number' && event.to.childElementCount >= to_reference.max_input - (to_reference.placeholders ? to_reference.placeholders.length : 0))
			return false; // symbol cannot accept more input
		return true;
		};

	// var can_drop2 = function(event)
	// 	{
	// 	if (event.to === event.from)
	// 		return true; // reorder
	// 	if (!list[chosen_old_index])
	// 		{
	// 		console.error('old index out of bounds',chosen_old_index);
	// 		return false;
	// 		}
	// 	var chosen_ref = reference.index[list[chosen_old_index].symbol.name || list[chosen_old_index].symbol.type];
	// 	if (!chosen_ref && !(list[chosen_old_index].symbol instanceof Reference))
	// 		return false; // document
	// 	if (chosen_ref && chosen_ref.root) // root elements can only go in the document root
	// 		return !!event.to.dataset.document;
	// 	if (event.to.dataset.custom_function)
	// 		return true;
	// 	var to_symbol = event.to.dataset.symbol_name;
	// 	if (!to_symbol || !reference.index[to_symbol])
	// 		return false; // unknown symbol
	// 	// check max input
	// 	if (typeof reference.index[to_symbol].max_input === 'number' && event.to.childElementCount < reference.index[to_symbol].max_input - (reference.index[to_symbol].placeholders ? reference.index[to_symbol].placeholders.length : 0))
	// 		return true; // symbol can accept more input
	// 	if (list[chosen_old_index].symbol instanceof Reference)
	// 		return true; // refs can go anywhere
	// 	return false;
	// 	};

	var last_drag_over = null;

	var dragging_clone = null;

	var drag_out = function()
		{
		if (last_drag_over)
			{
			//last_drag_over.removeEventListener('dragleave',drag_out);
			last_drag_over.classList.remove('cannot_drop');
			last_drag_over = null;
			}
		};

	var opt = {
		group: {
			name: 'symbols',
			pull: options.drawer ? 'clone' : true,
			revertClone: false,
			put: !options.drawer
		},
		swapThreshold: .3,
		emptyInsertThreshold: 20,
		invertSwap: true,
		animation: 0,
		fallbackOnBody: true,
		ghostClass: 'dragging-ghost',
		chosenClass: 'dragging',
		filter: '.ignore',
		preventOnFilter: false,
		//handle: '.handle',
		direction: 'vertical',
		sort: (typeof options.sort !== 'undefined' ? options.sort : !options.drawer),
		draggable: options.item || '.symbol',
		scroll: true,

		onChoose: function(event)
			{
			chosen_old_index = event.oldDraggableIndex;
			},

		onUnchoose: function(event)
			{
			// we need this to fix dragging clone offset in onEnd
			//chosen_old_index = null;
			},

		onStart: function(event)
			{
			if (dragging_clone)
				dragging_clone.remove();
			// set options.disable_old_ghost to true remove the dragging/old ghost, also see symbol.svelte:
			if (!options.drawer && !options.disable_old_ghost)
				{
				dragging_clone = event.item.cloneNode(true);
				dragging_clone.classList.add('dragging-clone','ignore');
				event.from.insertBefore(dragging_clone,event.from.children[event.oldIndex || 0]);
				}
			if (!options.drawer)
				document.body.classList.add('dragging-action');
			},

		onEnd: function(event)
			{
			if (dragging_clone)
				{
				dragging_clone.remove();
				if (chosen_old_index < event.newIndex && event.newIndex > 0 && event.newIndex < list.length)
					{
					// fix the offset issue due to the dragging clone
					var item = list[event.newIndex-1];
					list[event.newIndex-1] = list[event.newIndex];
					list[event.newIndex] = item;
					}
				chosen_old_index = null;
				}
			document.body.classList.remove('dragging-action');
			drag_out();
			},

		onUpdate: function(event)
			{
			if (dragging_clone)
				{
				var from = dragging_clone.getBoundingClientRect();
				setTimeout(() =>
					{
					//TODO- do this properly, without the timer.
					var to = event.item.getBoundingClientRect();
					create_animation(event.item,from,flip,{duration:200});
					},0);
				}
			//onEnd will clean up the dragging clone
			},

		onMove: function(event)
			{
			var droppable = can_drop(event);
			if (last_drag_over !== event.to)
				{
				drag_out();
				last_drag_over = event.to;
				if (!droppable)
					event.to.classList.add('cannot_drop');
				//event.to.addEventListener('dragleave',drag_out);
				}
			return droppable;
			}
		};

	function clone(item,event)
		{
		return {id:uid('symbols'),ref:item.ref,symbol:item.symbol.duplicate(false)};
		}

	var sortable;

	onMount(() => 
		{
		//TODO- We touch the Svelte context here because the Sortable
		//		component does not provide access to the main node. In 
		//		the future we create our own Sortable action.
		var [id,classname,node] = sortable.$$.ctx;
		if (options.document)
			node.dataset.document = true;
		if (symbol)
			node.dataset.symbol_name = symbol instanceof Value ? symbol.type : symbol.name;
		if (symbol instanceof Reference && symbol.type === 'function')
			node.dataset.custom_function = '1';
		});
</script>
<Sortable bind:this={sortable} bind:id bind:classname bind:list options={opt} clone={clone}>
	<slot />
</Sortable>
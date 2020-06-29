<script>
	export var document;

	import {onMount} from 'svelte';
	import {flip} from 'svelte/animate';
	import Symbol from './symbol.svelte';
	import SortableSymbolsList from './sortablesymbolslist.svelte';
	import {construct_symbol,uid} from '../utils';

	var symbols = [];

	var id = 0;
	for (var i in document.symbols)
		symbols.push({id:uid('symbols'),symbol:document.symbols[i]});

	function delete_symbol(event)
		{
		symbols = symbols.filter(entry => entry.symbol !== event.detail);
		}

	$: document.symbols = symbols.map(item => item.symbol);
</script>
<div id="canvas">
	<SortableSymbolsList id="document" bind:list={symbols} options={{document:true}}>
		{#if symbols}
			{#each symbols as item (item.id)}
				<Symbol symbol={item.symbol} id={item.id} on:delete={delete_symbol} />
			{/each}
		{/if}
	</SortableSymbolsList>
</div>
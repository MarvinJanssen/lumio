<script>
	/*
	This is a visual representation of a symbol in Clarity.
	*/

	export var id = 0;
	export var symbol = null;
	export var duration = 200;
	export var drawer = false;

	import {onDestroy} from 'svelte';
	import {scale,slide} from 'svelte/transition';
	import Toggle from './toggle.svelte';
	import SymbolArgumentDefinition from './symbolargumentdefinition.svelte';
	import SymbolTypeDefinition from './symboltypedefinition.svelte';
	import SortableSymbolsList from './sortablesymbolslist.svelte';
	import {Value,Reference} from '../lumio';
	import {symbol_reference,construct_symbol,uid} from '../utils';
	import {help,custom_functions,custom_varconsts} from '../stores';
	import {send,receive} from '../transition/sharedcrossfade';

	import {createEventDispatcher} from 'svelte';

	var dispatch = createEventDispatcher();

	var receive_fallback = drawer ? slide : scale;
	var reference = symbol.custom || symbol_reference(symbol);

	// custom symbol
	var custom_store = (reference.defines === 'function' || (reference && reference.custom === 'function')) ? custom_functions : custom_varconsts;

	function validate_value(event)
		{
		var value = event.target.value;
		if (symbol.type === 'uint')
			{
			value = 'u'+value;
			symbol.value = value;
			}
		event.target.className = value && (!reference.pattern || reference.pattern.test(value)) ? '' : 'error';
		}

	// add Symbols to sorted symbols array
	var symbols = [];
	for (var i in symbol.symbols)
		symbols.push({id:uid('symbols'),symbol:symbol.symbols[i]});

	// add static symbols
	var static_symbols = [];
	if (!drawer && reference.placeholders)
		for (var i in reference.placeholders)
			static_symbols.push(construct_symbol('value',reference.placeholders[i]));

	function delete_symbol(event)
		{
		symbols = symbols.filter(entry => entry.symbol !== event.detail);
		}

	// Crossfades are really nice but it makes some elements jump around when
	// the old ghost is removed. More time is needed to make them function
	// perfectly. To disable those crossfades, remove the out:send attribute
	// and set option disable_old_ghost to true on SortableSymbolsList options.

	// HTML number inputs do not like the u in front of unsigned integers.
	var initial_value = symbol instanceof Value && symbol.type === 'uint' && symbol.value[0] === 'u'
		? symbol.value.substring(1)
		: symbol.value;

	// this symbol defines a new symbol name
	if (reference.defines)
		{
		var ref = {
			type: 'reference',
			name: symbol.value,
			input: reference.defines === 'function' ? [] : null, // add in the future
			max_input: reference.defines === 'function' ? Infinity : 0,
			custom: reference.defines
			};
		var definition = {
			id: uid('symbols'),
			ref: ref,
			symbol: construct_symbol('reference',reference.defines,symbol.value,ref)
			};
		custom_store.insert(definition);
		onDestroy(() => custom_store.remove(definition));
		}

	// the next statement is reactive, it updates the definition symbol name and signals custom signal subscribers (like the drawer)
	$: if (definition)
		{
		definition.ref.name = symbol.value;
		definition.ref = definition.ref;
		custom_store.signal();
		}

	// we signal using the store for now
	// $: if (symbol.custom)
	// 	symbol.name = symbol.custom.name;

	// listen for updates so we redraw (new symbol name)
	if (reference.custom)
		custom_store.subscribe(update => {symbol.name = reference.name;symbol = symbol});

	// set current symbol list on Symbol
	$: symbol.symbols = static_symbols.concat(symbols.map(item => item.symbol));

	var class_list;
	$: {
		class_list = 'symbol';
		if (reference.input || (symbol.symbols && symbol.symbols.length))
			class_list += ' input';
		if (symbol.type === '#type-definition')
			class_list += ' type';
		else if (symbol.type === '#tuple-value')
			class_list += ' tuple';
		else if (symbol.type === '#method-signature')
			class_list += ' method';
	}
</script>
<div class={class_list} in:receive|local={{key:id,duration,fallback:receive_fallback}} out:send|local={{key:id,duration,fallback:receive_fallback}}>
	<div class="name handle">
		{reference.name_hint || reference.name || symbol.name || '?'}
		{#if !drawer && reference.input}
			<span>{symbol.symbols.length}{#if reference.max_input !== Infinity}/{reference.max_input}{/if}</span>
		{/if}
	</div>
	{#if !drawer}
		<!-- bound value inputs, this will be a separate component at some point -->
		{#if symbol instanceof Value}
			{#if symbol.type === 'int' || symbol.type === '#length'}
				<input bind:value={symbol.value} autocomplete="off" spellcheck="false" type="number" on:input={validate_value} min={symbol.type === 'int'?'':'0'} />
			{:else if symbol.type === 'uint'}
				<input value={initial_value} autocomplete="off" spellcheck="false" type="number" on:input={validate_value} min="0" />
			{:else if symbol.type === 'bool'}
				<Toggle bind:checked={symbol.value} />
				<div class="bool">{symbol.value}</div>
			{:else if symbol.type === '#argument-definition' || symbol.type === '#tuple-definition'}
				<SymbolArgumentDefinition bind:value={symbol.value} on:input={validate_value} bind:static_symbols />
			{:else if symbol.type === '#type-definition'}
				<SymbolTypeDefinition bind:value={symbol.value} bind:static_symbols />
			{:else}
				<input bind:value={symbol.value} autocomplete="off" spellcheck="false" on:input={validate_value} type="text" />
			{/if}
		{/if}
	{/if}
	<!-- help buttons, no help function for custom symbols at this time -->
	{#if !reference.custom}
		<div class="help" title="View help for this symbol" on:click={() => help.set({what:'symbol',for:reference.name})}>?</div>
	{/if}
	{#if !drawer}
		<!-- static symbols that cannot be sorted -->
		{#if (static_symbols.length)}
			<div class="symbols">
				{#each static_symbols as symbol (symbol)}
					<svelte:self symbol={symbol} />
				{/each}
			</div>
		{/if}
		<!-- variable symbol inputs -->
		{#if reference.input}
			<SortableSymbolsList classname="symbols" bind:symbol bind:list={symbols}>
				{#each symbols as item (item.id)}
					<svelte:self symbol={item.symbol} id={item.id} on:delete={delete_symbol} />
				{/each}
			</SortableSymbolsList>
		{/if}
		<!-- method signatures need add / remove buttons -->
		{#if symbol.type === '#method-signature'}
			<div class="button" title="Add argument definition." on:click={() => {static_symbols.push(construct_symbol('value','#argument-definition'));static_symbols=static_symbols;}}>add argument</div>
			{#if symbol.symbols.length}
				<div class="button" title="Remove argument definition." on:click={() => {static_symbols.pop();static_symbols=static_symbols;}}>Remove argument</div>
			{/if}
		{/if}
		<!-- tuple definitions have add / remove buttons -->
		{#if symbol.type === '#type-definition' && symbol.value === 'tuple'}
			<div class="button" title="Add key." on:click={() => {static_symbols.push(construct_symbol('value','#tuple-definition'));static_symbols=static_symbols;}}>add key</div>
			{#if symbol.symbols.length > 1}
				<div class="button" title="Remove key." on:click={() => {static_symbols.pop();static_symbols=static_symbols;}}>Remove key</div>
			{/if}
		{/if}
		<!-- tuple values / functions have add / remove buttons too -->
		{#if reference.type === 'function' && reference.name === 'tuple'}
			<div class="button" title="Add value." on:click={() => {static_symbols.push(construct_symbol('value','#tuple-value'));static_symbols=static_symbols;}}>add value</div>
			{#if symbol.symbols.length > 1}
				<div class="button" title="Remove value." on:click={() => {static_symbols.pop();static_symbols=static_symbols;}}>Remove value</div>
			{/if}
		{/if}
		<!-- we can probably roll the last three if-blocks into one and use some variables -->
		{#if !symbol.type || symbol.type[0] !== '#'}
		<!--div class="delete" title="Remove this symbol" on:click={() => dispatch('delete',symbol)}>&times;</div-->
		{/if}
	{/if}
</div>
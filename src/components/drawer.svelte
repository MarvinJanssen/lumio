<script>
	import {slide} from 'svelte/transition';

	import Symbol from './symbol.svelte';
	import DeleteZone from './deletezone.svelte';
	import SortableSymbolsList from './sortablesymbolslist.svelte';
	import FilterInput from './filterinput.svelte';
	import reference from '../reference';
	import {construct_symbol,uid} from '../utils';
	import {custom_functions,custom_varconsts} from '../stores';

	var slide_duration = 200;

	var categories = [
		//['Custom symbols',[],null,true],
		['Custom variables/constants',[],null,true],
		['Custom functions',[],null,true],
		//['Custom tokens',[],null,true],
		['Value',[],null,true],
		['Keywords',[],null,true],
		['Variables',[],/var|^let/,true],
		['Functions',[],/public|private|read-only/,true],
		['Responses',[],/^err|^ok/,true],
		['Arithmetic',[],/\+|^\-$|\*|^\/$|mod|pow/,true],
		['Comparison',[],/\<|\>/,true],
		['Logic',[],/and|or|not|^is-|if/,true],
		['Lists',[],/^map$|fold|filter|list/,true],
		['Maps',[],/map/,true],
		['STX',[],/stx/,true],
		['Non-fungible tokens',[],/nft|non-fungible/,true],
		['Fungible tokens',[],/^ft-|-fungible/,true],
		['Hashing',[],/hash|sha|keccak/,true],
		['Traits',[],/trait/,true],
		['Unwrapping',[],/unwrap/,true],
		['Other',[],null,true]
		];

	for (var name in reference.index)
		{
		if (name[0] === '#') // internal
			continue;
		var ref = reference.index[name];
		var ref_symbol = construct_symbol(ref.type,name);
		if (ref.type === 'value' || ref.type === 'keyword')
			{
			categories[2 + (ref.type === 'keyword')][1].push({id:uid('symbols'),ref:ref,symbol:ref_symbol});
			continue;
			}
		var found = false;
		for (var index in categories)
			{
			var [,list,pattern] = categories[index];
			if (pattern && pattern.test(name))
				found = !!list.push({id:uid('symbols'),ref:ref,symbol:ref_symbol});
			}
		if (!found)
			categories[categories.length-1][1].push({id:uid('symbols'),ref:ref,symbol:ref_symbol}); // push to last in the list ('Other')
		}

	custom_varconsts.subscribe(list => categories[0][1] = list);
	custom_functions.subscribe(list => categories[1][1] = list);

	var filter = '';
	
	var filtered_categories;
	$: filtered_categories = !filter
		? categories
		: categories.map(category => 
			{
			return [category[0],category[1].filter(entry => entry.ref.name.indexOf(filter) !== -1 || (entry.ref.name_hint && entry.ref.name_hint.indexOf(filter) !== -1))];
			});

	var hide_section = {};
</script>
<div class="drawer">
	<div class="filter">
		<FilterInput bind:value={filter} placeholder="Search" />
	</div>
	<DeleteZone classname="delete_zone" />
	<div class="entries">
		{#each filtered_categories as [category,entries], index}
			{#if entries.length}
				<div class="category">
					<div class="heading{index <= 1 ? ' custom':''}"
						on:click={() => hide_section[index] = !hide_section[index]}
						transition:slide|local={{duration:slide_duration}}>
							<span>{@html hide_section[index] && !filter.length?'&#9205;':'&#9207;'}</span>{category}
					</div>
					{#if !hide_section[index] || filter.length}
					<div class="section s{index}" transition:slide={{duration:slide_duration}}>
						<SortableSymbolsList list={entries} options={{drawer:true}}>
							{#each entries as entry (entry.id)}
								<Symbol symbol={entry.symbol} drawer={true} id={entry.id} />
							{/each}
						</SortableSymbolsList>
					</div>
					{/if}
				</div>
			{/if}
		{/each}
	</div>
</div>
<script>
	/*
	Symbol type definition selector.
	*/

	export var value;
	export var static_symbols;

	import {construct_symbol} from '../utils';
	import r from '../reference';
	var types = r.types;

	function update()
		{
		switch (this.value)
			{
			case 'tuple':
				static_symbols = [construct_symbol('value','#tuple-definition')];
				break;
			case 'list':
				static_symbols = [construct_symbol('value','#length'),construct_symbol('value','#type-definition')];
				break;
			case 'response':
				static_symbols = [construct_symbol('value','#type-definition'),construct_symbol('value','#type-definition')];
				break;
			case 'optional':
				static_symbols = [construct_symbol('value','#type-definition')];
				break;
			case 'buff':
				static_symbols = [construct_symbol('value','#length')];
				break;
			default:
				static_symbols = [];
				break;
			}
		}
</script>
<select bind:value on:change={update}>
	<option default disabled></option>
	{#each types as type}
		<option>{type.name}</option>
	{/each}
</select>

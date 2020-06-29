<script>
	/*
	Symbol type definition selector.
	*/

	export var value;
	export var static_symbols;

	import {construct_symbol} from '../utils';
	import r from '../reference';
	var types = r.types;

	if (!static_symbols.length)
		static_symbols.push(construct_symbol('value','#type-definition'));
</script>
<input type="text" bind:value on:input />

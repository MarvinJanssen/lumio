import {writable} from 'svelte/store';

export var help = writable(null);

function object_list()
	{
	var {subscribe,set,update} = writable([]);

	return {
		subscribe,
		signal: function()
			{
			return update(a => a);
			},
		insert: function(symbol)
			{
			return update(list => {list.push(symbol);return list});
			},
		remove: function(symbol)
			{
			return update(list => list.filter(a => a !== symbol));
			}
		};
	}

export var custom_functions = object_list();
export var custom_varconsts = object_list();

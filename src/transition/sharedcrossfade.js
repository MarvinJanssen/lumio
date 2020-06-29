import {slide,crossfade} from 'svelte/transition';

var [send,receive] = crossfade({
	duration: d => Math.sqrt(d * 200),
	fallback: function(node,parameters)
		{
		if (parameters.fallback)
			return parameters.fallback(node,parameters);
		return false;
		}
	});

export {send,receive};

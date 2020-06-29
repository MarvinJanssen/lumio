<script>
	/*
	Simple bound filter input with clear button	
	*/

	export var placeholder = '';
	export var value = '';
	import {fade} from 'svelte/transition';

	function keydown(event)
		{
		if (event.code === 'Escape' || event.key === 'Escape')
			value = '';
		}

	var input;
</script>
<style>
	div{
		position: relative;
	}
	div span{
		position: absolute;
		right: .6em;
		top: .55em;
		padding: .1em;
		border-radius: 99px;
		height: 1.2em;
		width: 1.2em;
		line-height: .75em;
		box-sizing: border-box;
		text-align: center;
		padding-top: .15em;
		padding-right: .15em;
		background-color: #ddd;
		user-select: none;
		cursor: pointer;
		transition: background-color .1s linear;
	}
	div span:hover{
		background-color: #eee;
	}
	input{
		padding-right: 2em;
	}
</style>
<div>
	<input bind:this={input} type="text" bind:value={value} on:input on:keydown={keydown} placeholder="{placeholder}" />
	{#if value.length}<span on:click={() => {value = '';input.focus()}} transition:fade={{duration:100}}>&times;</span>{/if}
</div>
<script>
	import {setContext} from 'svelte';
	import {slide,fade} from 'svelte/transition';
	import Drawer from './components/drawer.svelte';
	import Canvas from './components/canvas.svelte';
	import ClarityDisplay from './components/claritydisplay.svelte';
	import Toggle from './components/toggle.svelte';
	import SignInButton from './components/signinbutton.svelte';
	import {Document,Symbol,Value,Reference,Transpiler} from './lumio.js';
	import {escape_html} from './utils';
	import {help,analysis} from './stores';
	import reference from './reference';

	var show_bottom_bar = false;
	var help_symbol = null;
	var code_toggle;

	help.subscribe(detail =>
		{
		if (detail && detail.what === 'symbol' && reference.index[detail.for])
			{
			show_bottom_bar = !show_bottom_bar;
			if (help_symbol !== reference.index[detail.for])
				{
				help_symbol = reference.index[detail.for];
				show_bottom_bar = true;
				}
			}
		});

	var document = new Document('');

	var coming_soon = false;
</script>
<style>

</style>
{#if coming_soon}
	<div id="coming_soon" transition:fade>
		<div>
			<div class="logo">Lumio</div>
			<p>
				Building a reactive graphic IDE is a lot of work, especially in one week. Soon you will be able to log in to store and share your Clarity smart contracts!
			</p>
			<p>
				You can also follow me on <a href="//twitter.com/MarvinJanssen">Twitter</a> for updates.
			</p>
			<p class="small">
				(Trash icon by Freepik from flaticon.com)
			</p>
			<button on:click={() => coming_soon = false}>Close this message</button>
		</div>
	</div>
{/if}
<div id="mainbar">
	<div id="logo">Lumio</div>
	<!--div>
		<input type="text" bind:value={document.name} placeholder="Document name">
	</div-->
	<div class="spacer">
		<div class="code_switcher">
			<span class="{!code_toggle}" on:click={() => code_toggle = false}>Lumio</span> <Toggle alt=3 bind:checked={code_toggle} /> <span class="{code_toggle}" on:click={() => code_toggle = true}>Clarity</span>
		</div>
	</div>
	<div>
		<SignInButton on:click={() => coming_soon = true} />
	</div>
</div>
<div id="main">
	<div class="left">
		<Drawer />
	</div>
	<div class="right">
		<div class="top">
			<Canvas bind:document={document} />
			{#if code_toggle}
				<ClarityDisplay bind:document={document} />
			{/if}
		</div>
		<div class="bottom">
			{#if (show_bottom_bar && help_symbol) || (code_toggle && $analysis)}
				<div id="bottombar" class="{code_toggle?'code':''}" transition:slide={{duration:200}}>
					{#if code_toggle}
						{@html $analysis}
					{:else}
						<div class="close" on:click={() => show_bottom_bar = false}>&times;</div>
						<div class="symbol_help">
							<div class="row">
								<div class="name">{help_symbol.name_hint || help_symbol.name}</div>
								{#if help_symbol.signature}
									<div class="syntax"><code>{help_symbol.signature}</code></div>
								{/if}
							</div>
							<div class="row">
								<div class="io">
									{#if help_symbol.type === 'function'}
										<div class="input"><code>{help_symbol.input_type || 'none'}</code></div>
									{/if}
									{#if help_symbol.type === 'function' || help_symbol.type === 'symbol'}
										<div class="output"><code>{help_symbol.output_type || 'none'}</code></div>
									{/if}
								</div>
								<div class="info">
									<div class="description">{@html escape_html(help_symbol.description).replace(/`(.+?)`/g,'<code>$1</code>').replace(/ _(.+?)_ /g,' <em>$1</em> ')}</div>
									{#if help_symbol.example}
										<div class="example"><pre><code>{help_symbol.example.trim()}</code></pre></div>
									{/if}
								</div>
							</div>
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</div>

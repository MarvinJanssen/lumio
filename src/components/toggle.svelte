<script>
	export var checked = false;
	export var alt = 0;
</script>

<style>
.switch{
	position: relative;
	display: inline-block;
	width: 3.6em;
	height: 2.1em;
	user-select: none;
}

.switch input{
	/*opacity: 0;
	width: 0;
	height: 0;*/
	display: none;
}

.slider{
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(255,255,255,.6);
	-webkit-transition: 0.4s;
	transition: 0.4s;
	border-radius: 999px;
}

.slider:before{
	position: absolute;
	content: "";
	height: 1.6em;
	width: 1.6em;
	left: .25em;
	bottom: .25em;
	background-color: #fff;
	-webkit-transition: 0.4s;
	transition: 0.4s;
	border-radius: 50%;
}

input:checked + .slider{
	background-color: var(--color-primary-0);
}

input:checked + .slider{
	box-shadow: 0 0 1px var(--color-primary-0);
}

input:checked + .slider.alt1{
	background-color: var(--color-secondary-1-0);
}

input:checked + .slider.alt1{
	box-shadow: 0 0 1px var(--color-secondary-1-0);
}

input:checked + .slider.alt2{
	background-color: var(--color-secondary-2-0);
}

input:checked + .slider.alt2{
	box-shadow: 0 0 1px var(--color-secondary-2-0);
}

input:checked + .slider.alt3{
	background-color: rgba(255,255,255,.6);
}

input:checked + .slider.alt3{
	box-shadow: inherit;
}

input:checked + .slider:before{
	-webkit-transform: translateX(1.5em);
	-ms-transform: translateX(1.5em);
	transform: translateX(1.5em);
}
</style>
<label class="switch">
	<input type="checkbox" bind:checked />
	<span class="slider{alt?' alt'+alt:''}" />
</label>
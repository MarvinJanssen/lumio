var wasm = null;
var not_found = false;

import Convert from 'ansi-to-html';
var convert = new Convert({
	fg: '#000',
	bg: '#fff',
	newline: true,
	escapeXML: false,
	stream: false
});

export async function load(uri)
	{
	if (wasm || not_found)
		return wasm;
	if (!uri)
		uri = '/build/clarity_repl.wasm';
	var bin = await fetch(uri);
	if (bin.status === 404)
		{
		not_found = true;
		throw new Error('Clarity REPL not found, analysis will be unavailable');
		}
	var repl_backend = await WebAssembly.instantiate(await bin.arrayBuffer());
	wasm = repl_backend.instance.exports;
	return wasm;
	}

var WASM_VECTOR_LEN = 0;
var cached_uint8_memory = null;

function get_uint8_memory()
	{
	if (cached_uint8_memory === null || cached_uint8_memory.buffer !== wasm.memory.buffer)
		cached_uint8_memory = new Uint8Array(wasm.memory.buffer);
	return cached_uint8_memory;
	}

let cached_int32_memory = null;
function get_int32_memory()
	{
	if (cached_int32_memory === null || cached_int32_memory.buffer !== wasm.memory.buffer)
		cached_int32_memory = new Int32Array(wasm.memory.buffer);
	return cached_int32_memory;
	}

var text_encoder = new TextEncoder('utf-8');

var encode_string = typeof text_encoder.encodeInto === 'function'
	? function(arg,view)
		{
		return text_encoder.encodeInto(arg,view);
		}
	: function(arg,view)
		{
		const buf = text_encoder.encode(arg);
		view.set(buf);
		return {
			read: arg.length,
			written: buf.length
			};
		};

var text_decoder = new TextDecoder('utf-8',{ignoreBOM: true,fatal: true});
text_decoder.decode();

function get_string(ptr,len)
	{
    return text_decoder.decode(get_uint8_memory().subarray(ptr,ptr + len));
	}

function string_to_wasm(arg,malloc,realloc)
	{
	if (realloc === undefined)
		{
		var buf = text_encoder.encode(arg);
		var ptr = malloc(buf.length);
		get_uint8_memory().subarray(ptr,ptr + buf.length).set(buf);
		WASM_VECTOR_LEN = buf.length;
		return ptr;
		}

	var len = arg.length;
	var ptr = malloc(len);

	var mem = get_uint8_memory();

	var offset = 0;

	for (; offset < len; ++offset)
		{
		var code = arg.charCodeAt(offset);
		if (code > 0x7F)
			break;
		mem[ptr + offset] = code;
		}

	if (offset !== len)
		{
		if (offset !== 0)
			arg = arg.slice(offset);
		ptr = realloc(ptr,len,len = offset + arg.length * 3);
		var view = get_uint8_memory().subarray(ptr + offset,ptr + len);
		var ret = encode_string(arg,view);
		offset += ret.written;
		}

	WASM_VECTOR_LEN = offset;
	return ptr;
	}

export function evaluate(snippet)
	{
	if (!wasm)
		return null;
	try
		{
	    var ptr0 = string_to_wasm(snippet,wasm.__wbindgen_malloc,wasm.__wbindgen_realloc);
	    var len0 = WASM_VECTOR_LEN;
	    wasm.handle_command(8,ptr0,len0);
	    var r0 = get_int32_memory()[8 / 4 + 0];
	    var r1 = get_int32_memory()[8 / 4 + 1];
	    return get_string(r0,r1);
		}
	finally
		{
	    wasm.__wbindgen_free(r0,r1);
		}
	return '';
	}

export function evaluate_ansi(snippet)
	{
	var result = evaluate(snippet);
	if (result === null)
		return '';
	return convert.toHtml(result);
	}
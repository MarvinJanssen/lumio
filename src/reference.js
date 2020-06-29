'use strict';

/**
 * This is a reference file that imports clarityRef and performs some operations on it.
 * @module reference
 */

// https://raw.githubusercontent.com/blockstack/docs.blockstack/master/_data/clarityRef.json

import clarity_ref from './clarityRef.json';

clarity_ref.index = {};

clarity_ref.values = [
	{
		name: 'int',
		name_hint: 'integer',
		description: 'A signed 128-bit integer (positive and negative values).',
		type: 'value',
		pattern: /^-?[0-9]{1,}$/
	},
	{
		name: 'uint',
		name_hint: 'unsigned integer',
		description: 'An unsigned 128-bit integer (only positive values).',
		type: 'value',
		pattern: /^\u[0-9]{1,}$/
	},
	{
		name: 'bool',
		name_hint: 'boolean',
		description: 'A boolean value (true or false).',
		type: 'value',
		pattern: /^true|false$/
	},
	{
		name: 'buff',
		name_hint: 'buffer (string)',
		description: 'A byte-buffer of a specific length.',
		type: 'value'
	},
	// {
	// 	name: 'tuple'
	// },
	// {
	// 	name: 'some'
	// },
	{
		name: 'principal',
		name_hint: 'principal',
		description: 'An object representing a principal (whether a contract principal or standard principal). The following formats are valid: `\'SP017AUV5YRM7HT3TSQXJF7FCCYXETAB276BQ6XY`, `\'SP017AUV5YRM7HT3TSQXJF7FCCYXETAB276BQ6XY.contract-name`, and `.contract-name`. When writing the short-hand `.contract-name`, Clarity will expand it to a fully-qualified contract identifier. The address will then be the same as the publishing address.',
		pattern: /^(?!$)(?:'(?:SP|SM)[A-Z0-9]{38})?(?:\.[a-zA-Z0-9\-\_]{1,})?$/, // 'SP017AUV5YRM7HT3TSQXJF7FCCYXETAB276BQ6XY or 'SP017AUV5YRM7HT3TSQXJF7FCCYXETAB276BQ6XY.abc or .abc
		type: 'value'
	},
	{
		name: '#reference-name',
		defines: 'variable',
		name_hint: 'variable',
		description: 'A name definition. Valid characters are `a-z`, `0-9` and `-`. Must not start with a number or dash.',
		pattern: /^[a-zA-Z][a-zA-Z0-9\-]{0,}$/,
		type: 'value'
	},
	{
		name: '#type-definition',
		name_hint: 'type',
		description: 'A type definition.',
		type: 'value'
	},
	{
		name: '#length',
		name_hint: 'length',
		description: 'A length definition.',
		pattern: /^[0-9]{1,}$/,
		type: 'value'
	},
	{
		name: '#method-signature',
		defines: 'function',
		name_hint: 'function',
		description: 'A function name. Valid characters are `a-z`, `0-9` and `-`. Must not start with a number or dash.',
		pattern: /^[a-zA-Z][a-zA-Z0-9\-]{0,}$/,
		type: 'value'
	},
	{
		name: '#tuple-definition',
		defines: 'variable',
		name_hint: 'key',
		description: 'A key name definition. Valid characters are `a-z`, `0-9` and `-`. Must not start with a number or dash.',
		pattern: /^[a-zA-Z][a-zA-Z0-9\-]{0,}$/,
		type: 'value'
	},
	{
		name: '#tuple-value',
		name_hint: 'key',
		description: 'A key name. Valid characters are `a-z`, `0-9` and `-`. Must not start with a number or dash.',
		pattern: /^[a-zA-Z][a-zA-Z0-9\-]{0,}$/,
		type: 'value'
	},
	{
		name: '#argument-definition',
		defines: 'variable',
		name_hint: 'argument',
		description: 'A function argument definition. Valid characters are `a-z`, `0-9` and `-`. Must not start with a number or dash.',
		pattern: /^[a-zA-Z][a-zA-Z0-9\-]{0,}$/,
		type: 'value'
	},
	{
		name: '#trait-reference',
		name_hint: 'trait identifier',
		description: 'A trait identifier. The following formats are valid: `\'SP017AUV5YRM7HT3TSQXJF7FCCYXETAB276BQ6XY.contract-name.trait-name`, and `.contract-name.trait-name`. When writing the short-hand `.contract-name.trait-name`, Clarity will expand it to a fully-qualified trait identifier. The address will then be the same as the publishing address.',
		pattern: /^(?:'(?:SP|SM)[A-Z0-9]{38})?(?:\.[a-zA-Z0-9\-\_]{1,}){2}$/, // 'SP017AUV5YRM7HT3TSQXJF7FCCYXETAB276BQ6XY or 'SP017AUV5YRM7HT3TSQXJF7FCCYXETAB276BQ6XY.abc or .abc
		type: 'value'
	},
];

clarity_ref.types = [
	{
	name: 'tuple',
	type: 'type'
	},
	{
	name: 'list',
	type: 'type'
	},
	{
	name: 'response',
	type: 'type'
	},
	{
	name: 'optional',
	type: 'type'
	},
	{
	name: 'buff',
	type: 'type'
	},
	{
	name: 'principal',
	type: 'type'
	},
	{
	name: 'bool',
	type: 'type'
	},
	{
	name: 'int',
	type: 'type'
	},
	{
	name: 'uint',
	type: 'type'
	}
];

for (var index in clarity_ref.values)
	clarity_ref.index[clarity_ref.values[index].name] = clarity_ref.values[index]; 

/* istanbul ignore else */
if (clarity_ref.functions)
	{
	for (var index in clarity_ref.functions)
		{
		var d = clarity_ref.functions[index];
		d.type = 'function';
		if (d.name.indexOf('(') !== -1)
			{
			d.name_hint = d.name;
			d.name = d.name.split('(')[0].trim();
			}
		if (d.name.substring(0,7) === 'define-' || d.name.substring(d.name.length-6) === '-trait')
			d.root = true;
		clarity_ref.index[d.name] = d;
		
		/* istanbul ignore next */
		if (d.input_type)
			{
			if (d.input_type.indexOf('|') !== -1)
				{
				d.input = d.input_type.split('|').map(a => {a = a.trim(); a = a.split(','); return a.map(b => b.trim())});
				d.max_input = d.input_type.indexOf('...') !== -1 ? Infinity : d.input[0].length;
				}
			else
				{
				d.input = d.input_type.split(',').map(a => a.trim());
				d.max_input = d.input_type.indexOf('...') !== -1 ? Infinity : d.input.length;
				}			
			}

		/* istanbul ignore else */
		if (d.signature)
			{
			var dynamic = d.signature.indexOf('...');
			d.input_hint = d.signature.substring(1,dynamic !== -1 ? dynamic : d.signature.length-1).split(' ');
			d.input_hint.shift();
			}
		}
	}

clarity_ref.index['define-constant'].placeholders = ['#reference-name'];
clarity_ref.index['define-data-var'].placeholders = ['#reference-name','#type-definition'];
clarity_ref.index['define-fungible-token'].placeholders = ['#reference-name'];
clarity_ref.index['define-map'].placeholders = ['#reference-name'];
clarity_ref.index['define-non-fungible-token'].placeholders = ['#reference-name','#type-definition'];
clarity_ref.index['define-private'].placeholders = ['#method-signature'];
clarity_ref.index['define-public'].placeholders = ['#method-signature'];
clarity_ref.index['define-read-only'].placeholders = ['#method-signature'];
clarity_ref.index['define-trait'].placeholders = ['#reference-name']; //FIXME-
clarity_ref.index['impl-trait'].placeholders = ['#trait-reference'];
clarity_ref.index['tuple'].placeholders = ['#tuple-value'];

/* istanbul ignore else */
if (clarity_ref.keywords)
	{
	for (var index in clarity_ref.keywords)
		{
		var d = clarity_ref.keywords[index];
		d.type = 'keyword';
		clarity_ref.index[d.name] = d;
		}
	}

var c = 0;
for (var i in clarity_ref.index)
	clarity_ref.index[i].id = c++;

export default clarity_ref;

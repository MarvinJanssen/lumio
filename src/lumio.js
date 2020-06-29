'use strict';

/** @module Lumio */

/**
 * A Lumio Document is an object representation of a Clarity document.
 * @constructor
 * @param {string} name    Document name ([name].clar)
 * @param {array|null} [symbols] Array of Symbols 
 */
export function Document(name,symbols)
	{
	this.name = name || '';
	this.symbols = [];
	if (typeof symbols === 'object' && symbols.constructor === Array)
		for (var index in symbols)
			this.add(symbols[index]);
	}

/**
 * Add a symbol to the document
 * @param {Symbol} symbol
 */
Document.prototype.add = function(symbol)
	{
	if (symbol instanceof Symbol)
		return this.symbols.push(symbol);
	throw new Error('symbol must be an instance of Symbol');
	};

/**
 * Insert a Symbol at the specified index
 * @param  {Number} index
 * @param  {Symbol} symbol
 * @throws {Error} If symbol is not a Symbol
 * @return {bool}
 */
Document.prototype.insert = function(index,symbol)
	{
	if (symbol instanceof Symbol)
		return this.symbols.splice(index,0,symbol);
	throw new Error('symbol must be an instance of Symbol');
	};

/**
 * Removes the specified Symbol or the Symbol at an index
 * @param  {Symbol|Number} symbol Symbol or index
 * @throws {Error} If the parameter is not a Symbol or number
 * @return {Symbol|false}        Returns the removed Symbol or false if it is not found
 */
Document.prototype.remove = function(symbol)
	{
	return this.replace(symbol);
	};

/**
 * Replaces one Symbol with another
 * @param  {Symbol|Number} symbol      Symbol or index
 * @param  {Symbol|Number} replacement Symbol or index
 * @throws {Error} If either parameter is not a Symbol nor number
 * @return {Symbol|false}             Returns the replaced Symbol or false if it is not found
 */
Document.prototype.replace = function(symbol,replacement)
	{
	if (replacement !== undefined && !(replacement instanceof Symbol))
		throw new Error('replacement must be an instance of Symbol');
	if (symbol instanceof Symbol)
		{
		var index = this.symbols.indexOf(symbol);
		if (index === -1)
			return false;
		return replacement ? this.symbols.splice(index,1,replacement)[0] || false : this.symbols.splice(index,1)[0] || false;
		}
	else if (typeof symbol === 'number')
		return replacement ? this.symbols.splice(symbol,1,replacement)[0] || false : this.symbols.splice(symbol,1)[0] || false;
	throw new Error('symbol must be an instance of Symbol or number');
	};

/**
 * Swaps two Symbols
 * @param  {Symbol|Number} symbol1 Symbol or index
 * @param  {Symbol|Number} symbol2 Symbol or index
 * @throws {Error} If either parameter is not a Symbol nor number
 * @return {bool}
 */
Document.prototype.swap = function(symbol1,symbol2)
	{
	if (!((typeof symbol1 === 'number' || symbol1 instanceof Symbol) && (typeof symbol2 === 'number' || symbol2 instanceof Symbol)))
		throw new Error('symbol1 and symbol2 need to be numbers or Symbols');
	var index1 = typeof symbol1 === 'number' ? symbol1 : this.symbols.indexOf(symbol1);
	var index2 = typeof symbol2 === 'number' ? symbol2 : this.symbols.indexOf(symbol2);
	if (index1 === -1 || index2 === -1 || !this.symbols[index1] || !this.symbols[index2])
		return false;
	var temp = this.symbols[index1];
	this.symbols[index1] = this.symbols[index2];
	this.symbols[index2] = temp;
	return true;
	};

// Document.prototype.to_object = function()
// 	{
// 	var object = {};
// 	object.name = this.name;
// 	object.symbols = this.symbols.map(symbol => symbol.stringify());
// 	};

Document.prototype.parse = function(json)
	{

	};

/**
 * A Symbol is a contained unit of a Lumio document. It can be a function, keyword, reference, or variable.
 * @constructor
 * @param {string} name    Name of the Symbol (function name, variable name)
 * @param {array|null} symbols Array of Symbols inside this Symbol
 */
export function Symbol(name,symbols)
	{
	if (!name)
		throw new Error('Symbol must have a name');
	this.name = name;
	this.symbols = [];
	if (typeof symbols === 'object' && symbols.constructor === Array)
		for (var index in symbols)
			this.add(symbols[index]);
	}

/**
 * Add a symbol to the document
 * @method
 * @param {Symbol} symbol
 */
Symbol.prototype.add = Document.prototype.add;

/*!*
 * Insert a Symbol at the specified index
 * @method
 * @param  {Number} index
 * @param  {Symbol} symbol
 * @throws {Error} If symbol is not a Symbol
 * @return {bool}
 */
Symbol.prototype.insert = Document.prototype.insert;

/**
 * Removes the specified Symbol or the Symbol at an index
 * @method
 * @param  {Symbol|Number} symbol Symbol or index
 * @throws {Error} If the parameter is not a Symbol or number
 * @return {Symbol|false}        Returns the removed Symbol or false if it is not found
 */
Symbol.prototype.remove = Document.prototype.remove;

/**
 * Replaces one Symbol with another
 * @method
 * @param  {Symbol|Number} symbol      Symbol or index
 * @param  {Symbol|Number} replacement Symbol or index
 * @throws {Error} If either parameter is not a Symbol nor number
 * @return {Symbol|false}             Returns the replaced Symbol or false if it is not found
 */
Symbol.prototype.replace = Document.prototype.replace;

/**
 * Swaps two Symbols
 * @method
 * @param  {Symbol|Number} symbol1 Symbol or index
 * @param  {Symbol|Number} symbol2 Symbol or index
 * @throws {Error} If either parameter is not a Symbol nor number
 * @return {bool}
 */
Symbol.prototype.swap = Document.prototype.swap;

/**
 * Duplicates a symbol
 * @param  {bool} deep Whether to duplicate its symbols too.
 * @return {Symbol}
 */
Symbol.prototype.duplicate = function(deep)
	{
	var symbols = deep && this.symbols.map(symbol => symbol.duplicate(deep));
	return new this.constructor(this.name,symbols);
	};

/**
 * A Symbol representing a static value.
 * @constructor
 * @extends {Symbol}
 * @param {string} type  A valid Clarity type (int, uint, ...)
 * @param {string} value
 * @throws {Error} If type is not set
 */
export function Value(type,value)
	{
	if (!type)
		throw new Error('Value requires a type');
	this.type = type;
	if (typeof value === 'undefined')
		{
		// default value
		if (type === 'uint' || type === 'int')
			value = type === 'uint' ? 'u0' : '0';
		else if (type === 'bool')
			value = false;
		else
			value = '';
		}
	this.value = value;
	this.symbols = [];
	}
Value.prototype = Object.create(Symbol.prototype); 
Value.prototype.constructor = Value;

/**
 * Duplicates a Value
 * @param  {bool} deep Whether to duplicate its actual value too.
 * @return {Value}
 */
Value.prototype.duplicate = function(deep)
	{
	return new this.constructor(this.type,deep ? this.value : undefined);
	};

/**
 * A Symbol representing a type.
 * @constructor
 * @extends {Symbol}
 * @param {string} type  A valid Clarity type (int, uint, ...)
 * @param {string} value
 * @throws {Error} If type is not set
 */
// future use
// export function Type(name,parameters)
// 	{
// 	if (!name)
// 		throw new Error('Type requires a name');
// 	this.name = name;
// 	this.parameters = parameters;
// 	}
// Type.prototype = Object.create(Symbol.prototype); 
// Type.prototype.constructor = Type;

/**
 * Duplicates a Type
 * @return {Type}
 */
// Type.prototype.duplicate = function()
// 	{
// 	return new this.constructor(this.name,this.parameters);
// 	};

/**
 * A Symbol representing a reference to a variable or function name.
 * @constructor
 * @extends {Symbol}
 * @param {string} type
 * @param {string} name
 * @param {bool} custom
 * @throws {Error} If the type is not 'function', 'variable', or 'keyword'
 */
export function Reference(type,name,custom)
	{
	if (type !== 'function' && type !== 'variable' && type !== 'keyword')
		throw new Error('type must be function, variable, or keyword');
	this.type = type;
	this.name = name;
	this.custom = custom;
	}
Reference.prototype = Object.create(Symbol.prototype);
Reference.prototype.constructor = Reference;

/**
 * Duplicates a Reference
 * @return {Reference}
 */
Reference.prototype.duplicate = function()
	{
	return new this.constructor(this.type,this.name,this.custom);
	};

/**
 * Lumio Document to Clarity code validator and transpiler.
 * @constructor
 * @param {Object} reference A Clarity reference object containing an index of all symbols
 */
export function Transpiler(reference)
	{
	if (!reference || !reference.index)
		throw new Error('Transpiler requires a Clarity reference object with index');
	this.reference = reference;
	}

/**
 * @constant
 */
Transpiler.VALIDATE_ERROR_NOT_A_DOCUMENT = 0;
/**
 * @constant
 */
Transpiler.VALIDATE_ERROR_UNKNOWN_SYMBOL = 1;
/**
 * @constant
 */
Transpiler.VALIDATE_ERROR_UNKNOWN_VALUE_TYPE = 2;
/**
 * @constant
 */
Transpiler.VALIDATE_ERROR_INVALID_VALUE = 3;
/**
 * @constant
 */
Transpiler.VALIDATE_ERROR_SYMBOL_CANNOT_CONTAIN_SYMBOLS = 4;

/**
 * Validates a Lumio Document object
 * @param  {Document} document
 * @return {Object} An object with a 'valid' property (true/false) and an optional 'problems' array.
 */
Transpiler.prototype.validate = function(document)
	{
	if (!(document instanceof Document))
		return {valid:false,problems:[{code:Transpiler.VALIDATE_ERROR_NOT_A_DOCUMENT,error:'Not a Document'}]};
	var problems = [];
	var path = [];
	var check = symbol =>
		{
		if (symbol instanceof Reference)
			{
			//TODO- check defined references
			}
		else if (symbol instanceof Value)
			{
			if (!this.reference.index[symbol.type])
				problems.push({symbol:symbol,code:Transpiler.VALIDATE_ERROR_UNKNOWN_VALUE_TYPE,error:'Unknown value type '+symbol.type,path:path.join('/')});
			else if (this.reference.index[symbol.type].pattern && !this.reference.index[symbol.type].pattern.test(symbol.value))
				problems.push({symbol:symbol,code:Transpiler.VALIDATE_ERROR_INVALID_VALUE,error:'Incorrect value of "'+symbol.value+'" for type '+symbol.type,path:path.join('/')});
			}
		else if (symbol instanceof Symbol)
			{
			path.push(symbol.name);
			if (!this.reference.index[symbol.name])
				problems.push({symbol:symbol,code:Transpiler.VALIDATE_ERROR_UNKNOWN_SYMBOL,error:'Unknown symbol',path:path.join('/')});
			else if (this.reference.index[symbol.name].type === 'keyword' && symbol.symbols.length)
				problems.push({symbol:symbol,code:Transpiler.VALIDATE_ERROR_SYMBOL_CANNOT_CONTAIN_SYMBOLS,error:'Symbol cannot contain symbols',path:path.join('/')});
			symbol.symbols.forEach(check);
			path.pop();
			}
		else
			problems.push({symbol:symbol,code:Transpiler.VALIDATE_ERROR_UNKNOWN_SYMBOL,error:'Unknown symbol',path:path.join('/')}); // not an symbol
		};
	document.symbols.forEach(check);
	return {valid:!problems.length,problems:problems};
	}

/**
 * Transpiles a Lumio Document to Clarity code
 * @param  {Document} document
 * @param  {Object|null} options  Options {minify: bool}
 * @return {string|bool}          A string containing Clarity code or a bool false if the Document is not valid
 */
Transpiler.prototype.transpile = function(document,options)
	{
	var result = this.validate(document);
	result.code = '';
	
	if (!result.valid)
		return result;

	var render = (symbols,indent_level) =>
		{
		var code = '';
		if (!indent_level)
			indent_level = 0;
		var indent = "\t".repeat(indent_level++);
		for (var index = 0 ; index < symbols.length ; ++index)
			{
			var symbol = symbols[index];
			if (symbol instanceof Value)
				{
				if (symbol.symbols.length || symbol.type === '#method-signature') // type definition
					code += ' ('+symbol.value;
				else if (symbol.type === 'buff')
					code += ' "' + symbol.value.replace(/"/g,'\\"') + '"';
				else if (symbol.type === 'uint')
					code += ' '+symbol.value; // code += ' u'+symbol.value;
				else
					code += ' '+(symbol.type === 'bool' ? (symbol.value ? 'true':'false') : symbol.value);
				if (symbol.symbols.length) // type definition
					code += render(symbol.symbols,0);
				if (symbol.symbols.length || symbol.type === '#method-signature')
					code += ')';
				}
			else if (symbol instanceof Symbol)
				{
				var type = symbol instanceof Reference ? symbol.type : this.reference.index[symbol.name].type;
				// if (!reference)
				// 	throw new Error('Unknown symbol '+symbol.name);
				// if (symbol instanceof Reference)
				// 	console.log(symbol);
				code += (type==='function'?"\n"+indent+'(':' ')+symbol.name;
				if (type==='function')
					code += render(symbol.symbols,indent_level) + ')';
				}
			}
		return code;
		};
	result.code = render(document.symbols).trim();
	if (options && options.minify)
		result.code = result.code.replace(/\n/g,'').replace(/[\t\s]+/g,' ');
	/* istanbul ignore next */
	if (!result.code)
		result.code = '';
	return result;
	};

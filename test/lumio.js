'use strict';

import {assert} from 'chai';

import lumio from '../src/lumio';
import reference from '../src/reference';

function it_behaves_like_expression_container(type)
	{
	var container;
	beforeEach(() => container = new type('+'));

	describe('#add',() =>
		{
		it('only accepts an Symbol',() =>
			{
			var expression = new lumio.Symbol('+');
			assert.doesNotThrow(() => container.add(expression));
			assert.equal(container.symbols[0],expression);
			assert.throws(() => container.add(0));
			assert.throws(() => container.add(a));
			assert.throws(() => container.add([]));
			assert.throws(() => container.add({}));
			assert.throws(() => container.add(false));
			assert.throws(() => container.add(null));
			assert.throws(() => container.add(undefined));
			});
		});

	describe('#insert',() =>
		{
		it('inserts an Symbol at a specified index',() =>
			{
			var expression1 = new lumio.Symbol('+');
			var expression2 = new lumio.Symbol('-');
			var expression3 = new lumio.Symbol('/');
			container.add(expression1);
			container.add(expression2);
			container.insert(1,expression3);
			assert.equal(container.symbols[1],expression3);
			assert.equal(container.symbols[2],expression2);
			});

		it('only accepts an Symbol',() =>
			{
			var expression = new lumio.Symbol('+');
			assert.doesNotThrow(() => container.insert(0,expression));
			assert.equal(container.symbols[0],expression);
			assert.throws(() => container.insert(0,0));
			assert.throws(() => container.insert(0,a));
			assert.throws(() => container.insert(0,[]));
			assert.throws(() => container.insert(0,{}));
			assert.throws(() => container.insert(0,false));
			assert.throws(() => container.insert(0,null));
			assert.throws(() => container.insert(0,undefined));
			});
		});

	describe('#remove',() =>
		{
		it('removes an Symbol and returns it',() =>
			{
			var expression = new lumio.Symbol('+');
			container.add(expression);
			assert.equal(container.remove(expression),expression);
			assert.isEmpty(container.symbols);
			});

		it('removes an Symbol by index and returns it',() =>
			{
			var expression = new lumio.Symbol('+');
			container.add(new lumio.Symbol('-'));
			container.add(expression);
			container.add(new lumio.Symbol('/'));
			assert.equal(container.remove(1),expression);
			assert.equal(container.symbols.length,2);
			});

		it('does not accept other types',() =>
			{
			assert.throws(() => container.remove({}));
			assert.throws(() => container.remove([]));
			assert.throws(() => container.remove('a'));
			assert.throws(() => container.remove(false));
			assert.throws(() => container.remove(null));
			assert.throws(() => container.remove(undefined));
			});
		});

	describe('#replace',() =>
		{
		it('replaces an Symbol with another and returns the replaced Symbol',() =>
			{
			var expression1 = new lumio.Symbol('+');
			var expression2 = new lumio.Symbol('-');
			container.add(expression1);
			assert.equal(container.replace(expression1,expression2),expression1);
			assert.equal(container.symbols[0],expression2);
			});

		it('replaces an Symbol by index and returns the replaced Symbol',() =>
			{
			var expression1 = new lumio.Symbol('+');
			var expression2 = new lumio.Symbol('-');
			container.add(new lumio.Symbol('/'));
			container.add(expression1);
			assert.equal(container.replace(1,expression2),expression1);
			assert.equal(container.symbols[1],expression2);
			});

		it('removes an Symbol and returns it if no replacement is given',() =>
			{
			var expression1 = new lumio.Symbol('+');
			container.add(expression1);
			assert.equal(container.replace(expression1),expression1);
			assert.isEmpty(container.symbols);
			});

		it('returns false if the Symbol or index is not found',() =>
			{
			var expression1 = new lumio.Symbol('+');
			var expression2 = new lumio.Symbol('-');
			container.add(expression1);
			assert.isFalse(container.replace(expression2));
			assert.isFalse(container.replace(999));
			});

		it('does not accept other types',() =>
			{
			assert.throws(() => container.replace({}));
			assert.throws(() => container.replace([]));
			assert.throws(() => container.replace('a'));
			assert.throws(() => container.replace(false));
			assert.throws(() => container.replace(null));
			assert.throws(() => container.replace(undefined));
			assert.throws(() => container.replace(0,{}));
			assert.throws(() => container.replace(0,[]));
			assert.throws(() => container.replace(0,'a'));
			assert.throws(() => container.replace(0,false));
			assert.throws(() => container.replace(0,null));
			});
		});

	describe('#swap',() =>
		{
		it('swaps two Symbols',() =>
			{
			var expression1 = new lumio.Symbol('+');
			var expression2 = new lumio.Symbol('-');
			container.add(expression1);
			container.add(new lumio.Symbol('/'));
			container.add(expression2);
			assert.isTrue(container.swap(expression1,expression2));
			assert.equal(container.symbols[0],expression2);
			assert.equal(container.symbols[2],expression1);
			});

		it('swaps two Symbols by indexes',() =>
			{
			var expression1 = new lumio.Symbol('+');
			var expression2 = new lumio.Symbol('-');
			container.add(expression1);
			container.add(new lumio.Symbol('/'));
			container.add(expression2);
			assert.isTrue(container.swap(expression1,expression2));
			assert.equal(container.symbols[0],expression2);
			assert.equal(container.symbols[2],expression1);
			});

		it('swaps two Symbols with mixed number and Symbol inputs',() =>
			{
			var expression1 = new lumio.Symbol('+');
			var expression2 = new lumio.Symbol('-');
			container.add(expression1);
			container.add(new lumio.Symbol('/'));
			container.add(expression2);
			assert.isTrue(container.swap(expression1,2));
			assert.equal(container.symbols[0],expression2);
			assert.equal(container.symbols[2],expression1);
			assert.isTrue(container.swap(0,expression1));
			assert.equal(container.symbols[0],expression1);
			assert.equal(container.symbols[2],expression2);
			});

		it('returns false if either Symbol or index is not found',() =>
			{
			var expression1 = new lumio.Symbol('+');
			var expression2 = new lumio.Symbol('-');
			var expression3 = new lumio.Symbol('/');
			container.add(expression1);
			container.add(expression2);
			assert.isFalse(container.swap(expression1,expression3));
			assert.isFalse(container.swap(expression3,expression1));
			assert.isFalse(container.swap(expression1,999));
			assert.isFalse(container.swap(999,expression3));
			});

		it('does not accept other types',() =>
			{
			assert.throws(() => container.swap({}));
			assert.throws(() => container.swap([]));
			assert.throws(() => container.swap('a'));
			assert.throws(() => container.swap(false));
			assert.throws(() => container.swap(null));
			assert.throws(() => container.swap(undefined));
			});
		});

	describe('#duplicate',() =>
		{
		it('performs shallow duplication',() =>
			{
			var symbol = new lumio.Symbol('begin');
			symbol.add(new lumio.Symbol('begin'));
			var duplicate = symbol.duplicate(false);
			assert.notEqual(symbol,duplicate);
			assert.equal(symbol.name,duplicate.name);
			assert.isEmpty(duplicate.symbols);
			assert.isNotEmpty(symbol.symbols);
			});

		it('performs deep duplication',() =>
			{
			var symbol = new lumio.Symbol('begin');
			symbol.add(new lumio.Symbol('begin'));
			var duplicate = symbol.duplicate(true);
			assert.equal(symbol.name,duplicate.name);
			assert.isNotEmpty(duplicate.symbols);
			assert.isNotEmpty(symbol.symbols);
			assert.equal(symbol.symbols.length,duplicate.symbols.length);
			assert.notEqual(symbol.symbols[0],duplicate.symbols[0]);
			assert.equal(symbol.symbols[0].name,duplicate.symbols[0].name);
			});
		});
	}

describe('lumio',() =>
	{
	describe('Document',() =>
		{
		describe('#constructor',() =>
			{
			it('accepts a name',() =>
				{
				var document = new lumio.Document('abc');
				assert.equal(document.name,'abc');
				});

			it('accepts an optional symbol list array',() =>
				{
				assert.doesNotThrow(() => new lumio.Document('abc',[]));
				});

			it('optional symbol list can only contain Symbols',() =>
				{
				var expression = new lumio.Symbol('+');
				assert.doesNotThrow(() => new lumio.Document('abc',[expression]));
				assert.throws(() => new lumio.Document('abc',[0]));
				assert.throws(() => new lumio.Document('abc',['a']));
				assert.throws(() => new lumio.Document('abc',[false]));
				assert.throws(() => new lumio.Document('abc',[null]));
				assert.throws(() => new lumio.Document('abc',[undefined]));
				});
			});

		it_behaves_like_expression_container(lumio.Document);
		});

	describe('Symbol',() =>
		{
		describe('#constructor',() =>
			{
			it('requires a name',() =>
				{
				var document = new lumio.Symbol('abc');
				assert.equal(document.name,'abc');
				assert.throws(() => new lumio.Symbol());
				});

			it('accepts an optional symbol list array',() =>
				{
				assert.doesNotThrow(() => new lumio.Symbol('abc',[]));
				});

			it('optional symbol list can only contain Symbols',() =>
				{
				var expression = new lumio.Symbol('+');
				assert.doesNotThrow(() => new lumio.Symbol('abc',[expression]));
				assert.throws(() => new lumio.Symbol('abc',[0]));
				assert.throws(() => new lumio.Symbol('abc',['a']));
				assert.throws(() => new lumio.Symbol('abc',[false]));
				assert.throws(() => new lumio.Symbol('abc',[null]));
				assert.throws(() => new lumio.Symbol('abc',[undefined]));
				});
			});

		it_behaves_like_expression_container(lumio.Symbol);
		});

	describe('Value',() =>
		{
		describe('#constructor',() =>
			{
			it('requires a type',() =>
				{
				var value = new lumio.Symbol('bool');
				assert.equal(value.name,'bool');
				assert.throws(() => new lumio.Value());
				});

			it('accepts an optional value',() =>
				{
				assert.doesNotThrow(() => new lumio.Symbol('bool',true));
				});

			it('defaults to a proper value if no value is given',() =>
				{
				assert.equal((new lumio.Value('bool').value),false);
				assert.equal((new lumio.Value('int').value),'0');
				assert.equal((new lumio.Value('uint').value),'u0');
				assert.equal((new lumio.Value('buff').value),'');
				assert.equal((new lumio.Value('principal').value),'');
				});
			});

		describe('#duplicate',() =>
			{
			it('performs shallow duplication (default value)',() =>
				{
				var symbol = new lumio.Value('uint','42');
				var duplicate = symbol.duplicate(false);
				assert.notEqual(symbol,duplicate);
				assert.equal(symbol.name,duplicate.name);
				assert.notEqual(symbol.value,duplicate.value);
				});

			it('performs deep duplication (including value)',() =>
				{
				var symbol = new lumio.Value('uint','42');
				var duplicate = symbol.duplicate(true);
				assert.notEqual(symbol,duplicate);
				assert.equal(symbol.name,duplicate.name);
				assert.equal(symbol.value,duplicate.value);
				});
			});
		});

	describe('Reference',() =>
		{
		describe('#constructor',() =>
			{
			it('requires a valid type',() =>
				{
				assert.doesNotThrow(() => new lumio.Reference('function'));
				assert.doesNotThrow(() => new lumio.Reference('keyword'));
				assert.doesNotThrow(() => new lumio.Reference('variable'));
				assert.throws(() => new lumio.Reference('BOGUS'));
				});
			});

		describe('#duplicate',() =>
			{
			it('duplicates',() =>
				{
				var symbol = new lumio.Reference('function','begin');
				var duplicate = symbol.duplicate();
				assert.notEqual(symbol,duplicate);
				assert.equal(symbol.type,duplicate.type);
				assert.equal(symbol.name,duplicate.name);
				});
			});
		});

	describe('Transpiler',() =>
		{
		describe('#constructor',() =>
			{
			it('requires a Clarity reference file',() =>
				{
				assert.doesNotThrow(() => new lumio.Transpiler(reference));
				assert.throws(() => new lumio.Transpiler());
				});
			});

		describe('#validate',() =>
			{
			it('only accepts a Document',() =>
				{
				var transpiler = new lumio.Transpiler(reference);
				var document = new lumio.Document('a');
				assert.isTrue(transpiler.validate(document).valid);
				assert.isFalse(transpiler.validate(0).valid);
				assert.isFalse(transpiler.validate(false).valid);
				assert.isFalse(transpiler.validate(null).valid);
				assert.isFalse(transpiler.validate({}).valid);
				assert.isFalse(transpiler.validate([]).valid);
				});

			it('checks for invalid values and types',() =>
				{
				var transpiler = new lumio.Transpiler(reference);
				var document = new lumio.Document('a');
				document.add(new lumio.Value('uint','-1'));
				var result = transpiler.validate(document);
				assert.isFalse(result.valid);
				assert.isNotEmpty(result.problems);
				assert.equal(result.problems[0].code,lumio.Transpiler.VALIDATE_ERROR_INVALID_VALUE);
				document = new lumio.Document('a');
				document.add(new lumio.Value('x','a'));
				var result = transpiler.validate(document);
				assert.isFalse(result.valid);
				assert.isNotEmpty(result.problems);
				assert.equal(result.problems[0].code,lumio.Transpiler.VALIDATE_ERROR_UNKNOWN_VALUE_TYPE);
				});

			it('checks for invalid symbols',() =>
				{
				var transpiler = new lumio.Transpiler(reference);
				var document = new lumio.Document('a');
				document.add(new lumio.Symbol('BOGUS'));
				var result = transpiler.validate(document);
				assert.isFalse(result.valid);
				assert.isNotEmpty(result.problems);
				assert.equal(result.problems[0].code,lumio.Transpiler.VALIDATE_ERROR_UNKNOWN_SYMBOL);
				});

			it('checks that keywords do not contain expressions',() =>
				{
				var transpiler = new lumio.Transpiler(reference);
				var document = new lumio.Document('a');
				var expression = new lumio.Symbol('tx-sender');
				expression.add(new lumio.Symbol('+'));
				document.add(expression);
				var result = transpiler.validate(document);
				assert.isFalse(result.valid);
				assert.isNotEmpty(result.problems);
				assert.equal(result.problems[0].code,lumio.Transpiler.VALIDATE_ERROR_SYMBOL_CANNOT_CONTAIN_SYMBOLS);
				});

			it('checks that a Document does not somehow contain something that is not an Symbol',() =>
				{
				var transpiler = new lumio.Transpiler(reference);
				var document = new lumio.Document('a');
				document.symbols.push('bogus');
				var result = transpiler.validate(document);
				assert.isFalse(result.valid);
				assert.isNotEmpty(result.problems);
				assert.equal(result.problems[0].code,lumio.Transpiler.VALIDATE_ERROR_UNKNOWN_SYMBOL);
				});
			});

		describe('#transpile',() =>
			{
			it('transpiles a Document to Clarity code',() =>
				{
				var doc = new lumio.Document('test');

				var begin = new lumio.Symbol('begin');
				var plus = new lumio.Symbol('+');
				plus.add(new lumio.Value('uint','u4'));
				plus.add(new lumio.Value('uint','u8'));
				plus.add(new lumio.Value('uint','u15'));
				begin.add(plus);
				var minus = new lumio.Symbol('-');
				minus.add(new lumio.Value('int','-16'));
				minus.add(new lumio.Value('int','-23'));
				minus.add(new lumio.Value('int','42'));
				begin.add(minus);
				doc.add(begin);
				var ifc = new lumio.Symbol('if');
				ifc.add(new lumio.Symbol('>',
					[
					new lumio.Symbol('block-height'),
					new lumio.Value('uint','u1000')
					]));
				ifc.add(new lumio.Value('uint','u1'));
				ifc.add(new lumio.Value('uint','u2'));
				ifc.add(new lumio.Value('buff','bogus'));

				begin.add(ifc);

				var transpiler = new lumio.Transpiler(reference);
				var result = transpiler.transpile(doc,{minify:true});

				assert.equal('(begin (+ u4 u8 u15) (- -16 -23 42) (if (> block-height u1000) u1 u2 "bogus"))',result.code);
				});

			it('does not transpile invalid documents',() =>
				{
				var transpiler = new lumio.Transpiler(reference);
				var result = transpiler.transpile({});
				assert.isFalse(result.valid);
				assert.isEmpty(result.code);
				});
			});
		});
	});

'use strict';

import {assert} from 'chai';

import utils from '../src/utils';
import {Value,Reference,Symbol} from '../src/lumio';

describe('utils',() =>
	{
	describe('#escape_html',() =>
		{
		it('escapes HTML',() =>
			{
			assert.equal(utils.escape_html('&<>"\'abc'),'&amp;&lt;&gt;&quot;&#039;abc');
			});
		});

	describe('#symbol_reference',() =>
		{
		it('retrieves a symbol reference',() =>
			{
			assert.isObject(utils.symbol_reference('begin'));
			assert.isObject(utils.symbol_reference(new Symbol('begin')));
			assert.isFalse(utils.symbol_reference('BOGUS'));
			assert.isFalse(utils.symbol_reference(new Value('BOGUS')));
			});
		});

	describe('#construct_symbol',() =>
		{
		it('constructs a symbol of the specified type',() =>
			{
			var val = utils.construct_symbol('value','uint1','u1');
			var ref = utils.construct_symbol('keyword','tx-sender');
			var func = utils.construct_symbol('function','+');
			assert.instanceOf(val,Value);
			assert.instanceOf(ref,Reference);
			assert.instanceOf(func,Symbol);
			});

		it('returns false for an invalid function or keyword name',() =>
			{
			assert.isFalse(utils.construct_symbol('keyword','BOGUS'));
			assert.isFalse(utils.construct_symbol('function','BOGUS'));
			});
		});

	describe('#uid',() =>
		{
		it('generates a unique ID in a given namespace',() =>
			{
			assert.equal(utils.uid(),0);
			assert.equal(utils.uid(),1);
			assert.notEqual(utils.uid('bogus1'),utils.uid('bogus1'));
			assert.notEqual(utils.uid('bogus1'),utils.uid('bogus1'));
			assert.equal(utils.uid('bogus2'),utils.uid('bogus3'));
			assert.equal(utils.uid('bogus2'),utils.uid('bogus3'));
			});
		});
	});

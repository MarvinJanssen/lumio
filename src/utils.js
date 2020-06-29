'use strict';

import reference from './reference';

import {Symbol,Value,Reference} from './lumio';

/**
 * Escape HTML
 * @param  {string} html
 * @return {string}
 */
export function escape_html(html)
	{
	return html
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
	}

//* istanbul ignore next */
// export function swap_elements(element1,element2)
// 	{
// 	var parent1 = element1.parentNode;
// 	var parent2 = element2.parentNode
// 	var sibling = element2.nextSibling;
//     if(sibling === element1)
//     	sibling = sibling.nextSibling;
//     parent1.replaceChild(element2,element1);
//     if(sibling)
//     	parent2.insertBefore(element1,sibling);
//     else
//     	parent2.appendChild(element1);
// 	}
	
//* istanbul ignore next */
// export function mount_replace(Component,options)
// 	{
// 	var fragment = document.createDocumentFragment();
// 	var target = options.target;
// 	options.target = fragment;
// 	var component = new Component(options);
// 	target.parentNode.replaceChild(fragment,target);
// 	return {component:component,node:fragment};
// 	}

/**
 * Gets the symbol reference.
 * @param  {Symbol,string} symbol
 * @return {Object|false}
 */
export function symbol_reference(symbol)
	{
	if (symbol instanceof Value)
		return reference.index[symbol.type] || false;
	return reference.index[symbol instanceof Symbol ? symbol.name : symbol] || false;
	}

/**
 * Constructs a Symbol of the right type based on a type string
 * @param  {string} type   The type of Symbol to construct ('type','keyword','function')
 * @param  {string} param1 Passed as the first parameter, name for reference and function and type for value.
 * @param  {string} param2 Passed as the second parameter, symbol list for functions and value for Value.
 * @param  {string} param3 Passed as the third parameter, custom reference for Reference.
 * @return {Symbol|false}
 */
export function construct_symbol(type,param1,param2,param3)
	{
	if (type === 'value')
		return new Value(param1,param2);
	if (type === 'reference')
		return new Reference(param1,param2,param3);
	if (!reference.index[param1])
		return false;
	if (type === 'keyword')
		return new Reference('keyword',param1);
	return new Symbol(param1);
	}

var uids = {};

/**
 * Returns a unique ID in a given namespace.
 * @param  {string} [namespace]
 * @return {Number}
 */
export function uid(namespace)
	{
	if (!namespace)
		namespace = 'default';
	if (!uids[namespace])
		uids[namespace] = 0;
	return uids[namespace]++;
	}

/**
 * Generate a repeat object for use with Svelte's {#each} block
 * @param  {Number} n
 * @return {Object}
 */
// export function range(n)
// 	{
// 	return {length:n};
// 	}
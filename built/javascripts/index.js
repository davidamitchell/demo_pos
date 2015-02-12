(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./client_src/javascript/index.js":[function(require,module,exports){
document.addEventListener('DOMContentLoaded', function() {
  var basket = require ("../../modules/basket");

  var basket_el = document.getElementById('basket')
  basket_el.innerHTML = basket.html

  basket.bindEvents()

}, false);

},{"../../modules/basket":"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/modules/basket/index.js"}],"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/modules/basket/index.js":[function(require,module,exports){
//module.exports = require('./basket')

var basket = new function(){
  
  var products = require("../products")

  var add = "\n<input id=\"new_item\" placeholder=\"What did you buy?\" autofocus></input>\n";
  var list = "<ul id=\"basket_list\"><li class=\"basket_list_item hidden\">\n<div class=\"view\">\n  <label class=\"name\"></label>\n  <button class=\"destroy\"></button>\n</div>\n<input class=\"edit\" value=\"\"></input>\n</li></ul>\n";
  var full_basket = {
    token_identifier: "123",
    basket: {
      items: [],
      totals: []
    }
  }
  var total = 0.0

  var addLi = function(text) {
    var ul = document.getElementById("basket_list");
    var lis = document.getElementsByClassName("basket_list_item")
    var li = lis[0].cloneNode(true);
    li.classList.remove("hidden")
    var name_el = li.querySelector(".name")
    var price = products.keyedHash[text]
    name_el.innerHTML = text + '<span style="float:right;">$' + price + '</span>'

    var product_data = {
      code: text,
      name: text
    }
    var currency_amounts = [
    {
      currency_code: "NZD",
      amount:        price
    }
    ]
    var basket_item = {
      "quantity": 1,
      "currency_amounts": [currency_amounts],
      "product_data": product_data
    }
    full_basket.basket.items.push(basket_item)
    ul.appendChild(li)
    console.log(full_basket)
    total += parseFloat(price)

    var total_el = document.getElementById('total')
    total_el.value = total
  }

  this.html = add + list

  this.bindEvents = function(){
    var new_item_el = document.getElementById('new_item')

    var Typeahead = require('typeahead');

    // source is an array of items
    var ta = Typeahead(new_item_el, {
      source: products.list
    });

    new_item_el.onkeypress = function(){
      if (event.which == 13 || event.keyCode == 13) {
        console.log("enter pressed")
        addLi(new_item_el.value)
        new_item_el.value = ''
        return false;
      }
      return true;
    }
  }

}

module.exports = basket

},{"../products":"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/modules/products/index.js","typeahead":"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/typeahead.js"}],"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/modules/products/index.js":[function(require,module,exports){
module.exports.keyedHash = {
  "milk"       : "5.50",
  "cheese"     : "6.20",
  "beer"       : "13.80",
  "wine"       : "23.25",
  "bread"      : "4.00",
  "apples"     : "2.00",
  "eggs"       : "2.99",
  "butter"     : "3.87",
  "ham"        : "8.35",
  "fruit"      : "4.75",
  "bananas"    : "2.50",
  "mayonnaise" : "4.90",
  "cereal"     : "6.10",
  "coffee"     : "9.50",
  "pasta"      : "3.20",
  "chicken"    : "6.82",
  "popcorn"    : "5.00",
  "fish"       : "9.20",
  "sugar"      : "2.00",
  "vegetables" : "5.50"
}
module.exports.list = [
  "milk",
  "cheese",
  "beer",
  "wine",
  "bread",
  "apples",
  "eggs",
  "butter",
  "ham",
  "fruit",
  "bananas",
  "mayonnaise",
  "cereal",
  "coffee",
  "pasta",
  "chicken",
  "popcorn",
  "fish",
  "sugar",
  "vegetables"
]

},{}],"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/node_modules/dom/index.js":[function(require,module,exports){

var domify = require('./lib/domify');
var classes = require('./lib/classes');
var matches = require('./lib/matches');
var event = require('./lib/event');
var mutation = require('./lib/mutation');

/**
 * Expose `dom()`.
 */

exports = module.exports = dom;

/**
 * Return a dom `List` for the given
 * `html`, selector, or element.
 *
 * @param {String|Element|List}
 * @return {List}
 * @api public
 */

function dom(selector, context) {

  // user must specify a selector
  if (!selector) {
    throw new Error('no selector specified');
  }

  // array
  if (Array.isArray(selector)) {
    return new List(selector);
  }

  var ctx = context;

  // if no context, then use document
  if (!ctx) {
    ctx = document;
  }
  // if context is another list, use the first element
  else if (ctx instanceof List) {
    ctx = context[0];
  }

  // flatten out a nodelist into regular array
  if (selector instanceof NodeList) {
    var arr = [];
    for (var i=0; i<selector.length ; ++i) {
      arr.push(selector[i]);
    }
    return new List(arr, selector);
  }

  // List
  if (selector instanceof List) {
    return selector;
  }

  // node
  if (selector.nodeName) {
    return new List([selector]);
  }

  // if selector is a string, trim off leading and trailing whitespace
  if (typeof selector === 'string') {
    selector = selector.trim();
  }

  // html
  if ('<' == selector.charAt(0)) {
    return dom(domify(selector));
  }

  // selector
  if ('string' == typeof selector) {
    return dom(ctx.querySelectorAll(selector), selector);
  }
}

/**
 * Expose `List` constructor.
 */

exports.List = List;

/**
 * Initialize a new `List` with the
 * given array-ish of `els` and `selector`
 * string.
 *
 * @param {Mixed} els
 * @param {String} selector
 * @api private
 */

function List(els, selector) {
  Array.prototype.push.apply(this, els);
  this.selector = selector;
}

// for minifying
var proto = List.prototype;

/**
 * Set attribute `name` to `val`, or get attr `name`.
 *
 * @param {String} name
 * @param {String} [val]
 * @return {String|List} self
 * @api public
 */

proto.attr = function(name, val) {
  if (val === undefined) {
    return this[0].getAttribute(name);
  }

  this[0].setAttribute(name, val);
  return this;
};

proto.removeAttr = function(name) {
  this[0].removeAttribute(name);
  return this;
};

// set or get the data attribute for the first element in the list
proto.data = function(key, value) {
  return this.attr('data-' + key, value);
};

/**
 * Return a cloned `List` with all elements cloned.
 *
 * @return {List}
 * @api public
 */

proto.clone = function(){
  var arr = [];
  for (var i = 0, len = this.length; i < len; ++i) {
    arr.push(this[i].cloneNode(true));
  }
  return new List(arr);
};

/**
 * Return a `List` containing the element at `i`.
 *
 * @param {Number} i
 * @return {List}
 * @api public
 */

proto.at = function(i){
  return new List([this[i]], this.selector);
};

/**
 * Return a `List` containing the first element.
 *
 * @param {Number} i
 * @return {List}
 * @api public
 */

proto.first = function(){
  return new List([this[0]], this.selector);
};

/**
 * Return a `List` containing the last element.
 *
 * @param {Number} i
 * @return {List}
 * @api public
 */

proto.last = function(){
  return new List([this[this.length - 1]], this.selector);
};

/**
 * Return list length.
 *
 * @return {Number}
 * @api public
 */

proto.length = function() {
  return this.length;
};

/**
 * Return element text.
 *
 * @return {String}
 * @api public
 */

proto.text = function(val) {
  if (val) {
    this[0].textContent = val;
    return this;
  }

  // TODO: real impl
  var str = '';
  for (var i = 0; i < this.length; ++i) {
    str += this[i].textContent;
  }
  return str;
};

/**
 * Return element html.
 *
 * @return {String}
 * @api public
 */

proto.html = function(val){
  var el = this[0];

  if (val) {
    if (typeof(val) !== 'string') {
      throw new Error('.html() requires a string');
    }

    el.innerHTML = val;
    return this;
  }

  return el.innerHTML;
};

proto.hide = function() {
  this.forEach(function(item) {
    var save = item.style.display;
    if (save) {
      item.setAttribute('data-olddisplay', save);
    }
    item.style.display = 'none';
  });
  return this;
};

proto.show = function() {
  this.forEach(function(item) {
    var old = item.getAttribute('data-olddisplay');
    item.removeAttribute('data-olddisplay');

    // use default display for element
    if (!old || old === 'none') {
      old = '';
    }

    item.style.display = old;
  });
  return this;
};

/**
 * Bind to `event` and invoke `fn(e)`. When
 * a `selector` is given then events are delegated.
 *
 * @param {String} event
 * @param {String} [selector]
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {List}
 * @api public
 */

proto.on = function(name, selector, fn, capture) {
  if ('string' == typeof selector) {

    var el = this[0];
    var deleg = function(e) {
      var target = e.target;
      do {
        if (matches(target, selector)) {

          var Event = function(e) {
            for (var k in e) {
              this[k] = e[k];
            }
          };

          // craete a new 'event' object
          // so we can replace the 'currentTarget' field
          var new_ev = new Event(e);

          // replace the current target
          new_ev.currentTarget = target;

          return fn.call(target, new_ev);
        }
        target = target.parentElement;
      } while (target && target !== el);
    }

    // TODO(shtylman) synthesize this event
    if (name === 'mouseenter') {
      name = 'mouseover';
    }

    for (var i = 0; i < this.length; ++i) {
      fn._delegate = deleg;
      event.bind(this[i], name, deleg, capture);
    }
    return this;
  }

  //TODO(shtylman) why not just override the fn and bind that?

  capture = fn;
  fn = selector;

  for (var i = 0; i < this.length; ++i) {
    event.bind(this[i], name, fn, capture);
  }

  return this;
};

/**
 * Unbind to `event` and invoke `fn(e)`. When
 * a `selector` is given then delegated event
 * handlers are unbound.
 *
 * @param {String} event
 * @param {String} [selector]
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {List}
 * @api public
 */

proto.off = function(name, selector, fn, capture){
  if ('string' == typeof selector) {
    for (var i = 0; i < this.length; ++i) {
      // TODO: add selector support back
      delegate.unbind(this[i], name, fn._delegate, capture);
    }
    return this;
  }

  capture = fn;
  fn = selector;

  for (var i = 0; i < this.length; ++i) {
    event.unbind(this[i], name, fn, capture);
  }
  return this;
};

/**
 * Iterate elements and invoke `fn(list, i)`.
 *
 * @param {Function} fn
 * @return {List} self
 * @api public
 */

proto.each = function(fn) {
  for (var i = 0; i < this.length; ++i) {
    fn(new List([this[i]], this.selector), i);
  }
  return this;
};

/**
 * Iterate elements and invoke `fn(el, i)`.
 *
 * @param {Function} fn
 * @return {List} self
 * @api public
 */

proto.forEach = function(fn) {
  Array.prototype.forEach.call(this, fn);
  return this;
};

/**
 * Map elements invoking `fn(list, i)`.
 *
 * @param {Function} fn
 * @return {Array}
 * @api public
 */

proto.map = function(fn){
  return Array.prototype.map.call(this, fn);
};

proto.select = function() {
  for (var i=0; i<this.length ; ++i) {
    var el = this[i];
    el.select();
  };

  return this;
};

/**
 * Filter elements invoking `fn(list, i)`, returning
 * a new `List` of elements when a truthy value is returned.
 *
 * @param {Function} fn
 * @return {List}
 * @api public
 */

proto.filter = function(fn) {
  var els = Array.prototype.filter.call(this, function(el) {
    return fn(new List([el], this.selector));
  });
  return new List(els, this.selector);
};

proto.value = function(val) {
  var el = this[0];
  if (val) {
    el.value = val;
    return this
  }

  return el.value;
};

proto.offset = function() {
  var el = this[0];
  var curleft = 0;
  var curtop = 0;

  if (el.offsetParent) {
    do {
      curleft += el.offsetLeft;
      curtop += el.offsetTop;
    } while (el = el.offsetParent);
  }

  return {
    left: curleft,
    top: curtop
  }
};

proto.position = function() {
  var el = this[0];
  return {
    top: el.offsetTop,
    left: el.offsetLeft
  }
};

/// includes border
proto.outerHeight = function() {
  return this[0].offsetHeight;
};

/// no border, includes padding
proto.innerHeight = function() {
  return this[0].clientHeight;
};

/// no border, no padding
/// this is slower than the others because it must get computed style values
proto.contentHeight = function() {
  var style = window.getComputedStyle(this[0], null);
  var ptop = style.getPropertyValue('padding-top').replace('px', '') - 0;
  var pbot = style.getPropertyValue('padding-bottom').replace('px', '') - 0;

  return this.innerHeight() - ptop - pbot;
};

proto.scrollHeight = function() {
  return this[0].scrollHeight;
};

/// includes border
proto.outerWidth = function() {
  return this[0].offsetWidth;
};

/// no border, includes padding
proto.innerWidth = function() {
  return this[0].clientWidth;
};

/// no border, no padding
/// this is slower than the others because it must get computed style values
proto.contentWidth = function() {
  var style = window.getComputedStyle(this[0], null);
  var pleft = style.getPropertyValue('padding-left').replace('px', '') - 0;
  var pright = style.getPropertyValue('padding-right').replace('px', '') - 0;

  return this.innerWidth() - pleft - pright;
};

proto.scrollWidth = function() {
  return this[0].scrollWidth;
};

/**
 * Add the given class `name`.
 *
 * @param {String} name
 * @return {List} self
 * @api public
 */

proto.addClass = function(name){
  var el;
  for (var i = 0; i < this.length; ++i) {
    el = this[i];
    el._classes = el._classes || classes(el);
    el._classes.add(name);
  }
  return this;
};

/**
 * Remove the given class `name`.
 *
 * @param {String} name
 * @return {List} self
 * @api public
 */

proto.removeClass = function(name){
  var el;
  for (var i = 0; i < this.length; ++i) {
    el = this[i];
    el._classes = el._classes || classes(el);
    el._classes.remove(name);
  }
  return this;
};

/**
 * Toggle the given class `name`.
 *
 * @param {String} name
 * @return {List} self
 * @api public
 */

proto.toggleClass = function(name){
  var el;
  for (var i = 0; i < this.length; ++i) {
    el = this[i];
    el._classes = el._classes || classes(el);
    el._classes.toggle(name);
  }
  return this;
};

/**
 * Check if the given class `name` is present.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

proto.hasClass = function(name){
  var el;
  for (var i = 0; i < this.length; ++i) {
    el = this[i];
    el._classes = el._classes || classes(el);
    if (el._classes.has(name)) return true;
  }
  return false;
};

/**
 * Set CSS `prop` to `val` or get `prop` value.
 *
 * @param {String} prop
 * @param {Mixed} val
 * @return {List|String}
 * @api public
 */

proto.css = function(prop, val){
  if (prop instanceof Object) {
    for(var p in prop) {
      this.setStyle(p, prop[p]);
    }
  }

  if (2 == arguments.length) {
    return this.setStyle(prop, val);
  }

  return this.getStyle(prop);
};

/**
 * Set CSS `prop` to `val`.
 *
 * @param {String} prop
 * @param {Mixed} val
 * @return {List} self
 * @api private
 */

proto.setStyle = function(prop, val){
  for (var i = 0; i < this.length; ++i) {
    this[i].style[prop] = val;
  }
  return this;
};

/**
 * Get CSS `prop` value.
 *
 * @param {String} prop
 * @return {String}
 * @api private
 */

proto.getStyle = function(prop) {
  var el = this[0];
  if (el) return el.style[prop];
};

/**
 * Find children matching the given `selector`.
 *
 * @param {String} selector
 * @return {List}
 * @api public
 */

proto.find = function(selector) {
  return dom(selector, this);
};

proto.next = function() {
  var els = [];
  for (var i=0 ; i<this.length ; ++i) {
    var next = this[i].nextElementSibling;
    // if no more siblings then don't push
    if (next) {
      els.push(next);
    }
  }

  return new List(els);
};

proto.prev = function() {
  var els = [];
  for (var i=0 ; i<this.length ; ++i) {
    var next = this[i].previousElementSibling;
    // if no more siblings then don't push
    if (next) {
      els.push(next);
    }
  }
  return new List(els);
};

proto.emit = function(name, opt) {
  event.emit(this[0], name, opt);
  return this;
};

proto.parent = function() {
  var els = [];
  for (var i=0 ; i<this.length ; ++i) {
    els.push(this[i].parentNode);
  }

  return new List(els);
};

/// mutation

proto.prepend = function(what) {
  for (var i=0 ; i<this.length ; ++i) {
    mutation.prepend(this[i], dom(what));
  }
  return this;
};

proto.append = function(what) {
  for (var i=0 ; i<this.length ; ++i) {
    mutation.append(this[i], dom(what));
  }
  return this;
};

proto.before = function(what) {
  for (var i=0 ; i<this.length ; ++i) {
    mutation.before(this[i], dom(what));
  }
  return this;
};

proto.after = function(what) {
  for (var i=0 ; i<this.length ; ++i) {
    mutation.after(this[i], dom(what));
  }
  return this;
};

proto.remove = function() {
  for (var i=0 ; i<this.length ; ++i) {
    mutation.remove(this[i]);
  }
};

proto.replace = function(what) {
  for (var i=0 ; i<this.length ; ++i) {
    mutation.replace(this[i], dom(what));
  }
  return this;
};

// note, we don't do .find('*').remove() here for efficiency
proto.empty = function() {
  for (var i=0 ; i<this.length ; ++i) {
    mutation.empty(this[i]);
  }
  return this;
};


},{"./lib/classes":"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/node_modules/dom/lib/classes.js","./lib/domify":"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/node_modules/dom/lib/domify.js","./lib/event":"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/node_modules/dom/lib/event.js","./lib/matches":"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/node_modules/dom/lib/matches.js","./lib/mutation":"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/node_modules/dom/lib/mutation.js"}],"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/node_modules/dom/lib/classes.js":[function(require,module,exports){

// whitespace regex to avoid creating every time
var re = /\s+/;

/**
 * Wrap `el` in a `ClassList`.
 *
 * @param {Element} el
 * @return {ClassList}
 * @api public
 */

module.exports = function(el){
  return new ClassList(el);
};

/**
 * Initialize a new ClassList for `el`.
 *
 * @param {Element} el
 * @api private
 */

function ClassList(el) {
  this.el = el;
  this.list = el.classList;
}

/**
 * Add class `name` if not already present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.add = function(name){
  // classList
  if (this.list) {
    this.list.add(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = arr.indexOf(name);
  if (!~i) {
    arr.push(name);
  }
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Remove class `name` when present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.remove = function(name){
  // classList
  if (this.list) {
    this.list.remove(name);
    return this;
  }

  // fallback
  var arr = this.array();
  var i = arr.indexOf(name);
  if (~i) {
    arr.splice(i, 1);
  }
  this.el.className = arr.join(' ');
  return this;
};

/**
 * Toggle class `name`.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.toggle = function(name){
  // classList
  if (this.list) {
    this.list.toggle(name);
    return this;
  }

  // fallback
  if (this.has(name)) {
    return this.remove(name);
  }

  return this.add(name);
};

/**
 * Return an array of classes.
 *
 * @return {Array}
 * @api public
 */

ClassList.prototype.array = function(){
  var arr = this.el.className.split(re);
  if ('' === arr[0]) {
    arr.pop();
  }
  return arr;
};

/**
 * Check if class `name` is present.
 *
 * @param {String} name
 * @return {ClassList}
 * @api public
 */

ClassList.prototype.has = function(name){
  return this.list
    ? this.list.contains(name)
    : !! ~this.array().indexOf(name);
};

},{}],"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/node_modules/dom/lib/domify.js":[function(require,module,exports){

/**
 * Wrap map from jquery.
 */

var map = {
    option: [1, '<select multiple="multiple">', '</select>'],
    optgroup: [1, '<select multiple="multiple">', '</select>'],
    legend: [1, '<fieldset>', '</fieldset>'],
    thead: [1, '<table>', '</table>'],
    tbody: [1, '<table>', '</table>'],
    tfoot: [1, '<table>', '</table>'],
    colgroup: [1, '<table>', '</table>'],
    caption: [1, '<table>', '</table>'],
    tr: [2, '<table><tbody>', '</tbody></table>'],
    td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
    th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
    col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
    _default: [0, '', '']
};

/**
 * Convert the given `html` into DOM elements.
 * @return {Array} of html elements
 *
 * @api public
 */

module.exports = function(html){
    if (typeof html !== 'string') {
        throw new TypeError('String expected');
    }

    // tag name
    var m = /<([\w:]+)/.exec(html);
    if (!m) throw new Error('No elements were generated.');
    var tag = m[1];

    // body support
    if (tag == 'body') {
        var el = document.createElement('html');
        el.innerHTML = html;
        return [el.removeChild(el.lastChild)];
    }

    var elements = [];

    // wrap map
    var wrap = map[tag] || map._default;
    var depth = wrap[0];
    var prefix = wrap[1];
    var suffix = wrap[2];
    var el = document.createElement('div');
    el.innerHTML = prefix + html + suffix;

    // trim away wrapper elements
    while (depth--) {
        el = el.lastChild;
    };

    var els = [];

    var child = el.firstChild;
    do {
        els.push(child);
    } while (child = child.nextElementSibling);

    for (var i=0 ; i<els.length ; ++i) {
        el.removeChild(els[i]);
    }

    return els;
};

},{}],"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/node_modules/dom/lib/event.js":[function(require,module,exports){

/**
 * Bind `el` event `type` to `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
*/

exports.bind = function(el, type, fn, capture) {
    if (el.addEventListener) {
        el.addEventListener(type, fn, capture || false);
    } else {
        el.attachEvent('on' + type, fn);
    }

    return fn;
};

/**
 * Unbind `el` event `type`'s callback `fn`.
 *
 * @param {Element} el
 * @param {String} type
 * @param {Function} fn
 * @param {Boolean} capture
 * @return {Function}
 * @api public
*/

exports.unbind = function(el, type, fn, capture) {
    if (el.removeEventListener) {
        el.removeEventListener(type, fn, capture || false);
    } else {
        el.detachEvent('on' + type, fn);
    }
    return fn;
};

exports.emit = function(el, name, opts) {
    opts = opts || {};
    var type = typeOf(name);

    var ev = document.createEvent(type + 's');

    // initKeyEvent in firefox
    // initKeyboardEvent in chrome

    var init = typeof ev['init' + type] === 'function'
      ? 'init' + type : 'initEvent';

    var sig = initSignatures[init];
    var args = [];
    var used = {};

    opts.type = name;

    for (var i = 0; i < sig.length; ++i) {
        var key = sig[i];
        var val = opts[key];
        // if no user specified value, then use event default
        if (val === undefined) {
            val = ev[key];
        }
        args.push(val);
    }
    ev[init].apply(ev, args);

    // attach remaining unused options to the object
    for (var key in opts) {
        if (!used[key]) {
            ev[key] = opts[key];
        }
    }

    return el.dispatchEvent(ev);
};

var initSignatures = require('./init.json');
var types = require('./types.json');
var typeOf = (function () {
    var typs = {};
    for (var key in types) {
        var ts = types[key];
        for (var i = 0; i < ts.length; i++) {
            typs[ts[i]] = key;
        }
    }

    return function (name) {
        return typs[name] || 'Event';
    };
})();

},{"./init.json":"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/node_modules/dom/lib/init.json","./types.json":"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/node_modules/dom/lib/types.json"}],"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/node_modules/dom/lib/init.json":[function(require,module,exports){
module.exports={
  "initEvent" : [
    "type",
    "bubbles",
    "cancelable"
  ],
  "initUIEvent" : [
    "type",
    "bubbles",
    "cancelable",
    "view",
    "detail"
  ],
  "initMouseEvent" : [
    "type",
    "bubbles",
    "cancelable",
    "view",
    "detail",
    "screenX",
    "screenY",
    "clientX",
    "clientY",
    "ctrlKey",
    "altKey",
    "shiftKey",
    "metaKey",
    "button",
    "relatedTarget"
  ],
  "initMutationEvent" : [
    "type",
    "bubbles",
    "cancelable",
    "relatedNode",
    "prevValue",
    "newValue",
    "attrName",
    "attrChange"
  ],
  "initKeyEvent" : [
    "type",
    "bubbles",
    "cancelable",
    "view",
    "ctrlKey",
    "altKey",
    "shiftKey",
    "metaKey",
    "keyCode",
    "charCode"
  ]
}

},{}],"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/node_modules/dom/lib/matches.js":[function(require,module,exports){

var proto = Element.prototype;

var vendor = proto.matchesSelector
  || proto.webkitMatchesSelector
  || proto.mozMatchesSelector
  || proto.msMatchesSelector
  || proto.oMatchesSelector;

module.exports = function match(el, selector) {
    if (vendor) {
        return vendor.call(el, selector);
    }

    var nodes = el.parentNode.querySelectorAll(selector);
    for (var i = 0; i < nodes.length; ++i) {
        if (nodes[i] == el) {
            return true;
        }
    }

    return false;
};

},{}],"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/node_modules/dom/lib/mutation.js":[function(require,module,exports){

function mkfragment(elements) {
    var frag = document.createDocumentFragment();

    for (var i=0 ; i<elements.length ; ++i) {
        frag.appendChild(elements[i]);
    }

    return frag;
};

module.exports.remove = function(el) {
    if (!el.parentNode) {
        return;
    }
    return el.parentNode.removeChild(el);
};

module.exports.replace = function(el, what) {
    if (!el.parentNode) {
        return;
    }
    return el.parentNode.replaceChild(mkfragment(what), el);
};

module.exports.prepend = function(el, what) {
    return el.insertBefore(mkfragment(what), el.firstChild);
};

module.exports.append = function(el, what) {
    var frag = document.createDocumentFragment();
    return el.appendChild(mkfragment(what));
};

// returns newly inserted element
module.exports.after = function(el, what) {
    if (!el.parentNode) {
        return;
    }

    // ie9 doesn't like null for insertBefore
    if (!el.nextSilbling) {
        return el.parentNode.appendChild(mkfragment(what));
    }

    return el.parentNode.insertBefore(mkfragment(what), el.nextSilbling);
};

module.exports.before = function(el, what) {
    if (!el.parentNode) {
        return;
    }
    return el.parentNode.insertBefore(mkfragment(what), el);
};

module.exports.empty = function(parent) {
    // cheap way to remove all children
    parent.innerHTML = '';
};


},{}],"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/node_modules/dom/lib/types.json":[function(require,module,exports){
module.exports={
  "MouseEvent" : [
    "click",
    "mousedown",
    "mouseup",
    "mouseover",
    "mousemove",
    "mouseout"
  ],
  "KeyEvent" : [
    "keydown",
    "keyup",
    "keypress"
  ],
  "MutationEvent" : [
    "DOMSubtreeModified",
    "DOMNodeInserted",
    "DOMNodeRemoved",
    "DOMNodeRemovedFromDocument",
    "DOMNodeInsertedIntoDocument",
    "DOMAttrModified",
    "DOMCharacterDataModified"
  ],
  "HTMLEvent" : [
    "load",
    "unload",
    "abort",
    "error",
    "select",
    "change",
    "submit",
    "reset",
    "focus",
    "blur",
    "resize",
    "scroll"
  ],
  "UIEvent" : [
    "DOMFocusIn",
    "DOMFocusOut",
    "DOMActivate"
  ]
}

},{}],"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/node_modules/xtend/index.js":[function(require,module,exports){
module.exports = extend

function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i],
            keys = Object.keys(source)

        for (var j = 0; j < keys.length; j++) {
            var name = keys[j]
            target[name] = source[name]
        }
    }

    return target
}
},{}],"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/typeahead.js":[function(require,module,exports){
// vendor
var xtend = require('xtend');
var dom = require('dom');

var defaults = {
    source: [],
    items: 8,
    menu: '<ul class="typeahead hidden"></ul>',
    item: '<li><a href="#"></a></li>',
    minLength: 1,
    autoselect: true
}

var Typeahead = function (element, options) {
    if (!(this instanceof Typeahead)) {
        return new Typeahead(element, options);
    }

    var self = this;

    self.element = dom(element);
    self.options = xtend({}, defaults, options);
    self.matcher = self.options.matcher || self.matcher
    self.sorter = self.options.sorter || self.sorter
    self.highlighter = self.options.highlighter || self.highlighter
    self.updater = self.options.updater || self.updater
    self.menu = dom(self.options.menu);
    dom(document.body).append(self.menu);

    self.source = self.options.source;
    self.shown = false;
    self.listen();
}

// for minification
var proto = Typeahead.prototype;

proto.constructor = Typeahead;

// select the current item
proto.select = function() {
    var self = this;
    var val = self.menu.find('.active').attr('data-value');

    self.element
      .value(self.updater(val))
      .emit('change');

    return self.hide();
}

proto.updater = function (item) {
    return item;
}

// show the popup menu
proto.show = function () {
    var self = this;

    var offset = self.element.offset();
    var pos = xtend({}, offset, {
        height: self.element.outerHeight()
    })

    var scroll = 0
    var parent = self.element[0]
    while (parent = parent.parentElement) {
        scroll += parent.scrollTop
    }

    // if page has scrolled we need real position in viewport
    var top = pos.top + pos.height - scroll + 'px'
    var bottom = 'auto'
    var left = pos.left + 'px'

    if (self.options.position === 'above') {
        top = 'auto'
        bottom = document.body.clientHeight - pos.top + 3
    } else if (self.options.position === 'right') {
        top = parseInt(top.split('px')[0], 10) - self.element.outerHeight() + 'px'
        left = parseInt(left.split('px')[0], 10) + self.element.outerWidth() + 'px'
    }

    self.menu.css({
        top: top,
        bottom: bottom,
        left: left
    });

    self.menu.removeClass('hidden');
    self.shown = true;
    return self;
}

// hide the popup menu
proto.hide = function () {
    this.menu.addClass('hidden');
    this.shown = false;
    return this;
}

proto.lookup = function (event) {
    var self = this;

    self.query = self.element.value();

    if (!self.query || self.query.length < self.options.minLength) {
        return self.shown ? self.hide() : self
    }

    if (self.source instanceof Function) {
        self.source(self.query, self.process.bind(self));
    }
    else {
        self.process(self.source);
    }

    return self;
}

proto.process = function (items) {
    var self = this;

    items = items.filter(self.matcher.bind(self));
    items = self.sorter(items)

    if (!items.length) {
      return self.shown ? self.hide() : self
    }

    return self.render(items.slice(0, self.options.items)).show()
}

proto.matcher = function (item) {
  return ~item.toLowerCase().indexOf(this.query.toLowerCase())
}

proto.sorter = function (items) {
    var beginswith = [];
    var caseSensitive = [];
    var caseInsensitive = [];
    var item;

    while (item = items.shift()) {
      if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
      else if (~item.indexOf(this.query)) caseSensitive.push(item)
      else caseInsensitive.push(item)
    }

    return beginswith.concat(caseSensitive, caseInsensitive)
}

proto.highlighter = function (item) {
    var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
    return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
    })
}

proto.render = function (items) {
    var self = this;

    items = items.map(function (item) {
        var li = dom(self.options.item);
        li.attr('data-value', item)
          .find('a').html(self.highlighter(item));
        return li;
    })

    self.options.autoselect && items[0].addClass('active');

    self.menu.empty();
    items.forEach(function(item) {
        self.menu.append(item);
    });

    return this;
}

proto.next = function (event) {
    var active = this.menu.find('.active').removeClass('active');
    var next = active.next();

    if (!next.length) {
        next = this.menu.find('li').first();
    }

    next.addClass('active');
}

proto.prev = function (event) {
    var active = this.menu.find('.active').removeClass('active');
    var prev = active.prev();

    if (!prev.length) {
        prev = this.menu.find('li').last();
    }

    prev.addClass('active');
}

proto.listen = function () {
    var self = this;

    self.element
      .on('blur', self.blur.bind(self))
      .on('keypress', self.keypress.bind(self))
      .on('keyup', self.keyup.bind(self))
      .on('keydown', self.keydown.bind(self))

    self.menu
      .on('click', self.click.bind(self))
      .on('mouseenter', 'li', self.mouseenter.bind(self))
}

proto.move = function (e) {
    if (!this.shown) return

    switch(e.keyCode) {
    case 9: // tab
    case 13: // enter
    case 27: // escape
        e.preventDefault()
        break

    case 38: // up arrow
        e.preventDefault()
        this.prev()
        break

    case 40: // down arrow
        e.preventDefault()
        this.next()
        break
    }

    e.stopPropagation()
}

proto.keydown = function (e) {
    this.suppressKeyPressRepeat = [40,38,9,13,27].indexOf(e.keyCode) >= 0
    this.move(e)
}

proto.keypress = function (e) {
    if (this.suppressKeyPressRepeat) return
    this.move(e)
}

proto.keyup = function (e) {
    var self = this;

    switch(e.keyCode) {
    case 40: // down arrow
    case 38: // up arrow
            break

    case 9: // tab
    case 13: // enter
        if (!self.shown) return
        self.select()
        break

    case 27: // escape
        if (!self.shown) return
        self.hide()
        break

    default:
        self.lookup()
    }

    e.stopPropagation()
    e.preventDefault()
}

proto.blur = function (e) {
    var self = this;
    setTimeout(function () { self.hide() }, 150);
}

proto.click = function (e) {
    e.stopPropagation();
    e.preventDefault();
    this.select();
}

proto.mouseenter = function (e) {
    this.menu.find('.active').removeClass('active');
    dom(e.currentTarget).addClass('active');
}

module.exports = Typeahead;

},{"dom":"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/node_modules/dom/index.js","xtend":"/Users/davidm/Projects/github.com/LoyaltyNZ/demo_pos/node_modules/typeahead/node_modules/xtend/index.js"}]},{},["./client_src/javascript/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnRfc3JjL2phdmFzY3JpcHQvaW5kZXguanMiLCJtb2R1bGVzL2Jhc2tldC9pbmRleC5qcyIsIm1vZHVsZXMvcHJvZHVjdHMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvdHlwZWFoZWFkL25vZGVfbW9kdWxlcy9kb20vaW5kZXguanMiLCJub2RlX21vZHVsZXMvdHlwZWFoZWFkL25vZGVfbW9kdWxlcy9kb20vbGliL2NsYXNzZXMuanMiLCJub2RlX21vZHVsZXMvdHlwZWFoZWFkL25vZGVfbW9kdWxlcy9kb20vbGliL2RvbWlmeS5qcyIsIm5vZGVfbW9kdWxlcy90eXBlYWhlYWQvbm9kZV9tb2R1bGVzL2RvbS9saWIvZXZlbnQuanMiLCJub2RlX21vZHVsZXMvdHlwZWFoZWFkL25vZGVfbW9kdWxlcy9kb20vbGliL2luaXQuanNvbiIsIm5vZGVfbW9kdWxlcy90eXBlYWhlYWQvbm9kZV9tb2R1bGVzL2RvbS9saWIvbWF0Y2hlcy5qcyIsIm5vZGVfbW9kdWxlcy90eXBlYWhlYWQvbm9kZV9tb2R1bGVzL2RvbS9saWIvbXV0YXRpb24uanMiLCJub2RlX21vZHVsZXMvdHlwZWFoZWFkL25vZGVfbW9kdWxlcy9kb20vbGliL3R5cGVzLmpzb24iLCJub2RlX21vZHVsZXMvdHlwZWFoZWFkL25vZGVfbW9kdWxlcy94dGVuZC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy90eXBlYWhlYWQvdHlwZWFoZWFkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzd0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICB2YXIgYmFza2V0ID0gcmVxdWlyZSAoXCIuLi8uLi9tb2R1bGVzL2Jhc2tldFwiKTtcblxuICB2YXIgYmFza2V0X2VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2Jhc2tldCcpXG4gIGJhc2tldF9lbC5pbm5lckhUTUwgPSBiYXNrZXQuaHRtbFxuXG4gIGJhc2tldC5iaW5kRXZlbnRzKClcblxufSwgZmFsc2UpO1xuIiwiLy9tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vYmFza2V0JylcblxudmFyIGJhc2tldCA9IG5ldyBmdW5jdGlvbigpe1xuICBcbiAgdmFyIHByb2R1Y3RzID0gcmVxdWlyZShcIi4uL3Byb2R1Y3RzXCIpXG5cbiAgdmFyIGFkZCA9IFwiXFxuPGlucHV0IGlkPVxcXCJuZXdfaXRlbVxcXCIgcGxhY2Vob2xkZXI9XFxcIldoYXQgZGlkIHlvdSBidXk/XFxcIiBhdXRvZm9jdXM+PC9pbnB1dD5cXG5cIjtcbiAgdmFyIGxpc3QgPSBcIjx1bCBpZD1cXFwiYmFza2V0X2xpc3RcXFwiPjxsaSBjbGFzcz1cXFwiYmFza2V0X2xpc3RfaXRlbSBoaWRkZW5cXFwiPlxcbjxkaXYgY2xhc3M9XFxcInZpZXdcXFwiPlxcbiAgPGxhYmVsIGNsYXNzPVxcXCJuYW1lXFxcIj48L2xhYmVsPlxcbiAgPGJ1dHRvbiBjbGFzcz1cXFwiZGVzdHJveVxcXCI+PC9idXR0b24+XFxuPC9kaXY+XFxuPGlucHV0IGNsYXNzPVxcXCJlZGl0XFxcIiB2YWx1ZT1cXFwiXFxcIj48L2lucHV0PlxcbjwvbGk+PC91bD5cXG5cIjtcbiAgdmFyIGZ1bGxfYmFza2V0ID0ge1xuICAgIHRva2VuX2lkZW50aWZpZXI6IFwiMTIzXCIsXG4gICAgYmFza2V0OiB7XG4gICAgICBpdGVtczogW10sXG4gICAgICB0b3RhbHM6IFtdXG4gICAgfVxuICB9XG4gIHZhciB0b3RhbCA9IDAuMFxuXG4gIHZhciBhZGRMaSA9IGZ1bmN0aW9uKHRleHQpIHtcbiAgICB2YXIgdWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJhc2tldF9saXN0XCIpO1xuICAgIHZhciBsaXMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYmFza2V0X2xpc3RfaXRlbVwiKVxuICAgIHZhciBsaSA9IGxpc1swXS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgbGkuY2xhc3NMaXN0LnJlbW92ZShcImhpZGRlblwiKVxuICAgIHZhciBuYW1lX2VsID0gbGkucXVlcnlTZWxlY3RvcihcIi5uYW1lXCIpXG4gICAgdmFyIHByaWNlID0gcHJvZHVjdHMua2V5ZWRIYXNoW3RleHRdXG4gICAgbmFtZV9lbC5pbm5lckhUTUwgPSB0ZXh0ICsgJzxzcGFuIHN0eWxlPVwiZmxvYXQ6cmlnaHQ7XCI+JCcgKyBwcmljZSArICc8L3NwYW4+J1xuXG4gICAgdmFyIHByb2R1Y3RfZGF0YSA9IHtcbiAgICAgIGNvZGU6IHRleHQsXG4gICAgICBuYW1lOiB0ZXh0XG4gICAgfVxuICAgIHZhciBjdXJyZW5jeV9hbW91bnRzID0gW1xuICAgIHtcbiAgICAgIGN1cnJlbmN5X2NvZGU6IFwiTlpEXCIsXG4gICAgICBhbW91bnQ6ICAgICAgICBwcmljZVxuICAgIH1cbiAgICBdXG4gICAgdmFyIGJhc2tldF9pdGVtID0ge1xuICAgICAgXCJxdWFudGl0eVwiOiAxLFxuICAgICAgXCJjdXJyZW5jeV9hbW91bnRzXCI6IFtjdXJyZW5jeV9hbW91bnRzXSxcbiAgICAgIFwicHJvZHVjdF9kYXRhXCI6IHByb2R1Y3RfZGF0YVxuICAgIH1cbiAgICBmdWxsX2Jhc2tldC5iYXNrZXQuaXRlbXMucHVzaChiYXNrZXRfaXRlbSlcbiAgICB1bC5hcHBlbmRDaGlsZChsaSlcbiAgICBjb25zb2xlLmxvZyhmdWxsX2Jhc2tldClcbiAgICB0b3RhbCArPSBwYXJzZUZsb2F0KHByaWNlKVxuXG4gICAgdmFyIHRvdGFsX2VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3RvdGFsJylcbiAgICB0b3RhbF9lbC52YWx1ZSA9IHRvdGFsXG4gIH1cblxuICB0aGlzLmh0bWwgPSBhZGQgKyBsaXN0XG5cbiAgdGhpcy5iaW5kRXZlbnRzID0gZnVuY3Rpb24oKXtcbiAgICB2YXIgbmV3X2l0ZW1fZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbmV3X2l0ZW0nKVxuXG4gICAgdmFyIFR5cGVhaGVhZCA9IHJlcXVpcmUoJ3R5cGVhaGVhZCcpO1xuXG4gICAgLy8gc291cmNlIGlzIGFuIGFycmF5IG9mIGl0ZW1zXG4gICAgdmFyIHRhID0gVHlwZWFoZWFkKG5ld19pdGVtX2VsLCB7XG4gICAgICBzb3VyY2U6IHByb2R1Y3RzLmxpc3RcbiAgICB9KTtcblxuICAgIG5ld19pdGVtX2VsLm9ua2V5cHJlc3MgPSBmdW5jdGlvbigpe1xuICAgICAgaWYgKGV2ZW50LndoaWNoID09IDEzIHx8IGV2ZW50LmtleUNvZGUgPT0gMTMpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJlbnRlciBwcmVzc2VkXCIpXG4gICAgICAgIGFkZExpKG5ld19pdGVtX2VsLnZhbHVlKVxuICAgICAgICBuZXdfaXRlbV9lbC52YWx1ZSA9ICcnXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFza2V0XG4iLCJtb2R1bGUuZXhwb3J0cy5rZXllZEhhc2ggPSB7XG4gIFwibWlsa1wiICAgICAgIDogXCI1LjUwXCIsXG4gIFwiY2hlZXNlXCIgICAgIDogXCI2LjIwXCIsXG4gIFwiYmVlclwiICAgICAgIDogXCIxMy44MFwiLFxuICBcIndpbmVcIiAgICAgICA6IFwiMjMuMjVcIixcbiAgXCJicmVhZFwiICAgICAgOiBcIjQuMDBcIixcbiAgXCJhcHBsZXNcIiAgICAgOiBcIjIuMDBcIixcbiAgXCJlZ2dzXCIgICAgICAgOiBcIjIuOTlcIixcbiAgXCJidXR0ZXJcIiAgICAgOiBcIjMuODdcIixcbiAgXCJoYW1cIiAgICAgICAgOiBcIjguMzVcIixcbiAgXCJmcnVpdFwiICAgICAgOiBcIjQuNzVcIixcbiAgXCJiYW5hbmFzXCIgICAgOiBcIjIuNTBcIixcbiAgXCJtYXlvbm5haXNlXCIgOiBcIjQuOTBcIixcbiAgXCJjZXJlYWxcIiAgICAgOiBcIjYuMTBcIixcbiAgXCJjb2ZmZWVcIiAgICAgOiBcIjkuNTBcIixcbiAgXCJwYXN0YVwiICAgICAgOiBcIjMuMjBcIixcbiAgXCJjaGlja2VuXCIgICAgOiBcIjYuODJcIixcbiAgXCJwb3Bjb3JuXCIgICAgOiBcIjUuMDBcIixcbiAgXCJmaXNoXCIgICAgICAgOiBcIjkuMjBcIixcbiAgXCJzdWdhclwiICAgICAgOiBcIjIuMDBcIixcbiAgXCJ2ZWdldGFibGVzXCIgOiBcIjUuNTBcIlxufVxubW9kdWxlLmV4cG9ydHMubGlzdCA9IFtcbiAgXCJtaWxrXCIsXG4gIFwiY2hlZXNlXCIsXG4gIFwiYmVlclwiLFxuICBcIndpbmVcIixcbiAgXCJicmVhZFwiLFxuICBcImFwcGxlc1wiLFxuICBcImVnZ3NcIixcbiAgXCJidXR0ZXJcIixcbiAgXCJoYW1cIixcbiAgXCJmcnVpdFwiLFxuICBcImJhbmFuYXNcIixcbiAgXCJtYXlvbm5haXNlXCIsXG4gIFwiY2VyZWFsXCIsXG4gIFwiY29mZmVlXCIsXG4gIFwicGFzdGFcIixcbiAgXCJjaGlja2VuXCIsXG4gIFwicG9wY29yblwiLFxuICBcImZpc2hcIixcbiAgXCJzdWdhclwiLFxuICBcInZlZ2V0YWJsZXNcIlxuXVxuIiwiXG52YXIgZG9taWZ5ID0gcmVxdWlyZSgnLi9saWIvZG9taWZ5Jyk7XG52YXIgY2xhc3NlcyA9IHJlcXVpcmUoJy4vbGliL2NsYXNzZXMnKTtcbnZhciBtYXRjaGVzID0gcmVxdWlyZSgnLi9saWIvbWF0Y2hlcycpO1xudmFyIGV2ZW50ID0gcmVxdWlyZSgnLi9saWIvZXZlbnQnKTtcbnZhciBtdXRhdGlvbiA9IHJlcXVpcmUoJy4vbGliL211dGF0aW9uJyk7XG5cbi8qKlxuICogRXhwb3NlIGBkb20oKWAuXG4gKi9cblxuZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZG9tO1xuXG4vKipcbiAqIFJldHVybiBhIGRvbSBgTGlzdGAgZm9yIHRoZSBnaXZlblxuICogYGh0bWxgLCBzZWxlY3Rvciwgb3IgZWxlbWVudC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ3xFbGVtZW50fExpc3R9XG4gKiBAcmV0dXJuIHtMaXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBkb20oc2VsZWN0b3IsIGNvbnRleHQpIHtcblxuICAvLyB1c2VyIG11c3Qgc3BlY2lmeSBhIHNlbGVjdG9yXG4gIGlmICghc2VsZWN0b3IpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ25vIHNlbGVjdG9yIHNwZWNpZmllZCcpO1xuICB9XG5cbiAgLy8gYXJyYXlcbiAgaWYgKEFycmF5LmlzQXJyYXkoc2VsZWN0b3IpKSB7XG4gICAgcmV0dXJuIG5ldyBMaXN0KHNlbGVjdG9yKTtcbiAgfVxuXG4gIHZhciBjdHggPSBjb250ZXh0O1xuXG4gIC8vIGlmIG5vIGNvbnRleHQsIHRoZW4gdXNlIGRvY3VtZW50XG4gIGlmICghY3R4KSB7XG4gICAgY3R4ID0gZG9jdW1lbnQ7XG4gIH1cbiAgLy8gaWYgY29udGV4dCBpcyBhbm90aGVyIGxpc3QsIHVzZSB0aGUgZmlyc3QgZWxlbWVudFxuICBlbHNlIGlmIChjdHggaW5zdGFuY2VvZiBMaXN0KSB7XG4gICAgY3R4ID0gY29udGV4dFswXTtcbiAgfVxuXG4gIC8vIGZsYXR0ZW4gb3V0IGEgbm9kZWxpc3QgaW50byByZWd1bGFyIGFycmF5XG4gIGlmIChzZWxlY3RvciBpbnN0YW5jZW9mIE5vZGVMaXN0KSB7XG4gICAgdmFyIGFyciA9IFtdO1xuICAgIGZvciAodmFyIGk9MDsgaTxzZWxlY3Rvci5sZW5ndGggOyArK2kpIHtcbiAgICAgIGFyci5wdXNoKHNlbGVjdG9yW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBMaXN0KGFyciwgc2VsZWN0b3IpO1xuICB9XG5cbiAgLy8gTGlzdFxuICBpZiAoc2VsZWN0b3IgaW5zdGFuY2VvZiBMaXN0KSB7XG4gICAgcmV0dXJuIHNlbGVjdG9yO1xuICB9XG5cbiAgLy8gbm9kZVxuICBpZiAoc2VsZWN0b3Iubm9kZU5hbWUpIHtcbiAgICByZXR1cm4gbmV3IExpc3QoW3NlbGVjdG9yXSk7XG4gIH1cblxuICAvLyBpZiBzZWxlY3RvciBpcyBhIHN0cmluZywgdHJpbSBvZmYgbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZVxuICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSAnc3RyaW5nJykge1xuICAgIHNlbGVjdG9yID0gc2VsZWN0b3IudHJpbSgpO1xuICB9XG5cbiAgLy8gaHRtbFxuICBpZiAoJzwnID09IHNlbGVjdG9yLmNoYXJBdCgwKSkge1xuICAgIHJldHVybiBkb20oZG9taWZ5KHNlbGVjdG9yKSk7XG4gIH1cblxuICAvLyBzZWxlY3RvclxuICBpZiAoJ3N0cmluZycgPT0gdHlwZW9mIHNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIGRvbShjdHgucXVlcnlTZWxlY3RvckFsbChzZWxlY3RvciksIHNlbGVjdG9yKTtcbiAgfVxufVxuXG4vKipcbiAqIEV4cG9zZSBgTGlzdGAgY29uc3RydWN0b3IuXG4gKi9cblxuZXhwb3J0cy5MaXN0ID0gTGlzdDtcblxuLyoqXG4gKiBJbml0aWFsaXplIGEgbmV3IGBMaXN0YCB3aXRoIHRoZVxuICogZ2l2ZW4gYXJyYXktaXNoIG9mIGBlbHNgIGFuZCBgc2VsZWN0b3JgXG4gKiBzdHJpbmcuXG4gKlxuICogQHBhcmFtIHtNaXhlZH0gZWxzXG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIExpc3QoZWxzLCBzZWxlY3Rvcikge1xuICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseSh0aGlzLCBlbHMpO1xuICB0aGlzLnNlbGVjdG9yID0gc2VsZWN0b3I7XG59XG5cbi8vIGZvciBtaW5pZnlpbmdcbnZhciBwcm90byA9IExpc3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFNldCBhdHRyaWJ1dGUgYG5hbWVgIHRvIGB2YWxgLCBvciBnZXQgYXR0ciBgbmFtZWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEBwYXJhbSB7U3RyaW5nfSBbdmFsXVxuICogQHJldHVybiB7U3RyaW5nfExpc3R9IHNlbGZcbiAqIEBhcGkgcHVibGljXG4gKi9cblxucHJvdG8uYXR0ciA9IGZ1bmN0aW9uKG5hbWUsIHZhbCkge1xuICBpZiAodmFsID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gdGhpc1swXS5nZXRBdHRyaWJ1dGUobmFtZSk7XG4gIH1cblxuICB0aGlzWzBdLnNldEF0dHJpYnV0ZShuYW1lLCB2YWwpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbnByb3RvLnJlbW92ZUF0dHIgPSBmdW5jdGlvbihuYW1lKSB7XG4gIHRoaXNbMF0ucmVtb3ZlQXR0cmlidXRlKG5hbWUpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIHNldCBvciBnZXQgdGhlIGRhdGEgYXR0cmlidXRlIGZvciB0aGUgZmlyc3QgZWxlbWVudCBpbiB0aGUgbGlzdFxucHJvdG8uZGF0YSA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuYXR0cignZGF0YS0nICsga2V5LCB2YWx1ZSk7XG59O1xuXG4vKipcbiAqIFJldHVybiBhIGNsb25lZCBgTGlzdGAgd2l0aCBhbGwgZWxlbWVudHMgY2xvbmVkLlxuICpcbiAqIEByZXR1cm4ge0xpc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnByb3RvLmNsb25lID0gZnVuY3Rpb24oKXtcbiAgdmFyIGFyciA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgIGFyci5wdXNoKHRoaXNbaV0uY2xvbmVOb2RlKHRydWUpKTtcbiAgfVxuICByZXR1cm4gbmV3IExpc3QoYXJyKTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGEgYExpc3RgIGNvbnRhaW5pbmcgdGhlIGVsZW1lbnQgYXQgYGlgLlxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBpXG4gKiBAcmV0dXJuIHtMaXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5wcm90by5hdCA9IGZ1bmN0aW9uKGkpe1xuICByZXR1cm4gbmV3IExpc3QoW3RoaXNbaV1dLCB0aGlzLnNlbGVjdG9yKTtcbn07XG5cbi8qKlxuICogUmV0dXJuIGEgYExpc3RgIGNvbnRhaW5pbmcgdGhlIGZpcnN0IGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGlcbiAqIEByZXR1cm4ge0xpc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnByb3RvLmZpcnN0ID0gZnVuY3Rpb24oKXtcbiAgcmV0dXJuIG5ldyBMaXN0KFt0aGlzWzBdXSwgdGhpcy5zZWxlY3Rvcik7XG59O1xuXG4vKipcbiAqIFJldHVybiBhIGBMaXN0YCBjb250YWluaW5nIHRoZSBsYXN0IGVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IGlcbiAqIEByZXR1cm4ge0xpc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnByb3RvLmxhc3QgPSBmdW5jdGlvbigpe1xuICByZXR1cm4gbmV3IExpc3QoW3RoaXNbdGhpcy5sZW5ndGggLSAxXV0sIHRoaXMuc2VsZWN0b3IpO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gbGlzdCBsZW5ndGguXG4gKlxuICogQHJldHVybiB7TnVtYmVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5wcm90by5sZW5ndGggPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXMubGVuZ3RoO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gZWxlbWVudCB0ZXh0LlxuICpcbiAqIEByZXR1cm4ge1N0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucHJvdG8udGV4dCA9IGZ1bmN0aW9uKHZhbCkge1xuICBpZiAodmFsKSB7XG4gICAgdGhpc1swXS50ZXh0Q29udGVudCA9IHZhbDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIFRPRE86IHJlYWwgaW1wbFxuICB2YXIgc3RyID0gJyc7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7ICsraSkge1xuICAgIHN0ciArPSB0aGlzW2ldLnRleHRDb250ZW50O1xuICB9XG4gIHJldHVybiBzdHI7XG59O1xuXG4vKipcbiAqIFJldHVybiBlbGVtZW50IGh0bWwuXG4gKlxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5wcm90by5odG1sID0gZnVuY3Rpb24odmFsKXtcbiAgdmFyIGVsID0gdGhpc1swXTtcblxuICBpZiAodmFsKSB7XG4gICAgaWYgKHR5cGVvZih2YWwpICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCcuaHRtbCgpIHJlcXVpcmVzIGEgc3RyaW5nJyk7XG4gICAgfVxuXG4gICAgZWwuaW5uZXJIVE1MID0gdmFsO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmV0dXJuIGVsLmlubmVySFRNTDtcbn07XG5cbnByb3RvLmhpZGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgc2F2ZSA9IGl0ZW0uc3R5bGUuZGlzcGxheTtcbiAgICBpZiAoc2F2ZSkge1xuICAgICAgaXRlbS5zZXRBdHRyaWJ1dGUoJ2RhdGEtb2xkZGlzcGxheScsIHNhdmUpO1xuICAgIH1cbiAgICBpdGVtLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH0pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbnByb3RvLnNob3cgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgb2xkID0gaXRlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtb2xkZGlzcGxheScpO1xuICAgIGl0ZW0ucmVtb3ZlQXR0cmlidXRlKCdkYXRhLW9sZGRpc3BsYXknKTtcblxuICAgIC8vIHVzZSBkZWZhdWx0IGRpc3BsYXkgZm9yIGVsZW1lbnRcbiAgICBpZiAoIW9sZCB8fCBvbGQgPT09ICdub25lJykge1xuICAgICAgb2xkID0gJyc7XG4gICAgfVxuXG4gICAgaXRlbS5zdHlsZS5kaXNwbGF5ID0gb2xkO1xuICB9KTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEJpbmQgdG8gYGV2ZW50YCBhbmQgaW52b2tlIGBmbihlKWAuIFdoZW5cbiAqIGEgYHNlbGVjdG9yYCBpcyBnaXZlbiB0aGVuIGV2ZW50cyBhcmUgZGVsZWdhdGVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtTdHJpbmd9IFtzZWxlY3Rvcl1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNhcHR1cmVcbiAqIEByZXR1cm4ge0xpc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnByb3RvLm9uID0gZnVuY3Rpb24obmFtZSwgc2VsZWN0b3IsIGZuLCBjYXB0dXJlKSB7XG4gIGlmICgnc3RyaW5nJyA9PSB0eXBlb2Ygc2VsZWN0b3IpIHtcblxuICAgIHZhciBlbCA9IHRoaXNbMF07XG4gICAgdmFyIGRlbGVnID0gZnVuY3Rpb24oZSkge1xuICAgICAgdmFyIHRhcmdldCA9IGUudGFyZ2V0O1xuICAgICAgZG8ge1xuICAgICAgICBpZiAobWF0Y2hlcyh0YXJnZXQsIHNlbGVjdG9yKSkge1xuXG4gICAgICAgICAgdmFyIEV2ZW50ID0gZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgZm9yICh2YXIgayBpbiBlKSB7XG4gICAgICAgICAgICAgIHRoaXNba10gPSBlW2tdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICAvLyBjcmFldGUgYSBuZXcgJ2V2ZW50JyBvYmplY3RcbiAgICAgICAgICAvLyBzbyB3ZSBjYW4gcmVwbGFjZSB0aGUgJ2N1cnJlbnRUYXJnZXQnIGZpZWxkXG4gICAgICAgICAgdmFyIG5ld19ldiA9IG5ldyBFdmVudChlKTtcblxuICAgICAgICAgIC8vIHJlcGxhY2UgdGhlIGN1cnJlbnQgdGFyZ2V0XG4gICAgICAgICAgbmV3X2V2LmN1cnJlbnRUYXJnZXQgPSB0YXJnZXQ7XG5cbiAgICAgICAgICByZXR1cm4gZm4uY2FsbCh0YXJnZXQsIG5ld19ldik7XG4gICAgICAgIH1cbiAgICAgICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudEVsZW1lbnQ7XG4gICAgICB9IHdoaWxlICh0YXJnZXQgJiYgdGFyZ2V0ICE9PSBlbCk7XG4gICAgfVxuXG4gICAgLy8gVE9ETyhzaHR5bG1hbikgc3ludGhlc2l6ZSB0aGlzIGV2ZW50XG4gICAgaWYgKG5hbWUgPT09ICdtb3VzZWVudGVyJykge1xuICAgICAgbmFtZSA9ICdtb3VzZW92ZXInO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7ICsraSkge1xuICAgICAgZm4uX2RlbGVnYXRlID0gZGVsZWc7XG4gICAgICBldmVudC5iaW5kKHRoaXNbaV0sIG5hbWUsIGRlbGVnLCBjYXB0dXJlKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvL1RPRE8oc2h0eWxtYW4pIHdoeSBub3QganVzdCBvdmVycmlkZSB0aGUgZm4gYW5kIGJpbmQgdGhhdD9cblxuICBjYXB0dXJlID0gZm47XG4gIGZuID0gc2VsZWN0b3I7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgKytpKSB7XG4gICAgZXZlbnQuYmluZCh0aGlzW2ldLCBuYW1lLCBmbiwgY2FwdHVyZSk7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogVW5iaW5kIHRvIGBldmVudGAgYW5kIGludm9rZSBgZm4oZSlgLiBXaGVuXG4gKiBhIGBzZWxlY3RvcmAgaXMgZ2l2ZW4gdGhlbiBkZWxlZ2F0ZWQgZXZlbnRcbiAqIGhhbmRsZXJzIGFyZSB1bmJvdW5kLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtTdHJpbmd9IFtzZWxlY3Rvcl1cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNhcHR1cmVcbiAqIEByZXR1cm4ge0xpc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnByb3RvLm9mZiA9IGZ1bmN0aW9uKG5hbWUsIHNlbGVjdG9yLCBmbiwgY2FwdHVyZSl7XG4gIGlmICgnc3RyaW5nJyA9PSB0eXBlb2Ygc2VsZWN0b3IpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyArK2kpIHtcbiAgICAgIC8vIFRPRE86IGFkZCBzZWxlY3RvciBzdXBwb3J0IGJhY2tcbiAgICAgIGRlbGVnYXRlLnVuYmluZCh0aGlzW2ldLCBuYW1lLCBmbi5fZGVsZWdhdGUsIGNhcHR1cmUpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNhcHR1cmUgPSBmbjtcbiAgZm4gPSBzZWxlY3RvcjtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyArK2kpIHtcbiAgICBldmVudC51bmJpbmQodGhpc1tpXSwgbmFtZSwgZm4sIGNhcHR1cmUpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBJdGVyYXRlIGVsZW1lbnRzIGFuZCBpbnZva2UgYGZuKGxpc3QsIGkpYC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7TGlzdH0gc2VsZlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5wcm90by5lYWNoID0gZnVuY3Rpb24oZm4pIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgKytpKSB7XG4gICAgZm4obmV3IExpc3QoW3RoaXNbaV1dLCB0aGlzLnNlbGVjdG9yKSwgaSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEl0ZXJhdGUgZWxlbWVudHMgYW5kIGludm9rZSBgZm4oZWwsIGkpYC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7TGlzdH0gc2VsZlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5wcm90by5mb3JFYWNoID0gZnVuY3Rpb24oZm4pIHtcbiAgQXJyYXkucHJvdG90eXBlLmZvckVhY2guY2FsbCh0aGlzLCBmbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBNYXAgZWxlbWVudHMgaW52b2tpbmcgYGZuKGxpc3QsIGkpYC5cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnByb3RvLm1hcCA9IGZ1bmN0aW9uKGZuKXtcbiAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5tYXAuY2FsbCh0aGlzLCBmbik7XG59O1xuXG5wcm90by5zZWxlY3QgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaT0wOyBpPHRoaXMubGVuZ3RoIDsgKytpKSB7XG4gICAgdmFyIGVsID0gdGhpc1tpXTtcbiAgICBlbC5zZWxlY3QoKTtcbiAgfTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogRmlsdGVyIGVsZW1lbnRzIGludm9raW5nIGBmbihsaXN0LCBpKWAsIHJldHVybmluZ1xuICogYSBuZXcgYExpc3RgIG9mIGVsZW1lbnRzIHdoZW4gYSB0cnV0aHkgdmFsdWUgaXMgcmV0dXJuZWQuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0xpc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnByb3RvLmZpbHRlciA9IGZ1bmN0aW9uKGZuKSB7XG4gIHZhciBlbHMgPSBBcnJheS5wcm90b3R5cGUuZmlsdGVyLmNhbGwodGhpcywgZnVuY3Rpb24oZWwpIHtcbiAgICByZXR1cm4gZm4obmV3IExpc3QoW2VsXSwgdGhpcy5zZWxlY3RvcikpO1xuICB9KTtcbiAgcmV0dXJuIG5ldyBMaXN0KGVscywgdGhpcy5zZWxlY3Rvcik7XG59O1xuXG5wcm90by52YWx1ZSA9IGZ1bmN0aW9uKHZhbCkge1xuICB2YXIgZWwgPSB0aGlzWzBdO1xuICBpZiAodmFsKSB7XG4gICAgZWwudmFsdWUgPSB2YWw7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHJldHVybiBlbC52YWx1ZTtcbn07XG5cbnByb3RvLm9mZnNldCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZWwgPSB0aGlzWzBdO1xuICB2YXIgY3VybGVmdCA9IDA7XG4gIHZhciBjdXJ0b3AgPSAwO1xuXG4gIGlmIChlbC5vZmZzZXRQYXJlbnQpIHtcbiAgICBkbyB7XG4gICAgICBjdXJsZWZ0ICs9IGVsLm9mZnNldExlZnQ7XG4gICAgICBjdXJ0b3AgKz0gZWwub2Zmc2V0VG9wO1xuICAgIH0gd2hpbGUgKGVsID0gZWwub2Zmc2V0UGFyZW50KTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbGVmdDogY3VybGVmdCxcbiAgICB0b3A6IGN1cnRvcFxuICB9XG59O1xuXG5wcm90by5wb3NpdGlvbiA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZWwgPSB0aGlzWzBdO1xuICByZXR1cm4ge1xuICAgIHRvcDogZWwub2Zmc2V0VG9wLFxuICAgIGxlZnQ6IGVsLm9mZnNldExlZnRcbiAgfVxufTtcblxuLy8vIGluY2x1ZGVzIGJvcmRlclxucHJvdG8ub3V0ZXJIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXNbMF0ub2Zmc2V0SGVpZ2h0O1xufTtcblxuLy8vIG5vIGJvcmRlciwgaW5jbHVkZXMgcGFkZGluZ1xucHJvdG8uaW5uZXJIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXNbMF0uY2xpZW50SGVpZ2h0O1xufTtcblxuLy8vIG5vIGJvcmRlciwgbm8gcGFkZGluZ1xuLy8vIHRoaXMgaXMgc2xvd2VyIHRoYW4gdGhlIG90aGVycyBiZWNhdXNlIGl0IG11c3QgZ2V0IGNvbXB1dGVkIHN0eWxlIHZhbHVlc1xucHJvdG8uY29udGVudEhlaWdodCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzWzBdLCBudWxsKTtcbiAgdmFyIHB0b3AgPSBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLXRvcCcpLnJlcGxhY2UoJ3B4JywgJycpIC0gMDtcbiAgdmFyIHBib3QgPSBzdHlsZS5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLWJvdHRvbScpLnJlcGxhY2UoJ3B4JywgJycpIC0gMDtcblxuICByZXR1cm4gdGhpcy5pbm5lckhlaWdodCgpIC0gcHRvcCAtIHBib3Q7XG59O1xuXG5wcm90by5zY3JvbGxIZWlnaHQgPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXNbMF0uc2Nyb2xsSGVpZ2h0O1xufTtcblxuLy8vIGluY2x1ZGVzIGJvcmRlclxucHJvdG8ub3V0ZXJXaWR0aCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpc1swXS5vZmZzZXRXaWR0aDtcbn07XG5cbi8vLyBubyBib3JkZXIsIGluY2x1ZGVzIHBhZGRpbmdcbnByb3RvLmlubmVyV2lkdGggPSBmdW5jdGlvbigpIHtcbiAgcmV0dXJuIHRoaXNbMF0uY2xpZW50V2lkdGg7XG59O1xuXG4vLy8gbm8gYm9yZGVyLCBubyBwYWRkaW5nXG4vLy8gdGhpcyBpcyBzbG93ZXIgdGhhbiB0aGUgb3RoZXJzIGJlY2F1c2UgaXQgbXVzdCBnZXQgY29tcHV0ZWQgc3R5bGUgdmFsdWVzXG5wcm90by5jb250ZW50V2lkdGggPSBmdW5jdGlvbigpIHtcbiAgdmFyIHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpc1swXSwgbnVsbCk7XG4gIHZhciBwbGVmdCA9IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctbGVmdCcpLnJlcGxhY2UoJ3B4JywgJycpIC0gMDtcbiAgdmFyIHByaWdodCA9IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctcmlnaHQnKS5yZXBsYWNlKCdweCcsICcnKSAtIDA7XG5cbiAgcmV0dXJuIHRoaXMuaW5uZXJXaWR0aCgpIC0gcGxlZnQgLSBwcmlnaHQ7XG59O1xuXG5wcm90by5zY3JvbGxXaWR0aCA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpc1swXS5zY3JvbGxXaWR0aDtcbn07XG5cbi8qKlxuICogQWRkIHRoZSBnaXZlbiBjbGFzcyBgbmFtZWAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEByZXR1cm4ge0xpc3R9IHNlbGZcbiAqIEBhcGkgcHVibGljXG4gKi9cblxucHJvdG8uYWRkQ2xhc3MgPSBmdW5jdGlvbihuYW1lKXtcbiAgdmFyIGVsO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyArK2kpIHtcbiAgICBlbCA9IHRoaXNbaV07XG4gICAgZWwuX2NsYXNzZXMgPSBlbC5fY2xhc3NlcyB8fCBjbGFzc2VzKGVsKTtcbiAgICBlbC5fY2xhc3Nlcy5hZGQobmFtZSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSB0aGUgZ2l2ZW4gY2xhc3MgYG5hbWVgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtMaXN0fSBzZWxmXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbnByb3RvLnJlbW92ZUNsYXNzID0gZnVuY3Rpb24obmFtZSl7XG4gIHZhciBlbDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgKytpKSB7XG4gICAgZWwgPSB0aGlzW2ldO1xuICAgIGVsLl9jbGFzc2VzID0gZWwuX2NsYXNzZXMgfHwgY2xhc3NlcyhlbCk7XG4gICAgZWwuX2NsYXNzZXMucmVtb3ZlKG5hbWUpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBUb2dnbGUgdGhlIGdpdmVuIGNsYXNzIGBuYW1lYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7TGlzdH0gc2VsZlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5wcm90by50b2dnbGVDbGFzcyA9IGZ1bmN0aW9uKG5hbWUpe1xuICB2YXIgZWw7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7ICsraSkge1xuICAgIGVsID0gdGhpc1tpXTtcbiAgICBlbC5fY2xhc3NlcyA9IGVsLl9jbGFzc2VzIHx8IGNsYXNzZXMoZWwpO1xuICAgIGVsLl9jbGFzc2VzLnRvZ2dsZShuYW1lKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhlIGdpdmVuIGNsYXNzIGBuYW1lYCBpcyBwcmVzZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5wcm90by5oYXNDbGFzcyA9IGZ1bmN0aW9uKG5hbWUpe1xuICB2YXIgZWw7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7ICsraSkge1xuICAgIGVsID0gdGhpc1tpXTtcbiAgICBlbC5fY2xhc3NlcyA9IGVsLl9jbGFzc2VzIHx8IGNsYXNzZXMoZWwpO1xuICAgIGlmIChlbC5fY2xhc3Nlcy5oYXMobmFtZSkpIHJldHVybiB0cnVlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogU2V0IENTUyBgcHJvcGAgdG8gYHZhbGAgb3IgZ2V0IGBwcm9wYCB2YWx1ZS5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcFxuICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gKiBAcmV0dXJuIHtMaXN0fFN0cmluZ31cbiAqIEBhcGkgcHVibGljXG4gKi9cblxucHJvdG8uY3NzID0gZnVuY3Rpb24ocHJvcCwgdmFsKXtcbiAgaWYgKHByb3AgaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICBmb3IodmFyIHAgaW4gcHJvcCkge1xuICAgICAgdGhpcy5zZXRTdHlsZShwLCBwcm9wW3BdKTtcbiAgICB9XG4gIH1cblxuICBpZiAoMiA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2V0U3R5bGUocHJvcCwgdmFsKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLmdldFN0eWxlKHByb3ApO1xufTtcblxuLyoqXG4gKiBTZXQgQ1NTIGBwcm9wYCB0byBgdmFsYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcFxuICogQHBhcmFtIHtNaXhlZH0gdmFsXG4gKiBAcmV0dXJuIHtMaXN0fSBzZWxmXG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5wcm90by5zZXRTdHlsZSA9IGZ1bmN0aW9uKHByb3AsIHZhbCl7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7ICsraSkge1xuICAgIHRoaXNbaV0uc3R5bGVbcHJvcF0gPSB2YWw7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEdldCBDU1MgYHByb3BgIHZhbHVlLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wXG4gKiBAcmV0dXJuIHtTdHJpbmd9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5wcm90by5nZXRTdHlsZSA9IGZ1bmN0aW9uKHByb3ApIHtcbiAgdmFyIGVsID0gdGhpc1swXTtcbiAgaWYgKGVsKSByZXR1cm4gZWwuc3R5bGVbcHJvcF07XG59O1xuXG4vKipcbiAqIEZpbmQgY2hpbGRyZW4gbWF0Y2hpbmcgdGhlIGdpdmVuIGBzZWxlY3RvcmAuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG4gKiBAcmV0dXJuIHtMaXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5wcm90by5maW5kID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcbiAgcmV0dXJuIGRvbShzZWxlY3RvciwgdGhpcyk7XG59O1xuXG5wcm90by5uZXh0ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBlbHMgPSBbXTtcbiAgZm9yICh2YXIgaT0wIDsgaTx0aGlzLmxlbmd0aCA7ICsraSkge1xuICAgIHZhciBuZXh0ID0gdGhpc1tpXS5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgLy8gaWYgbm8gbW9yZSBzaWJsaW5ncyB0aGVuIGRvbid0IHB1c2hcbiAgICBpZiAobmV4dCkge1xuICAgICAgZWxzLnB1c2gobmV4dCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5ldyBMaXN0KGVscyk7XG59O1xuXG5wcm90by5wcmV2ID0gZnVuY3Rpb24oKSB7XG4gIHZhciBlbHMgPSBbXTtcbiAgZm9yICh2YXIgaT0wIDsgaTx0aGlzLmxlbmd0aCA7ICsraSkge1xuICAgIHZhciBuZXh0ID0gdGhpc1tpXS5wcmV2aW91c0VsZW1lbnRTaWJsaW5nO1xuICAgIC8vIGlmIG5vIG1vcmUgc2libGluZ3MgdGhlbiBkb24ndCBwdXNoXG4gICAgaWYgKG5leHQpIHtcbiAgICAgIGVscy5wdXNoKG5leHQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3IExpc3QoZWxzKTtcbn07XG5cbnByb3RvLmVtaXQgPSBmdW5jdGlvbihuYW1lLCBvcHQpIHtcbiAgZXZlbnQuZW1pdCh0aGlzWzBdLCBuYW1lLCBvcHQpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbnByb3RvLnBhcmVudCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZWxzID0gW107XG4gIGZvciAodmFyIGk9MCA7IGk8dGhpcy5sZW5ndGggOyArK2kpIHtcbiAgICBlbHMucHVzaCh0aGlzW2ldLnBhcmVudE5vZGUpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBMaXN0KGVscyk7XG59O1xuXG4vLy8gbXV0YXRpb25cblxucHJvdG8ucHJlcGVuZCA9IGZ1bmN0aW9uKHdoYXQpIHtcbiAgZm9yICh2YXIgaT0wIDsgaTx0aGlzLmxlbmd0aCA7ICsraSkge1xuICAgIG11dGF0aW9uLnByZXBlbmQodGhpc1tpXSwgZG9tKHdoYXQpKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbnByb3RvLmFwcGVuZCA9IGZ1bmN0aW9uKHdoYXQpIHtcbiAgZm9yICh2YXIgaT0wIDsgaTx0aGlzLmxlbmd0aCA7ICsraSkge1xuICAgIG11dGF0aW9uLmFwcGVuZCh0aGlzW2ldLCBkb20od2hhdCkpO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxucHJvdG8uYmVmb3JlID0gZnVuY3Rpb24od2hhdCkge1xuICBmb3IgKHZhciBpPTAgOyBpPHRoaXMubGVuZ3RoIDsgKytpKSB7XG4gICAgbXV0YXRpb24uYmVmb3JlKHRoaXNbaV0sIGRvbSh3aGF0KSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5wcm90by5hZnRlciA9IGZ1bmN0aW9uKHdoYXQpIHtcbiAgZm9yICh2YXIgaT0wIDsgaTx0aGlzLmxlbmd0aCA7ICsraSkge1xuICAgIG11dGF0aW9uLmFmdGVyKHRoaXNbaV0sIGRvbSh3aGF0KSk7XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5wcm90by5yZW1vdmUgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaT0wIDsgaTx0aGlzLmxlbmd0aCA7ICsraSkge1xuICAgIG11dGF0aW9uLnJlbW92ZSh0aGlzW2ldKTtcbiAgfVxufTtcblxucHJvdG8ucmVwbGFjZSA9IGZ1bmN0aW9uKHdoYXQpIHtcbiAgZm9yICh2YXIgaT0wIDsgaTx0aGlzLmxlbmd0aCA7ICsraSkge1xuICAgIG11dGF0aW9uLnJlcGxhY2UodGhpc1tpXSwgZG9tKHdoYXQpKTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIG5vdGUsIHdlIGRvbid0IGRvIC5maW5kKCcqJykucmVtb3ZlKCkgaGVyZSBmb3IgZWZmaWNpZW5jeVxucHJvdG8uZW1wdHkgPSBmdW5jdGlvbigpIHtcbiAgZm9yICh2YXIgaT0wIDsgaTx0aGlzLmxlbmd0aCA7ICsraSkge1xuICAgIG11dGF0aW9uLmVtcHR5KHRoaXNbaV0pO1xuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuIiwiXG4vLyB3aGl0ZXNwYWNlIHJlZ2V4IHRvIGF2b2lkIGNyZWF0aW5nIGV2ZXJ5IHRpbWVcbnZhciByZSA9IC9cXHMrLztcblxuLyoqXG4gKiBXcmFwIGBlbGAgaW4gYSBgQ2xhc3NMaXN0YC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcmV0dXJuIHtDbGFzc0xpc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZWwpe1xuICByZXR1cm4gbmV3IENsYXNzTGlzdChlbCk7XG59O1xuXG4vKipcbiAqIEluaXRpYWxpemUgYSBuZXcgQ2xhc3NMaXN0IGZvciBgZWxgLlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudH0gZWxcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5cbmZ1bmN0aW9uIENsYXNzTGlzdChlbCkge1xuICB0aGlzLmVsID0gZWw7XG4gIHRoaXMubGlzdCA9IGVsLmNsYXNzTGlzdDtcbn1cblxuLyoqXG4gKiBBZGQgY2xhc3MgYG5hbWVgIGlmIG5vdCBhbHJlYWR5IHByZXNlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEByZXR1cm4ge0NsYXNzTGlzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuQ2xhc3NMaXN0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbihuYW1lKXtcbiAgLy8gY2xhc3NMaXN0XG4gIGlmICh0aGlzLmxpc3QpIHtcbiAgICB0aGlzLmxpc3QuYWRkKG5hbWUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZmFsbGJhY2tcbiAgdmFyIGFyciA9IHRoaXMuYXJyYXkoKTtcbiAgdmFyIGkgPSBhcnIuaW5kZXhPZihuYW1lKTtcbiAgaWYgKCF+aSkge1xuICAgIGFyci5wdXNoKG5hbWUpO1xuICB9XG4gIHRoaXMuZWwuY2xhc3NOYW1lID0gYXJyLmpvaW4oJyAnKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIFJlbW92ZSBjbGFzcyBgbmFtZWAgd2hlbiBwcmVzZW50LlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lXG4gKiBAcmV0dXJuIHtDbGFzc0xpc3R9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkNsYXNzTGlzdC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24obmFtZSl7XG4gIC8vIGNsYXNzTGlzdFxuICBpZiAodGhpcy5saXN0KSB7XG4gICAgdGhpcy5saXN0LnJlbW92ZShuYW1lKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGZhbGxiYWNrXG4gIHZhciBhcnIgPSB0aGlzLmFycmF5KCk7XG4gIHZhciBpID0gYXJyLmluZGV4T2YobmFtZSk7XG4gIGlmICh+aSkge1xuICAgIGFyci5zcGxpY2UoaSwgMSk7XG4gIH1cbiAgdGhpcy5lbC5jbGFzc05hbWUgPSBhcnIuam9pbignICcpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogVG9nZ2xlIGNsYXNzIGBuYW1lYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHJldHVybiB7Q2xhc3NMaXN0fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5DbGFzc0xpc3QucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKG5hbWUpe1xuICAvLyBjbGFzc0xpc3RcbiAgaWYgKHRoaXMubGlzdCkge1xuICAgIHRoaXMubGlzdC50b2dnbGUobmFtZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBmYWxsYmFja1xuICBpZiAodGhpcy5oYXMobmFtZSkpIHtcbiAgICByZXR1cm4gdGhpcy5yZW1vdmUobmFtZSk7XG4gIH1cblxuICByZXR1cm4gdGhpcy5hZGQobmFtZSk7XG59O1xuXG4vKipcbiAqIFJldHVybiBhbiBhcnJheSBvZiBjbGFzc2VzLlxuICpcbiAqIEByZXR1cm4ge0FycmF5fVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5DbGFzc0xpc3QucHJvdG90eXBlLmFycmF5ID0gZnVuY3Rpb24oKXtcbiAgdmFyIGFyciA9IHRoaXMuZWwuY2xhc3NOYW1lLnNwbGl0KHJlKTtcbiAgaWYgKCcnID09PSBhcnJbMF0pIHtcbiAgICBhcnIucG9wKCk7XG4gIH1cbiAgcmV0dXJuIGFycjtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgY2xhc3MgYG5hbWVgIGlzIHByZXNlbnQuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWVcbiAqIEByZXR1cm4ge0NsYXNzTGlzdH1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuQ2xhc3NMaXN0LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbihuYW1lKXtcbiAgcmV0dXJuIHRoaXMubGlzdFxuICAgID8gdGhpcy5saXN0LmNvbnRhaW5zKG5hbWUpXG4gICAgOiAhISB+dGhpcy5hcnJheSgpLmluZGV4T2YobmFtZSk7XG59O1xuIiwiXG4vKipcbiAqIFdyYXAgbWFwIGZyb20ganF1ZXJ5LlxuICovXG5cbnZhciBtYXAgPSB7XG4gICAgb3B0aW9uOiBbMSwgJzxzZWxlY3QgbXVsdGlwbGU9XCJtdWx0aXBsZVwiPicsICc8L3NlbGVjdD4nXSxcbiAgICBvcHRncm91cDogWzEsICc8c2VsZWN0IG11bHRpcGxlPVwibXVsdGlwbGVcIj4nLCAnPC9zZWxlY3Q+J10sXG4gICAgbGVnZW5kOiBbMSwgJzxmaWVsZHNldD4nLCAnPC9maWVsZHNldD4nXSxcbiAgICB0aGVhZDogWzEsICc8dGFibGU+JywgJzwvdGFibGU+J10sXG4gICAgdGJvZHk6IFsxLCAnPHRhYmxlPicsICc8L3RhYmxlPiddLFxuICAgIHRmb290OiBbMSwgJzx0YWJsZT4nLCAnPC90YWJsZT4nXSxcbiAgICBjb2xncm91cDogWzEsICc8dGFibGU+JywgJzwvdGFibGU+J10sXG4gICAgY2FwdGlvbjogWzEsICc8dGFibGU+JywgJzwvdGFibGU+J10sXG4gICAgdHI6IFsyLCAnPHRhYmxlPjx0Ym9keT4nLCAnPC90Ym9keT48L3RhYmxlPiddLFxuICAgIHRkOiBbMywgJzx0YWJsZT48dGJvZHk+PHRyPicsICc8L3RyPjwvdGJvZHk+PC90YWJsZT4nXSxcbiAgICB0aDogWzMsICc8dGFibGU+PHRib2R5Pjx0cj4nLCAnPC90cj48L3Rib2R5PjwvdGFibGU+J10sXG4gICAgY29sOiBbMiwgJzx0YWJsZT48dGJvZHk+PC90Ym9keT48Y29sZ3JvdXA+JywgJzwvY29sZ3JvdXA+PC90YWJsZT4nXSxcbiAgICBfZGVmYXVsdDogWzAsICcnLCAnJ11cbn07XG5cbi8qKlxuICogQ29udmVydCB0aGUgZ2l2ZW4gYGh0bWxgIGludG8gRE9NIGVsZW1lbnRzLlxuICogQHJldHVybiB7QXJyYXl9IG9mIGh0bWwgZWxlbWVudHNcbiAqXG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaHRtbCl7XG4gICAgaWYgKHR5cGVvZiBodG1sICE9PSAnc3RyaW5nJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdTdHJpbmcgZXhwZWN0ZWQnKTtcbiAgICB9XG5cbiAgICAvLyB0YWcgbmFtZVxuICAgIHZhciBtID0gLzwoW1xcdzpdKykvLmV4ZWMoaHRtbCk7XG4gICAgaWYgKCFtKSB0aHJvdyBuZXcgRXJyb3IoJ05vIGVsZW1lbnRzIHdlcmUgZ2VuZXJhdGVkLicpO1xuICAgIHZhciB0YWcgPSBtWzFdO1xuXG4gICAgLy8gYm9keSBzdXBwb3J0XG4gICAgaWYgKHRhZyA9PSAnYm9keScpIHtcbiAgICAgICAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaHRtbCcpO1xuICAgICAgICBlbC5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICByZXR1cm4gW2VsLnJlbW92ZUNoaWxkKGVsLmxhc3RDaGlsZCldO1xuICAgIH1cblxuICAgIHZhciBlbGVtZW50cyA9IFtdO1xuXG4gICAgLy8gd3JhcCBtYXBcbiAgICB2YXIgd3JhcCA9IG1hcFt0YWddIHx8IG1hcC5fZGVmYXVsdDtcbiAgICB2YXIgZGVwdGggPSB3cmFwWzBdO1xuICAgIHZhciBwcmVmaXggPSB3cmFwWzFdO1xuICAgIHZhciBzdWZmaXggPSB3cmFwWzJdO1xuICAgIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGVsLmlubmVySFRNTCA9IHByZWZpeCArIGh0bWwgKyBzdWZmaXg7XG5cbiAgICAvLyB0cmltIGF3YXkgd3JhcHBlciBlbGVtZW50c1xuICAgIHdoaWxlIChkZXB0aC0tKSB7XG4gICAgICAgIGVsID0gZWwubGFzdENoaWxkO1xuICAgIH07XG5cbiAgICB2YXIgZWxzID0gW107XG5cbiAgICB2YXIgY2hpbGQgPSBlbC5maXJzdENoaWxkO1xuICAgIGRvIHtcbiAgICAgICAgZWxzLnB1c2goY2hpbGQpO1xuICAgIH0gd2hpbGUgKGNoaWxkID0gY2hpbGQubmV4dEVsZW1lbnRTaWJsaW5nKTtcblxuICAgIGZvciAodmFyIGk9MCA7IGk8ZWxzLmxlbmd0aCA7ICsraSkge1xuICAgICAgICBlbC5yZW1vdmVDaGlsZChlbHNbaV0pO1xuICAgIH1cblxuICAgIHJldHVybiBlbHM7XG59O1xuIiwiXG4vKipcbiAqIEJpbmQgYGVsYCBldmVudCBgdHlwZWAgdG8gYGZuYC5cbiAqXG4gKiBAcGFyYW0ge0VsZW1lbnR9IGVsXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gY2FwdHVyZVxuICogQHJldHVybiB7RnVuY3Rpb259XG4gKiBAYXBpIHB1YmxpY1xuKi9cblxuZXhwb3J0cy5iaW5kID0gZnVuY3Rpb24oZWwsIHR5cGUsIGZuLCBjYXB0dXJlKSB7XG4gICAgaWYgKGVsLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBmbiwgY2FwdHVyZSB8fCBmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWwuYXR0YWNoRXZlbnQoJ29uJyArIHR5cGUsIGZuKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm47XG59O1xuXG4vKipcbiAqIFVuYmluZCBgZWxgIGV2ZW50IGB0eXBlYCdzIGNhbGxiYWNrIGBmbmAuXG4gKlxuICogQHBhcmFtIHtFbGVtZW50fSBlbFxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNhcHR1cmVcbiAqIEByZXR1cm4ge0Z1bmN0aW9ufVxuICogQGFwaSBwdWJsaWNcbiovXG5cbmV4cG9ydHMudW5iaW5kID0gZnVuY3Rpb24oZWwsIHR5cGUsIGZuLCBjYXB0dXJlKSB7XG4gICAgaWYgKGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBmbiwgY2FwdHVyZSB8fCBmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZWwuZGV0YWNoRXZlbnQoJ29uJyArIHR5cGUsIGZuKTtcbiAgICB9XG4gICAgcmV0dXJuIGZuO1xufTtcblxuZXhwb3J0cy5lbWl0ID0gZnVuY3Rpb24oZWwsIG5hbWUsIG9wdHMpIHtcbiAgICBvcHRzID0gb3B0cyB8fCB7fTtcbiAgICB2YXIgdHlwZSA9IHR5cGVPZihuYW1lKTtcblxuICAgIHZhciBldiA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KHR5cGUgKyAncycpO1xuXG4gICAgLy8gaW5pdEtleUV2ZW50IGluIGZpcmVmb3hcbiAgICAvLyBpbml0S2V5Ym9hcmRFdmVudCBpbiBjaHJvbWVcblxuICAgIHZhciBpbml0ID0gdHlwZW9mIGV2Wydpbml0JyArIHR5cGVdID09PSAnZnVuY3Rpb24nXG4gICAgICA/ICdpbml0JyArIHR5cGUgOiAnaW5pdEV2ZW50JztcblxuICAgIHZhciBzaWcgPSBpbml0U2lnbmF0dXJlc1tpbml0XTtcbiAgICB2YXIgYXJncyA9IFtdO1xuICAgIHZhciB1c2VkID0ge307XG5cbiAgICBvcHRzLnR5cGUgPSBuYW1lO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzaWcubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgdmFyIGtleSA9IHNpZ1tpXTtcbiAgICAgICAgdmFyIHZhbCA9IG9wdHNba2V5XTtcbiAgICAgICAgLy8gaWYgbm8gdXNlciBzcGVjaWZpZWQgdmFsdWUsIHRoZW4gdXNlIGV2ZW50IGRlZmF1bHRcbiAgICAgICAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YWwgPSBldltrZXldO1xuICAgICAgICB9XG4gICAgICAgIGFyZ3MucHVzaCh2YWwpO1xuICAgIH1cbiAgICBldltpbml0XS5hcHBseShldiwgYXJncyk7XG5cbiAgICAvLyBhdHRhY2ggcmVtYWluaW5nIHVudXNlZCBvcHRpb25zIHRvIHRoZSBvYmplY3RcbiAgICBmb3IgKHZhciBrZXkgaW4gb3B0cykge1xuICAgICAgICBpZiAoIXVzZWRba2V5XSkge1xuICAgICAgICAgICAgZXZba2V5XSA9IG9wdHNba2V5XTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBlbC5kaXNwYXRjaEV2ZW50KGV2KTtcbn07XG5cbnZhciBpbml0U2lnbmF0dXJlcyA9IHJlcXVpcmUoJy4vaW5pdC5qc29uJyk7XG52YXIgdHlwZXMgPSByZXF1aXJlKCcuL3R5cGVzLmpzb24nKTtcbnZhciB0eXBlT2YgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciB0eXBzID0ge307XG4gICAgZm9yICh2YXIga2V5IGluIHR5cGVzKSB7XG4gICAgICAgIHZhciB0cyA9IHR5cGVzW2tleV07XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHR5cHNbdHNbaV1dID0ga2V5O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgIHJldHVybiB0eXBzW25hbWVdIHx8ICdFdmVudCc7XG4gICAgfTtcbn0pKCk7XG4iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwiaW5pdEV2ZW50XCIgOiBbXG4gICAgXCJ0eXBlXCIsXG4gICAgXCJidWJibGVzXCIsXG4gICAgXCJjYW5jZWxhYmxlXCJcbiAgXSxcbiAgXCJpbml0VUlFdmVudFwiIDogW1xuICAgIFwidHlwZVwiLFxuICAgIFwiYnViYmxlc1wiLFxuICAgIFwiY2FuY2VsYWJsZVwiLFxuICAgIFwidmlld1wiLFxuICAgIFwiZGV0YWlsXCJcbiAgXSxcbiAgXCJpbml0TW91c2VFdmVudFwiIDogW1xuICAgIFwidHlwZVwiLFxuICAgIFwiYnViYmxlc1wiLFxuICAgIFwiY2FuY2VsYWJsZVwiLFxuICAgIFwidmlld1wiLFxuICAgIFwiZGV0YWlsXCIsXG4gICAgXCJzY3JlZW5YXCIsXG4gICAgXCJzY3JlZW5ZXCIsXG4gICAgXCJjbGllbnRYXCIsXG4gICAgXCJjbGllbnRZXCIsXG4gICAgXCJjdHJsS2V5XCIsXG4gICAgXCJhbHRLZXlcIixcbiAgICBcInNoaWZ0S2V5XCIsXG4gICAgXCJtZXRhS2V5XCIsXG4gICAgXCJidXR0b25cIixcbiAgICBcInJlbGF0ZWRUYXJnZXRcIlxuICBdLFxuICBcImluaXRNdXRhdGlvbkV2ZW50XCIgOiBbXG4gICAgXCJ0eXBlXCIsXG4gICAgXCJidWJibGVzXCIsXG4gICAgXCJjYW5jZWxhYmxlXCIsXG4gICAgXCJyZWxhdGVkTm9kZVwiLFxuICAgIFwicHJldlZhbHVlXCIsXG4gICAgXCJuZXdWYWx1ZVwiLFxuICAgIFwiYXR0ck5hbWVcIixcbiAgICBcImF0dHJDaGFuZ2VcIlxuICBdLFxuICBcImluaXRLZXlFdmVudFwiIDogW1xuICAgIFwidHlwZVwiLFxuICAgIFwiYnViYmxlc1wiLFxuICAgIFwiY2FuY2VsYWJsZVwiLFxuICAgIFwidmlld1wiLFxuICAgIFwiY3RybEtleVwiLFxuICAgIFwiYWx0S2V5XCIsXG4gICAgXCJzaGlmdEtleVwiLFxuICAgIFwibWV0YUtleVwiLFxuICAgIFwia2V5Q29kZVwiLFxuICAgIFwiY2hhckNvZGVcIlxuICBdXG59XG4iLCJcbnZhciBwcm90byA9IEVsZW1lbnQucHJvdG90eXBlO1xuXG52YXIgdmVuZG9yID0gcHJvdG8ubWF0Y2hlc1NlbGVjdG9yXG4gIHx8IHByb3RvLndlYmtpdE1hdGNoZXNTZWxlY3RvclxuICB8fCBwcm90by5tb3pNYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ubXNNYXRjaGVzU2VsZWN0b3JcbiAgfHwgcHJvdG8ub01hdGNoZXNTZWxlY3RvcjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBtYXRjaChlbCwgc2VsZWN0b3IpIHtcbiAgICBpZiAodmVuZG9yKSB7XG4gICAgICAgIHJldHVybiB2ZW5kb3IuY2FsbChlbCwgc2VsZWN0b3IpO1xuICAgIH1cblxuICAgIHZhciBub2RlcyA9IGVsLnBhcmVudE5vZGUucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2Rlcy5sZW5ndGg7ICsraSkge1xuICAgICAgICBpZiAobm9kZXNbaV0gPT0gZWwpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xufTtcbiIsIlxuZnVuY3Rpb24gbWtmcmFnbWVudChlbGVtZW50cykge1xuICAgIHZhciBmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuXG4gICAgZm9yICh2YXIgaT0wIDsgaTxlbGVtZW50cy5sZW5ndGggOyArK2kpIHtcbiAgICAgICAgZnJhZy5hcHBlbmRDaGlsZChlbGVtZW50c1tpXSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZyYWc7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5yZW1vdmUgPSBmdW5jdGlvbihlbCkge1xuICAgIGlmICghZWwucGFyZW50Tm9kZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnJlcGxhY2UgPSBmdW5jdGlvbihlbCwgd2hhdCkge1xuICAgIGlmICghZWwucGFyZW50Tm9kZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBlbC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChta2ZyYWdtZW50KHdoYXQpLCBlbCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5wcmVwZW5kID0gZnVuY3Rpb24oZWwsIHdoYXQpIHtcbiAgICByZXR1cm4gZWwuaW5zZXJ0QmVmb3JlKG1rZnJhZ21lbnQod2hhdCksIGVsLmZpcnN0Q2hpbGQpO1xufTtcblxubW9kdWxlLmV4cG9ydHMuYXBwZW5kID0gZnVuY3Rpb24oZWwsIHdoYXQpIHtcbiAgICB2YXIgZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbiAgICByZXR1cm4gZWwuYXBwZW5kQ2hpbGQobWtmcmFnbWVudCh3aGF0KSk7XG59O1xuXG4vLyByZXR1cm5zIG5ld2x5IGluc2VydGVkIGVsZW1lbnRcbm1vZHVsZS5leHBvcnRzLmFmdGVyID0gZnVuY3Rpb24oZWwsIHdoYXQpIHtcbiAgICBpZiAoIWVsLnBhcmVudE5vZGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGllOSBkb2Vzbid0IGxpa2UgbnVsbCBmb3IgaW5zZXJ0QmVmb3JlXG4gICAgaWYgKCFlbC5uZXh0U2lsYmxpbmcpIHtcbiAgICAgICAgcmV0dXJuIGVsLnBhcmVudE5vZGUuYXBwZW5kQ2hpbGQobWtmcmFnbWVudCh3aGF0KSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVsLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKG1rZnJhZ21lbnQod2hhdCksIGVsLm5leHRTaWxibGluZyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5iZWZvcmUgPSBmdW5jdGlvbihlbCwgd2hhdCkge1xuICAgIGlmICghZWwucGFyZW50Tm9kZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiBlbC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShta2ZyYWdtZW50KHdoYXQpLCBlbCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5lbXB0eSA9IGZ1bmN0aW9uKHBhcmVudCkge1xuICAgIC8vIGNoZWFwIHdheSB0byByZW1vdmUgYWxsIGNoaWxkcmVuXG4gICAgcGFyZW50LmlubmVySFRNTCA9ICcnO1xufTtcblxuIiwibW9kdWxlLmV4cG9ydHM9e1xuICBcIk1vdXNlRXZlbnRcIiA6IFtcbiAgICBcImNsaWNrXCIsXG4gICAgXCJtb3VzZWRvd25cIixcbiAgICBcIm1vdXNldXBcIixcbiAgICBcIm1vdXNlb3ZlclwiLFxuICAgIFwibW91c2Vtb3ZlXCIsXG4gICAgXCJtb3VzZW91dFwiXG4gIF0sXG4gIFwiS2V5RXZlbnRcIiA6IFtcbiAgICBcImtleWRvd25cIixcbiAgICBcImtleXVwXCIsXG4gICAgXCJrZXlwcmVzc1wiXG4gIF0sXG4gIFwiTXV0YXRpb25FdmVudFwiIDogW1xuICAgIFwiRE9NU3VidHJlZU1vZGlmaWVkXCIsXG4gICAgXCJET01Ob2RlSW5zZXJ0ZWRcIixcbiAgICBcIkRPTU5vZGVSZW1vdmVkXCIsXG4gICAgXCJET01Ob2RlUmVtb3ZlZEZyb21Eb2N1bWVudFwiLFxuICAgIFwiRE9NTm9kZUluc2VydGVkSW50b0RvY3VtZW50XCIsXG4gICAgXCJET01BdHRyTW9kaWZpZWRcIixcbiAgICBcIkRPTUNoYXJhY3RlckRhdGFNb2RpZmllZFwiXG4gIF0sXG4gIFwiSFRNTEV2ZW50XCIgOiBbXG4gICAgXCJsb2FkXCIsXG4gICAgXCJ1bmxvYWRcIixcbiAgICBcImFib3J0XCIsXG4gICAgXCJlcnJvclwiLFxuICAgIFwic2VsZWN0XCIsXG4gICAgXCJjaGFuZ2VcIixcbiAgICBcInN1Ym1pdFwiLFxuICAgIFwicmVzZXRcIixcbiAgICBcImZvY3VzXCIsXG4gICAgXCJibHVyXCIsXG4gICAgXCJyZXNpemVcIixcbiAgICBcInNjcm9sbFwiXG4gIF0sXG4gIFwiVUlFdmVudFwiIDogW1xuICAgIFwiRE9NRm9jdXNJblwiLFxuICAgIFwiRE9NRm9jdXNPdXRcIixcbiAgICBcIkRPTUFjdGl2YXRlXCJcbiAgXVxufVxuIiwibW9kdWxlLmV4cG9ydHMgPSBleHRlbmRcblxuZnVuY3Rpb24gZXh0ZW5kKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaV0sXG4gICAgICAgICAgICBrZXlzID0gT2JqZWN0LmtleXMoc291cmNlKVxuXG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwga2V5cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIG5hbWUgPSBrZXlzW2pdXG4gICAgICAgICAgICB0YXJnZXRbbmFtZV0gPSBzb3VyY2VbbmFtZV1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0YXJnZXRcbn0iLCIvLyB2ZW5kb3JcbnZhciB4dGVuZCA9IHJlcXVpcmUoJ3h0ZW5kJyk7XG52YXIgZG9tID0gcmVxdWlyZSgnZG9tJyk7XG5cbnZhciBkZWZhdWx0cyA9IHtcbiAgICBzb3VyY2U6IFtdLFxuICAgIGl0ZW1zOiA4LFxuICAgIG1lbnU6ICc8dWwgY2xhc3M9XCJ0eXBlYWhlYWQgaGlkZGVuXCI+PC91bD4nLFxuICAgIGl0ZW06ICc8bGk+PGEgaHJlZj1cIiNcIj48L2E+PC9saT4nLFxuICAgIG1pbkxlbmd0aDogMSxcbiAgICBhdXRvc2VsZWN0OiB0cnVlXG59XG5cbnZhciBUeXBlYWhlYWQgPSBmdW5jdGlvbiAoZWxlbWVudCwgb3B0aW9ucykge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBUeXBlYWhlYWQpKSB7XG4gICAgICAgIHJldHVybiBuZXcgVHlwZWFoZWFkKGVsZW1lbnQsIG9wdGlvbnMpO1xuICAgIH1cblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIHNlbGYuZWxlbWVudCA9IGRvbShlbGVtZW50KTtcbiAgICBzZWxmLm9wdGlvbnMgPSB4dGVuZCh7fSwgZGVmYXVsdHMsIG9wdGlvbnMpO1xuICAgIHNlbGYubWF0Y2hlciA9IHNlbGYub3B0aW9ucy5tYXRjaGVyIHx8IHNlbGYubWF0Y2hlclxuICAgIHNlbGYuc29ydGVyID0gc2VsZi5vcHRpb25zLnNvcnRlciB8fCBzZWxmLnNvcnRlclxuICAgIHNlbGYuaGlnaGxpZ2h0ZXIgPSBzZWxmLm9wdGlvbnMuaGlnaGxpZ2h0ZXIgfHwgc2VsZi5oaWdobGlnaHRlclxuICAgIHNlbGYudXBkYXRlciA9IHNlbGYub3B0aW9ucy51cGRhdGVyIHx8IHNlbGYudXBkYXRlclxuICAgIHNlbGYubWVudSA9IGRvbShzZWxmLm9wdGlvbnMubWVudSk7XG4gICAgZG9tKGRvY3VtZW50LmJvZHkpLmFwcGVuZChzZWxmLm1lbnUpO1xuXG4gICAgc2VsZi5zb3VyY2UgPSBzZWxmLm9wdGlvbnMuc291cmNlO1xuICAgIHNlbGYuc2hvd24gPSBmYWxzZTtcbiAgICBzZWxmLmxpc3RlbigpO1xufVxuXG4vLyBmb3IgbWluaWZpY2F0aW9uXG52YXIgcHJvdG8gPSBUeXBlYWhlYWQucHJvdG90eXBlO1xuXG5wcm90by5jb25zdHJ1Y3RvciA9IFR5cGVhaGVhZDtcblxuLy8gc2VsZWN0IHRoZSBjdXJyZW50IGl0ZW1cbnByb3RvLnNlbGVjdCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgdmFsID0gc2VsZi5tZW51LmZpbmQoJy5hY3RpdmUnKS5hdHRyKCdkYXRhLXZhbHVlJyk7XG5cbiAgICBzZWxmLmVsZW1lbnRcbiAgICAgIC52YWx1ZShzZWxmLnVwZGF0ZXIodmFsKSlcbiAgICAgIC5lbWl0KCdjaGFuZ2UnKTtcblxuICAgIHJldHVybiBzZWxmLmhpZGUoKTtcbn1cblxucHJvdG8udXBkYXRlciA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW07XG59XG5cbi8vIHNob3cgdGhlIHBvcHVwIG1lbnVcbnByb3RvLnNob3cgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyIG9mZnNldCA9IHNlbGYuZWxlbWVudC5vZmZzZXQoKTtcbiAgICB2YXIgcG9zID0geHRlbmQoe30sIG9mZnNldCwge1xuICAgICAgICBoZWlnaHQ6IHNlbGYuZWxlbWVudC5vdXRlckhlaWdodCgpXG4gICAgfSlcblxuICAgIHZhciBzY3JvbGwgPSAwXG4gICAgdmFyIHBhcmVudCA9IHNlbGYuZWxlbWVudFswXVxuICAgIHdoaWxlIChwYXJlbnQgPSBwYXJlbnQucGFyZW50RWxlbWVudCkge1xuICAgICAgICBzY3JvbGwgKz0gcGFyZW50LnNjcm9sbFRvcFxuICAgIH1cblxuICAgIC8vIGlmIHBhZ2UgaGFzIHNjcm9sbGVkIHdlIG5lZWQgcmVhbCBwb3NpdGlvbiBpbiB2aWV3cG9ydFxuICAgIHZhciB0b3AgPSBwb3MudG9wICsgcG9zLmhlaWdodCAtIHNjcm9sbCArICdweCdcbiAgICB2YXIgYm90dG9tID0gJ2F1dG8nXG4gICAgdmFyIGxlZnQgPSBwb3MubGVmdCArICdweCdcblxuICAgIGlmIChzZWxmLm9wdGlvbnMucG9zaXRpb24gPT09ICdhYm92ZScpIHtcbiAgICAgICAgdG9wID0gJ2F1dG8nXG4gICAgICAgIGJvdHRvbSA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0IC0gcG9zLnRvcCArIDNcbiAgICB9IGVsc2UgaWYgKHNlbGYub3B0aW9ucy5wb3NpdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICB0b3AgPSBwYXJzZUludCh0b3Auc3BsaXQoJ3B4JylbMF0sIDEwKSAtIHNlbGYuZWxlbWVudC5vdXRlckhlaWdodCgpICsgJ3B4J1xuICAgICAgICBsZWZ0ID0gcGFyc2VJbnQobGVmdC5zcGxpdCgncHgnKVswXSwgMTApICsgc2VsZi5lbGVtZW50Lm91dGVyV2lkdGgoKSArICdweCdcbiAgICB9XG5cbiAgICBzZWxmLm1lbnUuY3NzKHtcbiAgICAgICAgdG9wOiB0b3AsXG4gICAgICAgIGJvdHRvbTogYm90dG9tLFxuICAgICAgICBsZWZ0OiBsZWZ0XG4gICAgfSk7XG5cbiAgICBzZWxmLm1lbnUucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xuICAgIHNlbGYuc2hvd24gPSB0cnVlO1xuICAgIHJldHVybiBzZWxmO1xufVxuXG4vLyBoaWRlIHRoZSBwb3B1cCBtZW51XG5wcm90by5oaWRlID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubWVudS5hZGRDbGFzcygnaGlkZGVuJyk7XG4gICAgdGhpcy5zaG93biA9IGZhbHNlO1xuICAgIHJldHVybiB0aGlzO1xufVxuXG5wcm90by5sb29rdXAgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLnF1ZXJ5ID0gc2VsZi5lbGVtZW50LnZhbHVlKCk7XG5cbiAgICBpZiAoIXNlbGYucXVlcnkgfHwgc2VsZi5xdWVyeS5sZW5ndGggPCBzZWxmLm9wdGlvbnMubWluTGVuZ3RoKSB7XG4gICAgICAgIHJldHVybiBzZWxmLnNob3duID8gc2VsZi5oaWRlKCkgOiBzZWxmXG4gICAgfVxuXG4gICAgaWYgKHNlbGYuc291cmNlIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgc2VsZi5zb3VyY2Uoc2VsZi5xdWVyeSwgc2VsZi5wcm9jZXNzLmJpbmQoc2VsZikpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgc2VsZi5wcm9jZXNzKHNlbGYuc291cmNlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VsZjtcbn1cblxucHJvdG8ucHJvY2VzcyA9IGZ1bmN0aW9uIChpdGVtcykge1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGl0ZW1zID0gaXRlbXMuZmlsdGVyKHNlbGYubWF0Y2hlci5iaW5kKHNlbGYpKTtcbiAgICBpdGVtcyA9IHNlbGYuc29ydGVyKGl0ZW1zKVxuXG4gICAgaWYgKCFpdGVtcy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBzZWxmLnNob3duID8gc2VsZi5oaWRlKCkgOiBzZWxmXG4gICAgfVxuXG4gICAgcmV0dXJuIHNlbGYucmVuZGVyKGl0ZW1zLnNsaWNlKDAsIHNlbGYub3B0aW9ucy5pdGVtcykpLnNob3coKVxufVxuXG5wcm90by5tYXRjaGVyID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgcmV0dXJuIH5pdGVtLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLnF1ZXJ5LnRvTG93ZXJDYXNlKCkpXG59XG5cbnByb3RvLnNvcnRlciA9IGZ1bmN0aW9uIChpdGVtcykge1xuICAgIHZhciBiZWdpbnN3aXRoID0gW107XG4gICAgdmFyIGNhc2VTZW5zaXRpdmUgPSBbXTtcbiAgICB2YXIgY2FzZUluc2Vuc2l0aXZlID0gW107XG4gICAgdmFyIGl0ZW07XG5cbiAgICB3aGlsZSAoaXRlbSA9IGl0ZW1zLnNoaWZ0KCkpIHtcbiAgICAgIGlmICghaXRlbS50b0xvd2VyQ2FzZSgpLmluZGV4T2YodGhpcy5xdWVyeS50b0xvd2VyQ2FzZSgpKSkgYmVnaW5zd2l0aC5wdXNoKGl0ZW0pXG4gICAgICBlbHNlIGlmICh+aXRlbS5pbmRleE9mKHRoaXMucXVlcnkpKSBjYXNlU2Vuc2l0aXZlLnB1c2goaXRlbSlcbiAgICAgIGVsc2UgY2FzZUluc2Vuc2l0aXZlLnB1c2goaXRlbSlcbiAgICB9XG5cbiAgICByZXR1cm4gYmVnaW5zd2l0aC5jb25jYXQoY2FzZVNlbnNpdGl2ZSwgY2FzZUluc2Vuc2l0aXZlKVxufVxuXG5wcm90by5oaWdobGlnaHRlciA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgdmFyIHF1ZXJ5ID0gdGhpcy5xdWVyeS5yZXBsYWNlKC9bXFwtXFxbXFxde30oKSorPy4sXFxcXFxcXiR8I1xcc10vZywgJ1xcXFwkJicpO1xuICAgIHJldHVybiBpdGVtLnJlcGxhY2UobmV3IFJlZ0V4cCgnKCcgKyBxdWVyeSArICcpJywgJ2lnJyksIGZ1bmN0aW9uICgkMSwgbWF0Y2gpIHtcbiAgICAgICAgcmV0dXJuICc8c3Ryb25nPicgKyBtYXRjaCArICc8L3N0cm9uZz4nXG4gICAgfSlcbn1cblxucHJvdG8ucmVuZGVyID0gZnVuY3Rpb24gKGl0ZW1zKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgaXRlbXMgPSBpdGVtcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgdmFyIGxpID0gZG9tKHNlbGYub3B0aW9ucy5pdGVtKTtcbiAgICAgICAgbGkuYXR0cignZGF0YS12YWx1ZScsIGl0ZW0pXG4gICAgICAgICAgLmZpbmQoJ2EnKS5odG1sKHNlbGYuaGlnaGxpZ2h0ZXIoaXRlbSkpO1xuICAgICAgICByZXR1cm4gbGk7XG4gICAgfSlcblxuICAgIHNlbGYub3B0aW9ucy5hdXRvc2VsZWN0ICYmIGl0ZW1zWzBdLmFkZENsYXNzKCdhY3RpdmUnKTtcblxuICAgIHNlbGYubWVudS5lbXB0eSgpO1xuICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICBzZWxmLm1lbnUuYXBwZW5kKGl0ZW0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbnByb3RvLm5leHQgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgYWN0aXZlID0gdGhpcy5tZW51LmZpbmQoJy5hY3RpdmUnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgdmFyIG5leHQgPSBhY3RpdmUubmV4dCgpO1xuXG4gICAgaWYgKCFuZXh0Lmxlbmd0aCkge1xuICAgICAgICBuZXh0ID0gdGhpcy5tZW51LmZpbmQoJ2xpJykuZmlyc3QoKTtcbiAgICB9XG5cbiAgICBuZXh0LmFkZENsYXNzKCdhY3RpdmUnKTtcbn1cblxucHJvdG8ucHJldiA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBhY3RpdmUgPSB0aGlzLm1lbnUuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICB2YXIgcHJldiA9IGFjdGl2ZS5wcmV2KCk7XG5cbiAgICBpZiAoIXByZXYubGVuZ3RoKSB7XG4gICAgICAgIHByZXYgPSB0aGlzLm1lbnUuZmluZCgnbGknKS5sYXN0KCk7XG4gICAgfVxuXG4gICAgcHJldi5hZGRDbGFzcygnYWN0aXZlJyk7XG59XG5cbnByb3RvLmxpc3RlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICBzZWxmLmVsZW1lbnRcbiAgICAgIC5vbignYmx1cicsIHNlbGYuYmx1ci5iaW5kKHNlbGYpKVxuICAgICAgLm9uKCdrZXlwcmVzcycsIHNlbGYua2V5cHJlc3MuYmluZChzZWxmKSlcbiAgICAgIC5vbigna2V5dXAnLCBzZWxmLmtleXVwLmJpbmQoc2VsZikpXG4gICAgICAub24oJ2tleWRvd24nLCBzZWxmLmtleWRvd24uYmluZChzZWxmKSlcblxuICAgIHNlbGYubWVudVxuICAgICAgLm9uKCdjbGljaycsIHNlbGYuY2xpY2suYmluZChzZWxmKSlcbiAgICAgIC5vbignbW91c2VlbnRlcicsICdsaScsIHNlbGYubW91c2VlbnRlci5iaW5kKHNlbGYpKVxufVxuXG5wcm90by5tb3ZlID0gZnVuY3Rpb24gKGUpIHtcbiAgICBpZiAoIXRoaXMuc2hvd24pIHJldHVyblxuXG4gICAgc3dpdGNoKGUua2V5Q29kZSkge1xuICAgIGNhc2UgOTogLy8gdGFiXG4gICAgY2FzZSAxMzogLy8gZW50ZXJcbiAgICBjYXNlIDI3OiAvLyBlc2NhcGVcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIGJyZWFrXG5cbiAgICBjYXNlIDM4OiAvLyB1cCBhcnJvd1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KClcbiAgICAgICAgdGhpcy5wcmV2KClcbiAgICAgICAgYnJlYWtcblxuICAgIGNhc2UgNDA6IC8vIGRvd24gYXJyb3dcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpXG4gICAgICAgIHRoaXMubmV4dCgpXG4gICAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxufVxuXG5wcm90by5rZXlkb3duID0gZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLnN1cHByZXNzS2V5UHJlc3NSZXBlYXQgPSBbNDAsMzgsOSwxMywyN10uaW5kZXhPZihlLmtleUNvZGUpID49IDBcbiAgICB0aGlzLm1vdmUoZSlcbn1cblxucHJvdG8ua2V5cHJlc3MgPSBmdW5jdGlvbiAoZSkge1xuICAgIGlmICh0aGlzLnN1cHByZXNzS2V5UHJlc3NSZXBlYXQpIHJldHVyblxuICAgIHRoaXMubW92ZShlKVxufVxuXG5wcm90by5rZXl1cCA9IGZ1bmN0aW9uIChlKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgc3dpdGNoKGUua2V5Q29kZSkge1xuICAgIGNhc2UgNDA6IC8vIGRvd24gYXJyb3dcbiAgICBjYXNlIDM4OiAvLyB1cCBhcnJvd1xuICAgICAgICAgICAgYnJlYWtcblxuICAgIGNhc2UgOTogLy8gdGFiXG4gICAgY2FzZSAxMzogLy8gZW50ZXJcbiAgICAgICAgaWYgKCFzZWxmLnNob3duKSByZXR1cm5cbiAgICAgICAgc2VsZi5zZWxlY3QoKVxuICAgICAgICBicmVha1xuXG4gICAgY2FzZSAyNzogLy8gZXNjYXBlXG4gICAgICAgIGlmICghc2VsZi5zaG93bikgcmV0dXJuXG4gICAgICAgIHNlbGYuaGlkZSgpXG4gICAgICAgIGJyZWFrXG5cbiAgICBkZWZhdWx0OlxuICAgICAgICBzZWxmLmxvb2t1cCgpXG4gICAgfVxuXG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKVxuICAgIGUucHJldmVudERlZmF1bHQoKVxufVxuXG5wcm90by5ibHVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHNlbGYuaGlkZSgpIH0sIDE1MCk7XG59XG5cbnByb3RvLmNsaWNrID0gZnVuY3Rpb24gKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLnNlbGVjdCgpO1xufVxuXG5wcm90by5tb3VzZWVudGVyID0gZnVuY3Rpb24gKGUpIHtcbiAgICB0aGlzLm1lbnUuZmluZCgnLmFjdGl2ZScpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICBkb20oZS5jdXJyZW50VGFyZ2V0KS5hZGRDbGFzcygnYWN0aXZlJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVHlwZWFoZWFkO1xuIl19

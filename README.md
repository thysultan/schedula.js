# schedula.js 

priority based work scheduler for javascript.

- ~700 bytes minified+gzipped

[![npm](https://img.shields.io/npm/v/schedula.svg?style=flat)](https://www.npmjs.com/package/schedula) [![licence](https://img.shields.io/badge/licence-MIT-blue.svg?style=flat)](https://github.com/thysultan/schedula.js/blob/master/LICENSE.md)


## Browser Support

* Edge
* IE 8+
* Chrome
* Firefox
* Safari
* Node

## Installation

#### direct download

```html
<script src=schedula.min.js></script>
```

#### CDN

```html
<script src=https://unpkg.com/schedula.js@0.1.2/schedula.min.js></script>
```

#### npm

```
npm install schedula --save
```

## Examples

```javascript
// create a fiber
var fiber = schedula(60);

// push work
fiber.push(true, null, (a, b) => {
	console.log(a, b);
}, 3, [1, 2]);

// slow things down, this will throttle work to a 20fps budget
schedule.budget = 20;

// speed things up, this will throttle work to a 60fps budget
schedule.budget = 60;

// context
var foo = {
	bar: function (a, b) {
		console.log(a, b);
	}
}

fiber.push(true, foo, foo.bar, 3, [1, 2]);

// manually flush high priority work, without throttling
fiber.flush(true); 

// manually flush low priority work, without throttling
fiber.flush(false);
```

- [work cycle timeline visuals](https://rawgit.com/thysultan/schedula.js/master/examples/index.html)

## API

#### push

push work

```javascript
/**
 * @param {boolean}  priority  - true for high priority
 * @param {any}      context   - this context
 * @param {function} callback  - callback function
 * @param {number}   length    - number of arguments passed
 * @param {any[]}    arguments - array of arguments passed
 */
```

#### flush

manually flush work sync

```javascript
/**
 * @param {boolean}  priority  - true for high priority
 */
```

#### budget

get/set budget

```javascript
/**
 * @type getter/setter
 */
```

#### work

get queued work.

```javascript
/**
 * @type getter
 */
```
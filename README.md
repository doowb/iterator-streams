# iterator-streams [![NPM version](https://badge.fury.io/js/iterator-streams.svg)](http://badge.fury.io/js/iterator-streams)  [![Build Status](https://travis-ci.org/doowb/iterator-streams.svg)](https://travis-ci.org/doowb/iterator-streams)

> Iterate over a stack of streams.

This module is intended to be used with [loader-cache](https://github.com/jonschlinkert/loader-cache)but may be used by itself or in other modules.

Install with [npm](https://www.npmjs.com/)

```sh
$ npm i iterator-streams --save
```

## Usage

```js
var iterator = require('iterator-streams');
```

## API

<!-- add a path or glob pattern for files with code comments to use for docs  -->

### [iterator](index.js#L20)

Iterate over a stack of streams piping the results of
each steram to the next stream in the stack.

**Params**

* `stack` **{Array}**: Array of streams to use.
* `returns` **{Function}**: Returns a function that will iterator over the given stack of streams.

```js
var fs = require('fs');
var iterator = require('iterator-streams');
var through = require('through2');

var stack = [
  through.obj(function (fp, enc, cb) { this.push(fs.readFileSync(fp, 'utf8')); cb(); }),
  through.obj(function (contents, enc, cb) { this.push(JSON.parse(contents)); cb(); })
];
var readJSON = iterator(stack);
readJSON('./package.json')
  .on('data', console.log);
```

## Related projects

<!-- add an array of related projects, then un-escape the helper -->

* [event-stream](http://github.com/dominictarr/event-stream): construct pipes of streams of events
* [iterator-async](https://github.com/doowb/iterator-async): Iterate over a stack of async functions.
* [iterator-promise](https://github.com/doowb/iterator-promise): Iterator over a stack of functions.
* [iterator-sync](https://github.com/doowb/iterator-sync): Iterator over a stack of functions.
* [loader-cache](https://github.com/jonschlinkert/loader-cache): Register loader functions that dynamically read, parse or otherwise transform file contents when the name… [more](https://github.com/jonschlinkert/loader-cache)
* [through2](https://github.com/rvagg/through2#readme): A tiny wrapper around Node streams2 Transform to avoid explicit subclassing noise

## Running tests

Install dev dependencies:

```sh
$ npm i -d && npm test
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/doowb/iterator-streams/issues/new)

## Author

**Brian Woodward**

+ [github/doowb](https://github.com/doowb)
+ [twitter/doowb](http://twitter.com/doowb)

## License

Copyright © 2015 [Brian Woodward](https://github.com/doowb)
Released under the MIT license.

***

_This file was generated by [verb-cli](https://github.com/assemble/verb-cli) on June 17, 2015._
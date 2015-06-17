/*!
 * iterator-streams <https://github.com/doowb/iterator-streams>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var es = require('event-stream');
var through = require('through2');

/**
 * Iterate over a stack of streams piping the results of
 * each stream to the next stream in the stack.
 *
 * @param  {Array} `stack` Array of streams to use.
 * @return {Function} Returns a function that will iterate over the given stack of streams.
 * @api public
 */

function iteratorStream(stack) {
  var self = this;

  return function () {
    var args = [].slice.call(arguments);
    var stream = through.obj();

    if (!stack.length) {
      stack = [through.obj()];
    }

    var len = stack.length, i = -1;
    while (len--) {
      var fn = stack[++i];
      if (typeof fn === 'function') {
        stack[i] = fn(self);
      }
    }

    var results = es.pipe.apply(es, stack);
    process.nextTick(function () {
      stream.write(args);
      stream.end();
    });
    return stream.pipe(results);
  };
};

module.exports = iteratorStream;

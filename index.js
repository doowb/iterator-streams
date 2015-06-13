/*!
 * iterator-streams <https://github.com/doowb/iterator-streams>
 *
 * Copyright (c) 2015, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

/**
 * Iterate over a stack of streams piping the results of
 * each steram to the next stream in the stack.
 *
 * @param  {Array} `stack` Array of streams to use.
 * @return {Function} Returns a function that will iterator over the given stack of streams.
 * @api public
 * @name  iterator
 */

module.exports = function iteratorStream(stack) {
  return function (/* arguments */) {
    var self = this;
    var args = [].slice.call(arguments);
    var es = require('event-stream');
    var through = require('through2');
    var stream = through.obj();
    if (!stack.length) {
      stack = [through.obj()];
    }

    var len = stack.length, i = 0;
    while (len--) {
      var fn = stack[i++];
      if (typeof fn === 'function') {
        stack[i - 1] = fn.apply(self, args);
      }
    }
    var results = es.pipe.apply(es, stack);
    process.nextTick(function () {
      stream.write(args[0]);
      stream.end();
    });
    return stream.pipe(results);
  };
};

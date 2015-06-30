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

var es = require('event-stream');
var through = require('through2');

module.exports = function iteratorStream(stack) {
  return function (/* arguments */) {
    var self = this;
    var args = [].slice.call(arguments);
    var pipeline = [];
    if (!stack.length) {
      stack.push(identity);
    }

    var len = stack.length, i = 0;
    while (len--) {
      var loader = stack[i++];
      if (typeof loader === 'function') {
        loader = loader.apply(self, args);
      }
      pipeline.push(loader);
    }
    return es.pipe.apply(es, pipeline);
  };
};

function identity() {
  var args = [].slice.call(arguments);
  var stream = through.obj();
  var pass = through.obj();
  stream.pipe(pass);
  process.nextTick(function () {
    stream.write(args[0]);
    stream.end();
  });
  return stream;
}

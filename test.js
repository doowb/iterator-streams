'use strict';

var through = require('through2');
var assert = require('assert');
var iterator = require('./');

describe('iterator-streams', function () {
  it('should create an iterator function when given a stack', function () {
    var called = [];
    var stack = getStack(called);
    var fn = iterator(stack);
    assert.equal(typeof fn, 'function');
  });

  it('should iterate over a stack of functions', function (done) {
    var called = [];
    var stack = getStack(called);
    iterator(stack)('foo', 'bar')
      .on('data', function (actual) {
        assert.deepEqual(actual, { foo: 'bar' });
        assert.deepEqual(called, ['a', 'b', 'c', 'd', 'e']);
        done();
      });
  });

  it('should return first argument when no functions are in the stack', function (done) {
    var fn = iterator([]);
    fn('foo', 'bar')
      .on('data', function (actual) {
        assert.equal(actual, 'foo');
        done();
      });
  });

  it('should still execute the functions when the stack only contains one function', function (done) {
    var called = [];
    var stack = getStack(called).slice(0, 1);
    iterator(stack)('foo', 'bar')
      .on('data', function (actual) {
        assert.deepEqual(actual, { foo: 'bar' });
        assert.deepEqual(called, ['a']);
        done();
      });
  });
});

function getStack (called) {
  var stack = [
    function a (key, value) {
      return through.obj(function (arg, enc, cb) {
        // this stream doesn't return anything
        // it just adds the object from the initial args
        cb();
      }, function (cb) {
        called.push('a');
        var obj = {};
        obj[key] = value;
        this.push(obj);
        cb();
      });
    },
    through.obj(function b (obj, enc, cb) { called.push('b'); this.push(obj); cb(); }),
    through.obj(function c (obj, enc, cb) { called.push('c'); this.push(obj); cb(); }),
    through.obj(function d (obj, enc, cb) { called.push('d'); this.push(obj); cb(); }),
    through.obj(function e (obj, enc, cb) { called.push('e'); this.push(obj); cb(); })
  ];
  return stack;
}

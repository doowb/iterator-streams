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
      })
      .on('error', done)
      .on('end', done);
  });

  it('should return first argument when no functions are in the stack', function (done) {
    var fn = iterator([]);
    fn('foo', 'bar')
      .on('data', function (actual) {
        assert.equal(actual, 'foo');
      })
      .on('error', done)
      .on('end', done);
  });

  it('should still execute the functions when the stack only contains one function', function (done) {
    var called = [];
    var stack = getStack(called).slice(0, 1);
    iterator(stack)('foo', 'bar')
      .on('data', function (actual) {
        assert.deepEqual(actual, { foo: 'bar' });
        assert.deepEqual(called, ['a']);
      })
      .on('error', done)
      .on('end', done);
  });

  it('should passthrough objects the first iterator has an empty stack', function (done) {
    var called = [];
    var stack = getStack(called);
    var first = iterator([]);
    var second = iterator(stack);
    var count = 0;

    first('first')
      .on('data', function (data) {
        assert.deepEqual(data, 'first');
        assert.deepEqual(called, []);
      })
      .pipe(second('foo', 'bar'))
      .on('data', function (data) {
        count++;
        if (count === 1) {
          assert.deepEqual(called, ['b', 'c', 'd', 'e']);
        } else {
          assert.deepEqual(called, ['b', 'c', 'd', 'e', 'a', 'b', 'c', 'd', 'e']);
        }
      })
      .on('error', done)
      .on('end', done);
  });

  it('should passthrough objects the first iterator has an empty stack', function (done) {
    var called = [];
    var stack = getStack(called);
    var first = iterator(stack);
    var second = iterator([]);
    var count = 0;

    first('foo', 'bar')
      .on('data', function (data) {
        assert.deepEqual(data, { foo: 'bar' });
        assert.deepEqual(called, ['a', 'b', 'c', 'd', 'e']);
      })
      .pipe(second('foo', 'bar'))
      .on('data', function (data) {
        count++;
        if (count === 1) assert.deepEqual(data, { foo: 'bar' });
        if (count === 2) assert.deepEqual(data, 'foo');
        assert.deepEqual(called, ['a', 'b', 'c', 'd', 'e']);
      })
      .on('error', done)
      .on('end', done);
  });
});

function getStack (called) {
  var stack = [
    function a (key, value) {
      var stream = through.obj();
      var pass = through.obj();
      var obj = {};
      obj[key] = value;
      stream.pipe(pass);
      process.nextTick(function () {
        called.push('a');
        stream.write(obj);
        stream.end();
      });
      return stream;
    },
    through.obj(function b (obj, enc, cb) { called.push('b'); cb(null, obj); }),
    through.obj(function c (obj, enc, cb) { called.push('c'); cb(null, obj); }),
    through.obj(function d (obj, enc, cb) { called.push('d'); cb(null, obj); }),
    through.obj(function e (obj, enc, cb) { called.push('e'); cb(null, obj); })
  ];
  return stack;
}

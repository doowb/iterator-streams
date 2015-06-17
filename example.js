var fs = require('fs');
var iterator = require('./');
var through = require('through2');

var stack = [
  // read a file
  through.obj(function (fp, enc, cb) {
    this.push(fs.readFileSync(fp, 'utf8'));
    cb();
  }),
  // parse to JSON
  through.obj(function (contents, enc, cb) {
    this.push(JSON.parse(contents));
    cb();
  })
];

// `iterator` returns a function composed from
// the array of supplied functions
iterator(stack)('./package.json')
  .on('data', console.log);

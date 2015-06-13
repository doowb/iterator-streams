var fs = require('fs');
var iterator = require('./');
var through = require('through2');

var stack = [
  through.obj(function (fp, enc, cb) { this.push(fs.readFileSync(fp, 'utf8')); cb(); }),
  through.obj(function (contents, enc, cb) { this.push(JSON.parse(contents)); cb(); })
];
var readJSON = iterator(stack);
readJSON('./package.json')
  .on('data', console.log);

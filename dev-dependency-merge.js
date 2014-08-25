var _ = require('underscore');
var fs = require('fs');
var assert = require('assert');

function hasDone(done){
  if(!done){
    throw new Error('Callback not passed');
  }
}

var start = module.exports = function(cmdLineArguments, done){
  hasDone(done);

  assert.equal(cmdLineArguments.length, 2, 'Start requires 2 arguments');

  var srcJSON = require(cmdLineArguments[0]);
  var destJSON = require(cmdLineArguments[1]);
  destJSON.devDependencies = destJSON.devDependencies || {};
  _.defaults(destJSON.devDependencies, srcJSON.devDependencies);

  fs.writeFile(cmdLineArguments[1], JSON.stringify(destJSON, null, 2), done);
};

module.exports.remove = function(dest, done){
  hasDone(done);

  assert.ok(dest, 'Remove requires 1 argument');

  var destJSON = require(dest);
  delete destJSON.devDependencies;

  fs.writeFile(dest, JSON.stringify(destJSON, null, 2), done);
};

/* istanbul ignore if */
if(require.main === module){
  start(process.argv.slice(2), function(){});
}

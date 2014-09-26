/* jslint node: true */ 
'use strict';

var server = require('../modules/server');
var config = require('../modules/config');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

console.log = function() {};
var settings;

exports.test = {
  setUp: function(done) {    
    done();
  },
  'Server Start Tests' : function(test) {
    test.expect(1);

    test.throws(
      function() {
        server.start();
      },
      Error, 'Should throw on undefined settings'
      );

    test.done();
  }
};
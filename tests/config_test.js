/* jslint node: true */ 
'use strict';

var config = require('../modules/config.js');

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

exports.test = {
  'Configuration file loading' : function(test) {
    test.expect(5);
    
    test.throws(
      function() { 
        config.load();
      }, 
      Error, 'Should throw on undefined config path'
      );
    
    test.throws(
      function() {
        config.load('/waffles');
      },
      Error, 'Should throw on invalid config path'
      );
    
    test.throws(
      function() {
        config.load('../tests/configs/malformed.json');
      },
      Error, 'Should throw on malformed json'
      );

    test.doesNotThrow(
      function() {
        config.load('../config.json');
      },
      Error, 'Throws on valid JSON'
    );

    test.notStrictEqual(
      function() {
        return typeof(config.load('../config.json'));
      },
      'undefined', 'Does not return populated config object'
      );


    test.done();
  },
};
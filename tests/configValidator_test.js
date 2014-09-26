/* jslint node: true */ 
'use strict';

var configValidators = require('../modules/configValidators.js');

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

//console.log = function() {};

var configs = {
	noHosts : {},
	zeroHosts : { hosts : {}},
	hostMissingInternalUrl : { hosts : { 'host1' : { internalUrl: 'waffles' }, 'host2' : {}}},
	httpsHostMissingCerts : { hosts: { 'host1' : { internalUrl: 'cake',	https: true	}}},
	httpsHostMissingPrivateKey : { hosts: {	'host1' : {	internalUrl : 'host2', https: true, cert : { privateKey : '', certificate : 'foo' }}}},
	httpsHostMissingCert : { hosts: { 'host1' : { internalUrl : 'host2', https: true, cert : { privateKey : 'bar', certificate : ''	}}}},
	aliasMissingTarget : { aliases:  { 'host.external' : {} }},
	aliasInvalidTarget : { hosts : 
		{ 'host1' : {} }, 
		aliases : { 
			'host2.external ' : { 
				aliasFor : 'host2'
			}
		}
	},
	noHttpsWhenHttpsHost :  { hosts: { 'host1' : { https : true }}},
	noCertificateRootNoHttpsHosts: { https: { certificateFolder : ''}},
	noCertificateRootHttpsHost: { hosts: { 'host1' : { https : true }}, https: { certificateFolder : ''}},
	noPort: {},
	emptyPort: { port: '' },
	nonNumericPort: { port: 'a'},
	lowPort: { port: 0 },
	highPort: {port: 70000 },
	noNotFound: {},
	invalidNotFound : { notFound : 'does_not_exist.html' }
};

exports.test = {
	'Configuration Structure' : function(test) {
		test.expect(18);

		// Required values

		// config contains hosts element
		test.throws(
			function() {
				configValidators.hostsExists(configs.noHosts);
			}, 
			Error, 'Config requires host element'
			);

		// config contains at least one host
		test.throws(
			function() {
				configValidators.hostsNotEmpty(configs.zeroHosts);
			},
			Error, 'Config requires at least one host'
			);

		test.throws(
			function() {
				configValidators.hostsHaveInternalUrl(configs.hostMissingInternalUrl);
			},
			Error, 'Hosts require internalUrl'
			);

		test.throws(
			function(){ 
				configValidators.httpsHostsHaveCertInfo(configs.httpsHostMissingCerts);
			},
			Error, 'HTTPS hosts require cert information'
			);

		test.throws(
			function() {
				configValidators.httpsHostsHaveCertInfo(configs.httpsHostMissingPrivateKey);
			},
			Error, 'HTTPS hosts require private key'
			);

		test.throws(
			function() {
				configValidators.httpsHostsHaveCertInfo(configs.httpsHostMissingCert);
			},
			Error, 'HTTPS hosts require certificate'
			);

		test.throws(
			function() {
				configValidators.aliasesHaveTargets(configs.aliasMissingTarget);
			},
			Error, 'Aliases require target (aliasFor)'
			);

		test.throws(
			function() {
				configValidators.aliasesHaveValidTargets(configs.aliasInvalidTarget);
			},
			Error, 'Aliases require valid target'
			);

		test.throws(
			function() {
				configValidators.httpsExistsIfHttpsHosts(configs.noHttpsWhenHttpsHost);
			},
			Error, 'Https settings must be present when https host present'
			);

		test.doesNotThrow(
			function() {
				configValidators.certificateRootFolderSet(configs.noCertificateRootNoHttpsHosts);
			},
			Error, 'Certificate root not required when no https hosts present'
			);

		test.throws(
			function() {
				configValidators.certificateRootFolderSet(configs.noCertificateRootHttpsHost);
			},
			Error, 'Certificate root required when https hosts present'
			);

		// config contains port element
		test.throws(
			function() {
				configValidators.portExists(configs.noPort);
			},
			Error, 'Config requires port element for http'
			);

		test.throws(
			function() {
				configValidators.portValid(configs.emptyPort);
			},
			Error, 'Port must be a number'
			);

		test.throws(
			function() {
				configValidators.portValid(configs.nonNumericPort);
			},
			Error, 'Port must be a number'
			);

		test.throws(
			function() {
				configValidators.portValid(configs.lowPort);
			},
			Error, 'Port must be > 0'
			);

		test.throws(
			function() {
				configValidators.portValid(configs.highPort);
			},
			Error, 'Port must be < 65536'
			);

		// config contains not found element
		test.throws(
			function() {
				configValidators.notFoundExists(configs.noNotFound);
			},
			Error, 'Config requires notFound element'
			);

		test.throws(
			function() {
				configValidators.notFoundExists(configs.invalidNotFound);
			},
			Error, 'notFound must error on file not found'
			);

		test.done();
	}
};
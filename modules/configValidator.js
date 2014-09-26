/* jslint node: true */ 
'use strict';

var v = require('./configValidators');
var log = require('./logging');

exports.validate = function(config) {
	log.write('Validating configuration', 'init');

	v.hostsExists(config);
	v.hostsNotEmpty(config);
	v.hostsHaveInternalUrl(config);
	v.httpsHostsHaveCertInfo(config);
	v.aliasesHaveTargets(config);
	v.aliasesHaveValidTargets(config);
	v.httpsExistsIfHttpsHosts(config);
	v.certificateRootFolderSet(config);
	v.portExists(config);
	v.portValid(config);
	v.notFoundExists(config);
};
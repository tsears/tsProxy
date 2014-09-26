/* jslint node: true */ 
'use strict';

var fs = require('fs');

exports.hostsExists = function(config) {
	if (typeof(config.hosts) === 'undefined') {
		throw new Error('No hosts specified - missing hosts element');
	}
};

exports.hostsNotEmpty = function(config) {
	if (Object.keys(config.hosts).length < 1) {
		throw new Error('No hosts specified - empty hosts element');
	}
};

exports.hostsHaveInternalUrl = function(config) {
	for (var host in config.hosts) {
		if (typeof(config.hosts[host].internalUrl) === 'undefined') {
			throw new Error('Host: ' + host + " missing internalUrl");
		}
	}
};

exports.httpsHostsHaveCertInfo = function(config) {
	for (var hostName in config.hosts) {
		var host = config.hosts[hostName];

		if (host.https) {
			if (!host.cert) {
				throw new Error('Host: ' + host + " using https but missing cert info");
			}

			var cert = host.cert;

			if (!cert.privateKey) {
				throw new Error('Host: ' + host +  " missing private key");
			} else if(!cert.certificate) {
				throw new Error('Host: ' + host +  " missing certificate");
			}

		}
	}
};

exports.aliasesHaveTargets = function(config) {
	if (config.aliases) {
		for (var aliasName in config.aliases) {
			var alias = config.aliases[aliasName];

			if (!alias.aliasFor) {
				throw new Error('Alias ' + aliasName + 'missing target (aliasFor)');
			}
		}
	}
};

exports.aliasesHaveValidTargets = function(config) {
	if (config.aliases) {
		for (var aliasName in config.aliases) {
			var alias = config.aliases[aliasName];

			if (!config.hosts[alias.aliasFor]) {
				throw new Error('Alias' + aliasName + ' has an invalid target');
			}
		}
	}
};

// https settings present...
exports.httpsExistsIfHttpsHosts = function(config) {
	// if there are https hosts, the global https settings must be present...
	if (httpsHostsPresent(config) && !config.https) {
		throw new Error('Https host exists but no global https settings');
	}
};

// only required if there are https hosts...
exports.certificateRootFolderSet = function(config) {
	if (httpsHostsPresent(config) && !config.https.certificateFolder) {
		throw new Error('Certificate root folder not set.');
	}
};

exports.portExists = function(config) {
	if (!config.port) {
		throw new Error('No port specified');
	}
};

exports.portValid = function(config) {
	if ((config.port === parseInt(config.port, 10) === false) || config.port < 1 || config.port > 65535) {
		throw new Error('port must be a number between 1 and 65535');
	}
};

exports.notFoundExists = function(config) {
	if (!config.notFound) {
		throw new Error('notFound element missing (404 page markup)');
	}

	try {
		fs.readFileSync(config.notFound);
	} catch (e) {
		throw new Error('notFound file must exist');
	}
};

function httpsHostsPresent(config) {
	if (config.hosts) {
		for (var host in config.hosts) {
			if (config.hosts[host].https) {
				return true;
			}
		}
	}
	return false;
}
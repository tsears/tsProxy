var log = require('./logging');
var fs = require('fs');
var crypto = require('crypto');

/*
 * Exports...
 */

exports.loadSecureContexts = function(settings) {
	for (var host in settings.hosts) {
		var hostInfo = settings.hosts[host];

		if (hostInfo.https) {
			log.write('Loading certificates for ' + host, 'initinfo');
			var context = getSecureContext(settings.https.certificateFolder, hostInfo.cert);
			secureContext[host] = context;
		}
	}
	return secureContext;
};

// set https options... cert/key are a self-signed cert to prevent node https from complaining
exports.httpsOptions =  function(root) {
	return {
		SNICallback: function(domain) {
			log.write('retrieving certificate for ' + domain, 'info');
			return secureContext[domain];
		},
		cert: function() { return fs.readFileSync(root + '/' + settings.https.cert.certificate); },
		key: function() { return  fs.readFileSync(root + '/' + settings.https.cert.privateKey); },
	};
};

/*
 * Locals/Privates
 */

var secureContext = {};


function getSecureContext (root, certInfo) {
	var authorities = getAuthorityCerts(root, certInfo.authorities);

	var creds = crypto.createCredentials({
		key: fs.readFileSync(root + '/' + certInfo.privateKey),
		cert: fs.readFileSync(root + '/' + certInfo.certificate),
		ca: authorities
	});

	return creds.context;
}

function getAuthorityCerts(root, authorityFiles) {
	var authorities = [];
	for (var i = 0; i < authorityFiles.length; i++) {
		authorities.push(fs.readFileSync(root + '/' + authorityFiles[i]));
	}
	return authorities;
}
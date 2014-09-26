var http = require('http');
var https = require('https');
var log = require('./logging');
var tlsSessions = require('strong-cluster-tls-store');

exports.start = function(settings) {
	log.write('Starting Servers...', 'init');

	var server = http.createServer(settings.server.handler);
	server.listen(settings.port);

	log.write('http server started on ' + settings.port, 'initinfo');

	if (settings.https) {
		var secureServer = https.createServer(settings.server.ssl.httpsOptions(settings.https.certificateFolder), settings.server.handler);
		tlsSessions(secureServer);
		secureServer.listen(settings.https.port);
		log.write('https server started on ' + settings.https.port, 'initinfo');
	}
};
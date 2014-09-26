
var server = require('./modules/server');
var log = require('./modules/logging');
var ssl = require('./modules/ssl');
var tsProxy = require('./modules/tsProxy');
var config = require('./modules/config');

// load settings
log.write('Initializing...', 'init');

var settings;
try {
	settings = config.load('/etc/tsProxy/config.json');	// relative to config module location, not main location...
	ssl.loadSecureContexts(settings);
} catch (e) {
	log.write('Error reading configuration\n' + e, 'error');
	process.exit(1);
}

settings.server = {};
settings.server.ssl = ssl;
settings.server.proxyServer = tsProxy.getProxyServer(settings);
settings.server.handler = tsProxy.getHandler(settings.server.proxyServer, settings);

// start servers
server.start(settings);
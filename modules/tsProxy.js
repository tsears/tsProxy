var log = require('./logging');
var config = require('./config');
var httpProxy = require('http-proxy');
var fs = require('fs');

exports.getHandler = function(proxyServer, settings) {
	return function (req, res) {
		var hostHeader = req.headers.host;
		
		log.write('Request for ' + hostHeader, 'info', req);

		var hostInfo = settings.hosts[hostHeader];
		var redirectHost = settings.redirects[hostHeader];

		if (hostInfo) {
			if (hostInfo.aliasFor) {
				hostInfo = settings.hosts[hostInfo.aliasFor];
			}

			log.write('proxying for internal url: ' + hostInfo.internalUrl, 'info', req);
			return proxyServer.web(req, res, {target: hostInfo.internalUrl});
		} else if (redirectHost) {
			var protocol = req.connection.encrypted ? 'https://' : 'http://'; //req.connection.encrypted is undefined for non-https
			var url = req.url;

			var requestUrl = protocol + hostHeader + url;
			var redirectUrl = protocol + redirectHost + url;

			log.write('redirecting request for ' + requestUrl + ' to ' + redirectUrl, 'info', req);
			res.writeHead(301, {"Location" : redirectUrl});
			return res.end();

		} else {
			log.write('Unable to find ' + hostHeader, 'error', req);
			showNotFound(settings, res);		
		}
	};
};

exports.getProxyServer = function(settings) {
	var proxyServer = httpProxy.createProxyServer({});
	proxyServer.on('error', function(err, req, res) {
		log.write('Bad request for [' + req.headers.host + ']\n' + err, 'error');
		showNotFound(settings, res);
	});

	return proxyServer;
};

function showNotFound(settings, res) {
	res.writeHead(404, {'Content-Type': 'text/html'});
	var notFound = fs.readFileSync(settings.notFound);
	res.end(notFound);	
}

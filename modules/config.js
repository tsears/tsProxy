var log = require('./logging');
var v = require('./configValidator');

exports.load = function(configPath) {
	var config = require(configPath);
	v.validate(config);
	
	// set up aliases... create a duplicate entry of aliased host with alias name
	if (config.aliases) {
		for (var alias in config.aliases) {
			var aliasInfo = config.aliases[alias];
			config.hosts[alias] = config.hosts[aliasInfo.aliasFor];
			log.write('Added [' + alias + '] as alias for [' + aliasInfo.aliasFor + ']', 'initinfo');	
		}
	}

	return config;
};
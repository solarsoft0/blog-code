"use strict";

var fs = require('fs'),
	path = require('path'),
	_ = require('lodash'),
	logManager = require('./logging');
	
var logger = logManager.getLogger('configuration');

function fixFilename(fn) {
	if (fn[0] !== '/' && fn[1] !== ':') {
		return path.resolve(path.join(__dirname, fn));
	} else {
		return fn;
	}
}

function fileExists(fn) {
	try {
		var s = fs.statSync(fn);
		if (s.isFile()) {
			return true;
		} else {
			return false;
		}
	} catch (e) {
		return false;
	}
}

var defaultOptions = {
	port: 3000,
	host: 'localhost',
	defaultRoute: '/home',
	https: {
		ciphers: 'ECDHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA256:AES128-GCM-SHA256:RC4:HIGH:!MD5:!aNULL',
		honorCipherOrder: true
	},
	serverMode: 'http',
	views: {
		directory: path.resolve(path.join(__dirname, '../views')),
		options: {
			defaultLayout: '_layouts/main',
		}
	},
	controllers: {
		directory: path.resolve(path.join(__dirname, '../controllers'))
	},
	session: {
		options: {
			secret: 'app-secret',
			resave: false,
			saveUninitialized: false,
			unset: 'destroy'
		}
	},
	staticFiles: {
		directory: path.resolve(path.join(__dirname, '../wwwroot')),
		favicon: path.resolve(path.join(__dirname, '../wwwroot/favicon.ico')),
		options: {
			dotfiles: 'ignore',
			etag: true,
			index: [ 'index.html' ],
			lastModified: true,
			redirect: true
		}
	}
};

var configPath = path.resolve(path.join(__dirname, '../config')),
	mainConfigFile = path.resolve(path.join(configPath, 'config.json')),
	localConfigFile = path.resolve(path.join(configPath, 'config-local.json'));
	
logger.debug('Loading %s', mainConfigFile);
var mainConfig = fileExists(mainConfigFile) ? require(mainConfigFile) : {};
logger.debug('Loading %s', localConfigFile);
var localConfig = fileExists(localConfigFile) ? require(localConfigFile) : {};

var envOverrides = { https: {} };
// If the following environment variables exist, then use them
//		PORT => options.port
//		HOST => options.host
//		CERTPASSPHRASE => options.https.passphrase
if (process.env.PORT) {
	logger.debug('Environment Override for PORT');
	envOverrides.port = process.env.PORT;
}

if (process.env.HOST) {
	logger.debug('Environment Override for HOST');
	envOverrides.host = process.env.HOST;
}

if (process.env.CERTPASSPHRASE) {
	logger.debug('Environment Override for CERTPASSPHRASE');
	envOverrides.https.passphrase = process.env.CERTPASSPHRASE;
}

logger.debug('Merging Configuration');
var options = _.assign(defaultOptions, mainConfig, localConfig, envOverrides);

// If any of the following are files, then load them from a file
//		options.https.pfx
//		options.https.cert
//		options.https.key
//		options.https.ca
var fileKeys = [ 'pfx', 'cert', 'key', 'ca' ];
_.forEach(fileKeys, function (k) {
	if (options.https[k]) {
		logger.debug('Converting options.https.%s to file', k);
		options.https[k] = fs.readFileSync(fixFilename(options.https[k]));
	}
});

// If any of the following are pathnames, then we need to resolve them
options.views.directory = fixFilename(options.views.directory);
options.controllers.directory = fixFilename(options.controllers.directory);
options.staticFiles.directory = fixFilename(options.staticFiles.directory);
options.staticFiles.favicon = fixFilename(options.staticFiles.favicon);

logger.trace('Exported Configuration: ', options);
module.exports = options;
	
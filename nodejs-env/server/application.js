"use strict";

var config = require('./configuration'),
	logManager = require('./logging'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	ejs = require('ejs'),
	express = require('express'),
	favicon = require('serve-favicon'),
	fs = require('fs'),
	methodOverride = require('method-override'),
	partials = require('express-partials'),
	path = require('path'),
	serveStatic = require('serve-static'),
	session = require('express-session');
	
function resolvePath(fn) {
	if (fn[0] !== '/' && fn[1] != ':') {
		return path.resolve(path.join(__dirname, fn)); 
	} else {
		return fn;
	}
}

var app = express(), logger = logManager.getLogger('express');

logger.debug('Configuring Express Basic Settings');
app.set('port', config.port);
app.set('views', resolvePath(config.views.directory));
app.use(logManager.connectLogger(logger, { level: logManager.levels.INFO }));

logger.debug('Configuring View Engine');
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.set('view options', config.views.options);
app.use(partials());

logger.debug('Configuring Express Session Management');
app.use(cookieParser());
app.use(session(config.session.options));

logger.debug('Configuring HTTP Stream Handling');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

logger.debug('Configuring Static File Service');
app.use(serveStatic(resolvePath(config.staticFiles.directory), config.staticFiles.options));
var fIcon = resolvePath(config.staticFiles.favicon);
try {
	var fIconStats = fs.statSync(fIcon);
	if (fIconStats.isFile()) {
		logger.debug('Found favicon - linking');
		app.use(favicon(fIcon));
	} else {
		logger.error('Found favicon but it is not a file - not linking');
	}
} catch (e) {
	logger.debug('Favicon not found (or permissions error) - not linking: ', e.code);
}

var controllerPath = resolvePath(config.controllers.directory);
logger.debug('Loading controllers from ', controllerPath);
fs.readdirSync(controllerPath).forEach(function (file) {
	if (file.substr(-3) === '.js') {
		logger.debug('Loading Controller %s', file);
		app.use('/' + path.basename(file, '.js'), require(path.join(controllerPath, file)));
	}
});

logger.debug('Installing Home Page Redirect to %s', config.defaultRoute);
app.get('/', function (req, res) {
	res.redirect(config.defaultRoute);
});

module.exports = app;
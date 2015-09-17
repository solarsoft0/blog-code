/// <reference path="typings/node/node.d.ts"/>

"use strict";

var logManager = require('./server/logging'),
	config = require('./server/configuration'),
	_ = require('lodash');
	
var logger = logManager.getLogger('server-bootstrap');
var serverModes = (config.serverMode || 'http').split(',');
var app = require('./server/application');

// Create HTTP Connection
var httpMode = _.indexOf(serverModes, 'http') !== -1;
if (httpMode) {
	var http = require('http');
	var httpPort = app.get('port');
	http.createServer(app).listen(httpPort, function (err) {
		if (err) {
			logger.error('Unable to listen to HTTP port %d: ', httpPort, err);
		} else {
			logger.info('Listening to HTTP requests on port %d', httpPort);
		}
	});
}

// Create HTTPS Connection
var httpsMode = _.indexOf(serverModes, 'https') !== -1;
if (httpsMode) {
	var https = require('https');
	var httpsPort = httpMode ? (app.get('port') === 80 ? 443 : app.get('port') + 1) : app.get('port');
	https.createServer(config.https, app).listen(httpsPort, config.host, function (err) {
		if (err) {
			logger.error('Unable to listen to HTTPS port %d: ', httpsPort, err);
		} else {
			logger.info('Listening to HTTPS requests on port %d', httpsPort);
		}
	});
}
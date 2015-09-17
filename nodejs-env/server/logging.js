"use strict";

var fs = require('fs'),
	path = require('path'),
	log4js = require('log4js'),
	_ = require('lodash');
	
var defaultLogConfig = {
	appenders: [
		{ type: 'console' }
	],
	levels: {
		'[all]': 'INFO'
	}
};

// You can't use ./configuration.js for this - you have to use a separate
// log4js.json because configuration uses logging and you need to be explicit
// to avoid a circular reference loop
var configFile = path.resolve(path.join(__dirname, '../config/log4js.json'));
var loadedConfig = fs.exists(configFile) ? require(configFile) : {};
var log4jsConfig = _.assign(defaultLogConfig, loadedConfig);

log4js.configure(log4jsConfig);
module.exports = log4js;

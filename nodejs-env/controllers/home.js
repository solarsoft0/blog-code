"use strict";

/*
 * Controller for /home/<whatever>
 */
var express = require('express'),
	path = require('path'),
	_ = require('lodash');

var controller = path.basename(__filename, '.js'),
	router = express.Router(); // eslint-disable-line new-cap

var mkPath = function (view) {
	return controller + '/' + view + '.html';
};

var defaultProperties = {
	title: 'Not Set'
};

router.get('/index', function (req, res) {
	res.render(mkPath('index'), _.assign(defaultProperties, {
		title: 'Index',
		path: '/home/index'
	}));
});

var skipenv = [ 'path', 'psmodulepath', 'pathext', 'programfiles', 'programfiles(x86)', 'programdata', 'programw6432' ];
router.get('/env', function (req, res) {
	var o = _.assign({}, process.env);
	for (var k in o) {
		if (skipenv.indexOf(k.toLowerCase()) !== -1) {
			delete o[k];
		}
	}

	res.render(mkPath('env'), _.assign(defaultProperties, {
		title: 'Environment',
		path: '/home/env',
		env: o
	}));
})

router.get('/', function (req, res) {
	res.redirect('/' + controller + '/index');
});

module.exports = router;

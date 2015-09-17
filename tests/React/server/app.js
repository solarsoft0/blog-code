var koa = require('koa'),
    staticFiles = require('koa-static'),
    logger = require('koa-log4js');

var app = koa();

// Logging - Console logger
app.use(logger());

// Static Files
app.use(staticFiles('./public'));

// HTTP Listen on port 3000
app.listen(3000);
console.log("Listening on port 3000");

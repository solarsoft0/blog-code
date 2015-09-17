var express = require("express"),
	jwt = require("express-jwt"),
	morgan = require("morgan"),
	staticFiles = require("serve-static"),
	spells = require("./spells.json"),
	config = require("./config.json");

var app = express();

// Check that the JWT is signed by us
var jwtCheck = jwt({
  secret: new Buffer(config.clientSecret, 'base64'),
  audience: config.clientID
});

// Set the port to listen on
app.set("port", process.env.PORT || 3000);

// Set up logging
app.use(morgan("combined"));

// Set up static files within public
app.use(staticFiles("public"));

// Set up a JWT Check for the /api/spells layer
app.use("/api/spells", jwtCheck);

// Set up the spells endpoint
app.get("/api/spells", function (request, response) {
	response.send(spells);
});


// Listen on the TCP port
app.listen(app.get("port"), function () {
	console.log("Listening on port " + app.get("port"));
});
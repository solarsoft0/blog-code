require.config({
    baseUrl: "/js",
    paths: {
        "jquery": "/lib/jquery/dist/jquery",
        "bootstrap": "/lib/bootstrap/dist/js/bootstrap.min"
    },
    shim: {
        "bootstrap": { deps: ["jquery"] }
    }
});

require([
    "jquery",
    "bootstrap"
], function ($) {
	$(document).ready(function() {
		console.log("In Application Startup");
	});
});

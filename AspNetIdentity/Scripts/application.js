require.config({
    baseUrl: "Scripts",
    paths: {
        "jquery": "../lib/jquery/dist/jquery.min",
        "bootstrap": "../lib/bootstrap/dist/js/bootstrap.min"
    },
    shim: {
        "bootstrap": {
            deps: ["jquery"]
        }
    }
});

require([
    "jquery", "bootstrap"
], function ($) {
    $(document).ready(function () {

    });
});

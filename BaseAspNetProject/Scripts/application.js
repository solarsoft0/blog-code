require.config({
    baseUrl: "Scripts",
    // Define your paths for each library here
    paths: {
        jquery: "../lib/jquery/dist/jquery.min",
        bootstrap: "../lib/bootstrap/dist/js/bootstrap.min"
    },
    shim: {
        "bootstrap": { deps: [ "jquery" ]}
    }
});

require([
    "jquery",       // Becomes $ in the function body
    "bootstrap"
], function ($) {
    $(document).ready(function () {

        // Application initialization code goes here

    });
});
require('bootstrap');
require('bootstrap/css/bootstrap.css!');
var App = (function () {
    function App() {
    }
    App.prototype.configureRouter = function (config, router) {
        config.title = 'Aurelia';
        config.addPipelineStep('authorize', AuthorizeStep);
        config.map([
            { route: 'welcome', name: 'welcome', moduleId: './pages/welcome', nav: true, title: 'Welcome' },
            { route: 'flickr', name: 'flickr', moduleId: './pages/flickr', nav: AuthorizeStep.isLoggedIn(), auth: true, title: 'Flickr' },
            { route: 'spells', name: 'spells', moduleId: './pages/spells', nav: true, title: 'Spells' },
            { route: '', redirect: 'welcome' },
        ]);
        this.router = router;
    };
    return App;
})();
exports.App = App;
var AuthorizeStep = (function () {
    function AuthorizeStep() {
    }
    AuthorizeStep.prototype.run = function (routingContext, next) {
        if (routingContext.nextInstructions.some(function (i) { return i.config.auth; })) {
            var isLoggedIn = AuthorizeStep.isLoggedIn();
            if (!isLoggedIn) {
                console.log("User is not logged in - clicking on app-authenticator");
                var authButton = (document.getElementById("app-authenticator"));
                authButton.click();
                return next.cancel();
            }
        }
        return next();
    };
    AuthorizeStep.isLoggedIn = function () {
        var auth_token = localStorage.getItem("auth_token");
        return (typeof auth_token !== "undefined" && auth_token !== null);
    };
    return AuthorizeStep;
})();

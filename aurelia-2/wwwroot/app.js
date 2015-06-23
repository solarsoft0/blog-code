require('bootstrap');
require('bootstrap/css/bootstrap.css!');
var App = (function () {
    function App() {
    }
    App.prototype.configureRouter = function (config, router) {
        config.title = 'Aurelia';
        config.addPipelineStep('authorize', AuthorizeStep);
        config.addPipelineStep('modelbind', AppInsights);
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
var AppInsights = (function () {
    function AppInsights() {
        // Copy lines 9-15 from the App Insights QuickStart to here
        this.server = window.appInsights || function (config) {
            function s(config) { t[config] = function () { var i = arguments; t.queue.push(function () { t[config].apply(t, i); }); }; }
            var t = { config: config }, r = document, f = window, e = "script", o = r.createElement(e), i, u;
            for (o.src = config.url || "//az416426.vo.msecnd.net/scripts/a/ai.0.js", r.getElementsByTagName(e)[0].parentNode.appendChild(o), t.cookie = r.cookie, t.queue = [], i = ["Event", "Exception", "Metric", "PageView", "Trace"]; i.length;)
                s("track" + i.pop());
            return config.disableExceptionTracking || (i = "onerror", s("_" + i), u = f[i], f[i] = function (config, r, f, e, o) { var s = u && u(config, r, f, e, o); return s !== !0 && t["_" + i](config, r, f, e, o), s; }), t;
        }({
            instrumentationKey: "{{INSERT-INSTRUMENTATION-KEY-HERE}}"
        });
        window.appInsights = this.server;
    }
    AppInsights.prototype.run = function (routingContext, next) {
        var origin = window.location.pathname + window.location.hash;
        var path = origin.replace("/#/", "/").replace("#", "");
        console.log("[AppInsights] Tracking for %s", path);
        this.server.trackPageView(path);
        return next();
    };
    return AppInsights;
})();

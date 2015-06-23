import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';

export class App {
    public router: any;

    configureRouter(config, router) {
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
    }
}

class AuthorizeStep {
    run(routingContext, next) {
        if (routingContext.nextInstructions.some(i => i.config.auth)) {
            var isLoggedIn = AuthorizeStep.isLoggedIn();
            if (!isLoggedIn) {
                console.log("User is not logged in - clicking on app-authenticator");
                var authButton = <HTMLDivElement>(document.getElementById("app-authenticator"));
                authButton.click();
                return next.cancel();
            }
        }
        return next();
    }

    static isLoggedIn(): boolean {
        var auth_token = localStorage.getItem("auth_token");
        return (typeof auth_token !== "undefined" && auth_token !== null);
    }
}

class AppInsights {
    private server: any;

    constructor() {
        // Copy lines 9-15 from the App Insights QuickStart to here
        this.server = window.appInsights || function (config) {
            function s(config) { t[config] = function () { var i = arguments; t.queue.push(function () { t[config].apply(t, i) }) } } var t = { config: config }, r = document, f = window, e = "script", o = r.createElement(e), i, u; for (o.src = config.url || "//az416426.vo.msecnd.net/scripts/a/ai.0.js", r.getElementsByTagName(e)[0].parentNode.appendChild(o), t.cookie = r.cookie, t.queue = [], i = ["Event", "Exception", "Metric", "PageView", "Trace"]; i.length;)s("track" + i.pop()); return config.disableExceptionTracking || (i = "onerror", s("_" + i), u = f[i], f[i] = function (config, r, f, e, o) { var s = u && u(config, r, f, e, o); return s !== !0 && t["_" + i](config, r, f, e, o), s }), t
        } ({
            instrumentationKey: "{{INSERT-INSTRUMENTATION-KEY-HERE}}"
            });
        window.appInsights = this.server;
    }

    run(routingContext, next) {
        var origin = window.location.pathname + window.location.hash;
        var path = origin.replace("/#/", "/").replace("#", "");
        console.log("[AppInsights] Tracking for %s", path);
        this.server.trackPageView(path);
        return next();
    }
}

import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';

export class App {
    public router: any;

    configureRouter(config, router) {
        config.title = 'Aurelia';

        config.addPipelineStep('authorize', AuthorizeStep);

        config.map([
            { route: 'welcome', name: 'welcome', moduleId: './pages/welcome', nav: true, title: 'Welcome' },
            { route: 'flickr', name: 'flickr', moduleId: './pages/flickr', nav: AuthorizeStep.isLoggedIn(), auth: true, title: 'Flickr' },
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

import {Router, Redirect} from 'aurelia-router';
import {Container} from 'aurelia-dependency-injection';

export class AppRouter {
    static inject() {
        console.debug("[AppRouter::inject]");
        return [ Router ];
    }

    constructor(router) {
        console.debug("[AppRouter::constructor]");
        this.router = router;
        this.router.configure(config => {
            config.title = "Aurelia Character Sheet";
            config.addPipelineStep('authorize', LoginPipelineHandler);
            config.map([
                /* Area: Account */
                { route: "login", moduleId: "app/account/login", anonymous: true, title: "Login" },

                /* Area: Pages */
                { route: "welcome", moduleId: "app/pages/welcome", nav: true, title: "Welcome" },

                /* Default Route */
                { route: "", redirect: "welcome" }
            ]);
        });
    }
}

class LoginPipelineHandler {
    static inject() {
        console.debug("[LoginPipelineHandler::inject]");
        return [];
    }

    constructor() {
        console.debug("[LoginPipelineHandler::constructor]");
    }

    run(routingContext, next) {
        console.debug("[LoginPipelineHandler::run]: routingContext = %o", routingContext);
        console.debug("[LoginPipelineHandler::run]: next = %o", next);

        // If anonymous is set to true, then go to next instruction automatically
        if (routingContext.nextInstructions.some(i => i.config.anonymous)) {
            return next();
        } else {
            var isLoggedIn = false; // We are not logged in (always)
            if (!isLoggedIn) {
                return next.cancel(new Redirect("login"));
            }
        }

        return next();
    }
}
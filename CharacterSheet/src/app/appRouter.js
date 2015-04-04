import {Router, Redirect} from "aurelia-router";
import {Container} from "aurelia-dependency-injection";
import {LogManager} from "aurelia-framework";

var logger = LogManager.getLogger("app/appRouter");

class LoginPipelineHandler {
    static inject() {
        logger.debug("[LoginPipelineHandler::inject]");
        return [];
    }

    constructor() {
        logger.debug("[LoginPipelineHandler::constructor]");
    }

    run(routingContext, next) {
        logger.debug("[LoginPipelineHandler::run]: routingContext = %o", routingContext);

        // If anonymous is set to true, then go to next instruction automatically
        if (routingContext.nextInstructions.some(i => i.config.anonymous)) {
            logger.debug("[LoginPipelineHandler::run]: Anonymous page requested - return next()");
            return next();
        } else {
            logger.debug("[LoginPipelineHandler::run]: Authenticated page requested");
            var isLoggedIn = false; // We are not logged in (always)
            logger.debug("[LoginPipelineHandler::run]: isLoggedIn = %o", isLoggedIn);
            if (!isLoggedIn) {
                logger.debug("[LoginPipelineHandler::run]:: Redirect to login route");
                return next.cancel(new Redirect("login"));
            }
        }
        logger.debug("[LoginPipelineHandler::run]: Authentication OK - return next()");
        return next();
    }
}

export class AppRouter {

    static inject() {
        logger.debug("[AppRouter::inject]");
        return [ Router ];
    }

    constructor(router) {
        logger.debug("[AppRouter::constructor]");
        this.router = router;
        this.router.configure(config => {
            config.title = "Aurelia Character Sheet";
            config.addPipelineStep("authorize", LoginPipelineHandler);
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



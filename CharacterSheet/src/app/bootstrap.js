import {LogManager} from "aurelia-framework";
import {ConsoleAppender} from "aurelia-logging-console";

LogManager.addAppender(new ConsoleAppender());
LogManager.setLevel(LogManager.levels.debug);

var logger = LogManager.getLogger("app/bootstrap");

export function configure(aurelia) {
    logger.debug("[configure(aurelia)]");

    aurelia.use
        .defaultBindingLanguage()
        .defaultResources()
        .router()
        .eventAggregator()
        .developmentLogging();

    aurelia.start()
        .then(a => a.setRoot("app/appRouter", document.body));
}

import {LogManager} from "aurelia-framework";

var logger = LogManager.getLogger("app/account/login");

export class Login {
    constructor() {
        logger.debug("[Login::constructor]");
    }
}

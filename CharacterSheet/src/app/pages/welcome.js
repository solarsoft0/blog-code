import {LogManager} from "aurelia-framework";

var logger = LogManager.getLogger("app/pages/welcome");

export class Welcome {
    constructor() {
        logger.debug("[Welcome::constructor]");
        this.heading = "Welcome to the Aurelia Navigation App!";
        this.firstName = "John";
        this.lastName = "Doe";
    }

    get fullName() {
        let r = `${this.firstName} ${this.lastName}`;
        logger.debug("[Welcome::fullName] Returning %s", r);
        return r;
    }

    welcome() {
        logger.debug("[Welcome::welcome()]");
        alert(`Weclome, ${this.fullName}!`);  // eslint-disable-line no-alert
    }
}

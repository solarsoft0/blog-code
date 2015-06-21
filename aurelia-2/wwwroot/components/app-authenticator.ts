///<reference path="Auth0Lock.d.ts" />

import {customElement, bindable} from "aurelia-framework";
import * as Auth0Lock from "auth0/lock";

@customElement("app-authenticator")
export class AppAuthenticator {
    @bindable classList = "fa fa-sign-in";
    @bindable title = "Sign In";

    private lock: Auth0Lock;

    constructor() {
        console.log("[AppAuthenticator] in constructor...");
        this.lock = new Auth0Lock("Po8srwATzQu3wRCLBFQxjE6OHW1qcNgz", "shellmonger.auth0.com");

        // Store the JWT for later use if we are returning from an authentication - this
        let hash = this.lock.parseHash(window.location.hash);
        if (hash && hash.id_token) {
            console.log("[AppAuthenticator] storing hash id_token in localStorage");
            localStorage.setItem("auth_token", hash.id_token);
            window.location.href = localStorage.getItem("auth_redirect");
        }
        if (hash && hash.error) {
            alert("Authentication Error! " + hash.error + "\n" + hash.error_description);
        }

        // IF the auth token exists, then we are authenticated
        let auth_token = localStorage.getItem("auth_token");
        if (auth_token) {
            this.setSignOut();
        } else {
            this.setSignIn();
        }
    }

    // Event handler when the user clicks on the icon (whatever it is)
    click() {
        console.log("[AppAuthenticator] click ");
        let auth_token = localStorage.getItem("auth_token");
        if (auth_token) {
            // We clicked on the sign-out sign
            localStorage.removeItem("auth_token");
            history.go(0);
        } else {
            // We clicked on the sign-in sign
            localStorage.setItem("auth_redirect", window.location.href);
            this.lock.show({
                authParams: {
                    scope: "openid"
                }
            });
        }
    }

    // Make the icon a sign-in icon
    setSignIn() {
        console.log("[AppAuthenticator] Setting Sign-in Status");
        this.classList = "fa fa-sign-in";
        this.title = "Sign In";
    }

    // Make the icon a sign-out icon
    setSignOut() {
        console.log("[AppAuthenticator] Setting Sign-out Status");
        this.classList = "fa fa-sign-out";
        this.title = "Sign Out";
    }
}
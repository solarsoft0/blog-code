///<reference path="Auth0Lock.d.ts" />
var __decorate = this.__decorate || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var aurelia_framework_1 = require("aurelia-framework");
var Auth0Lock = require("auth0/lock");
var AppAuthenticator = (function () {
    function AppAuthenticator() {
        this.classList = "fa fa-sign-in";
        this.title = "Sign In";
        console.log("[AppAuthenticator] in constructor...");
        this.lock = new Auth0Lock("Po8srwATzQu3wRCLBFQxjE6OHW1qcNgz", "shellmonger.auth0.com");
        // Store the JWT for later use if we are returning from an authentication - this
        var hash = this.lock.parseHash(window.location.hash);
        if (hash && hash.id_token) {
            console.log("[AppAuthenticator] storing hash id_token in localStorage");
            localStorage.setItem("auth_token", hash.id_token);
            window.location.href = localStorage.getItem("auth_redirect");
        }
        if (hash && hash.error) {
            alert("Authentication Error! " + hash.error + "\n" + hash.error_description);
        }
        // IF the auth token exists, then we are authenticated
        var auth_token = localStorage.getItem("auth_token");
        if (auth_token) {
            this.setSignOut();
        }
        else {
            this.setSignIn();
        }
    }
    // Event handler when the user clicks on the icon (whatever it is)
    AppAuthenticator.prototype.click = function () {
        console.log("[AppAuthenticator] click ");
        var auth_token = localStorage.getItem("auth_token");
        if (auth_token) {
            // We clicked on the sign-out sign
            localStorage.removeItem("auth_token");
            history.go(0);
        }
        else {
            // We clicked on the sign-in sign
            localStorage.setItem("auth_redirect", window.location.href);
            this.lock.show({
                authParams: {
                    scope: "openid"
                }
            });
        }
    };
    // Make the icon a sign-in icon
    AppAuthenticator.prototype.setSignIn = function () {
        console.log("[AppAuthenticator] Setting Sign-in Status");
        this.classList = "fa fa-sign-in";
        this.title = "Sign In";
    };
    // Make the icon a sign-out icon
    AppAuthenticator.prototype.setSignOut = function () {
        console.log("[AppAuthenticator] Setting Sign-out Status");
        this.classList = "fa fa-sign-out";
        this.title = "Sign Out";
    };
    __decorate([
        aurelia_framework_1.bindable
    ], AppAuthenticator.prototype, "classList");
    __decorate([
        aurelia_framework_1.bindable
    ], AppAuthenticator.prototype, "title");
    AppAuthenticator = __decorate([
        aurelia_framework_1.customElement("app-authenticator")
    ], AppAuthenticator);
    return AppAuthenticator;
})();
exports.AppAuthenticator = AppAuthenticator;

var aurelia_http_client_1 = require('aurelia-http-client');
var Spells = (function () {
    function Spells() {
        this.heading = 'Spells';
        this.data = '';
        this.code = '';
        this.loading = false;
        this.http = null;
        var auth_token = localStorage.getItem("auth_token");
        if (auth_token != null) {
            this.http = new aurelia_http_client_1.HttpClient().configure(function (x) {
                x.withBaseUrl(window.location.origin);
                x.withHeader("Authorization", "Bearer " + localStorage.getItem("auth_token"));
                x.withHeader("Accept", "application/json");
            });
        }
        else {
            this.http = new aurelia_http_client_1.HttpClient().configure(function (x) {
                x.withBaseUrl(window.location.origin);
            });
        }
    }
    Spells.prototype.activate = function () {
        var _this = this;
        this.loading = true;
        return this.http.get("/api/Spells").then(function (response) {
            _this.data = response.content;
            _this.code = response.statusCode.toString();
            _this.loading = false;
        });
    };
    Spells.prototype.canDeactivate = function () {
        if (this.loading) {
            return confirm("Still loading - are you sure?");
        }
        return true;
    };
    return Spells;
})();
exports.Spells = Spells;

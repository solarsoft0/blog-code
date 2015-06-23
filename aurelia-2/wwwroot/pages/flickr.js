var __decorate = this.__decorate || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var aurelia_framework_1 = require('aurelia-framework');
var aurelia_http_client_1 = require('aurelia-http-client');
var Flickr = (function () {
    function Flickr(http) {
        this.heading = 'Flickr';
        this.loading = false;
        this.images = [];
        this.url = 'http://api.flickr.com/services/feeds/photos_public.gne?tags=rainier&tagmode=any&format=json';
        this.http = http;
    }
    Flickr.prototype.activate = function () {
        var _this = this;
        this.loading = true;
        return this.http.jsonp(this.url).then(function (response) {
            _this.images = response.content.items;
            _this.loading = false;
        });
    };
    Flickr.prototype.canDeactivate = function () {
        if (this.loading) {
            return confirm("Still loading - are you sure?");
        }
        return true;
    };
    Flickr = __decorate([
        aurelia_framework_1.inject(aurelia_http_client_1.HttpClient)
    ], Flickr);
    return Flickr;
})();
exports.Flickr = Flickr;

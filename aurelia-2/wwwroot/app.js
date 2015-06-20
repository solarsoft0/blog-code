require('bootstrap');
require('bootstrap/css/bootstrap.css!');
var App = (function () {
    function App() {
    }
    App.prototype.configureRouter = function (config, router) {
        config.title = 'Aurelia';
        config.map([
            { route: ['', 'welcome'], name: 'welcome', moduleId: './pages/welcome', nav: true, title: 'Welcome' },
            { route: 'flickr', name: 'flickr', moduleId: './pages/flickr', nav: true, title: 'Flickr' }
        ]);
        this.router = router;
    };
    return App;
})();
exports.App = App;

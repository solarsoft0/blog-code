import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';

export class App {
    configureRouter(config, router) {
        config.title = 'Aurelia';
        config.map([
            { route: ['', 'welcome'], name: 'welcome', moduleId: './pages/welcome', nav: true, title: 'Welcome' },
            { route: 'flickr', name: 'flickr', moduleId: './pages/flickr', nav: true, title: 'Flickr' }
        ]);
        this.router = router;
    }
}

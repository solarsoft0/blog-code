import 'bootstrap';
import 'bootstrap/css/bootstrap.css!';

export class App {
	configureRouter(config, router) {
		config.title = "Aurelia";

		config.map([
			{ route: [ "", "welcome" ], name: "welcome", moduleId: "./welcome", nav: true, title: "Welcome" },
			{ route: "flickr", name: "flickr", moduleId: "./flickr", nav: true, title: "Flickr" },
			{ route: "spells", name: "spells", moduleId: "./spells", nav: true, auth: true, title: "Spells" }
		]);

		this.router = router;
	}
}

import {inject} from "aurelia-framework";
import {HttpClient} from "aurelia-http-client";

@inject(HttpClient)
export class Flickr {
	heading = "Flickr";
	images = [];
	url = "http://api.flickr.com/services/feeds/photos_public.gne?tags=ranier&tagmode=any&format=json";
	isLoading = false;

	constructor(http) {
		this.http = http;
	}

	activate() {
		this.isLoading = true;
		return this.http.jsonp(this.url).then(response => {
			this.images = response.content.items;
			this.isLoading = false;
		});
	}

	canDeactivate() {
		if (this.isLoading) {
			return confirm("Still loading - are you sure?");
		}
		return true;
	}
}

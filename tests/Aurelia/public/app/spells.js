import {inject} from "aurelia-framework";
import {HttpClient} from "aurelia-http-client";

export class Spells {
	heading = "Spells";
	spellList = [];
	url = "/api/spells";
	isLoading = false;
	
	activate() {
		let client = new HttpClient();
		if (localStorage.getItem("auth0token")) {
			let token = localStorage.getItem("auth0token");
			client.configure(x => x.addHeader("Authorization", "Bearer " + token));
		}
		
		this.isLoading = true;
		return client.get(this.url).then(response => {
			console.info("SPELLS: Response Content = ", response.content);
			this.isLoading = false;
		});
	}

	canDeactivate() {
		if (this.isLoading) {
			return confirm("Still loading - are you sure?");
		}
			
}
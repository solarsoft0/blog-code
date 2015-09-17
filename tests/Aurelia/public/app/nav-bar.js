import {inject, bindable} from "aurelia-framework";

@inject(Element)
export class NavBar {
	// The router and "this element"
	@bindable router = null;
	el = null;

	// The Auth0Lock object
	lock = null;

	// Private variables
	loggedIn = false;
	token = null;
	profile = null;
	profileID = "auth0profile";
	tokenID = "auth0token";

	// We use dependency injection to get the element into the object
	constructor(el) {
		this.el = el;
	}

	// Part of the Web Component Lifycycle - called when the element is attached
	// to the DOM
	attached() {
		// If we don't have a LOCK object yet, create one with our settings
		if (this.lock == null) {
			this.lock = new Auth0Lock('Po8srwATzQu3wRCLBFQxjE6OHW1qcNgz', 'shellmonger.auth0.com');
		}

		// Check to see if we are already logged in - if we are, then set the
		// navbar to reflect logged in.
		if (localStorage.getItem(this.tokenID)) {
			this.loggedIn = true;
			this.token = localStorage.getItem(this.tokenID);
			this.profile = JSON.parse(localStorage.getItem(this.profileID));
		}
		this.setAuthState();
	}

	// Sets up the DOM within the nav-bar element to show the auth status.
	setAuthState() {
		let navProfile = this.el.querySelector("#navProfile"),
			navButton = this.el.querySelector("#navSignIn > i"),
			authElements = this.el.querySelectorAll(".authentication");

		if (this.loggedIn) {
			navProfile.innerHTML = this.profile.name || this.profile.nickname;
			navButton.className = "fa fa-sign-out";

			for (var i = 0 ; i < authElements.length ; ++i) {
				authElements[i].classList.remove("auth-hide");
			}

		} else {
			navProfile.innerHTML = "";
			navButton.className = "fa fa-sign-in";

			for (var i = 0 ; i < authElements.length ; ++i) {
				authElements[i].classList.add("auth-hide");
			}
		}

	}

	// Handles the case when the user clicks on the sign-in/out icon.
	authClick(evt) {
		evt.preventDefault();

		// Process for logging out (i.e. we clicked when we were logged in)
		if (this.loggedIn) {
			localStorage.removeItem(this.tokenID);
			localStorage.removeItem(this.profileID);
			this.token = null;
			this.profile = null;
			this.loggedIn = false;
			this.setAuthState();
			return;
		}

		// Process for logging in (show the lock screen)
		this.lock.show((err, profile, token) => {
			if (err) {
				alert("Auth0 Failure");
				console.error("Auth0 Failure: ", err);
				return;
			} else {
				console.info("LOGGED IN - token = ", token);
				localStorage.setItem(this.tokenID, token);
				console.info("PROFILE = ", profile);
				localStorage.setItem(this.profileID, JSON.stringify(profile));
				this.loggedIn = true;
				this.token = token;
				this.profile = profile;
				this.setAuthState();
				this.lock.hide();
			}
		});
	}
}

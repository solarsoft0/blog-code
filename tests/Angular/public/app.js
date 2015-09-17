"use strict";

var testApp = angular.module("testApp", [ 'ngRoute', 'auth0', 'angular-storage', 'angular-jwt' ]);

testApp.config(["$routeProvider", "authProvider",
	 function($routeProvider, authProvider) {
		// Route Map
		$routeProvider
			.when("/welcome", {
				title: "Welcome",
				templateUrl: "partials/welcome.html",
				controller: "WelcomeController"
			})
			.when("/flickr", {
				title: "Flickr",
				templateUrl: "partials/flickr.html",
				controller: "FlickrController"
			})
			.when("/spells", {
				title: "Spells",
				templateUrl: "partials/spells.html",
				controller: "SpellsController"
			})
			.otherwise({
				redirectTo: "/welcome"
			});

		authProvider.init({
			domain: "shellmonger.auth0.com",
			clientID: "Po8srwATzQu3wRCLBFQxjE6OHW1qcNgz"
		});
	}
]);

// This hooks all auth events to check everything as soon as the app starts
testApp.run([ "$rootScope", "auth", "store", "jwtHelper", "$location",
	function ($rootScope, auth, store, jwtHelper, $location) {
		auth.hookEvents();

		$rootScope.$on("$locationChangeStart", function() {
			var token = store.get("token");
			if (token) {
				if (!jwtHelper.isTokenExpired(token)) {
					if (!auth.isAuthenticated) {
						auth.authenticate(store.get("profile"), token);
					}
				} else {
					$location.path("/");
				}
			}
		});
	}
]);

testApp.controller("WelcomeController", [ "$scope",
	function WelcomeController ($scope) {
		$scope.fn = "Adrian";
		$scope.ln = "Hall";

		$scope.fullName = function () {
			return $scope.fn + " " + $scope.ln;
		}

		$scope.submit = function () {
			console.info("In Submit");
			alert("Hello " + $scope.fn + " " + $scope.ln);
		}
	}
]);

testApp.controller("FlickrController", [ "$scope", "$http",
	function FlickrController ($scope, $http) {
		$scope.heading = "Flickr";
		$scope.images = [];
		$scope.tags = "ranier";
		var url = "http://api.flickr.com/services/feeds/photos_public.gne";

		$http.jsonp(url, {
			params: {
				"tags": $scope.tags,
				"tagmode": "any",
				"format": "json",
				"jsoncallback": "JSON_CALLBACK"
			},
			"responseType": "json"
		}).success(function (data, status, headers, config) {
			$scope.images = data.items.map(function (v) {
				return v.media.m;
			});
		});
	}
]);

testApp.controller("SpellsController", [ "$scope", "$http", "auth", "store",
	function SpellsController ($scope, $http, auth, store) {
		$scope.heading = "Spells";
		$scope.spells = [];
		var url = "/api/spells";
		var headers = {
			"Accept": "application/json"
		};

		// Add the authorization token if we are authenticated
		if (auth.isAuthenticated) {
			headers.Authorization = "Bearer " + store.get("token");
		}

		$http.get(url, {
			"withCredentials": true,
			"responseType": "json",
			"headers": headers
		}).success(function (data, status, headers, config) {
			$scope.spells = data;
		}).error(function () {
			console.error("Error retrieving spells");
		});
	}
]);

testApp.controller("NavBarController", [ "$scope", "$http", "auth", "store", "$location",
	function NavBarController ($scope, $http, auth, store, $location) {
		$scope.title = "Angular";
		$scope.nickname = "";
		$scope.icon = "sign-in";

		$scope.isActive = function (viewLocation) {
			return viewLocation === $location.path();
		};

		$scope.isAuthenticated = function() {
			return auth.isAuthenticated;
		};

		var profile = store.get("profile");
		if (profile) {
			$scope.nickname = profile.name || profile.nickname;
			$scope.icon = "sign-out";
		};

		$scope.login = function() {
			if ($scope.icon === "sign-out") {
				$scope.nickname = "";
				$scope.icon = "sign-in";
				auth.signout();
				store.remove("profile");
				store.remove("token");
			} else {
				auth.signin({}, function (profile, token) {
					// Success callback
					store.set("profile", profile);
					$scope.nickname = profile.name || profile.nickname;
					store.set("token", token);
					$scope.icon = "sign-out";
					$location.path("/");
				}, function () {
					// Error callback
					alert("Auth0 Error!!!!");
				});
			}
		}
	}
]);

testApp.directive("ngNavbar", function () {
	return {
		restrict: "A",
		templateUrl: "partials/navbar.html"
	}
});

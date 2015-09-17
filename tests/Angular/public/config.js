System.config({
  "baseURL": "/",
  "transpiler": "babel",
  "babelOptions": {
    "optional": [
      "runtime"
    ]
  },
  "paths": {
    "*": "*.js",
    "github:*": "jspm_packages/github/*.js",
    "npm:*": "jspm_packages/npm/*.js"
  }
});

System.config({
  "map": {
    "angular": "github:angular/bower-angular@1.4.2",
    "angular-cookies": "github:angular/bower-angular-cookies@1.4.2",
    "angular-resource": "github:angular/bower-angular-resource@1.4.2",
    "angular-route": "github:angular/bower-angular-route@1.4.2",
    "auth0/angular-jwt": "github:auth0/angular-jwt@0.0.9",
    "auth0/angular-storage": "github:auth0/angular-storage@0.0.11",
    "babel": "npm:babel-core@5.6.16",
    "babel-runtime": "npm:babel-runtime@5.6.16",
    "bootstrap": "github:twbs/bootstrap@3.3.5",
    "core-js": "npm:core-js@0.9.18",
    "font-awesome": "npm:font-awesome@4.3.0",
    "github:angular/bower-angular-cookies@1.4.2": {
      "angular": "github:angular/bower-angular@1.4.2"
    },
    "github:angular/bower-angular-route@1.4.2": {
      "angular": "github:angular/bower-angular@1.4.2"
    },
    "github:jspm/nodelibs-process@0.1.1": {
      "process": "npm:process@0.10.1"
    },
    "github:twbs/bootstrap@3.3.5": {
      "jquery": "github:components/jquery@2.1.4"
    },
    "npm:babel-runtime@5.6.16": {
      "process": "github:jspm/nodelibs-process@0.1.1"
    },
    "npm:core-js@0.9.18": {
      "fs": "github:jspm/nodelibs-fs@0.1.2",
      "process": "github:jspm/nodelibs-process@0.1.1",
      "systemjs-json": "github:systemjs/plugin-json@0.1.0"
    },
    "npm:font-awesome@4.3.0": {
      "css": "github:systemjs/plugin-css@0.1.13"
    }
  }
});


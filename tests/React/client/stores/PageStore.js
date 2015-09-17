import PageActions from "../actions/PageActions";
import EventEmitter from "events";
import $ from "jquery";

class PageStore {
  constructor() {
    // Create a Page Actions object so we can listen for actions
    this.pageActions = new PageActions();
    this.eventbus = new EventEmitter();

    // URL to fetch for our Flickr feed
    this.flickrUrl = "http://api.flickr.com/services/feeds/photos_public.gne";

    // Set up the initial state of our store
    this.data = {
      pages: [
        {
          "active": true,
          "name": "welcome",
          "title": "Welcome"
        },
        {
          "active": false,
          "name": "flickr",
          "title": "Flickr"
        }
      ],
      welcome: {
        firstname: "Adrian",
        lastname: "Hall"
      },
      images: []
    };

    // Register the actionHandlers when we get new information
    this.pageActions.listenForPageChange(location => {
      this.pageChangeHandler(location);
    });

    this.pageActions.listenForWelcomeChange(obj => {
      this.welcomeChangeHandler(obj);
    });

    // Set up event listener for the Flickr Response
    this.eventbus.on("FLICKR_RESPONSE", data => {
      this.initializeFlickrData(data);
    });

    // Initialiate the Flickr JSON Request
    $.ajax({
      url: this.flickrUrl,
      data: { "tags": "rainier", "tagmode": "any", "format": "json" },
      dataType: "jsonp",
      jsonp: "jsoncallback"
    }).done(data => {
      this.data.images = data.items;
      this.eventbus.emit("STORE_CHANGED", {});
    });
  }

  // The Action Handler for Page Changes
  pageChangeHandler(location) {
    this.data.pages.map(page => {
      if (page.name === location && page.active === false) {
        page.active = true;
        this.eventbus.emit("STORE_CHANGED", {});
      } else if (page.name !== location && page.active === true) {
        page.active = false;
        this.eventbus.emit("STORE_CHANGED", {});
      }
    });
  }

  // The Action Handler for Welcome Updates
  welcomeChangeHandler(obj) {
    if (obj.fieldname === "firstname") {
      this.data.welcome.firstname = obj.value;
      this.eventbus.emit("STORE_CHANGED", {});
    }
    if (obj.fieldname === "lastname") {
      this.data.welcome.lastname = obj.value;
      this.eventbus.emit("STORE_CHANGED", {});
    }
  }

  // ListenForChanges registers for change events
  listenForChanges(func) {
    this.eventbus.on("STORE_CHANGED", func);
  }

  // Accessor for the pages
  get pages() {
    return this.data.pages;
  }

  // Accessor for the welcome page view-model
  get welcome() {
    return this.data.welcome;
  }

  // Accessor for the flickr page view-model
  get images() {
    return this.data.images;
  }
}

var pageStore = new PageStore();

export default pageStore;

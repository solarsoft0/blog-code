import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';

@inject(HttpClient)
export class Flickr {
    heading = 'Flickr';
    loading = false;
    images = [];
    url = 'http://api.flickr.com/services/feeds/photos_public.gne?tags=rainier&tagmode=any&format=json';

    constructor(http) {
        this.http = http;
    }

    activate() {
        this.loading = true;
        return this.http.jsonp(this.url).then(response => {
            this.images = response.content.items;
            this.loading = false;
        });
    }


    canDeactivate() {
        if (this.loading) {
            return confirm("Still loading - are you sure?");
        }
        return true;
    }
}

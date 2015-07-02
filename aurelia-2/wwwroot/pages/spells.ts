import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';

export class Spells {
    public heading: string = 'Spells';
    public data: string = '';
    public code: string = '';
    private loading: boolean = false;
    private http: HttpClient = null;

    constructor() {
        var auth_token = localStorage.getItem("auth_token");
        if (auth_token != null) {
            this.http = new HttpClient().configure(x => {
                x.withBaseUrl(window.location.origin);
                x.withHeader("Authorization", "Bearer " + localStorage.getItem("auth_token"));
                x.withHeader("Accept", "application/json");
            });
        } else {
            this.http = new HttpClient().configure(x => {
                x.withBaseUrl(window.location.origin);
            });
        }
    }

    activate() {
        this.loading = true;
        return this.http.get("/api/Spells").then(response => {
            this.data = response.content;
            this.code = response.statusCode.toString();
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
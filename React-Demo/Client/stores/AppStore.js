import Store from '../lib/Store';
import find from 'lodash/collection/find';
import dispatcher from '../dispatcher';
import Actions from '../actions';
import $ from 'jquery';

class AppStore extends Store {

    constructor() {
        super('AppStore');
        this.logger.debug('Initializing AppStore');

        this.initialize('pages', [
          { name: 'welcome', title: 'Welcome', nav: true, auth: false, default: true },
          { name: 'flickr', title: 'Flickr', nav: true, auth: false },
          { name: 'spells', title: 'Spells', nav: true, auth: true }
        ]);
        this.initialize('route', this.getNavigationRoute(window.location.hash.substr(1)));
        this.initialize('images', []);
        this.initialize('lastFlickrRequest', 0);
        this.initialize('authToken', null);
        this.initialize('authProfile', null);
        this.initialize('authSettings', null);
        this.initialize('spells', []);
    }

    onAction(actionType, data) {
        this.logger.debug(`Received Action ${actionType} with data`, data);
        switch (actionType) {

            case 'NAVIGATE':
                let newRoute = this.getNavigationRoute(data.location);
                if (newRoute !== this.get('route')) {
                    this.set('route', newRoute);
                    window.location.hash = `#${newRoute}`;
                }
                break;

            case 'REQUEST-FLICKR-DATA':
                let lastRequest = this.get('lastFlickrRequest');
                let currentTime = Date.now;
                let fiveMinutes = 5 * 60 * 1000;
                if ((currentTime - lastRequest) > fiveMinutes) {
                    return;
                }
                $.ajax({
                    url: 'http://api.flickr.com/services/feeds/photos_public.gne',
                    data: { tags: data.tag, tagmode: 'any', format: 'json' },
                    dataType: 'jsonp',
                    jsonp: 'jsoncallback'
                }).done(response => {
                    Actions.processFlickrData(response);
                });
                break;

            case 'PROCESS-FLICKR-DATA':
                this.set('images', data.items);
                break;

            case 'LOGIN':
                if (this.get('authToken') != null) {
                    this.logger.error('Received LOGIN action, but already logged in');
                    return;
                }
                if (data.authToken == null || data.authProfile == null) {
                    this.logger.errro('Received LOGIN action with null in the data');
                    return;
                }
                this.logger.info(`Logging in with token=${data.authToken}`);
                this.set('authToken', data.authToken, true);
                this.set('authProfile', data.authProfile, true);
                this.changeStore();
                break;

            case 'LOGOUT':
                if (this.get('authToken') == null) {
                    this.logger.error('Received LOGOUT action, but not logged in');
                    return;
                }
                this.logger.info(`Logging out`);
                this.set('authToken', null, true);
                this.set('authProfile', null, true);
                this.changeStore();
                break;

            case 'REQUEST-AUTHENTICATED-API':
                if (this.get('authToken') == null) {
                    this.logger.error('Received REQUEST-AUTHENTICATED-API without authentication');
                    return;
                }
                let token = this.get('authToken');
                $.ajax({
                    url: data.api,
                    dataType: 'json',
                    headers: { 'Authorization': `Bearer ${token}` }
                }).done(response => {
                    data.callback(response);
                });
                break;

            case 'REQUEST-API':
                $.ajax({
                    url: data.api,
                    dataType: 'json'
                }).done(response => {
                    data.callback(response);
                });
                break;

            case 'PROCESS-SPELLS-DATA':
                this.logger.info('Received Spells Data: ', data);
                this.set('spells', data);
                break;

            case 'PROCESS-SETTINGS-DATA':
                this.logger.info('Received Settings Data: ', data);
                this.set('authSettings', data);
                break;

            default:
                this.logger.debug('Unknown actionType for this store - ignoring');
                break;
        }
    }

    getNavigationRoute(route) {
        let newRoute = find(this.get('pages'), path => { return path.name === route.toLowerCase(); });
        if (!newRoute) {
            newRoute = find(this.get('pages'), path => { return path.default && path.default === true; });
        }
        return newRoute.name || '';
    }
}

var appStore = new AppStore();
dispatcher.registerStore(appStore);

export default appStore;

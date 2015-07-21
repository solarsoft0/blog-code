import Store from '../lib/Store';
import find from 'lodash/collection/find';
import dispatcher from '../dispatcher';

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

import Store from '../lib/Store';
import find from 'lodash/collection/find';

export default class AppStore extends Store {
  /**
   * The AppStore Flux-like Store object
   *
   * @constructor
   * @this {AppStore}
   */
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

  /**
   * Receive an Action from the Dispatcher (required Store method)
   * All stores receive an "INITIALIZE" action when the system boots up
   *
   * @param {string} actionType The name of the action
   * @param {object} data The data block for the action
   */
  onAction(actionType, data) {
    this.logger.debug(`Received Action ${actionType} with data`, data);
    switch (actionType) {
      case 'INITIALIZE':
        this.set('route', this.getNavigationRoute(window.location.hash.substr(1)));
        break;

      case 'NAVIGATE':
        let newRoute = this.getNavigationRoute(data.location);
        if (newRoute !== this.get('route')) {
          this.set('route', newRoute);
          window.location.hash = `#${newRoute}`;
          this.changeStore();
        }
        break;

      default:
        this.logger.debug('Unknown actionType for this store - ignoring');
        break;
    }
  }

  /**
   * Determine the best match for the new route
   *
   * @param {string} route the new route
   * @param {string} the name of the new route
   */
  getNavigationRoute(route) {
    let newRoute = find(this.get('pages'), path => { return path.name === route.toLowerCase(); });
    if (!newRoute) {
      newRoute = find(this.get('pages'), path => { return path.default && path.default === true; });
    }
    return newRoute.name || '';
  }
}

import Store from '../lib/Store';
import $ from 'jquery';

export default class ImageStore extends Store {
  /**
   * The ImageStore is a flux-like Store structure for holding the
   * Flickr Images
   *
   * @constructor
   * @this {ImageStore}
   */
  constructor() {
    super('ImageStore');
    this.logger.debug('Initializing ImageStore');

    this.initialize('images', []);
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
        $.ajax({
          url: 'http://api.flickr.com/services/feeds/photos_public.gne',
          data: { tags: 'rainier', tagmode: 'any', format: 'json' },
          dataType: 'jsonp',
          jsonp: 'jsoncallback'
        }).done(response => {
          this.set('images', response.items);
          this.changeStore();
        });
        break;

      default:
        this.logger.debug('Unknown actionType for this store - ignoring');
        break;
    }
  }
}

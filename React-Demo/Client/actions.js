import dispatcher from './dispatcher';

export default class Actions {
    static navigate(newRoute) {
        dispatcher.dispatch('NAVIGATE', { location: newRoute });
    }

    static requestFlickrData(tag) {
        dispatcher.dispatch('REQUEST-FLICKR-DATA', { tag: tag });
    }

    static processFlickrData(data) {
        dispatcher.dispatch('PROCESS-FLICKR-DATA', data);
    }
}

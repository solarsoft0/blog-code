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

    static login(token, profile) {
        dispatcher.dispatch('LOGIN', { authToken: token, authProfile: profile });
    }

    static logout() {
        dispatcher.dispatch('LOGOUT');
    }

    static requestSpellsData() {
        dispatcher.dispatch('REQUEST-AUTHENTICATED-API', {
            api: '/api/spells',
            callback: Actions.processSpellsData
        });
    }

    static processSpellsData(data) {
        dispatcher.dispatch('PROCESS-SPELLS-DATA', data);
    }

    static requestSettingsData() {
        dispatcher.dispatch('REQUEST-API', {
            api: '/api/settings',
            callback: Actions.processSettingsData
        });
    }

    static processSettingsData(data) {
        dispatcher.dispatch('PROCESS-SETTINGS-DATA', data);
    }
}

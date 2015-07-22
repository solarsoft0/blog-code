import React from 'react';
import Auth0Lock from 'auth0-lock';
import Logger from '../lib/Logger';
import Actions from '../actions';
import appStore from '../stores/AppStore';

class Authenticator extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            token: null,
            settings: null
        };
        this.logger = new Logger('Authenticator');
        this.lock = null;
    }

    componentWillMount() {
        if (this.lock == null && this.state.settings != null) {
            this.lock = new Auth0Lock(this.state.settings.ClientID, this.state.settings.Domain);
        } else {
            Actions.requestSettingsData();
        }
        this.appStoreId = appStore.registerView(() => { this.updateState(); });
        this.updateState();
    }

    componentWillUnmount() {
        appStore.deregisterView(this.appStoreId);
    }

    updateState() {
        this.setState({
            token: appStore.get('authToken'),
            settings: appStore.get('authSettings')
        });
    }

    onClick() {
        if (this.state.token != null) {
            Actions.logout();       // Generate the logout action - we will be refreshed
            return;
        }

        this.lock.show((err, profile, token) => {
            this.lock.hide();
            if (err) {
                this.logger.error(`Error in Authentication: `, err);
                return;
            }
            Actions.login(token, profile);
        });
    }

    render() {
        // Additional code for the spinner while the settings are loaded
        if (this.state.settings == null) {
            return (
                <span className="_authenticator">
                    <i className="fa fa-spinner fa-pulse"></i>
                </span>
            );
        }

        let icon = (this.state.token == null) ? 'fa fa-sign-in' : 'fa fa-sign-out';
        let handler = event => { return this.onClick(event); };

        return (
            <span className="_authenticator" onClick={handler}>
                <i className={icon}></i>
            </span>
        );
    }
}

export default Authenticator;

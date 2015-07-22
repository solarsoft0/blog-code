import React from 'react';
import appStore from '../stores/AppStore';
import NavBar from '../views/NavBar';
import Welcome from '../views/Welcome';
import Flickr from '../views/Flickr';
import Spells from '../views/Spells';

class AppView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pages: [],
            route: 'welcome',
            authenticated: false
        };
    }

    componentWillMount() {
        this.appStoreId = appStore.registerView(() => { this.updateState(); });
        this.updateState();
    }

    componentWillUnmount() {
        appStore.deregisterView(this.appStoreId);
    }

    updateState() {
        let token = appStore.get('authToken');
        this.setState({
            route: appStore.get('route'),
            pages: appStore.get('pages'),
            authenticated: token != null
        });
    }

    render() {
        let Route;
        switch (this.state.route) {
            case 'welcome': Route = Welcome; break;
            case 'flickr': Route = Flickr; break;
            case 'spells': Route = Spells; break;
            default: Route = Welcome;
        }

        return (
            <div id="pagehost">
                <NavBar pages={this.state.pages} route={this.state.route} authenticated={this.state.authenticated}/>
                <Route/>
            </div>
        );
    }
}

export default AppView;

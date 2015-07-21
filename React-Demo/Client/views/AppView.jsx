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
            route: 'welcome'
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
        this.setState({
            route: appStore.get('route'),
            pages: appStore.get('pages')
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
                <NavBar pages={this.state.pages} route={this.state.route}/>
                <Route/>
            </div>
        );
    }
}

export default AppView;

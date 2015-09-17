import React from 'react';
import Logger from '../lib/Logger';
import dispatcher from '../dispatcher';

import NavBar from '../views/NavBar';
import Welcome from '../views/Welcome';
import Flickr from '../views/Flickr';
import Spells from '../views/Spells';

export default class AppView extends React.Component {
  /**
   * Create a new Controller View
   *
   * @param {object} props The properties for this object
   */
  constructor(props) {
    super(props);

    this.state = {
      pages: [],
      route: 'welcome'
    };

    this.logger = new Logger('AppView');

    this.logger.debug('Registering view with stores');
    this.appStore = dispatcher.getStore('AppStore');
    this.appStoreId = null;
  }

  /**
   * React Lifecycle Method - called when the component is about to be mounted
   */
  componentWillMount() {
    this.logger.debug('ComponentWillMount: Registering with Stores');
    this.appStoreId = this.appStore.registerView(() => { this.updateState(); });
    this.updateState();
  }

  /**
   * React Lifecycle Method - called when the component will dismount
   */
  componentWillUnmount() {
    this.logger.debug('ComponentWillUnmount: Deregistering with Stores');
    this.appStore.deregisterView(this.appStoreId);
  }


  /**
   * Update the state from the appStore
   */
  updateState() {
    this.setState({
      route: this.appStore.get('route'),
      pages: this.appStore.get('pages')
    });
  }

  /**
   * React Lifecycle Method - called when the component needs to be rendered
   */
  render() {
    this.logger.debug('render: Rendering View');

    let Route;
    switch (this.state.route) {
      /* eslint-disable no-multi-spaces */
      case 'welcome': Route = Welcome; break;
      case 'flickr':  Route = Flickr;  break;
      case 'spells':  Route = Spells;  break;
      default:        Route = Welcome;
      /* eslint-enable no-multi-spaces */
    }

    return (
      <div id="pagehost">
        <NavBar pages={this.state.pages} route={this.state.route}/>
        <Route/>
      </div>
    );
  }
}

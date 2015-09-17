import React from 'react';
import Logger from '../lib/Logger';
import dispatcher from '../dispatcher';

class Flickr extends React.Component {
  /**
   * Create a new Controller View
   *
   * @param {object} props The properties for this object
   */
  constructor(props) {
    super(props);

    this.state = {
      images: []
    };

    this.logger = new Logger('Flickr');

    this.logger.debug('Registering view with stores');
    this.imageStore = dispatcher.getStore('ImageStore');
    this.imageStoreId = null;
  }

  /**
   * React Lifecycle Method - called when the component is about to be mounted
   */
  componentWillMount() {
    this.logger.debug('ComponentWillMount: Registering with Stores');
    this.imageStoreId = this.imageStore.registerView(() => { this.updateState(); });
    this.logger.debug(`ComponentWillMount: ID = ${this.imageStoreId}`);
    this.updateState();
  }

  /**
   * React Lifecycle Method - called when the component will dismount
   */
  componentWillUnmount() {
    this.logger.debug(`ComponentWillUnmount: Deregistering ID ${this.imageStoreId} with Stores`);
    this.imageStore.deregisterView(this.imageStoreId);
  }

  /**
   * Update the state from the appStore
   */
  updateState() {
    this.setState({
      images: this.imageStore.get('images')
    });
  }

  /**
   * React Lifecycle Method - called when the component needs to be rendered
   */
  render() {
    let images = this.state.images.map(image => {
      let s = image.media.m.split('/');
      let fn = s[s.length - 1].split('.')[0];
      return (
        <div className="col-sm-6 col-md-3" key={fn}>
          <a className="thumbnail"><img src={image.media.m}/></a>
        </div>
      );
    });

    return (
      <section id="flickr">
        <h2>Flickr</h2>
        <div className="row">{images}</div>
      </section>
    );
  }
}

export default Flickr;

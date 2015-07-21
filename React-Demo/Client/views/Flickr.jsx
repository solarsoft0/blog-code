import React from 'react';
import Actions from '../actions';
import appStore from '../stores/AppStore';

class Flickr extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            images: [],
            tag: 'seattle'
        };

        Actions.requestFlickrData(this.state.tag);
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
            images: appStore.get('images')
        });
    }

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

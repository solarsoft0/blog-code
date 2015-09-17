import React from "react";
import pageStore from "../stores/PageStore";

export default class FlickrPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      images: pageStore.images
    };

    pageStore.listenForChanges(() => { this.handleStateUpdate(); });
  }

  componentDidMount() {
    this.handleStateUpdate();
  }

  handleStateUpdate() {
    if (this.isMounted()) {
      this.setState({ images: pageStore.images });
    }
  }

  render() {
    let images = this.state.images.map(image => {
      let s = image.media.m.split("/");
      let fn = s[s.length - 1].split(".")[0];
      return (
        <div className="col-sm-6 col-md-3" key={fn}>
          <a className="thumbnail">
            <img src={image.media.m}/>
          </a>
        </div>
      );
    });

    return (
      <section id="flickrPage">
        <h2>Flickr</h2>
        <div className="row">{images}</div>
      </section>
    );
  }
}

import React from "react";
import NavBar from "./NavBar.jsx";
import pageStore from "../stores/PageStore";
import FlickrPage from "./FlickrPage.jsx";
import WelcomePage from "./WelcomePage.jsx";

export default class AppView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pages: pageStore.pages
    };

    pageStore.listenForChanges(() => { this.handleStateUpdate(); });
  }

  componentDidMount() {
    this.handleStateUpdate();
  }

  handleStateUpdate() {
    if (this.isMounted()) {
      this.setState({ pages: pageStore.pages });
    }
  }

  get displayPage() {
    // This should be Array.find(), but not present always
    let activePage = { name: "" };
    this.state.pages.map(page => {
      if (page.active) { activePage = page; }
    });

    switch (activePage.name) {
      case "flickr":
        return (<FlickrPage/>);
      case "welcome":
      default:
        return (<WelcomePage/>);
    }
  }

  render() {
    return (
      <div id="fullPage">
        <NavBar title="React Demo"/>
        <section id="mainPage">{this.displayPage}</section>
      </div>
    );
  }
}

import React from "react";

import pageStore from "../stores/PageStore";

import NavBrand from "./NavBrand.jsx";
import NavLinks from "./NavLinks.jsx";

class NavBar extends React.Component {
  constructor(props) {
    super(props);

    // Initialize the state of the component
    this.state = {
      title: this.props.title,
      pages: pageStore.pages
    };

    pageStore.listenForChanges(() => { this.handleStateUpdate(); });
  }

  componentDidMount() {
    this.handleStateUpdate();
  }

  handleStateUpdate() {
    // Listen to changes from the store and adjust for changes
    if (this.isMounted()) {
      this.setState({ pages: pageStore.pages });
    }
  }

  render() {
    return (
      <header>
        <div className="_navbar_block _navbar_block_0">
          <NavBrand title={this.state.title}/>
        </div>
        <div className="_navbar_block _navbar_block_1">
          <NavLinks pages={this.state.pages}/>
        </div>
      </header>
    );
  }
}

NavBar.propTypes = {
  title: React.PropTypes.string.isRequired
};

export default NavBar;

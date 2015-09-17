import React from "react";
import PageActions from "../actions/PageActions";

class NavLink extends React.Component {
  constructor(props) {
    super(props);
    this.pageActions = new PageActions();
  }

  onClick() {
    this.pageActions.changePage(this.props.page.name);
  }

  render() {
    let cssClass = "_navlink_inner" + (this.props.page.active ? " active" : "");

    return (
      <div className="_navlink_outer" id={"navlink_" + this.props.page.name} onClick={this.onClick.bind(this)}>
        <div className={cssClass}>
          {this.props.page.title}
        </div>
      </div>
    );
  }
}

NavLink.propTypes = {
  page: React.PropTypes.shape({
    active: React.PropTypes.bool,
    name: React.PropTypes.string.isRequired,
    title: React.PropTypes.string.isRequired
  })
};

export default NavLink;

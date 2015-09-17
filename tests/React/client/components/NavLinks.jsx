import React from "react";
import NavLink from "./NavLink.jsx";

class NavLinks extends React.Component {
  render() {
    let links = this.props.pages.map(page => {
      return (
        <div className="_navlinks_block" key={page.name}>
          <NavLink page={page}/>
        </div>
      );
    });

    return (<div className="_navlinks">{links}</div>);
  }
}

NavLinks.propTypes = {
  pages: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      active: React.PropTypes.bool,
      name: React.PropTypes.string.isRequired,
      title: React.PropTypes.string.isRequired
    })
  ).isRequired
};

export default NavLinks;

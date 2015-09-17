import React from 'react';

import NavBrand from '../views/NavBrand.jsx';
import NavLinks from '../views/NavLinks.jsx';
import NavToolbar from '../views/NavToolbar.jsx';

class NavBar extends React.Component {
  render() {
    return (
      <header>
        <div className="_navbar">
          <NavBrand/>
        </div>
        <div className="_navbar _navbar_grow">
          <NavLinks pages={this.props.pages} route={this.props.route}/>
        </div>
        <div className="_navbar">
          <NavToolbar/>
        </div>
      </header>
    );
  }
}

NavBar.propTypes = {
  pages: React.PropTypes.array.isRequired,
  route: React.PropTypes.string.isRequired
};

export default NavBar;

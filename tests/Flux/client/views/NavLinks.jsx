import React from 'react';
import AppActions from '../actions/AppActions';

class NavLinks extends React.Component {
  /**
   * Event Handler - called when a user clicks on a link
   *
   * @param {string} route - the new Route
   */
  onClick(route) {
    AppActions.dispatchNavigateAction(route);
  }

  /**
   * Lifecycle event for a React component - renders the component
   */
  render() {
    // Filter the links to only the ones that should be displayed
    let visibleLinks = this.props.pages.filter(page => {
      // Only display pages in the NAV that don't require auth
      return (page.nav === true && page.auth === false);
    });

    let linkComponents = visibleLinks.map(page => {
      let handler = event => { return this.onClick(page.name, event); };
      let cssClass = (page.name === this.props.route) ? 'link active' : 'link';
      return (<li className={cssClass} key={page.name} onClick={handler}>{page.title}</li>);
    });

    return (
      <div className="_navlinks">
        <ul>{linkComponents}</ul>
      </div>
    );
  }
}

NavLinks.propTypes = {
  pages: React.PropTypes.array.isRequired,
  route: React.PropTypes.string.isRequired
};

export default NavLinks;

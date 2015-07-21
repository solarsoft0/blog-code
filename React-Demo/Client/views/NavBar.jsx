import React from 'react';
import NavBrand from './NavBrand.jsx';
import NavLinks from './NavLinks.jsx';

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

                </div>
            </header>
        );
    }
}

NavBar.propTypes = {
    pages: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                auth: React.PropTypes.bool,
                nav: React.PropTypes.bool,
                name: React.PropTypes.string.isRequired,
                title: React.PropTypes.string.isRequired
            })
        ).isRequired,
    route: React.PropTypes.string.isRequired
};


export default NavBar;

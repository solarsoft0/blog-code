import React from 'react';
import NavBrand from './NavBrand.jsx';

class NavBar extends React.Component {
    render() {
        return (
            <header>
                <div className="_navbar">
                    <NavBrand/>
                </div>
                <div className="_navbar _navbar_grow">

                </div>
                <div className="_navbar">

                </div>
            </header>
        );
    }
}

export default NavBar;

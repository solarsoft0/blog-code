import React from 'react';
import assign from 'lodash/object/assign';
import NavBar from '../views/NavBar';
import Welcome from '../views/Welcome';

class AppView extends React.Component {
    constructor(props) {
        super(props);

        this.state = assign({}, this.props);
    }

    render() {
        let Route;
        switch (this.state.route) {
            case 'welcome': Route = Welcome; break;
            default: Route = Welcome;
        }

        return (
            <div id="pagehost">
                <NavBar pages={this.state.pages} route={this.state.route}/>
                <Route/>
            </div>
        );
    }
}

AppView.propTypes = {
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

export default AppView;

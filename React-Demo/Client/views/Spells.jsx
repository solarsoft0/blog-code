import React from 'react';
import Actions from '../actions';
import appStore from '../stores/AppStore';

class Spells extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            spells: []
        };

        Actions.requestSpellsData();
    }

    componentWillMount() {
        this.appStoreId = appStore.registerView(() => { this.updateState(); });
        this.updateState();
    }

    componentWillUnmount() {
        appStore.deregisterView(this.appStoreId);
    }

    updateState() {
        this.setState({
            spells: appStore.get('spells')
        });
    }
    render() {
        let spells = this.state.spells.map(s => {
            return (<li>{s}</li>);
        });

        return (
            <section id="Spells">
                <h2>Spells</h2>
                <ul>{spells}</ul>
            </section>
        );
    }
}

export default Spells;

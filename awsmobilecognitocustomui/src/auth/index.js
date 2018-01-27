import React from 'react';
import ForgotPassword from './ForgotPassword';
import SignUp from './SignUp';
import SignIn from './SignIn';

class Authenticator extends React.Component {
    static defaultProps = {
        initialState: 'default',
        initialData: {},
        onAuthenticated: (authData) => { console.log(`Authenticate::onAuthenticated(${JSON.stringify(authData, null, 2)}`); }
    };

    constructor(props) {
        super(props);

        this.state = {
            authState: this.props.initialState,
            authData: this.props.initialData,
        };
    }

    onAuthStateChange(newState, newData) {
        const data = Object.assign({}, this.state.authData, newData);
        this.setState({ authState: newState, authData: data });
        if (newState === 'authenticated') {
            this.props.onAuthenticated(data);
        }
    }

    render() {
        const props = {
            authData: this.state.authData,
            authState: this.state.authState,
            onAuthStateChange: (s,d) => this.onAuthStateChange(s,d)
        };

        switch (this.state.authState) {
            case 'forgotPassword':
                return <ForgotPassword {...props} />;
            case 'signUp':
                return <SignUp {...props} />;
            case 'signIn':
            default:
                return <SignIn {...props} />;
        };
    }
}

export default Authenticator;

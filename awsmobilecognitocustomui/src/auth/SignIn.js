import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import IconTextInput from './ui/IconTextInput';
import ModalTokenInput from './ui/ModalTokenInput';
import Wrapper from './ui/Wrapper';
import { Button } from 'react-native-elements';
import { Auth } from 'aws-amplify-react-native';

const styles = StyleSheet.create({
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'row'
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    error: {
        backgroundColor: 'red',
        color: 'white',
        alignSelf: 'center',
        paddingLeft: 8,
        paddingRight: 8
    },
    flexGrow: {
        flex: 1
    },
    signInForm: {
        marginLeft: '10%',
        marginRight: '10%'
    },
    signInFormContainer: {
        width: '100%'
    }
});

class SignIn extends React.Component {
    static defaultProps = {
        authData: {},
        authState: 'signIn',
        onAuthStateChange: (next, data) => { console.log(`SignIn:onAuthStateChange(${next}, ${JSON.stringify(data, null, 2)})`); }
    };

    constructor(props) {
        super(props);
        this.state = {
            authData: this.props.authData,
            authState: this.props.authState,
            modalShowing: false,
            loading: false,
            error: null,
            username: this.props.authData.username || '',
            password: this.props.authData.password || '',
            user: null
        };
    }

    async onSignIn() {
        this.setState({ loading: true });
        try {
            const data = await Auth.signIn(this.state.username, this.state.password);
            console.log(`onSignIn::Response#1: ${JSON.stringify(data, null, 2)}`);

            // If the user session is not null, then we are authenticated
            if (data.signInUserSession !== null) {
                this.props.onAuthStateChange('authenticated', data);
                return;
            }

            // If there is a challenge, then show the modal
            if ('challengeName' in data) {
                console.log(`onSignIn: Expecting challenge to be recieved via ${data.challengeType}`);
                this.setState({ user: data, loading: false, modalShowing: true });
            }

            // Anything else and there is a problem
            throw new Error('Invalid response from server');
        } catch (err) {
            console.log(`Error: ${JSON.stringify(err, null, 2)}`);
            this.setState({ error: err.message, loading: false });
        }
    }

    async onConfirmSignin(token) {
        this.setState({ loading: true });
        try {
            console.log(`onConfirmSignIn:: ${this.state.username}, ${token}`);
            const data = await Auth.confirmSignIn(this.state.user, token);
            console.log(`onConfirmSignIn::Response#2: ${JSON.stringify(data, null, 2)}`);
            const profile = await Auth.currentUser();
            this.props.onAuthStateChange('authenticated', profile);
        } catch (err) {
            console.log('Error: ', err);
            this.setState({ error: err.message, loading: false, modalShowing: false });
        }
    }

    render() {
        let settings = {
            signUpButton: {
                title: 'Sign Up',
                backgroundColor: '#397af8',
                fontSize: 14,
                containerViewStyle: { flex: 1 },
                enabled: !this.state.loading,
                onPress: () => this.props.onAuthStateChange('signUp', {})
            },
            forgotPasswordButton: {
                title: 'Reset Password',
                backgroundColor: '#4d86f7',
                fontSize: 14,
                containerViewStyle: { flex: 1 },
                enabled: !this.state.loading,
                onPress: () => this.props.onAuthStateChange('forgotPassword', {})
            },
            mfaPrompt: {
                isVisible: this.state.modalShowing,
                title: 'MFA Token Required',
                description: 'Enter the six digit token you were just sent.',
                onSubmit: (token) => this.onConfirmSignin(token)
            },
            usernameInput: {
                iconColor: 'white',
                iconName: 'user',
                iconSize: 24,
                autoCapitalize: 'none',
                autoCorrect: false,
                autoFocus: true,
                returnKeyType: 'next',
                placeholder: 'Username',
                placeholderTextColor: '#404040',
                value: this.state.username,
                onChangeText: (text) => this.setState({ username: text.toLowerCase() })
            },
            passwordInput: {
                iconColor: 'white',
                iconName: 'lock',
                iconSize: 24,
                autoCapitalize: 'none',
                autoCorrect: false,
                returnKeyType: 'done',
                secureTextEntry: true,
                placeholder: 'Password',
                placeholderTextColor: '#404040',
                value: this.state.password,
                onChangeText: (text) => this.setState({ password: text })
            },
            submitButton: {
                title: 'Sign In',
                backgroundColor: '#397af8',
                onPress: () => this.onSignIn(this.state.username, this.state.password)
            },
            submitButtonLoading: {
                icon: {
                    color: 'white',
                    name: 'refresh',
                    size: 24,
                    type: 'font-awesome'
                },
                backgroundColor: '#cccccc',
                title: 'Processing...'
            }
        };

        const errorComponent = this.state.error !== null
            ? <View style={styles.errorContainer}><Text style={styles.error}>{this.state.error}</Text></View>
            : false;

        return (
            <Wrapper>
                {this.state.error !== null && errorComponent}
                <View style={styles.signInForm}>
                    <View style={styles.signInFormContainer}>
                        <IconTextInput {...settings.usernameInput}/>
                        <IconTextInput {...settings.passwordInput}/>
                        <View style={styles.signInFormButtons}>
                            <Button {...(this.state.loading ? settings.submitButtonLoading : settings.submitButton)}/>
                        </View>
                    </View>
                </View>
                <View style={styles.flexGrow}/>
                <View style={styles.buttonsContainer}>
                    <Button {...settings.signUpButton}/>
                    <Button {...settings.forgotPasswordButton}/>
                </View>
                <ModalTokenInput {...settings.mfaPrompt}/>
            </Wrapper>
        );
    }
}

export default SignIn;

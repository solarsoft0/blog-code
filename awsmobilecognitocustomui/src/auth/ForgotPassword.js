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
        flexDirection: 'row',
        justifyContent: 'center'
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
    formContainer: {
        width: '100%'
    },
    signUpForm: {
        marginLeft: '10%',
        marginRight: '10%'
    },
    submissionContainer: {

    }
});


class ForgotPassword extends React.Component {
    static defaultProps = {
        authData: {},
        authState: 'forgotPassword',
        onAuthStateChange: (next, data) => { console.log(`SignUp:onAuthStateChange(${next}, ${JSON.stringify(data, null, 2)})`); }
    };

    constructor(props) {
        super(props);
        this.state = {
            authData: this.props.authData,
            authState: this.props.authState,
            modalShowing: false,
            error: null,
            loading: false,
            username: '',
            password: ''
        };
    }

    async onSubmitForm() {
        try {
            this.setState({ loading: true });
            const response = await Auth.forgotPassword(this.state.username);
            console.log(`ForgotPassword::onSubmitForm(): Response#1 = ${JSON.stringify(response, null, 2)}`);
            this.setState({ authData: response, modalShowing: true, loading: false });
        } catch (err) {
            console.log(`ForgotPassword::onSubmitForm(): Error ${JSON.stringify(err, null, 2)}`);
            this.setState({ error: err.message, loading: false });
        }
    }

    async onConfirmSubmitted(token) {
        try {
            this.setState({ loading: true });
            const response = await Auth.forgotPasswordSubmit(this.state.username, token, this.state.password);
            console.log(`ForgotPassword::onConfirmSubmitted(): Response#2 = ${JSON.stringify(response, null, 2)}`);
            this.setState({ loading: false });
            this.props.onAuthStateChange('default', { username: this.state.username });
        } catch (err) {
            console.log(`ForgotPassword::onConfirmSubmitted(): Error ${JSON.stringify(err, null, 2)}`);
            this.setState({ error: err.message, loading: false, modalShowing: false });
        }
    }

    render() {
        let settings = {
            cancelButton: {
                title: 'Cancel',
                backgroundColor: '#cccccc',
                fontSize: 14,
                enabled: !this.state.loading,
                onPress: () => this.props.onAuthStateChange('default', {})
            },
            confirmPrompt: {
                isVisible: this.state.modalShowing,
                title: 'Confirmation Required',
                description: 'Enter the six digit token you were just sent',
                onSubmit: (token) => this.onConfirmSubmitted(token)
            },
            usernameInput: {
                iconColor: 'white',
                iconName: 'user',
                iconSize: 24,
                autoCorrect: false,
                autoCapitalize: 'none',
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
                autoCorrect: false,
                autoCapitalize: 'none',
                returnKeyType: 'done',
                secureTextEntry: true,
                placeholder: 'New Password',
                placeholderTextColor: '#404040',
                value: this.state.password,
                onChangeText: (text) => this.setState({ password: text })
            },
            submitButton: {
                title: 'Change Password',
                backgroundColor: '#397af8',
                onPress: () => this.onSubmitForm()
            },
            submitButtonLoading: {
                icon: { color: 'white', name: 'refresh', size: 24, type: 'font-awesome' },
                backgroundColor: '#cccccc',
                title: 'Processing'
            }
        };

        const errorComponent = this.state.error !== null
            ? <View style={styles.errorContainer}><Text style={styles.error}>{this.state.error}</Text></View>
            : false;

        return (
            <Wrapper>
                {this.state.error !== null && errorComponent}
                <View style={styles.signUpForm}>
                    <View style={styles.formContainer}>
                        <IconTextInput {...settings.usernameInput}/>
                        <IconTextInput {...settings.passwordInput}/>
                        <View style={styles.submissionContainer}>
                            <Button {...(this.state.loading ? settings.submitButtonLoading : settings.submitButton)}/>
                        </View>
                    </View>
                </View>
                <View style={styles.flexGrow}/>
                <View style={styles.buttonsContainer}>
                    <Button {...settings.cancelButton}/>
                </View>
                <ModalTokenInput {...settings.confirmPrompt}/>
            </Wrapper>
        );
    }
}

export default ForgotPassword;

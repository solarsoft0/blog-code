import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ScrollView, Text, TextInput, View, Button } from 'react-native';
import { login } from '../redux/actions/auth';

class Login extends Component {
    constructor (props) {
        super(props);
        this.state = {
            page: 'Login',
            username: '',
            password: ''
        };
    }

    get alt () { return (this.state.page === 'Login') ? 'SignUp' : 'Login'; }

    handleClick (e) {
        this.props.onLogin(this.state.username, this.state.password);
        e.preventDefault();
    }

    togglePage (e) {
        this.setState({ page: this.alt });
        e.preventDefault();
    }

    render() {
        return (
            <ScrollView style={{padding: 20}}>
                <Text style={{fontSize: 27}}>{this.state.page}</Text>
                <TextInput 
                    placeholder='Username' 
                    autoCapitalize='none' 
                    autoCorrect={false} 
                    autoFocus={true} 
                    keyboardType='email-address' 
                    value={this.state.username} 
                    onChangeText={(text) => this.setState({ username: text })} />
                <TextInput 
                    placeholder='Password' 
                    autoCapitalize='none' 
                    autoCorrect={false} 
                    secureTextEntry={true} 
                    value={this.state.password} 
                    onChangeText={(text) => this.setState({ password: text })} />
                <View style={{margin: 7}}/>
                <Button onPress={(e) => this.handleClick(e)} title={this.state.page}/>
                <View style={{margin: 7, flexDirection: 'row', justifyContent: 'center'}}>
                    <Text onPress={(e) => this.togglePage(e)} style={{fontSize: 12, color: 'blue'}}>
                        {this.alt}
                    </Text>
                </View>
            </ScrollView>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        isLoggedIn: state.auth.isLoggedIn
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLogin: (username, password) => { dispatch(login(username, password)); }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
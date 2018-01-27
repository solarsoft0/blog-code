import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = {
    container: {
        backgroundColor: 'transparent',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        padding: 2,
        marginBottom: 12
    },
    errorContainer: {
        borderBottomColor: 'red',
        borderBottomWidth: 2
    },
    noErrorContainer: {
        borderBottomColor: '#cccccc',
        borderBottomWidth: 1
    },
    textInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 24,
        color: 'white'
    },
};

class IconTextInput extends React.Component {
    static defaultProps = {
        iconName: 'user',
        iconColor: 'white',
        iconSize: 24,
        isError: false,
        style: {},
        inputStyle: {}
    };

    render() {
        const { iconName, iconColor, iconSize, isError, style, inputStyle, ...props } = this.props;
        const statusStyle = isError ? styles.errorContainer : styles.noErrorContainer;
        const coloration = { color: iconColor, fontSize: iconSize };

        return (
            <View style={[ styles.container, statusStyle, style]}>
                <Icon color={iconColor} name={iconName} size={iconSize}/>
                <TextInput style={[styles.textInput, coloration, inputStyle]} {...props}/>
            </View>
        );
    }
}

export default IconTextInput;

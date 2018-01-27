import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
    container: {
        paddingTop: 4,
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 4
    },
    textbox: {
        margin: 0,
        borderBottomColor: '#A0A0A0',
        borderBottomWidth: 1,
        display: 'flex',
        flexDirection: 'row'
    },
    textinput: {
        fontSize: 16,
        flexGrow: 1
    },
    title: {
        color: '#606060',
        fontSize: 10,
        marginBottom: 1
    }
});

const TextFormField = (providedProps) => {
    const defaultProps = {
        autoCapitalize: 'sentences',
        multiline: false,
        onChange: text => console.info(`TextFormField::onChange("${text}")`),
        onReset: () => console.info(`TextFormField::onReset()`),
        placeholder: 'Text',
        placeholderTextColor: '#A0A0A0',
        style: {},
        title: 'Title',
        value: ''
    };
    const props = Object.assign({}, defaultProps, providedProps);

    return (
        <View style={[styles.container, props.style]}>
            <Text style={styles.title}>{props.title}</Text>
            <View style={styles.textbox}>
                <TextInput
                    autoCapitalize={props.autoCapitalize}
                    multiline={props.multiline}
                    onChangeText={props.onChange}
                    placeholder={props.placeholder}
                    placeholderTextColor={props.placeholderTextColor}
                    value={props.value}
                    style={styles.textinput}
                    underlineColorAndroid="transparent" />
                <TouchableOpacity style={{alignSelf: 'center' }} onPress={() => props.onReset()}>
                    <Icon name="remove" color="#A0A0A0" size={16}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default TextFormField;

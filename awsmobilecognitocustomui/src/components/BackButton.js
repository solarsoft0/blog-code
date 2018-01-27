import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginLeft: 16
    },
    outerContainer: {
        alignSelf: 'center'
    },
    text: {
        fontSize: 16,
        marginLeft: 8
    }
});

/**
 * React component for displaying an Icon centered in the surrounding box
 *
 * @param {Object} providedProps the provided props - use any props that Icon can use
 */
const BackButton  = (providedProps) => {
    const defaultProps = {
        name: (Platform.OS === 'ios') ? 'chevron-left' : 'arrow-left',
        color: '#007AFF',  // iOS Blue Link Color
        size: 16,
        onPress: () => { console.info(`HeaderButton::onPress()`); }
    };

    const props = Object.assign({}, defaultProps, providedProps);
    const textStyle = {
        color: props.color
    };

    return (
        <TouchableOpacity style={styles.outerContainer} onPress={props.onPress}>
            <View style={styles.container}>
                <Icon name={props.name} color={props.color} size={props.size}/>
                {(Platform.OS === 'ios') && <Text style={[styles.text, textStyle]}>Back</Text>}
            </View>
        </TouchableOpacity>
    );
};

export default BackButton;

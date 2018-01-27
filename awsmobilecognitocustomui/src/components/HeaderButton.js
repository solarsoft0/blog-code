import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
    container: {
        alignSelf: 'center',
        marginLeft: 16,
        marginRight: 16
    }
});

/**
 * React component for displaying an Icon centered in the surrounding box
 *
 * @param {Object} providedProps the provided props - use any props that Icon can use
 */
const HeaderButton  = (providedProps) => {
    const defaultProps = {
        name: 'plus',
        color: '#007AFF',  // iOS Blue Link Color
        size: 16,
        onPress: () => { console.info(`HeaderButton::onPress()`); }
    };

    const props = Object.assign({}, defaultProps, providedProps);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={props.onPress}>
                <Icon name={props.name} color={props.color} size={props.size}/>
            </TouchableOpacity>
        </View>
    );
};

export default HeaderButton;

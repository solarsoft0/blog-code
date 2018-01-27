import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1
    }
});

/**
 * React component for displaying an Icon centered in the surrounding box
 *
 * @param {Object} providedProps the provided props - use any props that Icon can use
 */
const CenteredIcon = (providedProps) => {
    const defaultProps = {
        name: 'question',
        color: 'white',
        size: 16
    };

    const props = Object.assign({}, defaultProps, providedProps);

    return (
        <View style={styles.container}>
            <Icon {...props}/>
        </View>
    );
};

export default CenteredIcon;

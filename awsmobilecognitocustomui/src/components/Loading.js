import React from 'react';
import { StyleSheet, View } from 'react-native';
import Spinner from 'react-native-spinkit';
import colors from '../theme/colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.headerBackgroundColor,
    }
});

const Loading = (props) => {
    return (
        <View style={styles.container}>
            <Spinner type="Wave" size={100} color="white" isVisible={true} />
        </View>
    );
};

export default Loading;

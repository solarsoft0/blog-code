import React from 'react';
import { Image, StatusBar, StyleSheet, View } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    innerContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        display: 'flex'
    },
    imageContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    image: {
        flex: 1,
        resizeMode: 'stretch'
    },
    topContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        height: 150,
        width: 150
    }
});

const Wrapper = (props) => {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={require('./assets/background.jpg')}/>
            </View>
            <View style={styles.innerContainer}>
                <View style={styles.topContainer}>
                    <Image style={styles.logo} source={require('./assets/logo.png')}/>
                </View>
                {props.children}
            </View>
        </View>
    );
};

export default Wrapper;


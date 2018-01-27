import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

const styles = StyleSheet.create({
    container: {
        paddingTop: 4,
        paddingLeft: 8,
        paddingRight: 8,
        paddingBottom: 4,
    },
    innerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 4
    },
    switch: {

    },
    title: {
        fontSize: 16,
        alignSelf: 'center'
    }
});

const CheckboxFormField = (providedProps) => {
    const defaultProps = {
        onChange: v => console.info(`TextFormField::onChange("${v}")`),
        style: {},
        title: 'Title',
        value: false
    };
    const props = Object.assign({}, defaultProps, providedProps);

    return (
        <View style={[styles.container, props.style]}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>{props.title}</Text>
                <Switch style={styles.switch} onValueChange={props.onChange} value={props.value}/>
            </View>
        </View>
    );
}

export default CheckboxFormField;

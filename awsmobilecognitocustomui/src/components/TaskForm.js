import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CheckboxFormField from './CheckboxFormField';
import TextFormField from './TextFormField';

const styles = StyleSheet.create({
    container: {
       flexGrow: 1,
       display: 'flex',
       flexDirection: 'column'
    },
    blankspace: {
        flexGrow: 1
    },
    infoblock: {
        alignSelf: 'center',
        marginBottom: 1
    },
    infotext: {
        color: '#A0A0A0',
        fontSize: 12
    }
});

/**
 * Implements an editor for a task
 *
 * @class TaskForm
 * @extends React.Component
 */
class TaskForm extends React.Component {
    /**
     * Default properties
     *  {Task} item the item to be edited
     *  {Function} onSave called when the item is to be saved
     */
    static defaultProps = {
        onSave: (item) => console.info(`TaskForm::onSave(${JSON.stringify(item)})`)
    };

    /**
     * Constructor - main requirement is to copy the props item into the state so we
     * aren't always saving the object on every key press.
     *
     * @param {Object} props the component properties
     */
    constructor(props) {
        super(props);
        this.state = { item: props.item }
    };

    /**
     * Event handler called  when the task title is changed.  This is called on every
     * change within the text field.
     * @param {String} text the new task title
     */
    onChangeTaskTitle(text) {
        const item = { ...this.state.item };
        item.title = text;
        console.info(`TaskForm::onChangeTaskTitle: new item = ${JSON.stringify(item)}`);
        this.setState({ item: item });
    };

    /**
     * Event handler called when the completed toggle switch changes
     *
     * @param {Boolean} v  the new completed value
     */
    onChangeCompleted(v) {
        const item = { ...this.state.item };
        item.completed = v;
        this.setState({ item: item });
    }

    /**
     * React lifecycle hook that is called when the component is about to
     * be removed from the UI.  We use this to save the item.
     */
    componentWillUnmount() {
        this.props.onSave(this.state.item);
    }

    /**
     * React lifecycle hook that is called to render the component.
     */
    render() {
        return (
            <View style={styles.container}>
                <TextFormField
                    title="Task Name"
                    onChange={value => this.onChangeTaskTitle(value)}
                    onReset={() => this.onChangeTaskTitle(this.props.item.title)}
                    value={this.state.item.title}
                />
                <CheckboxFormField
                    title="Completed?"
                    onChange={value => this.onChangeCompleted(value)}
                    value={this.state.item.completed}/>
                <View style={styles.blankspace}/>
                <View style={styles.infoblock}>
                    <Text style={styles.infotext}>{this.state.item.taskId}</Text>
                </View>
            </View>
        );
    }
}

export default TaskForm;

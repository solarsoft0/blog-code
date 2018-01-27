import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import NavBar from 'react-native-navbar';
import BackButton from '../components/BackButton';
import TaskForm from '../components/TaskForm';
import colors from '../theme/colors';

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    }
});

/**
 * Creates a default handler for an event handler.
 *
 * @param {String} funcName the name of the event handler for logging purposes
 */
function defaultHandler(funcName) {
    return (item) => {
        console.info(`TaskDetailsScreen::${funcName}(${JSON.stringify(item)})`);
    };
}

/**
 * The TaskDetails "details" screen in the master-detail pattern
 *
 * @class TaskDetailsScreen
 * @extends {React.Component}
 */
class TaskDetailsScreen extends React.Component {
    /**
     * Default Properties
     *
     * @param {String} taskId the id of the task you wish to edit (no default)
     * @param {Function} onBack event handler called when the back button is pressed
     * @param {Function} onSaveTask event handler called when an item in the list is saved
     * @param {Function} getTask called to retrieve the task by taskId
     * @param {Object} style stylesheet for the bounding component
     */
    static defaultProps = {
        onBack: () => { console.info(`TaskDetailsScreen::onBack()`); },
        onSaveTask: defaultHandler('onSaveTask'),
        style: {}
    };

    /**
     * React lifecycle method to render the component
     */
    render() {
        const navBarOptions = {
            tintColor: colors.headerBackgroundColor,
            statusBar: {
                style: colors.statusBarColor,
                hidden: false
            },
            leftButton: <BackButton color={colors.statusIconColor} onPress={this.props.onBack} />,
            title: {
                title: 'Edit Task',
                tintColor: colors.headerForegroundColor
            }
        };

        const item = this.props.getItem(this.props.taskId);

        return (
            <View style={[styles.container, this.props.style]}>
                <NavBar {...navBarOptions} />
                <TaskForm item={item} onSave={this.props.onSaveTask} />
            </View>
        );
    }
}

export default TaskDetailsScreen;

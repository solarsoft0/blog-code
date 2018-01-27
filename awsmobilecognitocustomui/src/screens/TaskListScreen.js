import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Amplify from 'aws-amplify-react-native';
import ActionButton from 'react-native-action-button';
import NavBar from 'react-native-navbar';
import TaskList from '../components/TaskList';
import HeaderButton from '../components/HeaderButton';
import Authenticator from '../auth';
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
        console.info(`TaskListScreen::${funcName}(${JSON.stringify(item)})`);
    };
}

/**
 * The TaskList "master" screen in the master-detail pattern
 *
 * @class TaskListScreen
 * @extends {React.Component}
 */
class TaskListScreen extends React.Component {
    /**
     * Default Properties
     *
     * @param {Array[Task]} items the list of items to display (no default)
     * @param {Function} onAddTask event handler called when an item is to be added
     * @param {Function} onDeleteTask event handler called when an item in the list is deleted
     * @param {Function} onSaveTask event handler called when an item in the list is saved
     * @param {Function} onViewTask event handler called when an item in the list is pressed
     * @param {Object} style stylesheet for the bounding component
     */
    static defaultProps = {
        onAddTask: () => { console.info(`TaskListScreen::onAddTask()`); },
        onDeleteTask: defaultHandler('onDeleteTask'),
        onSaveTask: defaultHandler('onSaveTask'),
        onViewTask: defaultHandler('onViewTask'),
        style: {},
        authState: 'unauthenticated',
        onSetAuthState: (state, data) => { console.log(`TaskListScreen::onSetAuthState(${state}, ${JSON.stringify(data, null, 2)})`); }
    };

    onSigninPressed() {
        this.props.onSetAuthState('during-auth');
    }

    async onSignoutPressed() {
        try {
            await Amplify.Auth.signOut();
            this.props.onSetAuthState('unauthenticated');
        } catch (err) {
            console.log(`onSignoutPressed: err = ${err}`);
        }
    }

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
            leftButton: (this.props.authState === 'unauthenticated')
                ? <HeaderButton name='sign-in' color={colors.statusIconColor} onPress={() => this.onSigninPressed()} />
                : <HeaderButton name='sign-out' color={colors.statusIconColor} onPress={() => this.onSignoutPressed()} />,
            rightButton: (Platform.OS === 'ios')
                ? <HeaderButton name='plus' color={colors.statusIconColor} onPress={this.props.onAddTask} />
                : <View/>,
            title: {
                title: 'Tasks',
                tintColor: colors.headerForegroundColor
            }
        };

        if (this.props.authState === 'during-auth') {
            return (
                <View style={[styles.container, this.props.style]}>
                    <Authenticator onAuthenticated={(data) => this.props.onSetAuthState('authenticated', data)}/>
                </View>
            );
        }

        return (
            <View style={[styles.container, this.props.style]}>
                <NavBar {...navBarOptions} />
                <TaskList
                    items={this.props.items}
                    onDelete={this.props.onDeleteTask}
                    onSave={this.props.onSaveTask}
                    onView={this.props.onViewTask} />
                {(Platform.OS === 'android') && <ActionButton
                    buttonColor={colors.actionButtonColor}
                    onPress={this.props.onAddTask}
                />}
            </View>
        );
    }
}

export default TaskListScreen;

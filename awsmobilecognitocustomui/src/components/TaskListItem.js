import React from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    TouchableHighlight,
    TouchableNativeFeedback,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Swipeout from 'react-native-swipeout';
import CenteredIcon from './CenteredIcon';

const Touchable = (Platform.OS === 'android')
    ? TouchableNativeFeedback
    : TouchableHighlight;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomColor: '#A0A0A0',
        borderBottomWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        height: 40,
        justifyContent: 'flex-start',
        width: '100%'
    },
    c1: {
        flexGrow: 1
    },
    c2: {
        flexBasis: 32,
        margin: 8
    },
    t1: {
        fontSize: 18,
        marginRight: 8
    }
});

/**
 * Creates a default handler for an event handler.
 *
 * @param {String} funcName the name of the event handler for logging purposes
 */
function defaultHandler(funcName) {
    return (item) => {
        console.info(`TaskListItem::${funcName}(${JSON.stringify(item)})`);
    };
}

/**
 * React Component for displaying a task item in a list
 *
 * @param {Object} props the properties of the object
 * @param {Number} [props.index] the index of the component in the list
 * @param {Object} props.item the task to be displayed
 * @param {String} props.item.taskId the ID of the task
 * @param {String} props.item.title the Title of the task
 * @param {Boolean} props.item.completed if the task is completed
 * @param {String} [props.incompleteIconName] icon to be used for an incomplete task
 * @param {String} [props.completedIconName] icon to be used for a completed task
 * @param {Function} [props.onView] event handler called when the user presses the item
 * @param {Function} [props.onDelete] event handler called when the user tries to delete the item
 * @param {Function} [props.onSave] event handler called when the item needs to be saved
 * @param {Function} [props.onSwipeOpen] event handler called when the items swipe drawer is opened
 * @param {Function} [props.onSwipeClose] event handler called when the item swipe drawer is closed
 * @param {Object} [props.style] the style for the outer container
 * @param {Boolean} [props.swipeDrawerOpen] true if the item swipe drawer is open (false by default)
 * @param {Object} [props.textStyle] the style for the text component
 */
const TaskListItem = (providedProps) => {
    // Default Prop Values
    const defaultProps = {
        completedIconName: 'check-square-o',
        incompleteIconName: 'square-o',
        index: 0,
        onDelete: defaultHandler('onDelete'),
        onSave: defaultHandler('onSave'),
        onSwipeClose: defaultHandler('onSwipeClose'),
        onSwipeOpen: defaultHandler('onSwipeOpen'),
        onView: defaultHandler('onView'),
        style: {},
        textStyle: {}
    };

    // Calculate the props given the defaults:
    const props = Object.assign({}, defaultProps, providedProps);

    // Determine which icon name to use
    const iconName = (props.item.completed) ? props.completedIconName : props.incompleteIconName;
    const iconColor = (props.item.completed) ? 'green' : '#404040';

    // Event Handler for the "complete task" option
    const onCompleteTask = (item) => {
        const newItem = Object.assign({}, item, { completed: !item.completed });
        props.onSave(newItem);
    };

    // Swipeout Settings
    const swipeDrawerSettings = {
        autoClose: true,
        close: !props.swipeDrawerOpen,
        onClose: (secId, rowId, dir) => props.onSwipeClose(props.item, rowId, dir),
        onOpen: (secId, rowId, dir) => props.onSwipeOpen(props.item, rowId, dir),
        right: [
            {
                onPress: () => onCompleteTask(props.item),
                component: <CenteredIcon name='check'/>,
                type: 'primary'
            },
            {
                onPress: () => props.onDelete(props.item),
                component: <CenteredIcon name='trash-o'/>,
                type: 'delete'
            }
        ],
        rowId: props.index,
        sectionId: 1
    };

    // Render the component
    return (
        <Swipeout {...swipeDrawerSettings}>
            <Touchable onPress={() => props.onView(props.item)}>
                <View style={[styles.container, props.style]}>
                    <View style={styles.c2}>
                        <Icon name={iconName} color={iconColor} size={24}/>
                    </View>
                    <View style={styles.c1}>
                        <Text style={[ styles.t1, props.textStyle ]}>{props.item.title}</Text>
                    </View>
                </View>
            </Touchable>
        </Swipeout>
    );
};

export default TaskListItem;

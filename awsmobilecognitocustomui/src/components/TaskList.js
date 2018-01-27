import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import TaskListItem from './TaskListItem';

const styles = StyleSheet.create({
    container: {
       flexGrow: 1
    }
});

/**
 * Creates a default handler for an event handler.
 *
 * @param {String} funcName the name of the event handler for logging purposes
 */
function defaultHandler(funcName) {
    return (item) => {
        console.info(`TaskList::${funcName}(${JSON.stringify(item)})`);
    };
}

/**
 * React Component for displaying a list of tasks
 */
class TaskList extends React.Component {
    /**
     * Default Properties
     *
     * @param {Array[Task]} items the list of items to display (no default)
     * @param {Function} onDelete event handler called when an item in the list is deleted
     * @param {Function} onSave event handler called when an item in the list is saved
     * @param {Function} onView event handler called when an item in the list is pressed
     * @param {Object} style stylesheet for the bounding component
     */
    static defaultProps = {
        onDelete: defaultHandler('onDelete'),
        onSave: defaultHandler('onSave'),
        onView: defaultHandler('onView'),
        style: {}
    };

    /**
     * Initial State
     */
    state = {
       activeRow: null      // activeRow = null means no swipe-drawer is open
    };

    /**
     * Event Handler called when an item is swipe-opened
     *
     * @param {Object} item the item that is being swipe-opened
     * @param {Number} rowId the rowId of the item that is being swipe-opened
     * @param {String} dir the direction of the swipe
     */
    onSwipeOpen(item, rowId, dir) {
        this.setState({ activeRow: item.taskId });
    }

    /**
     * Event Handler called when an item is swipe-closed
     *
     * @param {Object} item the item that is being swipe-closed
     * @param {Number} rowId the rowId of the item that is being swipe-closed
     * @param {String} dir the direction of the swipe
     */
    onSwipeClose(item, rowId, dir) {
        if (item.taskId === this.state.activeRow && typeof dir !== 'undefined') {
            this.setState({ activeRow: null });
        }
    }

    /**
     * Called to render an individual item in the list
     *
     * @param {Object} item the item to be rendered
     * @param {*} index the index in the list
     */
    _renderListItem(item, index) {
        const itemSettings = {
            item,
            index,
            swipeDrawerOpen: this.state.activeRow === item.taskId,
            onDelete: (task) => this.props.onDelete(task),
            onSave: (task) => this.props.onSave(task),
            onSwipeClose: (task, row, dir) => this.onSwipeClose(task, row, dir),
            onSwipeOpen: (task, row, dir) => this.onSwipeOpen(task, row, dir),
            onView: (task) => this.props.onView(task)
        };

        return (<TaskListItem {...itemSettings}/>);
    }

    /**
     * React lifecycle method to render the component
     */
    render() {
        const listSettings = {
            data: this.props.items,
            extraData: this.state.activeRow,
            keyExtractor: (item) => item.taskId,
            renderItem: ({ item, index }) => this._renderListItem(item, index)
        };
        return (
            <View style={[styles.container, this.props.style]}>
                <FlatList {...listSettings} />
            </View>
        );
    }
}

export default TaskList;

import React from 'react';
import TaskStore from '../flux/TaskStore';
import TaskListItem from './TaskListItem.jsx';

export default class TaskList extends React.Component {
  /**
   * React component to render a list of tasks - also wires up the views
   * to handle common events.
   *
   * @class TaskList
   * @constructor
   * @param props the react properties
   */
  constructor(props) {
    super(props);
    this.state = {
      taskList: []
    };
  }

  /**
   * Lifecycle method that is invoked right before the component is mounted,
   * Use for setting up state change registrations.
   *
   * @method componentWillMount
   * @override
   */
  componentWillMount() {
    let handler = name => { this.updateState(name); };
    this.taskStoreId = TaskStore.register(handler);
    this.updateState(TaskStore.name);
  }

  /**
   * Lifecycle method that is invoked right before a component is unmounted.
   * Use for removing state change registrations.
   *
   * @method componentWillUnmount
   * @override
   */
  componentWillUnmount() {
    TaskStore.deregister(this.taskStoreId);
  }

  /**
   * Private method for updating the state - event handler style.
   *
   * @method updateState
   * @param {string} [name] the name of the store that is updated
   * @private
   */
  updateState(name) {
    this.setState({
      taskList: TaskStore.getTasks(true)
    });
  }

  /**
   * Lifecycle method that renders the component
   *
   * @method render
   * @override
   */
  render() {
    let tl = this.state.taskList.map(task => {
      return (<li key={task.id}><TaskListItem task={task}/></li>);
    });

    return (
      <div className="taskList">
        <ul>{tl}</ul>
      </div>
    );
  }
}

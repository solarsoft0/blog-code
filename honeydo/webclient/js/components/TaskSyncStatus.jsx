import React from 'react';
import TaskStore from '../flux/TaskStore';

export default class TaskSyncStatus extends React.Component {
  /**
   * React component to render the sync status of the task store.
   *
   * @class TaskSyncStatus
   * @constructor
   * @param props the react properties
   */
  constructor(props) {
    super(props);
    this.state = {
      dirty: false,
      saving: false
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
      dirty: TaskStore.isDirty(),
      saving: TaskStore.saving
    });
  }

  /**
   * Lifecycle method that renders the component
   *
   * @method render
   * @override
   */
  render() {
    let icon = (this.state.saving) ? 'fa fa-spinner fa-pulse':
      (this.state.dirty) ? 'fa fa-cloud-upload': 'fa fa-cloud';

    return (
      <div className="taskSyncStatus">
        <i className={icon}></i>
      </div>
    );
  }
}

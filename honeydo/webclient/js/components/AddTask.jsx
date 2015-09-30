import React from 'react';
import TaskActions from '../flux/TaskActions';

export default class AddTask extends React.Component {
  /**
   * React component to add a task to the list of tasks in the task store.
   *
   * @class AddTask
   * @constructor
   * @param props the react properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Event Handler for when a user clicks on the add task icon
   *
   * @method clickHandler
   * @param {Event} evt the Event that caused the call
   * @private
   */
  clickHandler(evt) {
    TaskActions.createTask();
  }

  /**
   * Lifecycle method that renders the component
   *
   * @method render
   * @override
   */
  render() {
    let clickHandler = e => this.clickHandler(e);

    return (
      <div className="addTaskIcon" onClick={clickHandler}>
        <i className="fa fa-plus"></i>
      </div>
    );
  }
}

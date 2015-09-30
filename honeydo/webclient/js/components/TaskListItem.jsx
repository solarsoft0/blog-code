import React from 'react';
import moment from 'moment';
import {DateTimePicker} from 'react-widgets';
import AbsoluteCenter from './AbsoluteCenter.jsx';
import Task from '../models/Task';
import TaskActions from '../flux/TaskActions';

export default class TaskListItem extends React.Component {
  static propTypes = {
    task: React.PropTypes.instanceOf(Task).isRequired
  };

  /**
   * React Component for rendering an individual task in the task list
   *
   * @class TaskListItem
   * @constructor
   * @param {object} props the React component properties
   */
  constructor(props) {
    super(props);
  }

  /**
   * Event handler for when the user sets or clears the completed flag - it
   * actually dispatches a change to the Dispatcher, which passes it down to
   * the store, which stores it and then informs the component of the change.
   *
   * @method onCompletedFlagChanged
   * @param {Event} evt the event
   */
  onCompletedFlagChanged(evt) {
    let el = React.findDOMNode(this.refs.completed);
    TaskActions.setCompleted(this.props.task.id, el.checked);
  }

  /**
   * Event handler for when the user changes the title field - it
   * actually dispatches a change to the Dispatcher, which passes it down to
   * the store, which stores it and then informs the component of the change.
   *
   * @method onTitleChanged
   * @param {Event} evt the event
   */
  onTitleChanged(evt) {
    let el = React.findDOMNode(this.refs.title);
    TaskActions.setTitle(this.props.task.id, el.value);
  }

  /**
   * Event handler for when the user changes the due date field - it
   * dispatches a change to the Dispatcher, which passes it down to
   * the store, which stores it and then informs the component of the
   * change.
   *
   * @method onDueDateChanged
   * @param {Date} date the Date() object
   * @param {string} dateStr the string representation of the data
   */
  onDueDateChanged(date, dateStr) {
    TaskActions.setDueDate(this.props.task.id, moment(date));
  }

  /**
   * Determine the appropriate rendering of the Date field
   *
   * @method renderDateValue
   * @param {boolean} isCompleted if the task is completed
   * @return Rendered Value (JSX)
   */
  renderDateValue(isCompleted) {
    let isDue = this.props.task.due.isValid();
    let dueDateChangeHandler = (date, dateStr) => this.onDueDateChanged(date, dateStr);
    if (isCompleted) {
      return (<h2>Completed {this.props.task.completed.format('MMM Do YYYY')}</h2>);
    } else {
      let v = isDue ? this.props.task.due.toDate() : null;
      return (
        <h2>Due
          <DateTimePicker value={v} time={false} min={new Date()}
            format={'MMM d yyyy'} editFormat={'d'}
            initialView={'month'} finalView={'month'}
            onChange={dueDateChangeHandler}/>
        </h2>
      );
    }
  }

  /**
   * Lifecycle method to render the component
   *
   * @method render
   * @return JSX content for rendering
   */
  render() {
    // Get rendered values
    let completedFlag = this.props.task.completed.isValid();
    let date = this.renderDateValue(completedFlag);
    let taskListItemClassName = 'taskListItem' + (this.props.task.dirty ? ' dirty' : '');

    // Event Handler for changed components
    let completedFlagHandler = e => this.onCompletedFlagChanged(e);
    let titleChangedHandler = e => this.onTitleChanged(e);

    return (
      <div className={taskListItemClassName}>
        <div className="taskListItem-fixed">
          <AbsoluteCenter>
            <input ref="completed" checked={completedFlag} type="checkbox" onChange={completedFlagHandler}/>
          </AbsoluteCenter>
        </div>
        <div className="taskListItem-grow">
          <div className="taskListItem-titledate">
            <h1><input ref="title" type="text" onChange={titleChangedHandler} value={this.props.task.title}/></h1>
            {date}
          </div>
        </div>
      </div>
    );
  }
}

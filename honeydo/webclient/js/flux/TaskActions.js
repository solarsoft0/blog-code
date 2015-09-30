import {Action, Dispatcher} from 'flux-light';

export default class TaskActions {
  /**
   * Set the Completed Flag on an ID
   *
   * @method setCompleted
   * @param {string} id the GUID of the task
   * @param {boolean} flag is it complete or not
   * @static
   */
  static setCompleted(id, flag) {
    Dispatcher.dispatch(new Action('TASK-SET-COMPLETED', { taskid: id, state: flag }));
  }

  /**
   * Set the title on an ID
   *
   * @method setTitle
   * @param {string} id the GUID of the task
   * @param {string} title the new title
   * @static
   */
  static setTitle(id, title) {
    Dispatcher.dispatch(new Action('TASK-SET-TITLE', { taskid: id, title: title }));
  }

  /**
   * Set the due date on an ID
   *
   * @method setDueDate
   * @param {string} id the GUID of the task
   * @param {Moment} date the new due date
   * @static
   */
  static setDueDate(id, date) {
    Dispatcher.dispatch(new Action('TASK-SET-DUEDATE', { taskid: id, due: date }));
  }

  /**
   * Create a new task
   *
   * @method createTask
   * @static
   */
  static createTask() {
    Dispatcher.dispatch(new Action('TASK-NEW-TASK'));
  }
}

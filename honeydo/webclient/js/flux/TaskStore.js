import {Store} from 'flux-light';
import Task from '../models/Task';
import moment from 'moment';
import uuid from 'uuid';
import localforage from 'localforage';

localforage.config({
  name: 'HoneyDo-TaskList'
});

class TaskStore extends Store {
  /**
   * Implements the TaskStore data store.  A Task is defined in The
   * Task model.
   *
   * @class TaskStore
   * @constructor
   */
  constructor() {
    super();

    // Set up the "store" variables
    this.tasks = [];
    this.saving = false;

    // Load up the old store (or create a new one)
    this.loadTasks();

    // Set up a periodic poll for saving. Default: 5 seconds
    this.intervalID = setInterval(() => this.saveTasks(), 2000);
  }

  /**
   * Required method for the Flux-Light Store
   *
   * @property name
   * @type string
   */
  get name() { return 'TaskStore'; }

  /**
   * Required method for the Flux-Light Store
   *
   * @method onAction
   * @param {Action} action the action being processed
   * @return {boolean} did this store process the action?
   */
  onAction(action) {
    let result = false;

    switch (action.name) {
      case 'TASK-NEW-TASK':
        result = this.taskNewTask();
        break;
      case 'TASK-SET-COMPLETED':
        result = this.taskSetCompleted(action.data);
        break;
      case 'TASK-SET-DUEDATE':
        result = this.taskSetDueDate(action.data);
        break;
      case 'TASK-SET-TITLE':
        result = this.taskSetTitle(action.data);
        break;
    }
    if (result) {
      this.changeStore();
    }
    return result;
  }

  /**
   * Handle the TASK-NEW-TASK action for creating a new task
   *
   * @method taskNewTask
   * @return {boolean} true if anything changed
   * @private
   */
  taskNewTask() {
    let task = new Task('New Task');
    this.tasks.push(task);
    return true;
  }

  /**
   * Handle the TASK-SET-TITLE action for changing a task title
   *
   * @method taskSetTitle
   * @param {object} data the data blob from the action
   * @return {boolean} true if anything was changed
   * @private
   */
  taskSetTitle(data) {
    let idx = this.tasks.findIndex(t => t.id == data.taskid);
    if (idx === -1) {
      this.logger.error(`Error: TASK-SET-TITLE: Task ID ${data.taskid} is not available`);
      return false;
    }
    if (this.tasks[idx].title !== data.title) {
      this.logger.debug(`TASK-SET-TITLE: Setting title on ${data.taskid} to ${data.title}`);
      try {
        this.tasks[idx].title = data.title;
        return true;
      } catch (err) {
        this.logger.error(`TASK-SET-TITLE: Cannot set title on ${data.taskid}: ${err}`);
        return false;
      }
    }
    this.logger.debug(`TASK-SET-TITLE: Title on ${data.taskid} is the same - no change`);
    return false;
  }

  /**
   * Handle the TASK-SET-DUEDATE action for changing a task due date
   *
   * @method taskSetDueDate
   * @param {object} data the data blob from the action
   * @return {boolean} true if anything was changed
   * @private
   */
  taskSetDueDate(data) {
    this.logger.debug(`TASK-SET-DUEDATE: Data = `, data);
    let idx = this.tasks.findIndex(t => t.id == data.taskid);
    if (idx === -1) {
      this.logger.error(`Error: TASK-SET-DUEDATE: Task ID ${data.taskid} is not available`);
      return false;
    }
    let current = this.tasks[idx].due;
    if (current.isValid() && data.due.isSame(current, 'day')) {
      this.logger.debug(`TASK-SET-DUEDATE: Due date on ${data.taskid} is the same - no change`);
      return false;
    }
    if (!current.isValid() && !data.due.isValid()) {
      this.logger.debug(`TASK-SET-DUEDATE: Due date on ${data.taskid} is the same - no change`);
      return false;
    }
    this.logger.debug(`TASK-SET-DUEDATE: Set due date on ${data.taskid} to ${data.due.format('MMM Do yyyy')}`);
    this.tasks[idx].due = data.due;
    return true;
  }

  /**
   * Handles the TASK-SET-COMPLETED action to set or clear the completed flag
   *
   * @method taskSetCompleted
   * @param {object} data the data block
   * @return {boolean} did we change anything
   * @private
   */
  taskSetCompleted(data) {
    let idx = this.tasks.findIndex(t => t.id === data.taskid);
    if (idx === -1) {
      this.logger.error(`Error: TASK-SET-COMPLETED: Task ID ${data.taskid} is not available`);
      return false;
    }
    let completed = this.tasks[idx].completed.isValid();
    if (data.state && !completed) {
      this.logger.debug(`TASK-SET-COMPLETED: Setting Completed Flag on ${data.taskid} to ${data.state}`);
      this.tasks[idx].completed = moment();
      return true;
    } else if (!data.state && completed) {
      this.logger.debug(`TASK-SET-COMPLETED: Clearing Completed Flag on ${data.taskid} to ${data.state}`);
      this.tasks[idx].completed = moment.invalid();
      return true;
    }
    this.logger.debug(`TASK-SET-COMPLETED: Completed flag on ${data.taskid} is the same - no change`);
    return false;
  }

  /**
   * Load the tasks from persistent storage
   * @method loadTasks
   * @throws {Error} if there is a parse error
   * @async
   */
  loadTasks() {
    let oneweekago = moment().subtract(7, 'days');

    /*
     * This is the normal sequence - each key is the GUID of the task and
     * the value is the serialized value of the task
     */
    localforage.iterate((value, key, iterationNumber) => {
      let task = Task.deserialize(value);
      this.tasks.push(task);
    }).then(() => {
      // Check to see if we need to initialize the tasks list
      if (this.tasks.length === 0) {
        this.initializeTasks();
      }
      this.changeStore();
    });
  }

  /**
   * Save the tasks to persistent storage
   *
   * @method saveTasks
   * @throws {Error} if there is a serialization or storage error
   */
  saveTasks() {
    // Return immediately if the store is not dirty OR we are already saving
    if (!this.isDirty() || this.saving) {
      return;
    }

    // Set the dirty flag to false and the saving flag to true
    this.saving = true; this.changeStore();

    // Loop through the tasks that are dirty and store them
    this.tasks.filter(t => t.dirty).forEach(t => {
      localforage.setItem(t.id, t.serialize());
      t.dirty = false;
    });

    // Loop through the tasks and determine if any should be deleted because
    // the ID is no longer valid
    localforage.iterate((value, key) => {
      if (this.tasks.findIndex(t => t.id === key) === -1) {
        this.logger.info(`Removing id ${key} - not in task list`);
        localforage.removeItem(key);
      }
    })

    // Now that we are done that, clear the saving flag and change the store
    this.saving = false; this.changeStore();
  }

  /**
   * Initialize some tasks if the load fails
   */
  initializeTasks() {
    // A completed task
    let t0 = new Task('Investigate HoneyDo');
    t0.completed = moment();
    this.createTask(t0, true);

    // A task with a due date
    let t1 = new Task('Tell Twitter how awesome HoneyDo is');
    t1.due = moment().add(1, 'days');
    this.createTask(t1, true);

    // A task without a due date
    let t2 = new Task('Give Feedback on HoneyDo');
    this.createTask(t2, true);

    // The above task creations are all squashing the changeStore
    // so we need to emit one separately
    this.changeStore();
  }

  /**
   * Creates a new task - if the task ID already exists, then an Error
   * is thrown
   *
   * @method createTask
   * @param {Task} newtask the new task
   * @param {boolean} [squash=false] squash the changeStore event
   * @throw {Error} if the Task already exists
   */
  createTask(newtask, squash = false) {
    this.tasks.every(task => {
      if (task.id === newtask.id) {
        throw new Error(`[TaskStore.createTask] Task ${newtask.id} already exists`)
      }
    });

    newtask.dirty = true;
    this.dirty = true;
    this.tasks.push(newtask);
    if (!squash) {
      this.changeStore();
    }
  }

  /**
   * Deletes the specified task or task ID.  If the task ID does not exist,
   * then an Error is thrown
   *
   * @method deleteTask
   * @param {Task | string} task the task (or ID) to delete
   * @param {boolean} [squash=false] squash the changeStore event
   * @throw {Error} if the task does not exist
   */
  deleteTask(task, squash = false) {
    // Work out what task ID we need to delete
    let id = task;
    if (task instanceof Task) {
      id = task.id;
    }
    // Find the task ID
    let offset = this.tasks.findIndex(t => t.id === id);
    if (offset === -1) {
      throw new Error(`[TaskStore.deleteTask] Task ${id} is not found`);
    }
    this.tasks.splice(offset, 1);
    this.dirty = true;
    if (!squash) {
      this.changeStore();
    }
  }

  /**
   * Changes / Updates the specified task with new information
   *
   * @method updateTask
   * @param {Task} the updated task
   * @param {boolean} [squash=false] squash the changeStore event
   * @throw {Error} if the task does not exist
   */
  updateTask(task, squash = false) {
    let offset = this.tasks.findIndex(t => t.id === task.id);
    if (offset === -1) {
      throw new Error(`[TaskStore.updateTask] Task ${task.id} is not found`);
    }
    this.tasks[offset] = task;
    this.setDirty(offset);
    if (!squash) {
      this.changeStore();
    }
  }

  /**
   * Get the list of tasks
   *
   * @method getTasks
   * @param {boolean} completed get completed tasks as well
   * @return {Array[Task]} an array of task objects
   */
  getTasks(completed = false) {
    if (completed) {
      return Array.from(this.tasks);
    } else {
      return Array.from(this.tasks.filter(t => !t.completed.isValid()));
    }
  }

  /**
   * Get the count of dirty tasks
   *
   * @method getDirtyTasks
   * @return {Number} the number of dirty tasks
   */
  getDirtyTasks() {
    return this.tasks.filter(t => t.dirty).length;
  }

  /**
   * Determine if any tasks are dirty
   *
   * @method isDirty
   * @return {boolean} if there are any dirty tasks
   */
  isDirty() {
    return this.getDirtyTasks() > 0;
  }
}

/*
 * SINGLETON PATTERN - we expose a singleton view of the TaskStore, not
 * the class itself.
 */
var taskStore = new TaskStore();

export default taskStore;

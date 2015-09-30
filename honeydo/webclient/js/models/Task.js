import React from 'react';
import uuid from 'uuid';
import moment from 'moment';

export default class Task {
  /*
   * Regular Expression that describes a GUID
   */
  static GUID_RE = new RegExp(/^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/);

  /**
   * Model: Task
   *    Property: {uuid} id - the unique ID of the Task
   *    Property: {string} title - the title of the Task
   *    Property: {moment} due - can be moment.invalid()
   *    Property: {moment} completed - can be moment.invalid()
   *
   * @class Task
   * @constructor
   */
  constructor(title) {
    this.sID = uuid.v1();
    this.title = title;
    this.sDue = moment.invalid();
    this.sCompleted = moment.invalid();
    this.sDirty = true;
  }

  /**
   * Property for accessing the ID.  Except in rare situations, the ID
   * should be read-only.  Exceptions include deserialization and loading
   * from disk.
   *
   * @property id
   * @type string
   * @readonly
   */
  get id() { return this.sID; }
  set id(v) {
    // v must be a string, 36 characters in length and a valid UUID
    if (typeof v === 'string' && v.length === 36 && Task.GUID_RE.test(v)) {
      this.sID = v;
      return;
    }
    throw new Error('Invalid ID supplied');
  }

  /**
   * Property for accessing the Title.  The title must be non-zero length
   * in all cases.
   *
   * @property title
   * @type string
   */
  get title() { return this.sTitle; }
  set title(v) {
    // v must be a string, between 1 and 250 characters when trimmed
    if (typeof v === 'string') {
      v = v.replace(/^[\s\uFEFF\xA0]+/, '');  // trimLeft() is not supported
      if (v.length > 0 && v.length < 250) {
        this.sTitle = v;
        this.sDirty = true;
        return;
      }
    }
    throw new Error('Invalid Title supplied');
  }

  /**
   * Property for accessing the Due Date.  A due date must be a parseable
   * ISO-8601 date OR a moment (including an invalid moment)
   *
   * @property due
   * @type moment
   */
  get due() { return this.sDue; }
  set due(v) {
    // v must be a string that can be parsed or a moment
    if (typeof v === 'string') {
      v = moment(v);
      if (v.isValid()) {
        this.sDue = v;
        this.sDirty = true;
        return;
      }
    } else if (this.isAMoment(v)) {
      this.sDue = v;
      this.sDirty = true;
      return;
    }
    throw new Error('Invalid Due Date supplied');
  }

  /**
   * Property for accessing the Completed Date.  A completed date must be
   * a parseable ISO-8601 date OR a moment (including an invalid moment)
   *
   * @property completed
   * @type moment
   */
  get completed() { return this.sCompleted; }
  set completed(v) {
    // v must be a string that can be parsed or a moment
    if (typeof v === 'string') {
      v = moment(v);
      if (v.isValid()) {
        this.sCompleted = v;
        this.sDirty = true;
        return;
      }
    } else if (this.isAMoment(v)) {
      this.sCompleted = v;
      this.sDirty = true;
      return;
    }
    throw new Error('Invalid Completed Date supplied');
  }

  /**
   * Property for accessing the dirty flag.
   *
   * @property dirty
   * @type boolean
   */
  get dirty() { return this.sDirty; }
  set dirty(v) { this.sDirty = v; }

  /**
   * Determines if the provided object is a moment() object
   *
   * @method isAMoment
   * @param {object} o the object to test
   * @return {boolean} true if o is a moment() object
   * @private
   */
  isAMoment(o) {
    if (typeof o === 'object') {
      if ('_isAMomentObject' in o) {
        return true;
      }
    }
    return false;
  }

  /**
   * Serializes the object and returns the serialized string
   *
   * @method serialize
   * @return {string} the serialized string
   * @throw {Error} if JSON.stringify() throws an Error
   */
  serialize() {
    let o = {
      id: this.sID,
      title: this.sTitle
    };

    if (this.sDue.isValid()) {
      o.due = this.sDue.toISOString();
    }
    if (this.sCompleted.isValid()) {
      o.completed = this.sCompleted.toISOString();
    }

    return JSON.stringify(o);
  }

  /**
   * Deserializes JSON and returns a Task object
   *
   * @method deserialize
   * @param {string} data the JSON data to deserialize
   * @return {Task} the Task object to return
   * @static
   * @throw {Error} if JSON is invalid
   */
  static deserialize(data) {
    let o = JSON.parse(data);

    // Minimally, we must have an ID and a Title in the serialized data
    if (!o.id) {
      throw new Error('No ID in Serialized Data');
    }

    if (!o.title) {
      throw new Error('No Title in Serialized Data');
    }

    let t = new Task(o.title);
    t.id = o.id;

    // For all other fields, set the appropriate field on the Task object
    for (let k in o) {
      switch (k) {
        case 'title':
        case 'id':
          // These fields have already been dealt with above
          break;
        case 'due':
          // Due Date (if specified) is a Valid ISO-8601 date
          t.due = moment(o.due);
          break;
        case 'completed':
          // Completed (if specified) is a Valid ISO-8601 date
          t.completed = moment(o.completed);
          break;
        default:
          throw new Error(`Invalid key ${k} in Serialized Data`);
      }
    }

    // When we deserialize, it isn't dirty
    t.sDirty = false;

    // Return the resultant task
    return t;
  }
}

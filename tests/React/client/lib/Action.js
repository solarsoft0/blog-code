import EventEmitter from "events";

var eventbus = new EventEmitter();

export default class Action {
  createAction(actiontype, data) {
    eventbus.emit(actiontype, data);
  }

  listenForAction(actiontype, func) {
    eventbus.on(actiontype, func);
  }
}

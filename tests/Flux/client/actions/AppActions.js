import dispatcher from '../dispatcher.js';

export default class AppActions {
  static dispatchInitializeAction() {
    dispatcher.dispatch('INITIALIZE');
  }

  static dispatchNavigateAction(newPage) {
    dispatcher.dispatch('NAVIGATE', { location: newPage });
  }
}

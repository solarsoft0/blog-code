import Action from "../lib/Action";

export default class PageActions extends Action {
  changePage(location) {
    this.createAction("PAGE_CHANGE", location);
  }

  changeWelcome(fieldname, v) {
    this.createAction("WELCOME_UPDATE", {
      "fieldname": fieldname,
      "value": v
    });
  }

  listenForPageChange(func) {
    this.listenForAction("PAGE_CHANGE", func);
  }

  listenForWelcomeChange(func) {
    this.listenForAction("WELCOME_UPDATE", func);
  }
}

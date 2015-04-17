/* eslint-disable no-console */
/* eslint-env browser, es6, jquery */

Polymer({ // eslint-disable-line new-cap, no-irregular-whitespace
    is: "s-menuicon",

    properties: {
        icon: {
            type: String,
            value: "bug",
            observer: "iconChanged"
        }
    },

    //#region CSS Class Handling Functions
    hasClass: function (el, className) {
        "use strict";

        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return new RegExp("(^| )" + className + "( |$)", "gi").test(el.className);
        }
    },

    addClass: function (el, className) {
        "use strict";

        if (this.hasClass(el, className)) {
            return;
        }
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += " " + className;
        }
    },

    removeClass: function (el, className) {
        "use strict";

        if (!this.hasClass(el, className)) {
            return;
        }
        if (el.classList) {
            el.classList.remove(className);
        } else {
            el.className = el.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
        }
    },
    //#endregion

    /*
     * The ready method is part of an elements lifecycle and is automatically
     * called when the template has been stamped and all elements in the local
     * DOM have been configured.
     */
    iconChanged: function (newValue, oldValue) {
        "use strict";

        var oldIcon = "fa-" + oldValue,
            newIcon = "fa-" + newValue,
            iconEl = this.$.icon;

        console.log("Removing class " + oldIcon);
        this.removeClass(iconEl, oldIcon);
        this.addClass(iconEl, newIcon);
    }
});

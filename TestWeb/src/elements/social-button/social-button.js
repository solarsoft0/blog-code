/* eslint-disable no-console */
/* eslint-env browser, es6 */

Polymer({ // eslint-disable-line new-cap, no-irregular-whitespace
    is: "social-button",

    properties: {
        network: {
            type: String,
            value: "bug",
            observer: "networkChanged"
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

    iconName: function (network) {
        "use strict";

        switch (network) {
            case "microsoft":
                return "fa-windows";
            default:
                return "fa-" + network;
        }
    },

    btnName: function (network) {
        "use strict";

        switch (network) {
            case "google":
                return "btn-google-plus";
            default:
                return "btn-" + network;
        }
    },

    /*
     * The ready method is part of an elements lifecycle and is automatically
     * called when the template has been stamped and all elements in the local
     * DOM have been configured.
     */
    networkChanged: function (newValue, oldValue) {
        "use strict";

        var oldIcon = this.iconName(oldValue),
            newIcon = this.iconName(newValue),
            oldBtn = this.btnName(oldValue),
            newBtn = this.btnName(newValue),
            iconEl = this.$.icon;

        var networkMsg = newValue.charAt(0).toUpperCase() + newValue.slice(1);

        this.removeClass(iconEl, oldIcon);
        this.addClass(iconEl, newIcon);
        this.$.msg.innerText = "Sign in with " + networkMsg;
        this.removeClass(this.$.content, oldBtn);
        this.addClass(this.$.content, newBtn);
    }
});

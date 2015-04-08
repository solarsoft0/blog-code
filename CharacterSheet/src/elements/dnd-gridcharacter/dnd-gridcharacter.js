Polymer({
    is: "dnd-gridcharacter",

    properties: {
        party: {
            type: Boolean,
            value: false,
            observer: "partyObserver"
        },
        shared: {
            type: Boolean,
            value: false,
            observer: "sharedObserver"
        }
    },

    //#region Global Event Listeners
    domReady: function() {
        this.windowResize();
    },

    windowResize: function() {
        // Make the object square by setting height == width
        this.style.height = this.offsetWidth + "px";

        // Make the character name font fit inside the containing DIV
        var textHeight = Math.floor(this.offsetHeight * 0.12);
        Polymer.dom(this).querySelector("h1").style.fontSize = textHeight + "px";
    },
    //#endregion

    //#region Lifecycle event handlers
    ready: function() {
        var that = this;
        // Add event handler for DOMContentLoaded
        if (document.readyState != 'loading') {
            this.domReady();
        } else {
            window.addEventListener('DOMContentLoaded', function () { that.domReady(); });
        }

        // Add event handler for window resize
        window.addEventListener("resize", function() { that.windowResize(); });
    },
    //#endregion

    //#region Property Observers
    partyObserver: function (newValue, oldValue) {
        this.$.partyIcon.style.display = newValue ? "block" : "none";
    },

    sharedObserver: function (newValue, oldValue) {
        this.$.shareIcon.style.display = newValue ? "block" : "none";
    }
    //#endregion
});
Polymer({
    is: "dnd-carousel",

    properties: {
        interval: {
            type: Number,
            value: 30
        }
    },

    ready: function () {
        var that = this; // Current object for event handlers;

        this.DIVSET = Polymer.dom(this).querySelectorAll("#carousel > div");
        if (this.DIVSET.length === 0) {
            console.log("No members - turning off");
            return;
        }

        this.MARKERS = [];
        for (var i = 1 ; i <= this.DIVSET.length ; i++) {
            var marker = document.createElement("span");
            marker.className = "marker";
            marker.innerHTML = i.toString();
            Polymer.dom(this.$.carouselmarkers).appendChild(marker);

            marker.addEventListener("click", function (evt) {
                var newIndex = parseInt(evt.currentTarget.innerText);
                that.displayCarousel(newIndex - 1);
            });

            this.MARKERS.push(marker);
        }
        Polymer.dom.flush();

        // Reset the carousel active element
        this.activeElement = -1;

        // Display the first carousel
        this.displayCarousel(0);

        // Set up the Interval event for automatically changing the cover
        this.intervalTimer = setInterval(function () {
            var newIndex = (that.activeElement + 1) % that.DIVSET.length;
            that.displayCarousel(newIndex);
        }, this.interval * 1000);
    },

    //#region CSS Class Handling Functions
    hasClass: function(el, className) {
        if (el.classList) {
            return el.classList.contains(className);
        } else {
            return new RegExp("(^| )" + className + "( |$)", "gi").test(el.className);
        }
    },

    addClass: function(el, className) {
        if (this.hasClass(el, className)) {
            return;
        }
        if (el.classList) {
            el.classList.add(className);
        } else {
            el.className += " " + className;
        }
    },

    removeClass: function(el, className) {
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

    // Private methods
    displayCarousel: function (idx) {
        if (idx === this.activeElement) {
            console.log("displayCarousel: Skipping as requested EL is the same as Active EL");
            return;
        }

        for (var i = 0 ; i < this.DIVSET.length ; i++) {
            var el = this.DIVSET[i],
                marker = this.MARKERS[i];
            if (i === idx) {
                this.addClass(el, "active");
                this.addClass(marker, "active");
            } else {
                this.removeClass(el, "active");
                this.removeClass(marker, "active");
            }
        }

        this.activeElement = idx;
    }
});
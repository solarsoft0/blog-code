(function () {
    // Find the template for this HTML element
    var template = document.currentScript.ownerDocument.querySelector("#noLibHelloWorld");

    // Create the prototype for the new HTML element
    var elementPrototype = Object.create(HTMLElement.prototype);

    // Set up lifecycle callbacks for the new HTML element
    elementPrototype.createdCallback = function () {
        // Create the shadow DOM and clone the template into the shadow DOM
        var shadow = this.createShadowRoot();
        shadow.appendChild(template.content.cloneNode(true));
    }
    document.registerElement("nolib-helloworld", { prototype: elementPrototype });
})();

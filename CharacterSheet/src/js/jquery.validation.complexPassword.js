/* eslint strict: 0 */

/**
 * Plugin for jQuery Validation
 *  Handle complex password
 */
jQuery.validator.addMethod("complexPassword", function(value) {
    // Min to Max length is already handled - just have to handle complexity
    var hasUpper = false, hasLower = false, hasNumeric = false, hasSymbol = false;

    for (var i = 0; i < value.length; i++) {
        var ch = value.charAt(i);
        if ("ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(ch) !== -1) {
            hasUpper = true;
        }
        if ("abcdefghijklmnopqrstuvwxyz".indexOf(ch) !== -1) {
            hasLower = true;
        }
        if ("0123456789".indexOf(ch) !== -1) {
            hasNumeric = true;
        }
        if ("!@@#\$\%^&*()_-+=|\\}{[]:;\"'<>?/.,".indexOf(ch) !== -1) {
            hasSymbol = true;
        }
    }
    return (hasUpper && hasLower && hasNumeric && hasSymbol);
}, "Password must be more complex");

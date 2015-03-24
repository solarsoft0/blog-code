System.register([], function (_export) {
    var _createClass, _classCallCheck, Welcome;

    return {
        setters: [],
        execute: function () {
            "use strict";

            _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

            _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

            Welcome = _export("Welcome", (function () {
                function Welcome() {
                    _classCallCheck(this, Welcome);

                    this.heading = "Welcome to the Aurelia Navigation App!";
                    this.firstName = "John";
                    this.lastName = "Doe";
                }

                _createClass(Welcome, {
                    fullName: {
                        get: function () {
                            return "" + this.firstName + " " + this.lastName;
                        }
                    },
                    welcome: {
                        value: function welcome() {
                            alert("Welcome, " + this.fullName + "!");
                        }
                    }
                });

                return Welcome;
            })());
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdzL3dlbGNvbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijt1Q0FBYSxPQUFPOzs7Ozs7Ozs7OztBQUFQLG1CQUFPO0FBQ0wseUJBREYsT0FBTyxHQUNIOzBDQURKLE9BQU87O0FBRVosd0JBQUksQ0FBQyxPQUFPLEdBQUcsd0NBQXdDLENBQUM7QUFDeEQsd0JBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0FBQ3hCLHdCQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztpQkFDekI7OzZCQUxRLE9BQU87QUFPWiw0QkFBUTs2QkFBQSxZQUFFO0FBQ1Ysd0NBQVUsSUFBSSxDQUFDLFNBQVMsU0FBSSxJQUFJLENBQUMsUUFBUSxDQUFHO3lCQUMvQzs7QUFFRCwyQkFBTzsrQkFBQSxtQkFBRTtBQUNMLGlDQUFLLGVBQWEsSUFBSSxDQUFDLFFBQVEsT0FBSSxDQUFDO3lCQUN2Qzs7Ozt1QkFiUSxPQUFPIiwiZmlsZSI6InZpZXdzL3dlbGNvbWUuanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==
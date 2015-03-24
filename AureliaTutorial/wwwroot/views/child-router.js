System.register(["aurelia-router"], function (_export) {
    var Router, _createClass, _classCallCheck, ChildRouter;

    return {
        setters: [function (_aureliaRouter) {
            Router = _aureliaRouter.Router;
        }],
        execute: function () {
            "use strict";

            _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

            _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

            ChildRouter = _export("ChildRouter", (function () {
                function ChildRouter(router) {
                    _classCallCheck(this, ChildRouter);

                    this.heading = "Child Router";
                    this.router = router;
                    router.configure(function (config) {
                        config.map([{ route: ["", "welcome"], moduleId: "views/welcome", nav: true, title: "Welcome" }, { route: "flickr", moduleId: "views/flickr", nav: true }, { route: "child-router", moduleId: "views/child-router", nav: true, title: "Child Router" }]);
                    });
                }

                _createClass(ChildRouter, null, {
                    inject: {
                        value: function inject() {
                            return [Router];
                        }
                    }
                });

                return ChildRouter;
            })());
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdzL2NoaWxkLXJvdXRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQVEsTUFBTSxpQ0FFRCxXQUFXOzs7O0FBRmhCLGtCQUFNLGtCQUFOLE1BQU07Ozs7Ozs7OztBQUVELHVCQUFXO0FBRVQseUJBRkYsV0FBVyxDQUVSLE1BQU0sRUFBQzswQ0FGVixXQUFXOztBQUdoQix3QkFBSSxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUM7QUFDOUIsd0JBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0FBQ3JCLDBCQUFNLENBQUMsU0FBUyxDQUFDLFVBQUEsTUFBTSxFQUFJO0FBQ3ZCLDhCQUFNLENBQUMsR0FBRyxDQUFDLENBQ1QsRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUMsU0FBUyxDQUFDLEVBQUcsUUFBUSxFQUFFLGVBQWUsRUFBTyxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBQyxTQUFTLEVBQUUsRUFDdEYsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFTLFFBQVEsRUFBRSxjQUFjLEVBQVEsR0FBRyxFQUFFLElBQUksRUFBRSxFQUNyRSxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUcsUUFBUSxFQUFFLG9CQUFvQixFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFDLGNBQWMsRUFBRSxDQUM1RixDQUFDLENBQUM7cUJBQ04sQ0FBQyxDQUFDO2lCQUNOOzs2QkFaUSxXQUFXO0FBQ2IsMEJBQU07K0JBQUEsa0JBQUc7QUFBRSxtQ0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO3lCQUFFOzs7O3VCQUQzQixXQUFXIiwiZmlsZSI6InZpZXdzL2NoaWxkLXJvdXRlci5qcyIsInNvdXJjZVJvb3QiOiIvc3JjLyJ9
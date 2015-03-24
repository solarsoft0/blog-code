System.register(["aurelia-http-client"], function (_export) {
    var HttpClient, _createClass, _classCallCheck, url, Flickr;

    return {
        setters: [function (_aureliaHttpClient) {
            HttpClient = _aureliaHttpClient.HttpClient;
        }],
        execute: function () {
            "use strict";

            _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

            _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

            url = "http://api.flickr.com/services/feeds/photos_public.gne?tags=rainier&tagmode=any&format=json";
            Flickr = _export("Flickr", (function () {
                function Flickr(http) {
                    _classCallCheck(this, Flickr);

                    this.heading = "Flickr";
                    this.images = [];
                    this.http = http;
                }

                _createClass(Flickr, {
                    activate: {
                        value: function activate() {
                            var _this = this;

                            return this.http.jsonp(url).then(function (response) {
                                _this.images = response.content.items;
                            });
                        }
                    },
                    canDeactivate: {
                        value: function canDeactivate() {
                            return confirm("Are you sure you want to leave?");
                        }
                    }
                }, {
                    inject: {
                        value: function inject() {
                            return [HttpClient];
                        }
                    }
                });

                return Flickr;
            })());
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXdzL2ZsaWNrci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQVEsVUFBVSxpQ0FFZCxHQUFHLEVBRU0sTUFBTTs7OztBQUpYLHNCQUFVLHNCQUFWLFVBQVU7Ozs7Ozs7OztBQUVkLGVBQUcsR0FBRyw2RkFBNkY7QUFFMUYsa0JBQU07QUFHSix5QkFIRixNQUFNLENBR0gsSUFBSSxFQUFDOzBDQUhSLE1BQU07O0FBSVgsd0JBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDO0FBQ3hCLHdCQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztBQUNqQix3QkFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7aUJBQ3BCOzs2QkFQUSxNQUFNO0FBU2YsNEJBQVE7K0JBQUEsb0JBQUU7OztBQUNOLG1DQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVEsRUFBSTtBQUN6QyxzQ0FBSyxNQUFNLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUM7NkJBQ3hDLENBQUMsQ0FBQzt5QkFDTjs7QUFFRCxpQ0FBYTsrQkFBQSx5QkFBRztBQUNaLG1DQUFPLE9BQU8sQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFDO3lCQUNyRDs7O0FBaEJNLDBCQUFNOytCQUFBLGtCQUFHO0FBQUUsbUNBQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQzt5QkFBRTs7Ozt1QkFEL0IsTUFBTSIsImZpbGUiOiJ2aWV3cy9mbGlja3IuanMiLCJzb3VyY2VSb290IjoiL3NyYy8ifQ==
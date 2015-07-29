(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var DeviceManager = (function () {
    function DeviceManager() {
        _classCallCheck(this, DeviceManager);
    }

    _createClass(DeviceManager, [{
        key: 'initialize',
        value: function initialize() {
            var _this = this;

            document.addEventListener('deviceready', function (event) {
                return _this.onDeviceReady(event);
            });
        }
    }, {
        key: 'onDeviceReady',
        value: function onDeviceReady(event) {
            console.log('[DeviceManager.onDeviceReady] Event = ', event);
            var el = document.getElementById('root');
            console.log('[DeviceManager.onDeviceReady] el = ', el);
            el.innerHTML = '<p>[DeviceManager.onDeviceReady] Booted.';
        }
    }]);

    return DeviceManager;
})();

console.log('[index] Creating new DeviceManager object');
var deviceManager = new DeviceManager();
console.log('[index] Initializing DeviceManager');
deviceManager.initialize();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJDOi9Vc2Vycy9hZHJpYW4vRG9jdW1lbnRzL0dpdEh1Yi9hZHJpYW5oYWxsL2Jsb2ctY29kZS9jb3Jkb3ZhLWVzNi1icm93c2VyaWZ5L2NvcmRvdmEtZXM2LWJyb3dzZXJpZnkvc3JjL2pzL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0lDQU8sYUFBYTthQUFiLGFBQWE7OEJBQWIsYUFBYTs7O2lCQUFiLGFBQWE7O2VBQ04sc0JBQUc7OztBQUNULG9CQUFRLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLFVBQUEsS0FBSyxFQUFJO0FBQUUsdUJBQU8sTUFBSyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7YUFBRSxDQUFDLENBQUM7U0FDNUY7OztlQUVZLHVCQUFDLEtBQUssRUFBRTtBQUNqQixtQkFBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUM3RCxnQkFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN6QyxtQkFBTyxDQUFDLEdBQUcsQ0FBQyxxQ0FBcUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUN2RCxjQUFFLENBQUMsU0FBUyxHQUFHLDBDQUEwQyxDQUFDO1NBQzdEOzs7V0FWRSxhQUFhOzs7QUFhcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDO0FBQ3pELElBQUksYUFBYSxHQUFHLElBQUksYUFBYSxFQUFFLENBQUM7QUFDeEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDO0FBQ2xELGFBQWEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCLvu79jbGFzcyBEZXZpY2VNYW5hZ2VyIHtcclxuICAgIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZGV2aWNlcmVhZHknLCBldmVudCA9PiB7IHJldHVybiB0aGlzLm9uRGV2aWNlUmVhZHkoZXZlbnQpOyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBvbkRldmljZVJlYWR5KGV2ZW50KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1tEZXZpY2VNYW5hZ2VyLm9uRGV2aWNlUmVhZHldIEV2ZW50ID0gJywgZXZlbnQpO1xyXG4gICAgICAgIHZhciBlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyb290Jyk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1tEZXZpY2VNYW5hZ2VyLm9uRGV2aWNlUmVhZHldIGVsID0gJywgZWwpO1xyXG4gICAgICAgIGVsLmlubmVySFRNTCA9ICc8cD5bRGV2aWNlTWFuYWdlci5vbkRldmljZVJlYWR5XSBCb290ZWQuJztcclxuICAgIH1cclxufVxyXG5cclxuY29uc29sZS5sb2coJ1tpbmRleF0gQ3JlYXRpbmcgbmV3IERldmljZU1hbmFnZXIgb2JqZWN0Jyk7XHJcbnZhciBkZXZpY2VNYW5hZ2VyID0gbmV3IERldmljZU1hbmFnZXIoKTtcclxuY29uc29sZS5sb2coJ1tpbmRleF0gSW5pdGlhbGl6aW5nIERldmljZU1hbmFnZXInKTtcclxuZGV2aWNlTWFuYWdlci5pbml0aWFsaXplKCk7XHJcbiJdfQ==

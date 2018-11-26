"use strict";

var _react = _interopRequireWildcard(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _reactRouterDom = require("react-router-dom");

var _CodingPanel = require("./modules/CodingPanel");

var _LoginPanel = require("./modules/LoginPanel");

var _HomePanel = require("./modules/HomePanel");

var _ProfilePanel = require("./modules/ProfilePanel");

var _RoulettePanel = require("./modules/RoulettePanel");

var _RoadMapPanel = require("./modules/RoadMapPanel");

var _Header = require("./modules/Header");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Main =
/*#__PURE__*/
function (_Component) {
  _inherits(Main, _Component);

  function Main(props) {
    var _this;

    _classCallCheck(this, Main);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Main).call(this, props));
    _this.state = {
      loggedIn: true,
      user: ''
    };
    return _this;
  }

  _createClass(Main, [{
    key: "updateState",
    value: function updateState(key, val) {
      this.setState(_defineProperty({}, key, val));
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      return _react.default.createElement("div", null, _react.default.createElement(_reactRouterDom.BrowserRouter, null, _react.default.createElement("div", null, _react.default.createElement("nav", null, _react.default.createElement(_LoginPanel.LoginPanel, {
        loggedIn: this.state.loggedIn,
        updating_parent_method: function updating_parent_method(key, val) {
          return _this2.updateState(key, val);
        }
      }), this.state.loggedIn ? _react.default.createElement("ul", null, _react.default.createElement("li", null, _react.default.createElement(_reactRouterDom.Link, {
        to: '/'
      }, "Home")), _react.default.createElement("li", null, _react.default.createElement(_reactRouterDom.Link, {
        to: '/coding'
      }, "Coding")), _react.default.createElement("li", null, _react.default.createElement(_reactRouterDom.Link, {
        to: '/roulette'
      }, "Roulette")), _react.default.createElement("li", null, _react.default.createElement(_reactRouterDom.Link, {
        to: '/roadmap'
      }, "RoadMap")), _react.default.createElement("li", null, _react.default.createElement(_reactRouterDom.Link, {
        to: '/profile'
      }, "Profile"))) : null), _react.default.createElement("div", null, _react.default.createElement(_Header.Header, null), _react.default.createElement(_reactRouterDom.Switch, null, _react.default.createElement(_reactRouterDom.Route, {
        exact: true,
        path: '/',
        component: _HomePanel.HomePanel
      }), _react.default.createElement(_reactRouterDom.Route, {
        path: '/coding',
        render: function render() {
          return _react.default.createElement(_CodingPanel.CodingPanel, {
            user: _this2.state.user
          });
        }
      }), _react.default.createElement(_reactRouterDom.Route, {
        path: '/roulette',
        render: function render() {
          return _react.default.createElement(_RoulettePanel.RoulettePanel, {
            user: _this2.state.user
          });
        }
      }), _react.default.createElement(_reactRouterDom.Route, {
        path: '/roadmap',
        render: function render() {
          return _react.default.createElement(_RoadMapPanel.RoadMapPanel, {
            user: _this2.state.user
          });
        }
      }), _react.default.createElement(_reactRouterDom.Route, {
        path: '/profile',
        render: function render() {
          return _react.default.createElement(_ProfilePanel.ProfilePanel, {
            user: _this2.state.user
          });
        }
      }))))));
    }
  }]);

  return Main;
}(_react.Component);

_reactDom.default.render(_react.default.createElement(Main, null), document.getElementById('reactdom'));

//# sourceMappingURL=index.js.map
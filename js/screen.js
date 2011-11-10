(function() {
  var NavKey, Screen, util;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  util = TangoTV.util;
  NavKey = (function() {
    var AVAILABLE_KEYS, KEY_CLASS, KEY_DESCRIPTION_CLASS, KEY_ICON_CLASS, NAVKEY_CLASS;
    NAVKEY_CLASS = "nav-key";
    KEY_CLASS = "key-helper";
    KEY_ICON_CLASS = "key-icon";
    KEY_DESCRIPTION_CLASS = "key-desc";
    AVAILABLE_KEYS = ["up-down", "left-right", "enter", "return", "A", "B", "C", "D"];
    function NavKey(containerSelector, keyRef) {
      var key, _i, _len;
      $(containerSelector).append($("<div class=\"" + NAVKEY_CLASS + "\">\n</div>"));
      this.mainElem = $("." + NAVKEY_CLASS);
      for (_i = 0, _len = AVAILABLE_KEYS.length; _i < _len; _i++) {
        key = AVAILABLE_KEYS[_i];
        this.mainElem.append($("<div id=\"nav-" + key + "\" class=\"" + KEY_CLASS + "\">\n    <div class=\"" + KEY_ICON_CLASS + "\"></div>\n    <div class=\"" + KEY_DESCRIPTION_CLASS + "\"></div>\n</div>"));
      }
      this.hideAllKeys();
      for (key in keyRef) {
        this.showKey(key, keyRef[key]);
      }
    }
    NavKey.prototype.show = function() {
      return this.mainElem.show();
    };
    NavKey.prototype.hide = function() {
      return this.mainElem.hide();
    };
    NavKey.prototype.showKey = function(key, description) {
      var $keyHelper;
      $keyHelper = this.mainElem.find("." + KEY_CLASS + "#nav-" + key);
      $keyHelper.find("." + KEY_DESCRIPTION_CLASS).html(description);
      return $keyHelper.show();
    };
    NavKey.prototype.hideAllKeys = function() {
      return this.mainElem.find("." + KEY_CLASS).hide();
    };
    return NavKey;
  })();
  Screen = (function() {
    Screen.prototype.widgetAPI = new Common.API.Widget();
    Screen.prototype.tvKey = new Common.API.TVKeyValue();
    Screen.prototype.listenerId = "keyListener";
    function Screen(body) {
      this.body = body;
      this.backstack = [];
    }
    Screen.prototype.onLoad = function() {
      this.body = util.resolveToJqueryIfSelector(this.body);
      this.enableKeys();
      return this.widgetAPI.sendReadyEvent();
    };
    Screen.prototype.drawView = function(view) {
      this.body.empty();
      return view.drawIn(this.body);
    };
    Screen.prototype.openView = function(view) {
      var _base, _name, _ref, _ref2, _ref3;
      if ((_ref = this.currentView) != null) {
        if (typeof _ref.onUnload === "function") {
          _ref.onUnload();
        }
      }
      this.currentView = view;
      if ((_ref2 = this.currentView) != null) {
        if ((_ref3 = (_base = _ref2.keyHandler)[_name = this.tvKey.KEY_RETURN]) == null) {
          _base[_name] = __bind(function() {
            return this.goBack();
          }, this);
        }
      }
      this.setKeyHandler(this.currentView.keyHandler);
      this.drawView(this.currentView);
      return this.backstack.unshift(this.currentView);
    };
    Screen.prototype.goBack = function() {
      var _ref, _ref2;
      if (!(this.backstack.length > 1)) {
        return;
      }
      if ((_ref = this.currentView) != null) {
        if (typeof _ref.onUnload === "function") {
          _ref.onUnload();
        }
      }
      this.backstack.shift();
      this.currentView = this.backstack[0];
      this.setKeyHandler((_ref2 = this.currentView) != null ? _ref2.keyHandler : void 0);
      return this.drawView(this.currentView);
    };
    Screen.prototype.keyHandler = {};
    Screen.prototype.setKeyHandler = function(handler) {
      var _ref, _ref2;
      if ((_ref = this.keyHandler) != null) {
        if (typeof _ref.stealFocus === "function") {
          _ref.stealFocus();
        }
      }
      this.keyHandler = handler;
      if ((_ref2 = this.keyHandler) != null) {
        if (typeof _ref2.focus === "function") {
          _ref2.focus();
        }
      }
      if ((handler != null ? handler.keyRef : void 0) != null) {
        return this.displayNavKey(handler.keyRef);
      } else {
        return this.hideNavKey();
      }
    };
    Screen.prototype.enableKeys = function() {
      return $("#" + this.listenerId).focus();
    };
    Screen.prototype.onKeyDown = function(event) {
      if (!event) {
        event = window.event;
      }
      log.trace("Key " + event.keyCode + " pressed");
      if (typeof this.keyHandler[event.keyCode] === "function") {
        return this.keyHandler[event.keyCode](event);
      } else {
        return log.debug("Unhandled key pressed");
      }
    };
    Screen.prototype.displayNavKey = function(keyRef) {
      return this.navKey = new NavKey(this.body, keyRef);
    };
    Screen.prototype.hideNavKey = function() {
      var _ref;
      return (_ref = this.navKey) != null ? _ref.hide() : void 0;
    };
    Screen.prototype.loadPage = function(uri) {
      return document.location = uri;
    };
    return Screen;
  })();
  TangoTV.Screen = Screen;
}).call(this);

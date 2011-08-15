(function() {
  var Splash;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  Splash = (function() {
    __extends(Splash, TVApp.Screen);
    function Splash() {
      Splash.__super__.constructor.apply(this, arguments);
    }
    Splash.prototype.TIMEOUT = 300;
    Splash.prototype.onLoad = function() {
      log.debug("Splash.onLoad");
      Splash.__super__.onLoad.call(this);
      return this.initSplashTimeout();
    };
    Splash.prototype.initSplashTimeout = function() {
      var that;
      that = this;
      return this.timer = setTimeout(function() {
        return that.advance();
      }, this.TIMEOUT);
    };
    Splash.prototype.advance = function() {
      log.debug("Advancing to main screen");
      return this.loadPage("html/dashboard.html");
    };
    return Splash;
  })();
  TVApp.Splash = Splash;
}).call(this);

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
    __extends(Splash, TangoTV.Screen);
    Splash.prototype.timeout = 300;
    function Splash(fakeBodySelector, nextPageUri, timeout) {
      if (timeout != null) {
        this.timeout = timeout;
      }
      Splash.__super__.constructor.call(this, fakeBodySelector);
      this.nextPageUri = nextPageUri;
    }
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
      }, this.timeout);
    };
    Splash.prototype.advance = function() {
      log.debug("Advancing to main screen");
      return this.loadPage(this.nextPageUri);
    };
    return Splash;
  })();
  TangoTV.Splash = Splash;
}).call(this);

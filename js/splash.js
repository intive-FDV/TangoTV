(function() {
  var Splash, util;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  };
  util = TangoTV.util;
  Splash = (function() {
    __extends(Splash, TangoTV.Screen);
    Splash.prototype.config = {
      timeout: 1000
    };
    function Splash(config) {
      $.extend(true, this.config, config);
      this.container = util.resolveToJqueryIfSelector(this.config.container);
      Splash.__super__.constructor.call(this, this.container);
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
      }, this.config.timeout);
    };
    Splash.prototype.advance = function() {
      log.debug("Advancing to uri: " + this.config.nextPageUri);
      return this.loadPage(this.config.nextPageUri);
    };
    return Splash;
  })();
  TangoTV.Splash = Splash;
}).call(this);

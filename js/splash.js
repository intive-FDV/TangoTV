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
    var defaultParams;
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
    defaultParams = ['country', 'language', 'lang', 'modelid', 'server', 'firmware', 'remocon', 'area'];
    Splash.prototype.advance = function() {
      var nextPageUri, p, params, queryString, uri, _i, _len;
      params = util.queryStringParams();
      uri = parseUri(this.config.nextPageUri);
      queryString = uri.query || '?_=_';
      for (_i = 0, _len = defaultParams.length; _i < _len; _i++) {
        p = defaultParams[_i];
        queryString += "&" + p + "=" + params[p];
      }
      nextPageUri = '';
      if (uri.protocol) {
        nextPageUri += "" + uri.protocol + "://";
      }
      nextPageUri += "" + (String(uri.authority)) + (String(uri.path));
      nextPageUri += "" + queryString;
      if (uri.anchor) {
        nextPageUri += "#" + uri.anchor;
      }
      log.debug("Advancing to uri: " + nextPageUri);
      return this.loadPage(nextPageUri);
    };
    return Splash;
  })();
  TangoTV.Splash = Splash;
}).call(this);

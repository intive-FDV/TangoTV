(function() {
  var TangoTV, log;
  TangoTV = {};
  TangoTV.css = {
    switchClasses: function($element, removed, added) {
      $element.removeClass(removed);
      return $element.addClass(added);
    }
  };
  TangoTV.util = {
    STRING_TYPENAME: "string",
    deepCopy: function(object) {
      return $.extend(true, {}, object);
    },
    generateRandomId: function(prefix) {
      if (prefix == null) {
        prefix = '';
      }
      return "__" + prefix + "_" + (Math.floor(Math.random() * 88888));
    },
    resolveToJqueryIfSelector: function(object) {
      if (typeof object === TangoTV.util.STRING_TYPENAME) {
        return $(object);
      }
      return object;
    },
    loadScript: function(path, onLoad) {
      var script;
      if (onLoad == null) {
        onLoad = (function() {});
      }
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = path;
      script.onload = onLoad;
      return document.getElementsByTagName('head')[0].appendChild(script);
    },
    queryStringParams: function(query, acceptEmptyParams) {
      var eqPos, param, paramMap, params, _i, _len;
      if (query == null) {
        query = window.location.search;
      }
      if (acceptEmptyParams == null) {
        acceptEmptyParams = false;
      }
      paramMap = {};
      if (query.indexOf('?') === 0) {
        query = query.substring(1);
      }
      while (query.indexOf('&') === 0) {
        query = query.substring(1);
      }
      params = query.split('&');
      for (_i = 0, _len = params.length; _i < _len; _i++) {
        param = params[_i];
        eqPos = param.indexOf('=');
        if (eqPos > 0) {
          paramMap[param.substring(0, eqPos)] = param.substring(eqPos + 1);
        } else if (acceptEmptyParams) {
          paramMap[param] = '';
        }
      }
      return paramMap;
    }
  };
  window.TangoTV = TangoTV;
  log = {
    levels: {
      TRACE: 5,
      DEBUG: 4,
      INFO: 3,
      WARN: 2,
      ERROR: 1,
      OFF: 0,
      ALL: this.TRACE
    },
    level: 5,
    log: function(message, level) {
      if (this.level < this.levels[level]) {
        return;
      }
      return this.append("" + level + " " + message);
    },
    trace: function(m) {
      return this.log(m, "TRACE");
    },
    debug: function(m) {
      return this.log(m, "DEBUG");
    },
    info: function(m) {
      return this.log(m, "INFO");
    },
    warn: function(m) {
      return this.log(m, "WARN");
    },
    error: function(m) {
      return this.log(m, "ERROR");
    },
    append: typeof console !== "undefined" && console !== null ? function(m) {
      return console.log(m);
    } : function(m) {
      return this.fallbackAppend(m);
    },
    fallbackAppend: function(m) {
      return alert(m);
    }
  };
  window.log = log;
}).call(this);

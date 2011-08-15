(function() {
  var log;
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

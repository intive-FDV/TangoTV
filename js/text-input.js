(function() {
  var defaultConfig, onImeReady;

  defaultConfig = {
    lang: 'en',
    onReady: void 0,
    onComplete: void 0,
    onAnyKey: void 0,
    onEnter: void 0,
    extraKeys: {}
  };

  TangoTV.adaptInput = function(config) {
    var ime, input;
    config = $.extend(true, {}, defaultConfig, config);
    input = TangoTV.util.resolveToJqueryIfSelector(config.input);
    if (!input.attr("id")) {
      input.attr("id", TangoTV.util.generateRandomId('input'));
    }
    input.wrap("<div>").parent().html();
    ime = new IMEShell(input.attr("id"), onImeReady(config), config.lang);
    if (!ime) log.error("Failed adapting input #" + (input.attr("id")));
    return input;
  };

  onImeReady = function(config) {
    return function(ime) {
      var key, _ref;
      if (config.onComplete != null) ime.setOnCompleteFunc(config.onComplete);
      if ((((_ref = config.position) != null ? _ref.x : void 0) != null) && (config.position.y != null)) {
        ime.setKeypadPos(config.position.x, config.position.y);
      }
      if (config.onEnter != null) ime.setEnterFunc(config.onEnter);
      if (config.onAnyKey != null) ime.setAnyKeyFunc(config.onAnyKey);
      for (key in config.extraKeys) {
        ime.setKeyFunc(key, config.extraKeys[key]);
      }
      return config.onReady(ime);
    };
  };

  TangoTV.util.loadScript('$MANAGER_WIDGET/Common/IME/ime2.js');

}).call(this);

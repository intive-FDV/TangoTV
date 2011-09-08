(function() {
  var Calculator, ColorChanger, Dashboard, HiddableContent, Html5VideoPlayer, Video, tvKey;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  tvKey = new Common.API.TVKeyValue();
  HiddableContent = (function() {
    function HiddableContent() {}
    HiddableContent.prototype.show = function() {
      return this.getContainer().show();
    };
    HiddableContent.prototype.hide = function() {
      return this.getContainer().hide();
    };
    HiddableContent.prototype.toggle = function() {
      return this.getContainer().toggle();
    };
    return HiddableContent;
  })();
  ColorChanger = (function() {
    __extends(ColorChanger, HiddableContent);
    ColorChanger.prototype.getContainer = function() {
      return this.element;
    };
    ColorChanger.prototype.setColor = function(color) {
      return this.element.css({
        "background-color": color
      });
    };
    function ColorChanger(elementSelector) {
      this.element = $(elementSelector);
      this.keyHandler = {};
      this.keyHandler[tvKey.KEY_RED] = __bind(function() {
        return this.setColor("#a90921");
      }, this);
      this.keyHandler[tvKey.KEY_GREEN] = __bind(function() {
        return this.setColor("#418415");
      }, this);
      this.keyHandler[tvKey.KEY_YELLOW] = __bind(function() {
        return this.setColor("#d6ab00");
      }, this);
      this.keyHandler[tvKey.KEY_BLUE] = __bind(function() {
        return this.setColor("#09418f");
      }, this);
      this.keyHandler[tvKey.KEY_ENTER] = __bind(function() {
        return this.setColor("white");
      }, this);
      this.keyHandler.keyRef = {
        "enter": "White",
        "A": "Red",
        "B": "Green",
        "C": "Yellow",
        "D": "Blue"
      };
    }
    return ColorChanger;
  })();
  Calculator = (function() {
    __extends(Calculator, HiddableContent);
    Calculator.prototype.DISPLAY_CLASS = "display";
    Calculator.prototype.HISTORY_CLASS = "history";
    Calculator.prototype.LINE_CLASS = "calc-line";
    Calculator.prototype.OPERATOR_CLASS = "operator";
    Calculator.prototype.OPERAND_CLASS = "operand";
    Calculator.prototype.currentOperand = 0;
    Calculator.prototype.value = 0;
    Calculator.prototype.getContainer = function() {
      return this.container;
    };
    Calculator.prototype.noop = function() {
      return this.parseDisplay();
    };
    Calculator.prototype.sum = function(x, y) {
      return x + y;
    };
    Calculator.prototype.subtraction = function(x, y) {
      return x - y;
    };
    Calculator.prototype.multiplication = function(x, y) {
      return x * y;
    };
    Calculator.prototype.division = function(x, y) {
      return x / y;
    };
    Calculator.prototype.performOp = function() {
      return this.value = this.op(this.value, this.parseDisplay());
    };
    Calculator.prototype.addLine = function() {
      return this.history.prepend($("<div class=\"" + this.LINE_CLASS + "\">\n    <div class=\"" + this.OPERAND_CLASS + "\"></div>\n    <div class=\"" + this.OPERATOR_CLASS + "\"></div>\n    <div class=\"" + this.OPERAND_CLASS + "\"></div>\n</div>"));
    };
    Calculator.prototype.appendToOperand = function(str) {
      return this.display.html("" + (this.display.html()) + str);
    };
    Calculator.prototype.showValue = function() {
      return this.display.html(String(this.value));
    };
    Calculator.prototype.parseDisplay = function() {
      return +this.display.html();
    };
    Calculator.prototype.acceptOperand = function(value) {
      var suffix;
      suffix = ":first";
      if (this.currentOperand !== 0) {
        suffix = ":last";
      }
      this.history.find("." + this.LINE_CLASS + ":first ." + this.OPERAND_CLASS + suffix).html(value);
      this.currentOperand = (this.currentOperand + 1) % 2;
      return log.debug("Calc: Accepted " + value + " as " + suffix + " operand");
    };
    Calculator.prototype.clearDisplay = function() {
      return this.display.html("");
    };
    Calculator.prototype.showOperator = function(operator) {
      return this.history.find("." + this.OPERATOR_CLASS + ":first").html("" + operator);
    };
    Calculator.prototype.showResult = function() {
      return this.history.find("." + this.LINE_CLASS + ":first ." + this.OPERAND_CLASS + ":first").html(this.value);
    };
    Calculator.prototype.clearHistory = function() {
      this.history.html("");
      this.display.html("");
      this.addLine();
      this.value = 0;
      this.currentOperand = 0;
      this.op = this.noop;
      return log.debug("Calc: History clear");
    };
    Calculator.prototype.calculateAndSetOperation = function(operation, symbol) {
      this.performOp();
      if (this.currentOperand === 1) {
        this.acceptOperand(this.display.html());
        this.addLine();
      }
      this.acceptOperand(this.value);
      this.showOperator(symbol);
      this.clearDisplay();
      return this.op = operation;
    };
    function Calculator(containerSelector, elementSelector) {
      var num, _fn;
      this.container = $(containerSelector);
      this.element = $(elementSelector);
      this.display = this.element.find("." + this.DISPLAY_CLASS);
      this.history = this.element.find("." + this.HISTORY_CLASS);
      this.op = this.noop;
      this.keyHandler = {};
      this.keyHandler[tvKey.KEY_RED] = __bind(function() {
        return this.calculateAndSetOperation(this.subtraction, "-");
      }, this);
      this.keyHandler[tvKey.KEY_GREEN] = __bind(function() {
        return this.calculateAndSetOperation(this.multiplication, "*");
      }, this);
      this.keyHandler[tvKey.KEY_YELLOW] = __bind(function() {
        return this.calculateAndSetOperation(this.division, "/");
      }, this);
      this.keyHandler[tvKey.KEY_BLUE] = __bind(function() {
        return this.calculateAndSetOperation(this.sum, "+");
      }, this);
      this.keyHandler[tvKey.KEY_ENTER] = __bind(function() {
        return this.calculateAndSetOperation(this.noop, "");
      }, this);
      _fn = __bind(function(num) {
        return this.keyHandler[tvKey["KEY_" + num]] = __bind(function() {
          this.appendToOperand("" + num);
          return log.trace("Calc: Appended " + num);
        }, this);
      }, this);
      for (num = 0; num <= 9; num++) {
        _fn(num);
      }
      this.keyHandler[tvKey.KEY_RW] = __bind(function() {
        return this.clearHistory();
      }, this);
      this.keyHandler.keyRef = {
        "enter": "Calculate",
        "A": "Substract",
        "B": "Multiply",
        "C": "Divide",
        "D": "Add"
      };
    }
    return Calculator;
  })();
  Html5VideoPlayer = (function() {
    __extends(Html5VideoPlayer, HiddableContent);
    Html5VideoPlayer.prototype.getContainer = function() {
      return this.container;
    };
    function Html5VideoPlayer(containerSelector, elementSelector) {
      this.container = $(containerSelector);
      this.video = $(elementSelector)[0];
      this.keyHandler = {};
      this.keyHandler[tvKey.KEY_PLAY] = __bind(function() {
        log.debug("PLAY");
        return this.video.play();
      }, this);
      this.keyHandler[tvKey.KEY_STOP] = __bind(function() {
        log.debug("STOP");
        return this.video.stop();
      }, this);
    }
    return Html5VideoPlayer;
  })();
  Video = (function() {
    __extends(Video, HiddableContent);
    Video.prototype.getContainer = function() {
      return this.container;
    };
    Video.prototype.show = function() {
      var position;
      Video.__super__.show.call(this);
      position = this.placeholder.offset();
      this.player.cfg.dimensions = {
        top: position.top,
        left: position.left,
        width: this.placeholder.width(),
        height: this.placeholder.height()
      };
      return this.player.show();
    };
    Video.prototype.hide = function() {
      Video.__super__.hide.call(this);
      return this.player.hide();
    };
    function Video(config) {
      this.container = $(config.containerSelector);
      this.placeholder = $(config.placeholderSelector);
      this.fullscreenPh = $(config.fullPhSelector);
      this.player = new TangoTV.VideoPlayer(config.playerConfig);
      this.keyHandler = {};
      this.keyHandler[tvKey.KEY_PLAY] = __bind(function() {
        return this.player.play();
      }, this);
      this.keyHandler[tvKey.KEY_PAUSE] = __bind(function() {
        return this.player.togglePause();
      }, this);
      this.keyHandler[tvKey.KEY_STOP] = __bind(function() {
        return this.player.stop();
      }, this);
      this.keyHandler[tvKey.KEY_ENTER] = __bind(function() {
        this.player.toggleFullscreen();
        return this.fullscreenPh.toggle();
      }, this);
    }
    return Video;
  })();
  Dashboard = (function() {
    __extends(Dashboard, TangoTV.Screen);
    function Dashboard() {
      Dashboard.__super__.constructor.apply(this, arguments);
    }
    Dashboard.prototype.show = function(content) {
      var _ref;
      if ((_ref = this.shown) != null) {
        _ref.hide();
      }
      this.shown = content;
      content.show();
      return this.setKeyHandler(content.keyHandler);
    };
    Dashboard.prototype.onLoad = function() {
      var addReturnKey;
      this.menu = new TangoTV.Menu({
        containerSelector: '.menu',
        options: [
          {
            html: 'Color changer',
            callback: __bind(function() {
              return this.show(this.colorChanger);
            }, this)
          }, {
            html: 'Calculator',
            callback: __bind(function() {
              return this.show(this.calculator);
            }, this)
          }, {
            html: 'Video',
            callback: __bind(function() {
              return this.show(this.videoPlayer);
            }, this)
          }
        ]
      });
      addReturnKey = __bind(function(keyHandler) {
        keyHandler[this.tvKey.KEY_RETURN] = __bind(function() {
          return this.setKeyHandler(this.menu.keyHandler);
        }, this);
        if (keyHandler.keyRef != null) {
          return keyHandler.keyRef["return"] = "Menu";
        }
      }, this);
      this.colorChanger = new ColorChanger("#color-changer");
      addReturnKey(this.colorChanger.keyHandler);
      this.calculator = new Calculator("#calculator-box", "#calculator");
      addReturnKey(this.calculator.keyHandler);
      this.html5Player = new Html5VideoPlayer("#html5-video-container", "#html5-video");
      addReturnKey(this.html5Player.keyHandler);
      this.videoPlayer = new Video({
        containerSelector: "#video-container",
        placeholderSelector: "#video-player",
        fullPhSelector: "#fullscreen-placeholder",
        playerConfig: {
          url: "D:/Workspaces/samsung-tv/app-template/resource/video/movie.mp4"
        }
      });
      addReturnKey(this.videoPlayer.keyHandler);
      this.setKeyHandler(this.menu.keyHandler);
      log.debug("Dashboard loaded");
      return Dashboard.__super__.onLoad.call(this);
    };
    return Dashboard;
  })();
  TangoTV.Dashboard = Dashboard;
}).call(this);

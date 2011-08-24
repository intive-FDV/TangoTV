(function() {
  var Calculator, ColorChanger, Dashboard, HiddableContent, Html5VideoPlayer, Video;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
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
      var tvKey;
      this.element = $(elementSelector);
      tvKey = new Common.API.TVKeyValue();
      this.keyHandler = {};
      this.keyHandler[tvKey.KEY_RED] = __bind(function() {
        return this.setColor("red");
      }, this);
      this.keyHandler[tvKey.KEY_GREEN] = __bind(function() {
        return this.setColor("green");
      }, this);
      this.keyHandler[tvKey.KEY_YELLOW] = __bind(function() {
        return this.setColor("yellow");
      }, this);
      this.keyHandler[tvKey.KEY_BLUE] = __bind(function() {
        return this.setColor("blue");
      }, this);
      this.keyHandler[tvKey.KEY_ENTER] = __bind(function() {
        return this.setColor("white");
      }, this);
      this.keyHandler.keyRef = {
        "return": "Menu",
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
    Calculator.prototype.LINE_CLASS = "calc-line";
    Calculator.prototype.OPERATOR_CLASS = "operator";
    Calculator.prototype.OPERAND_CLASS = "operand";
    Calculator.prototype.value = 0;
    Calculator.prototype.getContainer = function() {
      return this.container;
    };
    Calculator.prototype.show = function() {
      return this.container.show();
    };
    Calculator.prototype.noop = function() {
      return this.parseValue();
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
      return this.value = this.op(this.value, this.parseValue());
    };
    Calculator.prototype.addLine = function() {
      return this.element.append($("<div class=\"" + this.LINE_CLASS + "\">\n    <div class=\"" + this.OPERATOR_CLASS + "\"></div>\n    <div class=\"" + this.OPERAND_CLASS + "\"></div>\n</div>"));
    };
    Calculator.prototype.appendToOperand = function(str) {
      var $currentOperand;
      $currentOperand = this.element.find("." + this.OPERAND_CLASS + ":last")[0];
      return $currentOperand.innerHTML = "" + $currentOperand.innerHTML + str;
    };
    Calculator.prototype.showValue = function() {
      var $currentOperand;
      $currentOperand = this.element.find("." + this.OPERAND_CLASS + ":last")[0];
      return $currentOperand.innerHTML = String(this.value);
    };
    Calculator.prototype.parseValue = function() {
      return +this.element.find("div:last")[0].innerHTML;
    };
    Calculator.prototype.showOperator = function(operator) {
      var $currentOperator;
      $currentOperator = this.element.find("." + this.OPERATOR_CLASS + ":last")[0];
      return $currentOperator.innerHTML = "" + operator + " ";
    };
    Calculator.prototype.clearHistory = function() {
      this.element.html("");
      this.addLine();
      this.value = 0;
      return this.op = this.noop;
    };
    Calculator.prototype.calculateAndSetOperation = function(operation, symbol) {
      this.performOp();
      this.addLine();
      this.showValue();
      this.addLine();
      this.op = operation;
      return this.showOperator(symbol);
    };
    function Calculator(containerSelector, elementSelector) {
      var num, tvKey, _fn;
      this.container = $(containerSelector);
      this.element = $(elementSelector);
      this.op = this.noop;
      tvKey = new Common.API.TVKeyValue();
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
          return this.appendToOperand("" + num);
        }, this);
      }, this);
      for (num = 0; num <= 9; num++) {
        _fn(num);
      }
      this.keyHandler[tvKey.KEY_RW] = __bind(function() {
        return this.clearHistory();
      }, this);
    }
    return Calculator;
  })();
  Html5VideoPlayer = (function() {
    __extends(Html5VideoPlayer, HiddableContent);
    Html5VideoPlayer.prototype.getContainer = function() {
      return this.container;
    };
    function Html5VideoPlayer(containerSelector, elementSelector) {
      var tvKey;
      this.container = $(containerSelector);
      this.video = $(elementSelector)[0];
      tvKey = new Common.API.TVKeyValue();
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
      var tvKey;
      this.container = $(config.containerSelector);
      this.placeholder = $(config.placeholderSelector);
      this.fullscreenPh = $(config.fullPhSelector);
      this.player = new TVApp.VideoPlayer(config.playerConfig);
      tvKey = new Common.API.TVKeyValue();
      this.keyHandler = {};
      this.keyHandler[tvKey.KEY_PLAY] = __bind(function() {
        return this.player.play();
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
    __extends(Dashboard, TVApp.Screen);
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
      var focusOnMenu;
      log.debug("Dashboard.onLoad");
      Dashboard.__super__.onLoad.call(this);
      this.menu = new TVApp.Menu({
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
      focusOnMenu = __bind(function() {
        return this.setKeyHandler(this.menu.keyHandler);
      }, this);
      this.colorChanger = new ColorChanger("#color-changer");
      this.colorChanger.keyHandler[this.tvKey.KEY_RETURN] = focusOnMenu;
      this.calculator = new Calculator("#calculator-box", "#calculator");
      this.calculator.keyHandler[this.tvKey.KEY_RETURN] = focusOnMenu;
      this.html5Player = new Html5VideoPlayer("#html5-video-container", "#html5-video");
      this.html5Player.keyHandler[this.tvKey.KEY_RETURN] = focusOnMenu;
      this.videoPlayer = new Video({
        containerSelector: "#video-container",
        placeholderSelector: "#video-player",
        fullPhSelector: "#fullscreen-placeholder",
        playerConfig: {
          url: "D:/Workspaces/samsung-tv/app-template/resource/video/movie.mp4"
        }
      });
      this.videoPlayer.keyHandler[this.tvKey.KEY_RETURN] = focusOnMenu;
      return focusOnMenu();
    };
    return Dashboard;
  })();
  TVApp.Dashboard = Dashboard;
}).call(this);

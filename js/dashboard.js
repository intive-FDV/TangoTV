(function() {
  var Calculator, Carrousel, ColorChanger, Dashboard, HiddableContent, Html5VideoPlayer, IMEInput, ScrollerPane, Video, Weather, YouTube, tvKey;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

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
      var _this = this;
      this.element = $(elementSelector);
      this.keyHandler = {};
      this.keyHandler[tvKey.KEY_RED] = function() {
        return _this.setColor("#a90921");
      };
      this.keyHandler[tvKey.KEY_GREEN] = function() {
        return _this.setColor("#418415");
      };
      this.keyHandler[tvKey.KEY_YELLOW] = function() {
        return _this.setColor("#d6ab00");
      };
      this.keyHandler[tvKey.KEY_BLUE] = function() {
        return _this.setColor("#09418f");
      };
      this.keyHandler[tvKey.KEY_ENTER] = function() {
        return _this.setColor("white");
      };
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
      if (this.currentOperand !== 0) suffix = ":last";
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
      var _this = this;
      this.container = $(containerSelector);
      this.element = $(elementSelector);
      this.display = this.element.find("." + this.DISPLAY_CLASS);
      this.history = this.element.find("." + this.HISTORY_CLASS);
      this.op = this.noop;
      this.keyHandler = {};
      this.keyHandler[tvKey.KEY_RED] = function() {
        return _this.calculateAndSetOperation(_this.subtraction, "-");
      };
      this.keyHandler[tvKey.KEY_GREEN] = function() {
        return _this.calculateAndSetOperation(_this.multiplication, "*");
      };
      this.keyHandler[tvKey.KEY_YELLOW] = function() {
        return _this.calculateAndSetOperation(_this.division, "/");
      };
      this.keyHandler[tvKey.KEY_BLUE] = function() {
        return _this.calculateAndSetOperation(_this.sum, "+");
      };
      this.keyHandler[tvKey.KEY_ENTER] = function() {
        return _this.calculateAndSetOperation(_this.noop, "");
      };
      _fn = function(num) {
        return _this.keyHandler[tvKey["KEY_" + num]] = function() {
          _this.appendToOperand("" + num);
          return log.trace("Calc: Appended " + num);
        };
      };
      for (num = 0; num <= 9; num++) {
        _fn(num);
      }
      this.keyHandler[tvKey.KEY_RW] = function() {
        return _this.clearHistory();
      };
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

  ScrollerPane = (function() {
    var SCROLLABLE_ID;

    __extends(ScrollerPane, HiddableContent);

    SCROLLABLE_ID = "scrollable";

    ScrollerPane.prototype.getContainer = function() {
      return this.container;
    };

    ScrollerPane.prototype.show = function() {
      ScrollerPane.__super__.show.call(this);
      return this.scroller.updateBar();
    };

    ScrollerPane.prototype.contentTemplate = function(o) {
      var content, i, j;
      return "<div id=\"" + o.id + "\">\n" + ((function() {
        content = "";
        for (i = 1; i <= 40; i++) {
          content += "" + ((function() {
            var _results;
            _results = [];
            for (j = 1; 1 <= i ? j <= i : j >= i; 1 <= i ? j++ : j--) {
              _results.push(j * j);
            }
            return _results;
          })()) + "<br>";
        }
        return content;
      })()) + "\n</div>";
    };

    function ScrollerPane(containerSelector) {
      var scrollable;
      var _this = this;
      this.container = $(containerSelector);
      this.container.append($(this.contentTemplate({
        id: SCROLLABLE_ID
      })));
      scrollable = $("#" + SCROLLABLE_ID);
      scrollable.css({
        width: "200px",
        height: "200px",
        overflow: "auto"
      });
      this.scroller = new TangoTV.Scroller({
        element: scrollable,
        onTop: function() {
          return log.debug("Scrolled to top");
        },
        onBottom: function() {
          return log.debug("Scrolled to bottom");
        }
      });
      this.keyHandler = {};
      this.keyHandler[tvKey.KEY_DOWN] = function() {
        return _this.scroller.scrollDown();
      };
      this.keyHandler[tvKey.KEY_UP] = function() {
        return _this.scroller.scrollUp();
      };
    }

    return ScrollerPane;

  })();

  Html5VideoPlayer = (function() {

    __extends(Html5VideoPlayer, HiddableContent);

    Html5VideoPlayer.prototype.getContainer = function() {
      return this.container;
    };

    function Html5VideoPlayer(containerSelector, elementSelector) {
      var _this = this;
      this.container = $(containerSelector);
      this.video = $(elementSelector)[0];
      this.keyHandler = {};
      this.keyHandler[tvKey.KEY_PLAY] = function() {
        log.debug("PLAY");
        return _this.video.play();
      };
      this.keyHandler[tvKey.KEY_STOP] = function() {
        log.debug("STOP");
        return _this.video.stop();
      };
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
      var _this = this;
      this.container = $(config.containerSelector);
      this.placeholder = $(config.placeholderSelector);
      this.fullscreenPh = $(config.fullPhSelector);
      this.player = new TangoTV.VideoPlayer(config.playerConfig);
      this.keyHandler = {};
      this.keyHandler[tvKey.KEY_PLAY] = function() {
        return _this.player.play();
      };
      this.keyHandler[tvKey.KEY_PAUSE] = function() {
        return _this.player.togglePause();
      };
      this.keyHandler[tvKey.KEY_STOP] = function() {
        return _this.player.stop();
      };
      this.keyHandler[tvKey.KEY_ENTER] = function() {
        _this.player.toggleFullscreen();
        return _this.fullscreenPh.toggle();
      };
    }

    return Video;

  })();

  Weather = (function() {
    var conditionsTemplate, dayNames, forecast, forecastsTemplate;

    __extends(Weather, HiddableContent);

    Weather.prototype.getContainer = function() {
      return this.container;
    };

    conditionsTemplate = function(cond, today) {
      return "<div class=\"weather conditions\">\n    <img src=\"" + today.weatherIconUrl[0].value + "\">\n    <div class=\"temp\">" + cond.temp_C + "ºC</div>\n    <div class=\"condition\">" + cond.weatherDesc[0].value + "</div>\n</div>";
    };

    forecast = function(forecast, dayName) {
      return "<div class=\"forecast\">\n    <div class=\"day-name\">" + dayName + "</div>\n    <img src=\"" + forecast.weatherIconUrl[0].value + "\">\n    <div class=\"temp-extremes\">" + forecast.tempMaxC + "ºC - " + forecast.tempMinC + "ºC </div>\n</div>";
    };

    dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    forecastsTemplate = function(forecasts) {
      var date, html, i;
      date = new Date();
      html = "<div class=\"weather forecasts\">";
      for (i = 0; i <= 4; i++) {
        html += forecast(forecasts[i], dayNames[date.getDay()]);
        date.setDate(date.getDate() + 1);
      }
      return html += "</div>";
    };

    function Weather(config) {
      var _this = this;
      this.container = $(config.containerSelector);
      $.extend(config.forecastConfig, {
        success: function() {
          var forecastHtml;
          forecastHtml = conditionsTemplate(_this.forecast.conditions, _this.forecast.forecasts[0]);
          forecastHtml += forecastsTemplate(_this.forecast.forecasts);
          return _this.container.html(forecastHtml);
        }
      });
      this.forecast = new TangoTV.Forecast(config.forecastConfig);
      this.keyHandler = {};
    }

    return Weather;

  })();

  YouTube = (function() {

    __extends(YouTube, HiddableContent);

    YouTube.prototype.getContainer = function() {
      return this.container;
    };

    function YouTube(config) {
      var _this = this;
      this.container = TangoTV.util.resolveToJqueryIfSelector(config.container);
      this.player = new TangoTV.YouTubePlayer({
        container: this.container,
        videoId: 'FAYGHTqPMA8',
        autohide: false
      });
      this.keyHandler = {};
      this.keyHandler[tvKey.KEY_PLAY] = function() {
        return _this.player.play();
      };
      this.keyHandler[tvKey.KEY_PAUSE] = function() {
        return _this.player.pause();
      };
      this.keyHandler[tvKey.KEY_STOP] = function() {
        return _this.player.stop();
      };
      this.keyHandler[tvKey.KEY_FF] = function() {
        return _this.player.seek(1);
      };
      this.keyHandler[tvKey.KEY_RW] = function() {
        return _this.player.seek(-1);
      };
    }

    return YouTube;

  })();

  IMEInput = (function() {

    __extends(IMEInput, HiddableContent);

    IMEInput.prototype.show = function() {
      var _this = this;
      IMEInput.__super__.show.apply(this, arguments).show();
      return TangoTV.adaptInput({
        input: this.input,
        onReady: function() {
          return _this.input.focus();
        },
        onAnyKey: function() {
          return log.debug("Entered: " + (_this.input.val()));
        },
        extraKeys: this.keyHandler
      });
    };

    IMEInput.prototype.getContainer = function() {
      return this.container;
    };

    function IMEInput(config) {
      this.container = $(config.containerSelector);
      this.container.append("Enter some text: <input id=\"text-input\" type=\"text\"></input>");
      this.input = $("#text-input");
      this.keyHandler = {};
    }

    return IMEInput;

  })();

  Carrousel = (function() {

    __extends(Carrousel, HiddableContent);

    function Carrousel(config) {
      this.container = $(config.containerSelector);
      this.carr = new TangoTV.Carrousel({
        options: [
          {
            url: "http://www.ifondos.net/wp-content/uploads/2009/09/Simpsons_Bart.jpg"
          }, {
            url: "http://www.wescoregames.com/dynimgs/games/wii-los-simpson-el-videojuego/los_simpson___el_videojuego_202580.jpg"
          }, {
            url: "http://www.soygik.com/wp-content/uploads/2007/11/cart0149.jpg"
          }, {
            url: "http://www.soygik.com/wp-content/uploads/2007/11/harry-potter-simpsons.jpg"
          }, {
            url: "http://www.luigikeynes.com/wp-content/uploads/2010/05/403112.jpg"
          }
        ]
      });
      this.keyHandler = this.carr.keyHandler;
      this.carr.drawIn(this.container);
    }

    Carrousel.prototype.getContainer = function() {
      return this.container;
    };

    return Carrousel;

  })();

  Dashboard = (function() {

    __extends(Dashboard, TangoTV.Screen);

    function Dashboard() {
      Dashboard.__super__.constructor.apply(this, arguments);
    }

    Dashboard.prototype.show = function(content) {
      var _ref;
      this.setKeyHandler(content.keyHandler);
      if ((_ref = this.shown) != null) _ref.hide();
      this.shown = content;
      return content.show();
    };

    Dashboard.prototype.onLoad = function() {
      var addReturnKey;
      var _this = this;
      this.menu = new TangoTV.Menu({
        options: [
          {
            html: 'Carrousel',
            callback: function() {
              return _this.show(_this.carrousel);
            }
          }, {
            html: 'Color changer',
            callback: function() {
              return _this.show(_this.colorChanger);
            }
          }, {
            html: 'Calculator',
            callback: function() {
              return _this.show(_this.calculator);
            }
          }, {
            html: 'Scroller',
            callback: function() {
              return _this.show(_this.scroller);
            }
          }, {
            html: 'YouTube',
            callback: function() {
              return _this.show(_this.youtube);
            }
          }, {
            html: 'Weather',
            callback: function() {
              return _this.show(_this.weather);
            }
          }, {
            html: 'Text Input',
            callback: function() {
              return _this.show(_this.imeInput);
            }
          }
        ]
      });
      this.menu.drawIn('.menu');
      addReturnKey = function(keyHandler) {
        if (keyHandler == null) return;
        keyHandler[_this.tvKey.KEY_RETURN] = function() {
          return _this.setKeyHandler(_this.menu.keyHandler);
        };
        if (keyHandler.keyRef != null) return keyHandler.keyRef["return"] = "Menu";
      };
      this.colorChanger = new ColorChanger("#color-changer");
      addReturnKey(this.colorChanger.keyHandler);
      this.calculator = new Calculator("#calculator-box", "#calculator");
      addReturnKey(this.calculator.keyHandler);
      this.scroller = new ScrollerPane("#scroller");
      addReturnKey(this.scroller.keyHandler);
      this.html5Player = new Html5VideoPlayer("#html5-video-container", "#html5-video");
      addReturnKey(this.html5Player.keyHandler);
      this.youtube = new YouTube({
        container: '#youtube-container'
      });
      addReturnKey(this.youtube.keyHandler);
      this.weather = new Weather({
        containerSelector: "#weather-container",
        forecastConfig: {
          wwoApiKey: "e5a8a4d2d2163552112309",
          location: {
            city: "Buenos Aires",
            country: "Argentina"
          }
        }
      });
      addReturnKey(this.weather.keyHandler);
      this.imeInput = new IMEInput({
        containerSelector: "#ime-container"
      });
      this.imeInput.keyHandler[tvKey.KEY_RETURN] = function() {
        _this.setKeyHandler(_this.menu.keyHandler);
        _this.enableKeys();
        return false;
      };
      this.carrousel = new Carrousel({
        containerSelector: '#carrousel-container'
      });
      addReturnKey(this.carrousel.keyHandler);
      this.setKeyHandler(this.menu.keyHandler);
      log.debug("Dashboard loaded");
      return Dashboard.__super__.onLoad.call(this);
    };

    return Dashboard;

  })();

  TangoTV.Dashboard = Dashboard;

}).call(this);

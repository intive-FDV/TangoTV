(function() {
  var Dashboard;
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor;
    child.__super__ = parent.prototype;
    return child;
  }, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Dashboard = (function() {
    __extends(Dashboard, TVApp.Screen);
    Dashboard.calculator = {};
    Dashboard.colorChanger = {};
    function Dashboard(fakeBodySelector) {
      var constructCalculator, constructColorChanger;
      Dashboard.__super__.constructor.call(this, fakeBodySelector);
      constructColorChanger = __bind(function() {
        var ELEMENT_ID, handler, setColor;
        ELEMENT_ID = "color-changer";
        setColor = function(color) {
          return $("#" + ELEMENT_ID).css({
            "background-color": color
          });
        };
        handler = {};
        handler[this.tvKey.KEY_RED] = function() {
          return setColor("red");
        };
        handler[this.tvKey.KEY_GREEN] = function() {
          return setColor("green");
        };
        handler[this.tvKey.KEY_YELLOW] = function() {
          return setColor("yellow");
        };
        handler[this.tvKey.KEY_BLUE] = function() {
          return setColor("blue");
        };
        handler[this.tvKey.KEY_ENTER] = function() {
          return setColor("white");
        };
        handler[this.tvKey.KEY_DOWN] = __bind(function() {
          return this.setKeyHandler(this.calculator);
        }, this);
        handler.keyRef = {
          "up-down": "Switch boxes",
          "enter": "White",
          "A": "Red",
          "B": "Green",
          "C": "Yellow",
          "D": "Blue"
        };
        return handler;
      }, this);
      constructCalculator = __bind(function() {
        var ELEMENT_ID, LINE_CLASS, OPERAND_CLASS, OPERATOR_CLASS, addLine, appendToOperand, calculateAndSetOperation, clearHistory, division, handler, multiplication, noop, num, op, parseValue, performOp, showOperator, showValue, subtraction, sum, value, _fn;
        ELEMENT_ID = "calculator";
        LINE_CLASS = "calc-line";
        OPERATOR_CLASS = "operator";
        OPERAND_CLASS = "operand";
        value = 0;
        noop = function() {
          return parseValue();
        };
        sum = function(x, y) {
          return x + y;
        };
        subtraction = function(x, y) {
          return x - y;
        };
        multiplication = function(x, y) {
          return x * y;
        };
        division = function(x, y) {
          return x / y;
        };
        op = noop;
        performOp = function() {
          return value = op(value, parseValue());
        };
        addLine = function() {
          var $element;
          $element = $("#" + ELEMENT_ID);
          return $element.append($("<div class=\"" + LINE_CLASS + "\">\n    <div class=\"" + OPERATOR_CLASS + "\"></div>\n    <div class=\"" + OPERAND_CLASS + "\"></div>\n</div>"));
        };
        appendToOperand = function(str) {
          var $currentOperand;
          $currentOperand = $("#" + ELEMENT_ID + " ." + OPERAND_CLASS + ":last")[0];
          return $currentOperand.innerHTML = "" + $currentOperand.innerHTML + str;
        };
        showValue = function() {
          var $currentOperand;
          $currentOperand = $("#" + ELEMENT_ID + " ." + OPERAND_CLASS + ":last")[0];
          return $currentOperand.innerHTML = String(value);
        };
        parseValue = function() {
          return +$("#" + ELEMENT_ID + " div:last")[0].innerHTML;
        };
        showOperator = function(operator) {
          var $currentOperator;
          $currentOperator = $("#" + ELEMENT_ID + " ." + OPERATOR_CLASS + ":last")[0];
          return $currentOperator.innerHTML = "" + operator + " ";
        };
        clearHistory = function() {
          $("#" + ELEMENT_ID).html("");
          addLine();
          value = 0;
          return op = noop;
        };
        calculateAndSetOperation = function(operation, symbol) {
          performOp();
          addLine();
          showValue();
          addLine();
          op = operation;
          return showOperator(symbol);
        };
        handler = {};
        handler[this.tvKey.KEY_RED] = function() {
          return calculateAndSetOperation(subtraction, "-");
        };
        handler[this.tvKey.KEY_GREEN] = function() {
          return calculateAndSetOperation(multiplication, "*");
        };
        handler[this.tvKey.KEY_YELLOW] = function() {
          return calculateAndSetOperation(division, "/");
        };
        handler[this.tvKey.KEY_BLUE] = function() {
          return calculateAndSetOperation(sum, "+");
        };
        handler[this.tvKey.KEY_ENTER] = function() {
          return calculateAndSetOperation(noop, "");
        };
        _fn = __bind(function(num) {
          return handler[this.tvKey["KEY_" + num]] = function() {
            return appendToOperand("" + num);
          };
        }, this);
        for (num = 0; num <= 9; num++) {
          _fn(num);
        }
        handler[this.tvKey.KEY_RETURN] = function() {
          return clearHistory();
        };
        handler[this.tvKey.KEY_UP] = __bind(function() {
          return this.setKeyHandler(this.colorChanger);
        }, this);
        return handler;
      }, this);
      this.colorChanger = constructColorChanger();
      this.calculator = constructCalculator();
    }
    Dashboard.prototype.onLoad = function() {
      log.debug("Dashboard.onLoad");
      Dashboard.__super__.onLoad.call(this);
      return this.setKeyHandler(this.colorChanger);
    };
    return Dashboard;
  })();
  TVApp.Dashboard = Dashboard;
}).call(this);

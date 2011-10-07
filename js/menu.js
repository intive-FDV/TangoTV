(function() {
  var Menu;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  Menu = (function() {
    /*
        Configuration options:
    
        containerSelector: CSS selector for the element to add items (children) to
        options: List of menu items, each an object with "html" and "callback" properties
            html: the innerHTML of the generated li element,
            callback: function called when the ENTER key is pressed on the remote
                while the option is selected
        continuous: wether the first item is selected when going forward from
            the last element (and the last item when going backwards from the
            first one) or not
        selected: index of the initially selected option. Defaults to 0
        itemTemplate: function that builds a menu item returning a HTML string of such,
            recieves a HTML string with the content of the item and a list of CSS classes
    
        Currently, the menu items can only be selected through the UP and DOWN keys
    
        The keyHandler can be publicly accesed in order to override/add behaviour
        */    Menu.prototype.config = {
      itemTemplate: function(content, classes, index) {
        var classString, klass, _i, _len;
        classString = '';
        for (_i = 0, _len = classes.length; _i < _len; _i++) {
          klass = classes[_i];
          classString += "" + klass + " ";
        }
        return "<li class=\"" + classString + "\">\n    " + content + "\n</li>";
      }
    };
    Menu.prototype.selected = 0;
    Menu.prototype.focusedClass = "menu-focused";
    Menu.prototype.openClass = "menu-item-open";
    Menu.prototype.selectedClass = "menu-item-selected";
    Menu.prototype.unselectedClass = "menu-item-unselected";
    Menu.prototype.createItems = function() {
      var classes, evenness, index, _ref;
      evenness = ["odd", "even"];
      for (index = 0, _ref = this.options.length; 0 <= _ref ? index < _ref : index > _ref; 0 <= _ref ? index++ : index--) {
        classes = [this.unselectedClass, "" + evenness[index % 2]];
        this.container.append($(this.config.itemTemplate(this.options[index].html, classes, index)));
      }
      this.items = this.container.find("." + this.unselectedClass);
      return this.selectItem(this.selected);
    };
    Menu.prototype.selectItem = function(index) {
      TangoTV.css.switchClasses($(this.items[this.selected]), this.selectedClass, this.unselectedClass);
      this.selected = index;
      return TangoTV.css.switchClasses($(this.items[this.selected]), this.unselectedClass, this.selectedClass);
    };
    Menu.prototype.openSelectedItem = function() {
      var _base;
      this.container.find("." + this.openClass).removeClass(this.openClass);
      $(this.items[this.selected]).addClass(this.openClass);
      return typeof (_base = this.options[this.selected]).callback === "function" ? _base.callback() : void 0;
    };
    function Menu(config) {
      var tvKey, _ref, _ref2;
      $.extend(true, this.config, config);
      this.options = this.config.options;
      this.container = $(this.config.containerSelector);
      if (this.config.selected != null) {
        this.selected = this.config.selected;
      }
      if (this.config.continuous) {
        this.preFirst = ((_ref = this.config.options) != null ? _ref.length : void 0) - 1;
        this.postLast = 0;
      } else {
        this.preFirst = 0;
        this.postLast = ((_ref2 = this.config.options) != null ? _ref2.length : void 0) - 1;
      }
      this.keyHandler = {
        focus: __bind(function() {
          return this.container.addClass(this.focusedClass);
        }, this),
        stealFocus: __bind(function() {
          return this.container.removeClass(this.focusedClass);
        }, this)
      };
      tvKey = new Common.API.TVKeyValue();
      this.keyHandler[tvKey.KEY_UP] = __bind(function() {
        return this.offset(-1);
      }, this);
      this.keyHandler[tvKey.KEY_DOWN] = __bind(function() {
        return this.offset(1);
      }, this);
      this.keyHandler[tvKey.KEY_ENTER] = __bind(function() {
        return this.openSelectedItem();
      }, this);
      this.keyHandler.keyRef = {
        "enter": "Select",
        "up-down": "Move"
      };
      this.createItems();
    }
    Menu.prototype.offset = function(amount) {
      var selected;
      selected = this.selected + amount;
      if (selected >= this.options.length) {
        selected = this.postLast;
      }
      if (selected < 0) {
        selected = this.preFirst;
      }
      return this.selectItem(selected);
    };
    return Menu;
  })();
  TangoTV.Menu = Menu;
}).call(this);

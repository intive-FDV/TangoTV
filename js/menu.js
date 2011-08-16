(function() {
  var Menu, switchClasses;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  switchClasses = function($element, removed, added) {
    $element.removeClass(removed);
    return $element.addClass(added);
  };
  Menu = (function() {
    /*
        Configuration options:
    
        containerSelector: CSS selector for the <ul> element to add <li>'s to
        options: List of menu items, each an object with "html" and "callback" properties
            html will be the innerHTML of the generated li element,
            callback is called when the ENTER key is pressed on the remote
            continuous: wether the
    
        Currently, the menu items can only be selected through the UP and DOWN keys
    
        The keyHandler can be publicly accesed in order to override/add behaviour
        */    Menu.prototype.selected = 0;
    Menu.prototype.selectedClass = "menu-item-selected";
    Menu.prototype.unselectedClass = "menu-item-unselected";
    Menu.prototype.createItems = function() {
      var option, _i, _len, _ref;
      _ref = this.options;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        this.container.append($("<li class=\"" + this.unselectedClass + "\">" + option.html + "</li>"));
      }
      return this.selectItem(this.selected);
    };
    Menu.prototype.selectItem = function(index) {
      var items;
      items = this.container.find("li");
      switchClasses($(items[this.selected]), this.selectedClass, this.unselectedClass);
      this.selected = index;
      return switchClasses($(items[this.selected]), this.unselectedClass, this.selectedClass);
    };
    Menu.prototype.openSelectedItem = function() {
      return this.options[this.selected].callback();
    };
    function Menu(config) {
      var tvKey, _ref, _ref2;
      this.options = config.options;
      this.container = $(config.containerSelector);
      if (config.selected != null) {
        this.selected = config.selected;
      }
      if (config.continuous) {
        this.preFirst = ((_ref = config.options) != null ? _ref.length : void 0) - 1;
        this.postLast = 0;
      } else {
        this.preFirst = 0;
        this.postLast = ((_ref2 = config.options) != null ? _ref2.length : void 0) - 1;
      }
      tvKey = new Common.API.TVKeyValue();
      this.keyHandler = {};
      this.keyHandler[tvKey.KEY_UP] = __bind(function() {
        return this.offset(-1);
      }, this);
      this.keyHandler[tvKey.KEY_DOWN] = __bind(function() {
        return this.offset(1);
      }, this);
      this.keyHandler[tvKey.KEY_ENTER] = __bind(function() {
        return this.openSelectedItem();
      }, this);
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
  TVApp.Menu = Menu;
}).call(this);

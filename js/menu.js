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
            html: the innerHTML of the generated li element,
            callback: function called when the ENTER key is pressed on the remote
                while the option is selected
        continuous: wether the first item is selected when going forward from
            the last element (and the last item when going backwards from the
            first one) or not
        selected: index of the initially selected option. Defaults to 0
        
    
        Currently, the menu items can only be selected through the UP and DOWN keys
    
        The keyHandler can be publicly accesed in order to override/add behaviour
        */    Menu.prototype.selected = 0;
    Menu.prototype.selectedClass = "menu-item-selected";
    Menu.prototype.unselectedClass = "menu-item-unselected";
    Menu.prototype.createItems = function() {
      var evenness, index, _ref;
      evenness = ["odd", "even"];
      for (index = 0, _ref = this.options.length; 0 <= _ref ? index < _ref : index > _ref; 0 <= _ref ? index++ : index--) {
        this.container.append($("<li class=\"" + this.unselectedClass + " " + evenness[index % 2] + "\">" + this.options[index].html + "</li>"));
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
      var _base;
      return typeof (_base = this.options[this.selected]).callback === "function" ? _base.callback() : void 0;
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
  TVApp.Menu = Menu;
}).call(this);

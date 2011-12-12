(function() {
  var Carrousel;

  Carrousel = (function() {

    /*
        Configuration options:
    
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
    */

    var defaultConfig;

    defaultConfig = {
      images: []
    };

    Carrousel.prototype.drawIn = function(container) {
      this.container = TangoTV.util.resolveToJqueryIfSelector(container);
      return this.menu.drawIn(container);
    };

    Carrousel.prototype.showSelectedImage = function(img) {
      return this.container.append($(img.html));
    };

    function Carrousel(config) {
      var image, thumbnailFor;
      this.config = $.extend(true, {}, defaultConfig, config);
      this.options = this.config.options;
      thumbnailFor = function(image) {
        return {
          html: "<img src='" + image.url + "' style='height=10%'>",
          callback: function() {}
        };
      };
      this.menu = new TangoTV.Menu({
        options: (function() {
          var _i, _len, _ref, _results;
          _ref = this.options;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            image = _ref[_i];
            _results.push(thumbnailFor(image));
          }
          return _results;
        }).call(this)
      });
      this.keyHandler = this.menu.keyHandler;
    }

    return Carrousel;

  })();

  TangoTV.Carrousel = Carrousel;

}).call(this);

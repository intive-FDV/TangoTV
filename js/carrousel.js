(function() {
  var Carrousel;

  Carrousel = (function() {

    /*
        Configuration options:
    
        options: List of image items, each an object with "url" and "thumbnailUrl" properties
            url: the link to the image
            thumbnailUrl: link to teh preview image show in the carrousel menu
        autoShow: specifies when the image is showing automatically
    */

    var defaultConfig;

    defaultConfig = {
      options: [],
      autoShow: true
    };

    Carrousel.prototype.drawIn = function(container) {
      this.container = TangoTV.util.resolveToJqueryIfSelector(container);
      this.container.append("<FRAMESET><div class='panel-image-carrousel'><img class='main-image'> </div><div class='menu-carrousel'></div></FRAMESET>");
      this.menu.drawIn('.menu-carrousel');
      return this.menu.openSelectedItem();
    };

    Carrousel.prototype.showImage = function(image) {
      return this.container.find(".main-image").attr("src", image.url);
    };

    function Carrousel(config) {
      var image, thumbnailFor;
      var _this = this;
      this.config = $.extend(true, {}, defaultConfig, config);
      this.options = this.config.options;
      thumbnailFor = function(image) {
        var _ref;
        return {
          html: "<img src='" + ((_ref = image.thumbnailUrl) != null ? _ref : image.url) + "' class='tumbnail-menu-carrousel'>",
          callback: function() {
            return _this.showImage(image);
          }
        };
      };
      this.menu = new TangoTV.ScrollMenu({
        options: (function() {
          var _i, _len, _ref, _results;
          _ref = this.options;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            image = _ref[_i];
            _results.push(thumbnailFor(image));
          }
          return _results;
        }).call(this),
        continuous: true,
        autoOpenSelected: this.config.autoShow
      });
      this.keyHandler = this.menu.keyHandler;
    }

    return Carrousel;

  })();

  TangoTV.Carrousel = Carrousel;

}).call(this);

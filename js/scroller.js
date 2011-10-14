(function() {
  var Scroller;
  Scroller = (function() {
    var defaultConfig;
    defaultConfig = {
      vStep: 80,
      hStep: 40,
      bar: {
        show: true,
        topOffset: 0,
        template: function(barClass, handleClass) {
          return "<div class=\"" + barClass + "\">\n    <div class=\"" + handleClass + "\"></div>\n</div>";
        }
      },
      position: {
        x: 0,
        y: 0
      },
      cssClasses: {
        bar: "scrollbar",
        handle: "handle"
      }
    };
    Scroller.prototype.scrollDown = function() {
      return this.scrollVertical(this.config.vStep);
    };
    Scroller.prototype.scrollUp = function() {
      return this.scrollVertical(-this.config.vStep);
    };
    Scroller.prototype.scrollVertical = function(amount) {
      var scrollOffset, _base, _base2;
      this.element.scrollTop(this.position.y + amount);
      scrollOffset = this.element.scrollTop();
      if (this.position.y !== scrollOffset) {
        this.position.y = scrollOffset;
        if (this.position.y <= 0) {
          if (typeof (_base = this.config).onTop === "function") {
            _base.onTop();
          }
        }
        if (this.position.y >= this.element.attr('scrollHeight') - this.element.height()) {
          if (typeof (_base2 = this.config).onBottom === "function") {
            _base2.onBottom();
          }
        }
      }
      return this.updateBar();
    };
    Scroller.prototype.createBar = function() {
      var classes;
      if (!this.config.bar.show) {
        return;
      }
      classes = this.config.cssClasses;
      this.element.append($(this.config.bar.template(classes.bar, classes.handle)));
      if (this.element.css("position") === "static") {
        this.element.css({
          position: "relative"
        });
      }
      return this.element.find("." + classes.handle).css({
        position: "absolute"
      });
    };
    Scroller.prototype.updateBar = function() {
      var bar, barHeight, handle, handleHeight, handleTop;
      if (!this.config.bar.show) {
        return;
      }
      bar = this.element.find("." + this.config.cssClasses.bar);
      bar.css({
        top: "" + (this.position.y + this.config.bar.topOffset) + "px"
      });
      handle = this.element.find("." + this.config.cssClasses.handle);
      barHeight = bar.height();
      handleHeight = 100 * this.element.height() / this.element.attr('scrollHeight');
      handleTop = barHeight * this.position.y / this.element.attr('scrollHeight');
      return handle.css({
        top: "" + handleTop + "px",
        height: "" + handleHeight + "%"
      });
    };
    function Scroller(config) {
      this.config = $.extend(true, {}, defaultConfig, config);
      this.element = TangoTV.util.resolveToJqueryIfSelector(this.config.element);
      this.position = TangoTV.util.deepCopy(this.config.position);
      this.createBar();
      this.updateBar();
    }
    return Scroller;
  })();
  TangoTV.Scroller = Scroller;
}).call(this);

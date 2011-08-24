(function() {
  var PAUSED, PLAYING, STOPPED;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  STOPPED = 0;
  PLAYING = 1;
  PAUSED = 2;
  TVApp.VideoPlayer = (function() {
    VideoPlayer.prototype.cfg = {
      dimensions: {
        left: 0,
        top: 0,
        width: 960,
        height: 540
      }
    };
    VideoPlayer.prototype.getCurrentDimensions = function() {
      var dimensions;
      dimensions = {
        left: 0,
        top: 0,
        width: 960,
        height: 540
      };
      if (!this.fullscreen) {
        dimensions = this.cfg.dimensions;
      }
      return dimensions;
    };
    VideoPlayer.prototype.show = function() {
      return this.position(this.getCurrentDimensions());
    };
    VideoPlayer.prototype.hide = function() {
      this.plugin.SetDisplayArea(0, 0, 0, 0);
      return log.debug("Video player hidden");
    };
    VideoPlayer.prototype.position = function(dimensions) {
      var x0, x1, y0, y1;
      log.debug("position(): dimensions: " + dimensions);
      this.plugin.SetDisplayArea(dimensions.left, dimensions.top, dimensions.width, dimensions.height);
      x0 = dimensions.left;
      y0 = dimensions.top;
      x1 = x0 + dimensions.width;
      y1 = y0 + dimensions.height;
      return log.debug("Video player positioned in (" + x0 + "," + y0 + "), (" + x1 + "," + y1 + ")");
    };
    VideoPlayer.prototype.toggleFullscreen = function() {
      var wasPlaying;
      wasPlaying = this.status === PLAYING;
      if (wasPlaying) {
        this.stop();
      }
      this.fullscreen = !this.fullscreen;
      this.position(this.getCurrentDimensions());
      if (wasPlaying) {
        this.play();
      }
      log.debug("Video fullscreen " + (this.fullscreen ? "on" : "off"));
      return log.debug("Was" + (wasPlaying ? "" : "n't") + " playing when fullscreen toggled");
    };
    VideoPlayer.prototype.play = function() {
      if (this.cfg.url === null) {
        log.error("No URL to play");
        return;
      }
      this.plugin.Play(this.cfg.url);
      this.status = PLAYING;
      return log.info("Playing video " + this.cfg.url);
    };
    VideoPlayer.prototype.stop = function() {
      if (this.status === STOPPED) {
        log.warn("stop(): Already stopped, ignoring");
        return;
      }
      this.plugin.Stop();
      this.status = STOPPED;
      return log.info("Video playback stopped");
    };
    function VideoPlayer(config) {
      this.status = STOPPED;
      this.plugin = $("#pluginPlayer")[0];
      $.extend(true, this.cfg, config);
      if (this.plugin === null) {
        log.error("Player plugin not found in page");
        return;
      }
      TVApp.video = {
        setCurTime: __bind(function() {
          return this.setCurTime(arguments);
        }, this),
        setTotalTime: __bind(function() {
          return this.setTotalTime(arguments);
        }, this),
        onBufferingStart: __bind(function() {
          return this.onBufferingStart(arguments);
        }, this),
        onBufferingProgress: __bind(function() {
          return this.onBufferingProgress(arguments);
        }, this),
        onBufferingComplete: __bind(function() {
          return this.onBufferingComplete(arguments);
        }, this)
      };
      this.plugin.OnCurrentPlayTime = "TVApp.__video.setCurTime";
      this.plugin.OnStreamInfoReady = "TVApp.__video.setTotalTime";
      this.plugin.OnBufferingStart = "TVApp.__video.onBufferingStart";
      this.plugin.OnBufferingProgress = "TVApp.__video.onBufferingProgress";
      this.plugin.OnBufferingComplete = "TVApp.__video.onBufferingComplete";
    }
    VideoPlayer.prototype.setCurTime = function(time) {
      return log.trace("Current time: " + time);
    };
    VideoPlayer.prototype.setTotalTime = function(time) {
      return log.debug("Total time: " + time);
    };
    VideoPlayer.prototype.onBufferingStart = function() {
      return log.debug("Buffering...");
    };
    VideoPlayer.prototype.onBufferingProgress = function(pctg) {
      return log.debug("Buffering " + pctg + "%");
    };
    VideoPlayer.prototype.onBufferingComplete = function() {
      return log.debug("Buffering complete");
    };
    return VideoPlayer;
  })();
  window.startDrawLoading = function() {
    return log.trace("startDrawLoading");
  };
  window.endDrawLoading = function() {
    return log.trace("endDrawLoading");
  };
  window.getBandwidth = function(bandwidth) {
    return log.trace("getBandwidth " + bandwidth);
  };
  window.onDecoderReady = function() {
    return log.trace("onDecoderReady");
  };
  window.onRenderError = function() {
    return log.trace("onRenderError");
  };
  window.popupNetworkErr = function() {
    return log.trace("popupNetworkErr");
  };
  window.setCurTime = function(time) {
    return log.trace("setCurTime " + time);
  };
  window.setTottalTime = function(time) {
    return log.trace("setTottalTime " + time);
  };
  window.stopPlayer = function() {
    return log.info("Video stopped (stopPlayer)");
  };
  window.setTottalBuffer = function(buffer) {
    return log.trace("setTottalBuffer " + buffer);
  };
  window.setCurBuffer = function(buffer) {
    return log.trace("setCurBuffer " + buffer);
  };
  window.onServerError = function() {
    return log.trace("onServerError");
  };
  window.onNetworkDisconnected = function() {
    return log.error("Network Error!");
  };
}).call(this);

(function() {
  var PAUSED, PLAYING, STOPPED;
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  STOPPED = 0;
  PLAYING = 1;
  PAUSED = 2;
  TangoTV.VideoPlayer = (function() {
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
      this.pause();
      this.fullscreen = !this.fullscreen;
      this.position(this.getCurrentDimensions());
      this.resume();
      return log.debug("Video fullscreen " + (this.fullscreen ? "on" : "off"));
    };
    VideoPlayer.prototype.togglePause = function() {
      if (this.status === PAUSED) {
        return this.resume();
      } else if (this.status === PLAYING) {
        return this.pause();
      } else {
        return log.info("togglePause(): Not playing, ignoring");
      }
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
    VideoPlayer.prototype.pause = function() {
      if (this.status !== PLAYING) {
        log.warn("pause(): Not playing, ignoring");
        return;
      }
      this.plugin.Pause();
      this.status = PAUSED;
      return log.info("Video playback paused");
    };
    VideoPlayer.prototype.resume = function() {
      if (this.status !== PAUSED) {
        log.warn("resume(): Not paused, ignoring");
      }
      this.plugin.Resume();
      this.status = PLAYING;
      return log.info("Video playback resumed");
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
      TangoTV.__video = {
        setCurTime: __bind(function() {
          log.debug("Current time in TangoTV.__video: " + arguments[0]);
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
      TangoTV.setCurTime = __bind(function() {
        return this.setCurTime(arguments);
      }, this);
      this.plugin.OnCurrentPlayTime = "TangoTV.__video.setCurTime";
      this.plugin.OnStreamInfoReady = "TangoTV.__video.setTotalTime";
      this.plugin.OnBufferingStart = "TangoTV.__video.onBufferingStart";
      this.plugin.OnBufferingProgress = "TangoTV.__video.onBufferingProgress";
      this.plugin.OnBufferingComplete = "TangoTV.__video.onBufferingComplete";
    }
    VideoPlayer.prototype.setCurTime = function(time) {
      return log.debug("Current time: " + time);
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
    return log.debug("setCurTime " + time);
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

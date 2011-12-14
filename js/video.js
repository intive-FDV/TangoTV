(function() {
  var PAUSED, PLAYING, STOPPED, YT_STATE, util, youtubePlayers, youtubeTemplate;
  var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; };

  util = TangoTV.util;

  STOPPED = 0;

  PLAYING = 1;

  PAUSED = 2;

  TangoTV.VideoPlayer = (function() {
    var defaultConfig;

    defaultConfig = {
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
      if (!this.fullscreen) dimensions = this.cfg.dimensions;
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
      if (this.status !== PAUSED) log.warn("resume(): Not paused, ignoring");
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
      var _this = this;
      this.status = STOPPED;
      this.plugin = $("#pluginPlayer")[0];
      this.cfg = $.extend(true, {}, defaultConfig, config);
      if (this.plugin === null) {
        log.error("Player plugin not found in page");
        return;
      }
      TangoTV.__video = {
        setCurTime: function() {
          log.debug("Current time in TangoTV.__video: " + arguments[0]);
          return _this.setCurTime(arguments);
        },
        setTotalTime: function() {
          return _this.setTotalTime(arguments);
        },
        onBufferingStart: function() {
          return _this.onBufferingStart(arguments);
        },
        onBufferingProgress: function() {
          return _this.onBufferingProgress(arguments);
        },
        onBufferingComplete: function() {
          return _this.onBufferingComplete(arguments);
        }
      };
      TangoTV.setCurTime = function() {
        return _this.setCurTime(arguments);
      };
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

  YT_STATE = {
    UNSTARTED: -1,
    ENDED: 0,
    PLAYING: 1,
    PAUSED: 2,
    BUFFERING: 3,
    CUED: 5
  };

  TangoTV.YouTubePlayer = (function() {
    var defaultConfig;

    defaultConfig = {
      autohide: true,
      autoplay: false,
      allowFullScreen: true,
      width: 640,
      height: 390
    };

    function YouTubePlayer(config) {
      var seek;
      var _this = this;
      this.config = $.extend(true, {}, defaultConfig, config);
      this.container = util.resolveToJqueryIfSelector(this.config.container);
      this.config.autohide = this.config.autohide ? 1 : 0;
      this.config.autoplay = this.config.autoplay ? 1 : 0;
      this.elementId = util.generateRandomId('youtube');
      youtubePlayers[this.elementId] = this;
      this.container.get(0).innerHTML = youtubeTemplate({
        elementId: this.elementId,
        videoId: this.config.videoId,
        autohide: this.config.autohide ? 1 : 0,
        allowFullScreen: this.config.allowFullScreen,
        width: this.config.width,
        height: this.config.height
      });
      seek = function(secs) {
        var _ref;
        if (secs == null) secs = 5;
        if ((_ref = _this.currentState) === YT_STATE.PLAYING || _ref === YT_STATE.PAUSED) {
          return _this.player.seekTo(_this.player.getCurrentTime() + secs, true);
        }
      };
      this.seek = util.debounce(seek, 250);
    }

    YouTubePlayer.prototype.playerIsReady = function() {
      var player, _base, _ref;
      player = $("#" + this.elementId);
      return player.length && (_ref = typeof (_base = player.get(0)).getPlayerState === "function" ? _base.getPlayerState() : void 0, __indexOf.call([-1, 0, 1, 2, 3, 4, 5], _ref) >= 0);
    };

    YouTubePlayer.prototype.stateChanged = function(state) {
      var _base, _base2, _base3, _base4, _base5;
      this.currentState = state;
      switch (this.currentState) {
        case YT_STATE.CUED:
          return typeof (_base = this.config).onCued === "function" ? _base.onCued() : void 0;
        case YT_STATE.PLAYING:
          return typeof (_base2 = this.config).onPlay === "function" ? _base2.onPlay() : void 0;
        case YT_STATE.PAUSED:
          return typeof (_base3 = this.config).onPause === "function" ? _base3.onPause() : void 0;
        case YT_STATE.BUFFERING:
          return typeof (_base4 = this.config).onBuffering === "function" ? _base4.onBuffering() : void 0;
        case YT_STATE.ENDED:
          return typeof (_base5 = this.config).onEnded === "function" ? _base5.onEnded() : void 0;
      }
    };

    YouTubePlayer.prototype.addEventListener = function() {
      var fnName;
      var _this = this;
      fnName = util.generateRandomId("youtube_listener_" + this.elementId);
      window[fnName] = function(state) {
        return _this.stateChanged(state);
      };
      return fnName;
    };

    YouTubePlayer.prototype.onReady = function() {
      var _base;
      if (!this.playerIsReady()) {
        log.debug("Player " + this.elementId + " not yet ready");
        return;
      }
      clearInterval(this.readinessCheck);
      this.player = $("#" + this.elementId).get(0);
      log.debug("Player " + this.elementId + " ready");
      this.player.addEventListener('onStateChange', this.addEventListener());
      return typeof (_base = this.config).onReady === "function" ? _base.onReady() : void 0;
    };

    YouTubePlayer.prototype.load = function(videoId) {
      var _ref;
      return (_ref = this.player) != null ? _ref.cueVideoById(videoId) : void 0;
    };

    YouTubePlayer.prototype.play = function() {
      var _ref;
      return (_ref = this.player) != null ? _ref.playVideo() : void 0;
    };

    YouTubePlayer.prototype.pause = function() {
      var _ref;
      return (_ref = this.player) != null ? _ref.pauseVideo() : void 0;
    };

    YouTubePlayer.prototype.stop = function() {
      var _ref;
      return (_ref = this.player) != null ? _ref.stopVideo() : void 0;
    };

    return YouTubePlayer;

  })();

  youtubePlayers = {};

  window.onYouTubePlayerReady = function(playerId) {
    playerId = unescape(playerId);
    return youtubePlayers[playerId].onReady();
  };

  youtubeTemplate = function(p) {
    return "<object\n        id='" + p.elementId + "' class='embed'\n        type='application/x-shockwave-flash'\n        data='http://www.youtube.com/v/" + p.videoId + "?autohide=" + p.autohide + "&enablejsapi=1&playerapiid=" + p.elementId + "&showinfo=0'\n        style=\"height: " + p.height + "px; width: " + p.width + "px\">\n\n    <param name=\"allowFullScreen\" value=\"" + p.allowFullScreen + "\">\n    <param name=\"allowScriptAccess\" value=\"always\">\n</object>";
  };

}).call(this);

(function() {
  var PAUSED, PLAYING, STOPPED;
  STOPPED = 0;
  PLAYING = 1;
  PAUSED = 2;
  TVApp.VideoPlayer = (function() {
    function VideoPlayer() {}
    VideoPlayer.prototype.onBufferingStart = function() {
      return log.debug("Buffering...");
    };
    VideoPlayer.prototype.onBufferingProgress = function(pctg) {
      return log.debug("Buffering " + pctg + "%");
    };
    VideoPlayer.prototype.onBufferingComplete = function() {
      return log.debug("Buffering complete");
    };
    VideoPlayer.prototype.setCurTime = function(time) {
      return log.trace("Current time: " + time);
    };
    VideoPlayer.prototype.setTotalTime = function(time) {
      return log.debug("Total time: " + time);
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

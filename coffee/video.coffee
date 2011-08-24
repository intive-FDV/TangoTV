STOPPED = 0
PLAYING = 1
PAUSED =  2

class TVApp.VideoPlayer

    cfg:
        dimensions:
            left:   0
            top:    0
            width:  960
            height: 540

    getCurrentDimensions: ->
        dimensions =
            left:   0
            top:    0
            width:  960
            height: 540
        dimensions = @cfg.dimensions if !@fullscreen
        return dimensions

    show: ->
        @position @getCurrentDimensions()
    hide: ->
        @plugin.SetDisplayArea(0, 0, 0, 0)
        log.debug "Video player hidden"

    position: (dimensions) ->
        log.debug "position(): dimensions: #{dimensions}"
        @plugin.SetDisplayArea(
                dimensions.left, dimensions.top,
                dimensions.width, dimensions.height
        )
        x0 = dimensions.left
        y0 = dimensions.top
        x1 = x0 + dimensions.width
        y1 = y0 + dimensions.height
        log.debug "Video player positioned in (#{x0},#{y0}), (#{x1},#{y1})"

    toggleFullscreen: ->
        wasPlaying = (@status == PLAYING)
        @stop() if wasPlaying # TODO Change stop and play for Pause and Unpause
        @fullscreen = !@fullscreen
        @position @getCurrentDimensions()
        @play() if wasPlaying
        log.debug "Video fullscreen #{if @fullscreen then "on" else "off"}"
        log.debug "Was#{if wasPlaying then "" else "n't"} playing when fullscreen toggled"

    play: ->
        if @cfg.url == null
            log.error "No URL to play"
            return # TODO Throw something

        @plugin.Play(@cfg.url)
        @status = PLAYING
        log.info "Playing video #{@cfg.url}"

    stop: ->
        if @status == STOPPED
            log.warn "stop(): Already stopped, ignoring"
            return

        @plugin.Stop()
        @status = STOPPED
        log.info "Video playback stopped"

    constructor: (config) ->
        @status = STOPPED
        @plugin = $("#pluginPlayer")[0]

        $.extend true, @cfg, config

        if @plugin == null
            log.error "Player plugin not found in page"
            return # Throw something

        # Big WTF for Samsung here
        TVApp.video =
            setCurTime: => @setCurTime(arguments)
            setTotalTime: => @setTotalTime(arguments)
            onBufferingStart: => @onBufferingStart(arguments)
            onBufferingProgress: => @onBufferingProgress(arguments)
            onBufferingComplete: => @onBufferingComplete(arguments)

        @plugin.OnCurrentPlayTime = "TVApp.__video.setCurTime"
        @plugin.OnStreamInfoReady = "TVApp.__video.setTotalTime"
        @plugin.OnBufferingStart = "TVApp.__video.onBufferingStart"
        @plugin.OnBufferingProgress = "TVApp.__video.onBufferingProgress"
        @plugin.OnBufferingComplete = "TVApp.__video.onBufferingComplete"

         # Would be nicer to do it this way
#        @plugin.OnCurrentPlayTime = => @setCurTime(arguments)
#        @plugin.OnStreamInfoReady = => @setTotalTime(arguments)
#        @plugin.OnBufferingStart = => @onBufferingStart(arguments)
#        @plugin.OnBufferingProgress = => @onBufferingProgress(arguments)
#        @plugin.OnBufferingComplete = => @onBufferingComplete(arguments)

    setCurTime: (time) -> log.trace "Current time: #{time}"
    setTotalTime: (time) -> log.debug "Total time: #{time}"
    onBufferingStart: -> log.debug "Buffering..."
    onBufferingProgress: (pctg) -> log.debug "Buffering #{pctg}%"
    onBufferingComplete: -> log.debug "Buffering complete"


# Big WTF for Samsung *again*
window.startDrawLoading = -> log.trace "startDrawLoading"
window.endDrawLoading = -> log.trace "endDrawLoading"
window.getBandwidth = (bandwidth) -> log.trace "getBandwidth #{bandwidth}"
window.onDecoderReady = -> log.trace "onDecoderReady"
window.onRenderError = -> log.trace "onRenderError"
window.popupNetworkErr = -> log.trace "popupNetworkErr"
window.setCurTime = (time) -> log.trace "setCurTime #{time}"
window.setTottalTime = (time) -> log.trace "setTottalTime #{time}"
window.stopPlayer = -> log.info "Video stopped (stopPlayer)"
window.setTottalBuffer = (buffer) -> log.trace "setTottalBuffer #{buffer}"
window.setCurBuffer = (buffer) -> log.trace "setCurBuffer #{buffer}"
window.onServerError = -> log.trace "onServerError"
window.onNetworkDisconnected = -> log.error "Network Error!"

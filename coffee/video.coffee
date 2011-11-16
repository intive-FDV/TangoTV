util = TangoTV.util

STOPPED = 0
PLAYING = 1
PAUSED =  2

class TangoTV.VideoPlayer

    defaultConfig =
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
        @pause()
        @fullscreen = !@fullscreen
        @position @getCurrentDimensions()
        @resume()
        log.debug "Video fullscreen #{if @fullscreen then "on" else "off"}"

    togglePause: ->
        if @status == PAUSED
            @resume()
        else if @status == PLAYING
            @pause()
        else
            log.info "togglePause(): Not playing, ignoring"

    # Should use State pattern here?
    play: ->                                          #
        if @cfg.url == null                              #
            log.error "No URL to play"                     #
            return # TODO Throw something                   #
                                                             #
        @plugin.Play(@cfg.url)                               #
        @status = PLAYING                                    #
        log.info "Playing video #{@cfg.url}"                 #
                                                             #
    pause: ->                                                #
        if @status != PLAYING                                #
            log.warn "pause(): Not playing, ignoring"        #
            return                                           #
                                                             #
        @plugin.Pause()                                       #
        @status = PAUSED                                       #.
        log.info "Video playback paused"                         #-  Should use State pattern here?
                                                               #´
    resume: ->                                                #
        if @status != PAUSED                                 #
            log.warn "resume(): Not paused, ignoring"        #
                                                             #
        @plugin.Resume()                                     #
        @status = PLAYING                                    #
        log.info "Video playback resumed"                    #
                                                             #
    stop: ->                                                 #
        if @status == STOPPED                                #
            log.warn "stop(): Already stopped, ignoring"     #
            return                                           #
                                                            #
        @plugin.Stop()                                     #
        @status = STOPPED                                #
        log.info "Video playback stopped"             #

    constructor: (config) ->
        @status = STOPPED
        @plugin = $("#pluginPlayer")[0]

        @cfg = $.extend true, {}, defaultConfig, config

        if @plugin == null
            log.error "Player plugin not found in page"
            return # Throw something

        # Big WTF for Samsung here
        TangoTV.__video =
            setCurTime: =>
                log.debug "Current time in TangoTV.__video: #{arguments[0]}"
                @setCurTime(arguments)
            setTotalTime: => @setTotalTime(arguments)
            onBufferingStart: => @onBufferingStart(arguments)
            onBufferingProgress: => @onBufferingProgress(arguments)
            onBufferingComplete: => @onBufferingComplete(arguments)
        TangoTV.setCurTime = => @setCurTime(arguments)

        @plugin.OnCurrentPlayTime = "TangoTV.__video.setCurTime"
        @plugin.OnStreamInfoReady = "TangoTV.__video.setTotalTime"
        @plugin.OnBufferingStart = "TangoTV.__video.onBufferingStart"
        @plugin.OnBufferingProgress = "TangoTV.__video.onBufferingProgress"
        @plugin.OnBufferingComplete = "TangoTV.__video.onBufferingComplete"

         # Would be nicer to do it this way
#        @plugin.OnCurrentPlayTime = => @setCurTime(arguments)
#        @plugin.OnStreamInfoReady = => @setTotalTime(arguments)
#        @plugin.OnBufferingStart = => @onBufferingStart(arguments)
#        @plugin.OnBufferingProgress = => @onBufferingProgress(arguments)
#        @plugin.OnBufferingComplete = => @onBufferingComplete(arguments)

    setCurTime: (time) -> log.debug "Current time: #{time}"
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
window.setCurTime = (time) -> log.debug "setCurTime #{time}"
window.setTottalTime = (time) -> log.trace "setTottalTime #{time}"
window.stopPlayer = -> log.info "Video stopped (stopPlayer)"
window.setTottalBuffer = (buffer) -> log.trace "setTottalBuffer #{buffer}"
window.setCurBuffer = (buffer) -> log.trace "setCurBuffer #{buffer}"
window.onServerError = -> log.trace "onServerError"
window.onNetworkDisconnected = -> log.error "Network Error!"

#########################################################################################

YT_STATE =
    UNSTARTED:  -1
    ENDED:       0
    PLAYING:     1
    PAUSED:      2
    BUFFERING:   3
    CUED:        5

class TangoTV.YouTubePlayer

    defaultConfig =
        autohide: true
        autoplay: false
        allowFullScreen: true
        width: 640
        height: 390

    constructor: (config) ->
        @config = $.extend(true, {}, defaultConfig, config)
        @container = util.resolveToJqueryIfSelector(@config.container)

        @config.autohide = if @config.autohide then 1 else 0
        @config.autoplay = if @config.autoplay then 1 else 0

        @elementId = util.generateRandomId('youtube')

        # Unfortuntely, YouTube uses global functions too... (see below)
        youtubePlayers[@elementId] = this

        @container.get(0).innerHTML = youtubeTemplate(
            elementId: @elementId
            videoId: @config.videoId
            autohide: if @config.autohide then 1 else 0
            allowFullScreen: @config.allowFullScreen
            width: @config.width
            height: @config.height
        )

        seek = (secs = 5) =>
            @player.seekTo(@player.getCurrentTime() + secs, true) if @currentState in [YT_STATE.PLAYING, YT_STATE.PAUSED]
        @seek = util.debounce(seek, 250)

        # FIXME onYouTubePlayerReady is not always firing, though player *is* ready
        # @readinessCheck = setInterval((=> @onReady()), 500)

    isReady: ->
        player = $("##{@elementId}")
        player.length and player.get(0).getPlayerState?() in [-1..5]

    stateChanged: (state) ->
        @currentState = state
        switch @currentState
            when YT_STATE.CUED      then @config.onCued?()
            when YT_STATE.PLAYING   then @config.onPlay?()
            when YT_STATE.PAUSED    then @config.onPause?()
            when YT_STATE.BUFFERING then @config.onBuffering?()
            when YT_STATE.ENDED     then @config.onEnded?()

    addEventListener: ->
        fnName = util.generateRandomId("youtube_listener_#{@elementId}")
        window[fnName] = (state) =>
            @stateChanged(state)
        fnName

    onReady: ->
        unless @isReady()
            log.debug("Player #{@elementId} not yet ready")
            return

        clearInterval(@readinessCheck)
        @player = $("##{@elementId}").get(0)
        log.debug("Player #{@elementId} ready")

        @player.addEventListener('onStateChange', @addEventListener())
        @config.onReady?()

    load: (videoId) ->
        @player?.cueVideoById(videoId)

    play: ->
        @player?.playVideo()

    pause: ->
        @player?.pauseVideo()

    stop: ->
        @player?.stopVideo()

    getProgress: ->
        @player?.getCurrentTime()

youtubePlayers = {}
window.onYouTubePlayerReady = (playerId) ->
    playerId = unescape(playerId)
    youtubePlayers[playerId].onReady()

youtubeTemplate = (p) ->
    """
    <object
            id='#{p.elementId}' class='embed'
            type='application/x-shockwave-flash'
            data='http://www.youtube.com/v/#{p.videoId}?autohide=#{p.autohide}&enablejsapi=1&playerapiid=#{p.elementId}&showinfo=0'
            style="height: #{p.height}px; width: #{p.width}px">

        <param name="allowFullScreen" value="#{p.allowFullScreen}">
        <param name="allowScriptAccess" value="always">
    </object>
    """
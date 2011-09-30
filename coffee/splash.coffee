util = TangoTV.util

class Splash extends TangoTV.Screen

    config:
        timeout: 1000

    constructor: (config) ->
        $.extend(true, @config, config)
        @container = util.resolveToJqueryIfSelector(@config.container)
        super(@container)

    onLoad: ->
        log.debug "Splash.onLoad"
        super()
        @initSplashTimeout()
    
    initSplashTimeout: ->
        that = this
        @timer = setTimeout(
            -> that.advance(),
            @config.timeout)
    
    advance: ->
        log.debug "Advancing to uri: #{@config.nextPageUri}"
        @loadPage @config.nextPageUri

TangoTV.Splash = Splash
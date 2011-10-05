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

    defaultParams = [
        'country'
        'language'
        'lang'
        'modelid'
        'server'
        'firmware'
        'remocon'
        'area'
    ]

    advance: ->
        params = util.queryStringParams()
        uri = parseUri(@config.nextPageUri)
        queryString = uri.query || '?_=_'
        for p in defaultParams
            queryString += "&#{p}=#{params[p]}"

        nextPageUri = ''
        nextPageUri += "#{uri.protocol}://" if uri.protocol
        nextPageUri += "#{String(uri.authority)}#{String(uri.path)}"
        nextPageUri += "#{queryString}"
        nextPageUri += "##{uri.anchor}" if uri.anchor
        log.debug "Advancing to uri: #{nextPageUri}"
        @loadPage nextPageUri

TangoTV.Splash = Splash
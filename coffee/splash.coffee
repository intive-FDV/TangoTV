class Splash extends TVApp.Screen
    timeout: 300 #0

    constructor: (fakeBodySelector, nextPageUri, timeout) ->
        @timeout = timeout if timeout?
        super(fakeBodySelector)
        @nextPageUri = nextPageUri

    onLoad: ->
        log.debug "Splash.onLoad"
        super()
        @initSplashTimeout()
    
    initSplashTimeout: ->
        that = this
        @timer = setTimeout(
            -> that.advance(),
            @timeout)
    
    advance: ->
        log.debug "Advancing to main screen"
        @loadPage @nextPageUri

TVApp.Splash = Splash
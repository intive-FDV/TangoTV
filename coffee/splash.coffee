class Splash extends TVApp.Screen
    TIMEOUT: 300 #0
    
    onLoad: ->
        log.debug "Splash.onLoad"
        super()
        @initSplashTimeout()
    
    initSplashTimeout: ->
        that = this
        @timer = setTimeout(
            -> that.advance(),
            @TIMEOUT)
    
    advance: ->
        log.debug "Advancing to main screen"
        @loadPage "html/dashboard.html"

TVApp.Splash = Splash
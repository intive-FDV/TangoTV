util = TangoTV.util

class NavKey
    # TODO Make all this stuff configurable on a per instance basis (but not public)
    NAVKEY_CLASS = "nav-key"
    KEY_CLASS = "key-helper"
    KEY_ICON_CLASS = "key-icon"
    KEY_DESCRIPTION_CLASS = "key-desc"
    AVAILABLE_KEYS = [
        "up-down",
        "left-right",
        "enter",
        "return",
        "A", # RED
        "B", # GREEN
        "C", # YELLOW
        "D"  # BLUE
    ]

    constructor: (containerSelector, keyRef) ->
        $(containerSelector).append $("""
            <div class="#{NAVKEY_CLASS}">
            </div>
        """)
        @mainElem = $(".#{NAVKEY_CLASS}")
        for key in AVAILABLE_KEYS
            @mainElem.append $("""
                <div id="nav-#{key}" class="#{KEY_CLASS}">
                    <div class="#{KEY_ICON_CLASS}"></div>
                    <div class="#{KEY_DESCRIPTION_CLASS}"></div>
                </div>
            """)
        @hideAllKeys()
        for key of keyRef
            @showKey key, keyRef[key]

    show: ->
        @mainElem.show()

    hide: ->
        @mainElem.hide()

    showKey: (key, description) ->
        $keyHelper = @mainElem.find(".#{KEY_CLASS}#nav-#{key}")
        $keyHelper.find(".#{KEY_DESCRIPTION_CLASS}").html description
        $keyHelper.show()

    hideAllKeys: ->
        @mainElem.find(".#{KEY_CLASS}").hide()

class Screen
    widgetAPI: new Common.API.Widget()
    tvKey: new Common.API.TVKeyValue()

    listenerId: "keyListener"

    constructor: (fakeBodySelector) ->
        @fakeBodySelector = util.resolveToJqueryIfSelector(fakeBodySelector)

    onLoad: ->
        @enableKeys()
        @widgetAPI.sendReadyEvent()
        log.debug "Screen base loaded"

    keyHandler: {}

    setKeyHandler: (handler) ->
        @keyHandler?.stealFocus?()
        @keyHandler = handler
        @keyHandler?.focus?()
        if handler?.keyRef?
            @displayNavKey handler.keyRef
         else
            @hideNavKey()

    # TODO Add listener anchor programmatically
    enableKeys: ->
        $("##{@listenerId}").focus()
    
    onKeyDown: (event) ->
        event = window.event if !event
        log.trace "Key #{event.keyCode} pressed"
        if typeof @keyHandler[event.keyCode] == "function"
            @keyHandler[event.keyCode] event
        else
            log.debug "Unhandled key pressed"


    displayNavKey: (keyRef) ->
        @navKey = new NavKey @fakeBodySelector, keyRef

    hideNavKey: ->
        @navKey?.hide()

    loadPage: (uri) ->
        document.location = uri

TangoTV.Screen = Screen
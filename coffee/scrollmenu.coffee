class ScrollMenu extends TangoTV.Menu


    #defaultConfig =
        #options: []
        #element: '#scroll-menu-panel'
    selectItem: (index) ->
        super index
        log.debug $(@items[@selected]).attr("class")
    drawIn: (container) ->

        super container
        @container = TangoTV.util.resolveToJqueryIfSelector(container).addClass("scroller-menu")


    constructor: (config) ->
        super(config)
        @scroller = new TangoTV.Scroller({
            element: '.scroller-menu'
        })

TangoTV.ScrollMenu = ScrollMenu

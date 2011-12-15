class ScrollMenu extends TangoTV.Menu


    #defaultConfig =
        #options: []
        #element: '#scroll-menu-panel'
    selectItem: (index) ->
        super index
        posX =  $(@items[@selected]).position().top
        height= $(@items[@selected]).height()
        log.debug posX
        if ( posX + height > $(@container).height()+ @moved)
            @scroller?.scrollVertical(posX + height - $(@container).height()-@moved)
            @moved = posX + height - $(@container).height()

    drawIn: (container) ->

        super container
        @container = TangoTV.util.resolveToJqueryIfSelector(container).addClass("scroller-menu")
        @scroller = new TangoTV.Scroller({
            element: ".scroller-menu"
        })

    constructor: (config) ->
        super(config)
        @moved = 0
        #@scroller = new TangoTV.Scroller({
         #   element: ".scroller-menu"
        #})

TangoTV.ScrollMenu = ScrollMenu

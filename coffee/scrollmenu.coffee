class ScrollMenu extends TangoTV.Menu


    selectItem: (index) ->
        super index
        posX =  $(@items[@selected]).position().top
        if( posX - @moved < 0)
            dif = posX - @moved
            @scroller?.scrollVertical(dif)
            @moved += dif
        else
            height= $(@items[@selected]).height() + parseInt($(@items[@selected]).css("padding-top"))

            if ( posX + height > $(@container).height()+ @moved)
                @scroller?.scrollVertical(posX + height - $(@container).height() - @moved)
                @moved = posX + height - $(@container).height()

    drawIn: (container) ->

        super container
        @container = TangoTV.util.resolveToJqueryIfSelector(container).addClass("scroller-menu")
        @scroller = new TangoTV.Scroller({
            element: ".scroller-menu"
            bar:
                show: @config.bar
        })

    constructor: (config) ->
        super(config)
        @moved = 0
        @config.bar = config.bar ? false

TangoTV.ScrollMenu = ScrollMenu

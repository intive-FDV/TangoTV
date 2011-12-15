class Scroller

    # TODO Use scrollHeight and scrollWidth to get full content size

    defaultConfig =
        vStep: 80
        hStep: 40
        bar:
            show: true
            topOffset: 0
            template: (barClass, handleClass) ->
                """
                <div class="#{barClass}">
                    <div class="#{handleClass}"></div>
                </div>
                """
        position:
            x: 0
            y: 0
        cssClasses:
            bar: "scrollbar"
            handle: "handle"


    scrollDown: ->
        @scrollVertical(@config.vStep)

    scrollUp: ->
        @scrollVertical(- @config.vStep)

    scrollVertical: (amount) ->
        @element.scrollTop(@position.y + amount)
        scrollOffset = @element.scrollTop()
        if @position.y != scrollOffset
            @position.y = scrollOffset
            @config.onTop?() if @position.y <= 0
            @config.onBottom?() if @position.y >= @element.attr('scrollHeight') - @element.height()
        @updateBar()

#   scrollRight: ->                                  #
#        @scrollHorizontal(@config.hStep)             #
#                                                     #
#    scrollLeft: ->                                   #
#        @scrollHorizontal(- @config.hStep)            #  Not working: scrollLeft useless in MAPLE
#                                                     #
#    scrollHorizontal: (amount) ->                    #
#        @element.scrollLeft(@position.x + amount)    #
#        @position.x = @element.scrollLeft()         #

    createBar: ->
        return unless @config.bar.show
        classes = @config.cssClasses
        @element.append $(@config.bar.template(classes.bar, classes.handle))
        if @element.css("position") is "static"
            @element.css(position: "relative")
        @element.find(".#{classes.handle}").css(position: "absolute")

    # TODO Decouple scrollbar in separate component
    updateBar: ->
        return unless @config.bar.show

        bar = @element.find(".#{@config.cssClasses.bar}")
        bar.css(
            top: "#{@position.y + @config.bar.topOffset}px"
        )

        handle = @element.find(".#{@config.cssClasses.handle}")
        barHeight = bar.height() # @element.height()
        handleHeight = 100 * @element.height() / @element.attr('scrollHeight')
        handleTop = barHeight * @position.y / @element.attr('scrollHeight')
        handle.css(
            top: "#{handleTop}px"
            height: "#{handleHeight}%"
        )

    constructor: (config) ->
        @config = $.extend(true, {}, defaultConfig, config)
        @element = TangoTV.util.resolveToJqueryIfSelector(@config.element)
        @position = TangoTV.util.deepCopy(@config.position)

        @createBar()
        @updateBar()

TangoTV.Scroller = Scroller
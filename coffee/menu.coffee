class Menu
    ###
    Configuration options:

    options: List of menu items, each an object with "html" and "callback" properties
        html: the innerHTML of the generated li element,
        callback: function called when the ENTER key is pressed on the remote
            while the option is selected
    continuous: wether the first item is selected when going forward from
        the last element (and the last item when going backwards from the
        first one) or not
    selected: index of the initially selected option. Defaults to 0
    itemTemplate: function that builds a menu item returning a HTML string of such,
        recieves a HTML string with the content of the item and a list of CSS classes
    autoOpenSelected: call openSelected  when the selection change. Defaults to false

    Currently, the menu items can only be selected through the UP and DOWN keys

    The keyHandler can be publicly accesed in order to override/add behaviour
    ###

    defaultConfig =
        itemTemplate: (content, classes, index) ->
            classString = ''
            for klass in classes
                classString += "#{klass} "
            """
                <li class="#{classString}">
                    #{content}
                </li>
            """

        autoOpenSelected: false

    selected: 0
    focusedClass: "menu-focused"
    openClass: "menu-item-open"
    selectedClass: "menu-item-selected"
    unselectedClass: "menu-item-unselected"


    drawIn: (container) ->
        @container = TangoTV.util.resolveToJqueryIfSelector(container)
        evenness = ["odd", "even"]
        for index in [0 ... @options.length]
            classes = [@unselectedClass, "#{evenness[index % 2]}"]
            @container.append $(@config.itemTemplate(@options[index].html, classes, index))
        @items = @container.find(".#{@unselectedClass}")
        @selectItem(@selected)

    selectItem: (index) ->
        TangoTV.css.switchClasses $(@items[@selected]), @selectedClass, @unselectedClass
        @selected = index
        TangoTV.css.switchClasses $(@items[@selected]), @unselectedClass, @selectedClass
        if @config.autoOpenSelected
            @openSelectedItem()

    openSelectedItem: ->
        @container.find(".#{@openClass}").removeClass(@openClass)
        $(@items[@selected]).addClass(@openClass)
        @options[@selected].callback?()
    

    constructor: (config) ->
        @config = $.extend(true, {}, defaultConfig, config)
        @options = @config.options
        @selected = @config.selected if @config.selected?
        if @config.continuous
            @preFirst = @config.options?.length - 1
            @postLast = 0
        else
            @preFirst = 0
            @postLast = @config.options?.length - 1

        # TODO Make key codes configurable (or at least give horizontal alternative)
        @keyHandler =
            focus: =>
                @container?.addClass? @focusedClass
            stealFocus: =>
                @container?.removeClass? @focusedClass

        tvKey = new Common.API.TVKeyValue()
        @keyHandler[tvKey.KEY_UP] = =>
            @offset -1
        @keyHandler[tvKey.KEY_DOWN] = =>
            @offset 1
        @keyHandler[tvKey.KEY_ENTER] = =>
            @openSelectedItem()

        @keyHandler.keyRef =
            "enter": "Select"
            "up-down": "Move"

    offset: (amount) ->
        selected = @selected + amount
        if selected >= @options.length
            selected = @postLast
        if selected < 0
            selected = @preFirst
        @selectItem selected

TangoTV.Menu = Menu

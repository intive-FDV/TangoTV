switchClasses = ($element, removed, added) ->
    $element.removeClass removed
    $element.addClass added

class Menu
    ###
    Configuration options:

    containerSelector: CSS selector for the <ul> element to add <li>'s to
    options: List of menu items, each an object with "html" and "callback" properties
        html will be the innerHTML of the generated li element,
        callback is called when the ENTER key is pressed on the remote
        continuous: wether the

    Currently, the menu items can only be selected through the UP and DOWN keys

    The keyHandler can be publicly accesed in order to override/add behaviour
    ###
    selected: 0
    selectedClass: "menu-item-selected"
    unselectedClass: "menu-item-unselected"

    createItems: ->
        for option in @options
            @container.append $("<li class=\"#{@unselectedClass}\">#{option.html}</li>")
        @selectItem @selected

    selectItem: (index) ->
        items = @container.find("li")
        switchClasses $(items[@selected]), @selectedClass, @unselectedClass
        @selected = index
        switchClasses $(items[@selected]), @unselectedClass, @selectedClass

    openSelectedItem: ->
        @options[@selected].callback()

    constructor: (config) ->
        @options = config.options
        @container = $(config.containerSelector)
        @selected = config.selected if config.selected?
        if config.continuous
            @preFirst = config.options?.length - 1
            @postLast = 0
        else
            @preFirst = 0
            @postLast = config.options?.length - 1

        # TODO Make key codes configurable
        tvKey = new Common.API.TVKeyValue()
        @keyHandler = {}
        @keyHandler[tvKey.KEY_UP] = =>
            @offset -1
        @keyHandler[tvKey.KEY_DOWN] = =>
            @offset 1
        @keyHandler[tvKey.KEY_ENTER] = =>
            @openSelectedItem()

        @createItems()

    offset: (amount) ->
        selected = @selected + amount
        if selected >= @options.length
            selected = @postLast
        if selected < 0
            selected = @preFirst
        @selectItem selected

TVApp.Menu = Menu
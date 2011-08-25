switchClasses = ($element, removed, added) ->
    $element.removeClass removed
    $element.addClass added

class Menu
    ###
    Configuration options:

    containerSelector: CSS selector for the <ul> element to add <li>'s to
    options: List of menu items, each an object with "html" and "callback" properties
        html: the innerHTML of the generated li element,
        callback: function called when the ENTER key is pressed on the remote
            while the option is selected
    continuous: wether the first item is selected when going forward from
        the last element (and the last item when going backwards from the
        first one) or not
    selected: index of the initially selected option. Defaults to 0
    

    Currently, the menu items can only be selected through the UP and DOWN keys

    The keyHandler can be publicly accesed in order to override/add behaviour
    ###
    selected: 0
    selectedClass: "menu-item-selected"
    unselectedClass: "menu-item-unselected"

    createItems: ->
        evenness = ["odd", "even"]
        for index in [0 ... @options.length]
            @container.append $("<li class=\"#{@unselectedClass} #{evenness[index % 2]}\">#{@options[index].html}</li>")
        @selectItem @selected

    selectItem: (index) ->
        items = @container.find("li")
        switchClasses $(items[@selected]), @selectedClass, @unselectedClass
        @selected = index
        switchClasses $(items[@selected]), @unselectedClass, @selectedClass

    openSelectedItem: ->
        @options[@selected].callback?()

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

        # TODO Make key codes configurable (or at least horizontal)
        tvKey = new Common.API.TVKeyValue()
        @keyHandler = {}
        @keyHandler[tvKey.KEY_UP] = =>
            @offset -1
        @keyHandler[tvKey.KEY_DOWN] = =>
            @offset 1
        @keyHandler[tvKey.KEY_ENTER] = =>
            @openSelectedItem()

        @keyHandler.keyRef =
            "enter": "Select"
            "up-down": "Move"

        @createItems()

    offset: (amount) ->
        selected = @selected + amount
        if selected >= @options.length
            selected = @postLast
        if selected < 0
            selected = @preFirst
        @selectItem selected

TVApp.Menu = Menu
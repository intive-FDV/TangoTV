class Carrousel
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

    Currently, the menu items can only be selected through the UP and DOWN keys

    The keyHandler can be publicly accesed in order to override/add behaviour
    ###

    defaultConfig =
        options: []
        #keyHandler: {}
        #itemTemplate: (content, classes, index) ->
         #   classString = ''
          #  for klass in classes
          #      classString += "#{klass} "
          #  """
          #      <li class="#{classString}">
          #          #{content}
          #      </li>
          #  """

    #selected: 0
    #focusedClass: "menu-focused"
    #openClass: "menu-item-open"
    #selectedClass: "menu-item-selected"
    #unselectedClass: "menu-item-unselected"
   

    drawIn: (container) ->
        @container = TangoTV.util.resolveToJqueryIfSelector(container)
        @container.append("<FRAMESET><div class='panel-image-carrousel'><img class='main-image'> </div><div class='menu-carrousel'></div></FRAMESET>")
       # @menu.openSelectedItem()
        @menu.drawIn('.menu-carrousel')
        @menu.openSelectedItem()

    #selectItem: (index) ->
        #TangoTV.css.switchClasses $(@items[@selected]), @selectedClass, @unselectedClass
        #@selected = index
        #TangoTV.css.switchClasses $(@items[@selected]), @unselectedClass, @selectedClass

   # openSelectedItem: ->
        #@container.find(".#{@openClass}").removeClass(@openClass)
        #$(@items[@selected]).addClass(@openClass)
        #@options[@selected].callback?()

   # showSelectedImage: (img) ->
    #    @container.append $(img.html) 
    
    showImage: (image) ->
        @container.find(".main-image").attr("src", image.url)


    constructor: (config) ->

        @config = $.extend(true, {}, defaultConfig, config)

        @options = @config.options


        #@keyHandler.keyRef =
         #   "enter": "Select"
         #   "left-rigth": "Move"
        # Cada imagen es un objeto como {url: 'http://hector.jpg.to', thumbnailUrl: 'http://pequenio-hector.jpg.to'}

        thumbnailFor = (image) =>
                thumb= image.thumbnailUrl ? image.url
                html: "<img src='#{thumb}' class='tumbnail-menu-carrousel'>"
                callback: =>
                    #log.debug "@showImage: #{typeof @showImage}"
                    @showImage image

        @menu = new TangoTV.Menu(
                options: thumbnailFor(image) for image in @options
                continuous: true

        )
        @keyHandler = @menu.keyHandler

        # Pasarle parametros "selected" y "continuous" al menu del carrousel        
        # Recibir lista de imagenes por parametro y crear las opciones para el constructor del menu


TangoTV.Carrousel = Carrousel

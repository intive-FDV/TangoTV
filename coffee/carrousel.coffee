class Carrousel
    ###
    Configuration options:

    options: List of image items, each an object with "url" and "thumbnailUrl" properties
        url: the link to the image
        thumbnailUrl: link to teh preview image show in the carrousel menu
    autoShow: specifies when the image is showing automatically. Defaults to true
    scrolleable: specifies when the menu is scrolleable. Defaults to true

    ###

    defaultConfig =
        options: []
        autoShow: true
        scrolleable: true

    drawIn: (container) ->
        @container = TangoTV.util.resolveToJqueryIfSelector(container)
        @container.append("<FRAMESET><div class='panel-image-carrousel'><img class='main-image'> </div><div class='menu-carrousel'></div></FRAMESET>")
        @menu.drawIn('.menu-carrousel')
        @menu.openSelectedItem()
    
    showImage: (image) ->
        @container.find(".main-image").attr("src", image.url)


    constructor: (config) ->

        @config = $.extend(true, {}, defaultConfig, config)

        @options = @config.options

        thumbnailFor = (image) =>
                # thumb= image.thumbnailUrl ? image.url
                html: "<img src='#{image.thumbnailUrl ? image.url}' class='tumbnail-menu-carrousel'>"
                callback: =>
                    #log.debug "@showImage: #{typeof @showImage}"
                    @showImage image
        configForMenu = {
            options: thumbnailFor(image) for image in @options
            continuous: true
            autoOpenSelected: @config.autoShow
        }
        if @config.scrolleable
            @menu = new TangoTV.ScrollMenu(configForMenu)
        else
            @menu = new TangoTV.Menu(configForMenu)
        @keyHandler = @menu.keyHandler




TangoTV.Carrousel = Carrousel

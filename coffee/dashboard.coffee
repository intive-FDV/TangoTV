class HiddableContent
    show: -> @getContainer().show()
    hide: -> @getContainer().hide()
    toggle: -> @getContainer().toggle()

class ColorChanger extends HiddableContent

    getContainer: -> @element

    setColor: (color) ->
        @element.css "background-color": color

    constructor: (elementSelector) ->
        @element = $(elementSelector)

        tvKey = new Common.API.TVKeyValue()
        @keyHandler = {}
        
        @keyHandler[tvKey.KEY_RED] = =>
            @setColor "red"

        @keyHandler[tvKey.KEY_GREEN] = =>
            @setColor "green"

        @keyHandler[tvKey.KEY_YELLOW] = =>
            @setColor "yellow"

        @keyHandler[tvKey.KEY_BLUE] = =>
            @setColor "blue"

        @keyHandler[tvKey.KEY_ENTER] = =>
            @setColor "white"

        @keyHandler.keyRef =
            "return": "Menu"
            "enter": "White"
            "A": "Red"
            "B": "Green"
            "C": "Yellow"
            "D": "Blue"


class Calculator extends HiddableContent
    LINE_CLASS: "calc-line"
    OPERATOR_CLASS: "operator"
    OPERAND_CLASS: "operand"
    value: 0

    getContainer: -> @container

    show: -> @container.show()

    noop: -> @parseValue()
    sum: (x, y) -> x + y
    subtraction: (x, y) -> x - y
    multiplication: (x, y) -> x * y
    division: (x, y) -> x / y

    performOp: ->
        @value = @op @value, @parseValue()

    addLine: ->
        @element.append $("""
            <div class="#{@LINE_CLASS}">
                <div class="#{@OPERATOR_CLASS}"></div>
                <div class="#{@OPERAND_CLASS}"></div>
            </div>
        """)

    appendToOperand: (str) ->
        $currentOperand = @element.find(".#{@OPERAND_CLASS}:last")[0]
        $currentOperand.innerHTML = "#{$currentOperand.innerHTML}#{str}"

    showValue: ->
        $currentOperand = @element.find(".#{@OPERAND_CLASS}:last")[0]
        $currentOperand.innerHTML = String(@value)

    parseValue: ->
        (+ @element.find("div:last")[0].innerHTML)

    showOperator: (operator) ->
        $currentOperator = @element.find(".#{@OPERATOR_CLASS}:last")[0]
        $currentOperator.innerHTML = "#{operator} "

    clearHistory: ->
        @element.html("")
        @addLine()
        @value = 0
        @op = @noop
    
    calculateAndSetOperation: (operation, symbol) ->
        @performOp()
        @addLine()
        @showValue()
        @addLine()
        @op = operation
        @showOperator symbol # TODO Could be part of the operation

    constructor: (containerSelector, elementSelector) ->
        @container = $(containerSelector)
        @element = $(elementSelector)
        @op = @noop

        tvKey = new Common.API.TVKeyValue()
        @keyHandler = {}
        
        @keyHandler[tvKey.KEY_RED] = =>
            @calculateAndSetOperation @subtraction, "-"

        @keyHandler[tvKey.KEY_GREEN] = =>
            @calculateAndSetOperation @multiplication, "*"

        @keyHandler[tvKey.KEY_YELLOW] = =>
            @calculateAndSetOperation @division, "/"

        @keyHandler[tvKey.KEY_BLUE] = =>
            @calculateAndSetOperation @sum, "+"
            
        @keyHandler[tvKey.KEY_ENTER] = =>
            @calculateAndSetOperation @noop, ""

        for num in [0..9]
            do (num) =>
                @keyHandler[tvKey["KEY_#{num}"]] = =>
                    @appendToOperand "#{num}"

        @keyHandler[tvKey.KEY_RW] = =>
            @clearHistory()

class Html5VideoPlayer extends HiddableContent

    getContainer: -> @container

    constructor: (containerSelector, elementSelector) ->
        @container = $(containerSelector)
        @video = $(elementSelector)[0]

        tvKey = new Common.API.TVKeyValue()
        @keyHandler = {}
        @keyHandler[tvKey.KEY_PLAY] = =>
            log.debug "PLAY"
            @video.play()
        @keyHandler[tvKey.KEY_STOP] = =>
            log.debug "STOP"
            @video.stop()

class Video extends HiddableContent

    getContainer: -> @container

    show: ->
        super()
        position = @placeholder.offset()
        @player.cfg.dimensions =
            top: position.top
            left: position.left
            width: @placeholder.width()
            height: @placeholder.height()
        @player.show()
        
    hide: ->
        super()
        @player.hide()

    constructor: (config) ->
        @container = $(config.containerSelector)
        @placeholder = $(config.placeholderSelector)
        @fullscreenPh = $(config.fullPhSelector)
        @player = new TVApp.VideoPlayer(config.playerConfig)

        # TODO Make keys configurable
        tvKey = new Common.API.TVKeyValue()
        @keyHandler = {}
        @keyHandler[tvKey.KEY_PLAY] = => @player.play()
        @keyHandler[tvKey.KEY_STOP] = => @player.stop()
        @keyHandler[tvKey.KEY_ENTER] = =>
            @player.toggleFullscreen()
            @fullscreenPh.toggle()

# "Dashboard" is just an arbitrary name for the first interactive screen
class Dashboard extends TVApp.Screen

    show: (content) ->
        @shown?.hide()
        @shown = content
        content.show()
        @setKeyHandler content.keyHandler

    onLoad: ->
        log.debug "Dashboard.onLoad"
        super()
        
        @menu = new TVApp.Menu(
            containerSelector: '.menu'
            options: [
                {
                    html: 'Color changer'
                    callback: => @show @colorChanger
                },
                {
                    html: 'Calculator'
                    callback: => @show @calculator
                },
                {
                    html: 'Video'
                    callback: => @show @videoPlayer
                }
            ]
        )

        focusOnMenu = => @setKeyHandler @menu.keyHandler

        @colorChanger = new ColorChanger("#color-changer")
        @colorChanger.keyHandler[@tvKey.KEY_RETURN] = focusOnMenu

        @calculator = new Calculator("#calculator-box", "#calculator")
        @calculator.keyHandler[@tvKey.KEY_RETURN] = focusOnMenu

        @html5Player = new Html5VideoPlayer("#html5-video-container", "#html5-video")
        @html5Player.keyHandler[@tvKey.KEY_RETURN] = focusOnMenu

        @videoPlayer = new Video(
            containerSelector: "#video-container"
            placeholderSelector: "#video-player"
            fullPhSelector: "#fullscreen-placeholder"
            playerConfig:
                url: "D:/Workspaces/samsung-tv/app-template/resource/video/movie.mp4"
        )
        @videoPlayer.keyHandler[@tvKey.KEY_RETURN] = focusOnMenu

        focusOnMenu()

TVApp.Dashboard = Dashboard
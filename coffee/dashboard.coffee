tvKey = new Common.API.TVKeyValue()

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

        @keyHandler = {}
        
        @keyHandler[tvKey.KEY_RED] = =>
            @setColor "#a90921"

        @keyHandler[tvKey.KEY_GREEN] = =>
            @setColor "#418415"

        @keyHandler[tvKey.KEY_YELLOW] = =>
            @setColor "#d6ab00"

        @keyHandler[tvKey.KEY_BLUE] = =>
            @setColor "#09418f"

        @keyHandler[tvKey.KEY_ENTER] = =>
            @setColor "white"

        @keyHandler.keyRef =
            "enter": "White"
            "A": "Red"
            "B": "Green"
            "C": "Yellow"
            "D": "Blue"


class Calculator extends HiddableContent
    DISPLAY_CLASS: "display"
    HISTORY_CLASS: "history"
    LINE_CLASS: "calc-line"
    OPERATOR_CLASS: "operator"
    OPERAND_CLASS: "operand"
    currentOperand: 0
    value: 0

    getContainer: -> @container

    noop: ->
        @parseDisplay()
    sum: (x, y) -> x + y
    subtraction: (x, y) -> x - y
    multiplication: (x, y) -> x * y
    division: (x, y) -> x / y

    performOp: ->
        @value = @op @value, @parseDisplay()

    addLine: ->
        @history.prepend $("""
            <div class="#{@LINE_CLASS}">
                <div class="#{@OPERAND_CLASS}"></div>
                <div class="#{@OPERATOR_CLASS}"></div>
                <div class="#{@OPERAND_CLASS}"></div>
            </div>
        """)

    appendToOperand: (str) ->
        @display.html("#{@display.html()}#{str}")
        # $currentOperand = @element.find(".#{@OPERAND_CLASS}:last")[0]
        # $currentOperand.innerHTML = "#{$currentOperand.innerHTML}#{str}"

    showValue: ->
        @display.html(String(@value))
        # $currentOperand = @element.find(".#{@OPERAND_CLASS}:last")[0]
        # $currentOperand.innerHTML = String(@value)

    parseDisplay: ->
        (+ @display.html())

    acceptOperand: (value) ->
        suffix = ":first"
        suffix = ":last" unless @currentOperand == 0
        @history.find(".#{@LINE_CLASS}:first .#{@OPERAND_CLASS}#{suffix}").html(value)
        @currentOperand = (@currentOperand + 1) % 2
        log.debug "Calc: Accepted #{value} as #{suffix} operand"

    clearDisplay: ->
        @display.html("")

    showOperator: (operator) ->
        @history.find(".#{@OPERATOR_CLASS}:first").html("#{operator}")

    showResult: ->
        @history.find(".#{@LINE_CLASS}:first .#{@OPERAND_CLASS}:first").html(@value)

    clearHistory: ->
        @history.html("")
        @display.html("")
        @addLine()
        @value = 0
        @currentOperand = 0
        @op = @noop
        log.debug "Calc: History clear"

    calculateAndSetOperation: (operation, symbol) ->
        @performOp()
        if @currentOperand == 1
            @acceptOperand(@display.html())
            @addLine()
        @acceptOperand(@value)
        @showOperator symbol # TODO Could be part of the operation
        @clearDisplay()
        @op = operation

    constructor: (containerSelector, elementSelector) ->
        @container = $(containerSelector)
        @element = $(elementSelector)
        @display = @element.find(".#{@DISPLAY_CLASS}")
        @history = @element.find(".#{@HISTORY_CLASS}")
        @op = @noop

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
                    log.trace "Calc: Appended #{num}"

        @keyHandler[tvKey.KEY_RW] = =>
            @clearHistory()

        @keyHandler.keyRef =
            "enter": "Calculate"
            "A": "Substract"
            "B": "Multiply"
            "C": "Divide"
            "D": "Add"

class ScrollerPane extends HiddableContent

    SCROLLABLE_ID = "scrollable"
    getContainer: -> @container

    show: ->
        super()
        @scroller.updateBar()

    contentTemplate: (o) ->
        """
            <div id="#{o.id}">
            #{
            content = ""
            for i in [1..40]
                content += "#{(j*j for j in [1..i])}<br>"
            content
            }
            </div>
        """

    constructor: (containerSelector) ->
        @container = $(containerSelector)
        @container.append $(@contentTemplate(id: SCROLLABLE_ID))
        scrollable = $("##{SCROLLABLE_ID}")
        scrollable.css(
            width: "200px"
            height: "200px"
            overflow: "auto"
        )
        @scroller = new TangoTV.Scroller(
            element: scrollable
            onTop: -> log.debug "Scrolled to top"
            onBottom: -> log.debug "Scrolled to bottom"
        )
        @keyHandler = {}
        @keyHandler[tvKey.KEY_DOWN] = =>
            @scroller.scrollDown()
        @keyHandler[tvKey.KEY_UP] = =>
            @scroller.scrollUp()


class Html5VideoPlayer extends HiddableContent

    getContainer: -> @container

    constructor: (containerSelector, elementSelector) ->
        @container = $(containerSelector)
        @video = $(elementSelector)[0]

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
        @player = new TangoTV.VideoPlayer(config.playerConfig)

        # TODO Make keys configurable
        @keyHandler = {}
        @keyHandler[tvKey.KEY_PLAY] = => @player.play()
        @keyHandler[tvKey.KEY_PAUSE] = => @player.togglePause()
        @keyHandler[tvKey.KEY_STOP] = => @player.stop()
        @keyHandler[tvKey.KEY_ENTER] = =>
            @player.toggleFullscreen()
            @fullscreenPh.toggle()

class Weather extends HiddableContent

    getContainer: -> @container

    conditionsTemplate = (cond, today) ->
        """
        <div class="weather conditions">
            <img src="#{today.weatherIconUrl[0].value}">
            <div class="temp">#{cond.temp_C}ºC</div>
            <div class="condition">#{cond.weatherDesc[0].value}</div>
        </div>
        """

    forecast = (forecast, dayName) ->
        """
        <div class="forecast">
            <div class="day-name">#{dayName}</div>
            <img src="#{forecast.weatherIconUrl[0].value}">
            <div class="temp-extremes">#{forecast.tempMaxC}ºC - #{forecast.tempMinC}ºC </div>
        </div>
        """

    dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    forecastsTemplate = (forecasts) ->
        date = new Date()
        html = """<div class="weather forecasts">"""
        for i in [0..4]
            html += forecast(forecasts[i], dayNames[date.getDay()])
            date.setDate(date.getDate() + 1);
        html += "</div>"

    constructor: (config) ->
        @container = $(config.containerSelector)

        $.extend(config.forecastConfig,
            success: =>
                forecastHtml = conditionsTemplate(@forecast.conditions, @forecast.forecasts[0])
                forecastHtml += forecastsTemplate(@forecast.forecasts)
                @container.html(forecastHtml)
        )
        @forecast = new TangoTV.Forecast(config.forecastConfig)

        # TODO Make keys configurable
        @keyHandler = {}

class IMEInput extends HiddableContent

    show: ->
        super.show()
        TangoTV.adaptInput
            input: @input
            onReady: =>
                @input.focus()
            extraKeys: @keyHandler


    getContainer: -> @container

    constructor: (config) ->
        @container = $(config.containerSelector)

        @container.append """
            Enter some text: <input id="text-input" type="text"></input>
        """
        @input = $("#text-input")

        @keyHandler = {}

# "Dashboard" is just an arbitrary name for the first interactive screen
class Dashboard extends TangoTV.Screen

    show: (content) ->
        @shown?.hide()
        @shown = content
        content.show()
        @setKeyHandler content.keyHandler

    onLoad: ->
        @menu = new TangoTV.Menu(
            containerSelector: '.menu'
            options: [
                {
                    html: 'Color changer'
                    callback: => @show @colorChanger
                }, {
                    html: 'Calculator'
                    callback: => @show @calculator
                }, {
                    html: 'Scroller'
                    callback: => @show @scroller
                }, {
                    html: 'Video'
                    callback: => @show @videoPlayer
                }, {
                    html: 'Weather'
                    callback: => @show @weather
                }, {
                    html: 'Text Input'
                    callback: => @show @imeInput
                }
            ]
        )

        addReturnKey = (keyHandler) =>
            keyHandler[@tvKey.KEY_RETURN] = => @setKeyHandler @menu.keyHandler
            keyHandler.keyRef.return = "Menu" if keyHandler.keyRef?

        @colorChanger = new ColorChanger("#color-changer")
        addReturnKey(@colorChanger.keyHandler)

        @calculator = new Calculator("#calculator-box", "#calculator")
        addReturnKey(@calculator.keyHandler)

        @scroller = new ScrollerPane("#scroller")
        addReturnKey(@scroller.keyHandler)

        @html5Player = new Html5VideoPlayer("#html5-video-container", "#html5-video")
        addReturnKey(@html5Player.keyHandler)

        @videoPlayer = new Video(
            containerSelector: "#video-container"
            placeholderSelector: "#video-player"
            fullPhSelector: "#fullscreen-placeholder"
            playerConfig:
                url: "D:/Workspaces/samsung-tv/app-template/resource/video/movie.mp4"
        )
        addReturnKey(@videoPlayer.keyHandler)

        @weather = new Weather(
            containerSelector: "#weather-container"
            forecastConfig:
                wwoApiKey: "e5a8a4d2d2163552112309"
                location:
                    city: "Buenos Aires"
                    country: "Argentina"
        )
        addReturnKey(@weather.keyHandler)

        @imeInput = new IMEInput(
            containerSelector: "#ime-container"
        )
        #@imeInput.keyHandler[88] = =>
        @imeInput.keyHandler[tvKey.KEY_RETURN] = =>
            @setKeyHandler @menu.keyHandler
            @enableKeys()
            return false

        @setKeyHandler @menu.keyHandler

        log.debug "Dashboard loaded"
        super()

TangoTV.Dashboard = Dashboard
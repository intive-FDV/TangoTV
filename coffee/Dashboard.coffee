# "Dashboard" is just an arbitrary name for the first interactive screen
class Dashboard extends TVApp.Screen

    @calculator: {}
    @colorChanger: {}

    constructor: (fakeBodySelector) ->
        super(fakeBodySelector)

        # TODO Move to its own class
        constructColorChanger = =>
            ELEMENT_ID = "color-changer"
            # TODO Make the selection only once
            # $element = $("##{_ELEMENT_ID}")
            setColor = (color) ->
                    $("##{ELEMENT_ID}").css "background-color": color
            handler = {}
            handler[@tvKey.KEY_RED] = ->
                setColor "red"
            handler[@tvKey.KEY_GREEN] = ->
                setColor "green"
            handler[@tvKey.KEY_YELLOW] = ->
                setColor "yellow"
            handler[@tvKey.KEY_BLUE] = ->
                setColor "blue"
            handler[@tvKey.KEY_ENTER] = ->
                setColor "white"
            handler[@tvKey.KEY_DOWN] = =>
                @setKeyHandler @calculator
            handler.keyRef =
                "up-down": "Switch boxes"
                "enter": "White"
                "A": "Red"
                "B": "Green"
                "C": "Yellow"
                "D": "Blue"


            return handler

        # TODO Move to its own class
        constructCalculator = =>
            ELEMENT_ID = "calculator"
            LINE_CLASS = "calc-line"
            OPERATOR_CLASS = "operator"
            OPERAND_CLASS = "operand"
            value = 0

            noop = -> parseValue()
            sum = (x, y) -> x + y
            subtraction = (x, y) -> x - y
            multiplication = (x, y) -> x * y
            division = (x, y) -> x / y

            op = noop

            performOp = ->
                value = op value, parseValue()

            addLine = ->
                $element = $("##{ELEMENT_ID}")
                $element.append $("""
                    <div class="#{LINE_CLASS}">
                        <div class="#{OPERATOR_CLASS}"></div>
                        <div class="#{OPERAND_CLASS}"></div>
                    </div>
                """)

            appendToOperand = (str) ->
                $currentOperand = $("##{ELEMENT_ID} .#{OPERAND_CLASS}:last")[0]
                $currentOperand.innerHTML = "#{$currentOperand.innerHTML}#{str}"

            showValue = ->
                $currentOperand = $("##{ELEMENT_ID} .#{OPERAND_CLASS}:last")[0]
                $currentOperand.innerHTML = String(value)

            parseValue = ->
                (+ $("##{ELEMENT_ID} div:last")[0].innerHTML)

            showOperator = (operator) ->
                $currentOperator = $("##{ELEMENT_ID} .#{OPERATOR_CLASS}:last")[0]
                $currentOperator.innerHTML = "#{operator} "

            clearHistory = ->
                $("##{ELEMENT_ID}").html("")
                addLine()
                value = 0
                op = noop

            calculateAndSetOperation = (operation, symbol) ->
                performOp()
                addLine()
                showValue()
                addLine()
                op = operation
                showOperator symbol # TODO Could be part of the operation

            handler = {}
            handler[@tvKey.KEY_RED] = ->
                calculateAndSetOperation subtraction, "-"

            handler[@tvKey.KEY_GREEN] = ->
                calculateAndSetOperation multiplication, "*"

            handler[@tvKey.KEY_YELLOW] = ->
                calculateAndSetOperation division, "/"

            handler[@tvKey.KEY_BLUE] = ->
                calculateAndSetOperation sum, "+"
                
            handler[@tvKey.KEY_ENTER] = ->
                calculateAndSetOperation noop, ""

            for num in [0..9]
                do (num) =>
                    handler[@tvKey["KEY_#{num}"]] = ->
                        appendToOperand "#{num}"

            handler[@tvKey.KEY_RETURN] = ->
                clearHistory()

            handler[@tvKey.KEY_UP] = =>
                @setKeyHandler @colorChanger
                
            return handler

        @colorChanger = constructColorChanger()
        @calculator = constructCalculator()

    onLoad: ->
        log.debug "Dashboard.onLoad"
        super()
        @setKeyHandler @colorChanger

TVApp.Dashboard = Dashboard
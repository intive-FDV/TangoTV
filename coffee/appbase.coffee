TangoTV = {}

TangoTV.css =
    switchClasses: ($element, removed, added) ->
        $element.removeClass removed
        $element.addClass added

TangoTV.util =
    STRING_TYPENAME: "string"

    deepCopy: (object) ->
        $.extend(true, {}, object)

    resolveToJqueryIfSelector: (object) ->
        if typeof object == TangoTV.util.STRING_TYPENAME
            return $(object)
        return object

window.TangoTV = TangoTV

log =
    levels:
        TRACE:  5
        DEBUG:  4
        INFO:   3
        WARN:   2
        ERROR:  1
        OFF: 0
        ALL: @TRACE

    level: 5

    log: (message, level) ->
        return if @level < @levels[level]
        @append "#{level} #{message}"

    trace: (m) -> @log m, "TRACE"
    debug: (m) -> @log m, "DEBUG"
    info:  (m) -> @log m, "INFO"
    warn:  (m) -> @log m, "WARN"
    error: (m) -> @log m, "ERROR"

    append: if console?
        (m) -> console.log m
    else
        (m) -> @fallbackAppend m

    fallbackAppend: (m) -> alert m

window.log = log
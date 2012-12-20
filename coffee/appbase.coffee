TangoTV = {}

TangoTV.css =
    switchClasses: ($element, removed, added) ->
        $element.removeClass removed
        $element.addClass added

limit = (func, wait, debounce) ->


TangoTV.util =
    STRING_TYPENAME: "string"

    deepCopy: (object) ->
        $.extend(true, {}, object)

    debounce: (func, wait) ->
        timeout = {}
        return ->
            context = this
            args = arguments
            throttler = ->
                timeout = null
                func.apply(context, args)

            clearTimeout(timeout)
            timeout = setTimeout(throttler, wait)

    generateRandomId: (prefix = '') ->
        "__#{prefix}_#{Math.floor Math.random() * 88888}" # Why 88888? I like it!

    resolveToJqueryIfSelector: (object) ->
        if typeof object == TangoTV.util.STRING_TYPENAME
            return $(object)
        return object

    loadScript: (path, onLoad = (->)) ->
        script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = path
        script.onload = onLoad
        document.getElementsByTagName('head')[0].appendChild(script)

    loadCss: (path) ->
        link = $('<link></link>')
        link.attr('rel','stylesheet')
        link.attr('type', 'text/css')
        link.attr('href', path)
        $('head').append(link)

    queryStringParams: (query = window.location.search, acceptEmptyParams = false) ->
        paramMap = {}
        # Trim the "?" if present
        if query.indexOf('?') == 0
            query = query.substring(1)
        # Trim any leading ampersands
        while query.indexOf('&') == 0
            query = query.substring(1)
        params = query.split('&')
        for param in params
            eqPos = param.indexOf('=')
            if eqPos > 0
                paramMap[param.substring(0, eqPos)] = param.substring(eqPos + 1)
            else if acceptEmptyParams
                paramMap[param] = ''
        paramMap

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
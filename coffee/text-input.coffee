defaultConfig =
    lang:       'en'
    onReady:    undefined # (ime) ->
    onComplete: undefined # ->
    onAnyKey:   undefined # (keyCode) ->
    onEnter:    undefined # (textValue) ->
    extraKeys: {}

generateRandomId = ->
    "__input__#{Math.floor Math.random() * 88888}" # Why 88888? I like it!

TangoTV.adaptInput = (config) ->
    config = $.extend(true, defaultConfig, config)
    input = TangoTV.util.resolveToJqueryIfSelector(config.input)

    unless input.attr("id")
        input.attr("id", generateRandomId())
    ime = new IMEShell(input.attr("id"), onImeReady(config), config.lang)
    
    log.error "Failed adapting input ##{input.attr("id")}" unless ime
    return input

onImeReady = (config) ->
    return (ime) ->
        ime.setOnCompleteFunc(config.onComplete) if config.onComplete?
        ime.setKeypadPos(config.position.x, config.position.y) if config.position?.x? and config.position.y?
        ime.setEnterFunc(config.onEnter) if config.onEnter?
        ime.setAnyKeyFunc(config.onAnyKey) if config.onAnyKey?
        for key of config.extraKeys
            ime.setKeyFunc(key, config.extraKeys[key])

        config.onReady(ime)

TangoTV.util.loadScript('$MANAGER_WIDGET/Common/IME/ime2.js')
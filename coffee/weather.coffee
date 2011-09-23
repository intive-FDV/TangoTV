# Weather forecast retrieved from http://www.worldweatheronline.com/
# Configuration (properties with default values are optional):
#
# config:
#     wwoApiKey       # string containing World Weather Online api key
#     days: 5         # number of days to retrieve forecast to, from 2 to 5
#     location        # described below
#     success         # callback called when weather data is ready to be used
#     error           # callback invoked on error retrieving weather data
#
# If "days" exceed valid values' bound, the nearest value will be forced,
# e.g.: 5 will be used when days == 6
#
# The "location" field can be either:
#
# location:
#     city            # city name as string
#     country: null   # country name as string
#
# or
#
# location:
#     lat             # latitude in decimal degree
#     lng             # longitude in decimal degree

class TangoTV.Forecast

    MIN_DAYS = 2
    MAX_DAYS = 5
    BASE_URL = 'http://free.worldweatheronline.com/feed/weather.ashx?format=json'

    config:
        days: 5

    buildUrl: ->
        "#{BASE_URL}&key=#{@config.wwoApiKey}&num_of_days=#{@config.days}&q=#{@query}"

    buildQuery: ->
        loc = @config.location
        if loc.city?
            @query = "#{loc.city}"
            @query += ",#{loc.country}" if loc.country?
        else
            @query = "#{loc.lat},#{loc.lng}"

    loadForecast: ->
        log.debug "Loading weather with URI #{@buildUrl()}"
        $.ajax
            url: @buildUrl()
            dataType: 'json'
            success: (data) =>
                data = data.data
                @conditions = data.current_condition[0]
                @forecasts = data.weather
                @config.success() if @config.success
            error: (xhr, textStatus, error) =>
                @config.error?(textStatus, error)

                

    constructor: (config) ->
        return @config.error?("Invalid options") unless config.wwoApiKey? and
            (config.location?.city? or
            (config.location?.lat? and config.location?.lng?) )

        $.extend(true, @config, config)

        @config.days = MIN_DAYS if @config.days < MIN_DAYS
        @config.days = MAX_DAYS if @config.days > MAX_DAYS

        @buildQuery()
        @loadForecast()
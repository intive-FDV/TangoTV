
  TangoTV.Forecast = (function() {
    var BASE_URL, MAX_DAYS, MIN_DAYS, defaultConfig;

    MIN_DAYS = 2;

    MAX_DAYS = 5;

    BASE_URL = 'http://free.worldweatheronline.com/feed/weather.ashx?format=json';

    defaultConfig = {
      days: 5
    };

    Forecast.prototype.buildUrl = function() {
      return "" + BASE_URL + "&key=" + this.config.wwoApiKey + "&num_of_days=" + this.config.days + "&q=" + this.query;
    };

    Forecast.prototype.buildQuery = function() {
      var loc;
      loc = this.config.location;
      if (loc.city != null) {
        this.query = "" + loc.city;
        if (loc.country != null) return this.query += "," + loc.country;
      } else {
        return this.query = "" + loc.lat + "," + loc.lng;
      }
    };

    Forecast.prototype.loadForecast = function() {
      var _this = this;
      return $.ajax({
        url: this.buildUrl(),
        dataType: 'json',
        success: function(data) {
          var _base;
          data = data.data;
          _this.conditions = data.current_condition[0];
          _this.forecasts = data.weather;
          return typeof (_base = _this.config).success === "function" ? _base.success(_this.conditions, _this.forecasts) : void 0;
        },
        error: function(xhr, textStatus, error) {
          var _base;
          return typeof (_base = _this.config).error === "function" ? _base.error(textStatus, error) : void 0;
        }
      });
    };

    function Forecast(config) {
      var _base, _ref, _ref2, _ref3;
      if (!((config.wwoApiKey != null) && ((((_ref = config.location) != null ? _ref.city : void 0) != null) || ((((_ref2 = config.location) != null ? _ref2.lat : void 0) != null) && (((_ref3 = config.location) != null ? _ref3.lng : void 0) != null))))) {
        return typeof (_base = this.config).error === "function" ? _base.error("Invalid options") : void 0;
      }
      this.config = $.extend(true, {}, defaultConfig, config);
      if (this.config.days < MIN_DAYS) this.config.days = MIN_DAYS;
      if (this.config.days > MAX_DAYS) this.config.days = MAX_DAYS;
      this.buildQuery();
      this.loadForecast();
    }

    return Forecast;

  })();

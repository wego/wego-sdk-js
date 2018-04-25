var Api = require('../Api');
var Poller = require('../Poller');

var HotelDetailsClient = function(options) {
  var self = this;

  options = options || {};
  self.currency  = options.currency || {};
  self.locale = options.locale;
  self.searchId = options.searchId;
  self.siteCode = options.siteCode;
  self.deviceType = options.deviceType || "DESKTOP";
  self.appType = options.appType || "WEB_APP";
  self.userLoggedIn = options.userLoggedIn;
  self.onProgressChanged = options.onProgressChanged || function() {};
  self.onHotelRatesChanged = options.onHotelRatesChanged || function() {};
  self.onSearchCreated = options.onSearchCreated || function() {};

  self.poller = new Poller({
    delays: [0, 300, 600, 900, 2400, 3800, 5000, 6000],
    pollLimit: 7,
    callApi: function() {
      return Api.searchHotel(self.getSearchRequestBody(), {
        currencyCode: self.currency.code,
        locale: self.locale,
      });
    },
    onSuccessResponse: function(response) {
      return self.handleSearchResponse(response);
    },
  });
  self.reset();
};

HotelDetailsClient.prototype = {
  searchHotelRates: function(search, mainSearchId) {
    var self = this;
    self.search = search;
    self.searchId = undefined;

    if (mainSearchId !== undefined) {
      self.reset();
      self.onProgressChanged(self.poller.getProgress());
      self.searchId = mainSearchId;
      self.poller.start();
    } else {
      Api.searchHotel(self.getSearchRequestBody(), {
        currencyCode: self.currency.code,
        locale: self.locale,
      }).then(function (hotelSearch) {
        self.reset();
        self.onProgressChanged(self.poller.getProgress());
        self.searchId = hotelSearch.search.id;
        self.onSearchCreated(hotelSearch.search);
        self.poller.start();
      });
    }
  },

  handleSearchResponse: function(response) {
    var self = this;

    self.onProgressChanged(self.poller.getProgress());
    self.onHotelRatesChanged(response);
  },

  reset: function() {
    this.poller.reset();
  },

  updateCurrency: function(currency) {
    this.currency = currency;
  },

  getSearchRequestBody: function() {
    var self = this,
        hotelSearch = self.search || {},
        currency = self.currency || {},
        currencyCode = currency.code,
        locale = self.locale
        searchRequestBody = {};

    searchRequestBody = {
      search: {
        cityCode: hotelSearch.cityCode,
        rooms: hotelSearch.rooms,
        hotelId: hotelSearch.hotelId,
        checkIn: hotelSearch.checkIn,
        checkOut: hotelSearch.checkOut,
        locale: locale,
        siteCode: self.siteCode,
        currencyCode: currencyCode,
        deviceType: self.deviceType,
        appType: self.appType,
        userLoggedIn: self.userLoggedIn
      }
    };

    if (self.searchId !== undefined) {
      searchRequestBody.search.id = self.searchId;
    }

    return searchRequestBody;
  },
};

module.exports = HotelDetailsClient;
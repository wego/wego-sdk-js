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
  self.onHotelRatesChanged = options.onHotelRatesChanged || function() {};
  self.onSearchCreated = options.onSearchCreated || function() {};

  self.poller = new Poller({
    delays: [0, 300, 600, 900, 2400, 3800, 5000, 6000],
    pollLimit: 7,
    callApi: function() {
      return Api.fetchHotelRates(self.getSearchRequestBody().search.hotelId, {
        searchId: self.searchId,
        currencyCode: self.currency.code,
        locale: self.locale,
      });
    },
    onSuccessResponse: function(response) {
      self.onHotelRatesChanged(response);
    },
  });
  self.reset();
};

HotelDetailsClient.prototype = {
  searchHotelRates: function(search, mainSearchId) {
    var self = this;
    self.search = search;

    if (mainSearchId !== undefined) {
      self.reset();
      self.searchId = mainSearchId;
      self.poller.start();
    } else {
      Api.searchHotel(self.getSearchRequestBody(), {
        currencyCode: self.currency.code,
        locale: self.locale,
      }).then(function (hotelSearch) {
        self.reset();
        self.searchId = hotelSearch.search.id;
        self.handleSearchResponse(hotelSearch);
        self.poller.start();
      });
    }
  },

  handleSearchResponse: function(response) {
    this.onSearchCreated(response.search);
  },

  reset: function() {
    this.poller.reset();
  },

  updateCurrency: function(currency) {
    this.currency = currency;
  },

  getSearchRequestBody: function() {
    var hotelSearch = this.search || {};
    var currency = this.currency || {};
    var currencyCode = currency.code;
    var locale = this.locale;

    return {
        'search': {
          'cityCode': hotelSearch.cityCode,
          'roomsCount': hotelSearch.roomsCount,
          'guestsCount': hotelSearch.guestsCount,
          'hotelId': hotelSearch.hotelId,
          'checkIn': hotelSearch.checkIn,
          'checkOut': hotelSearch.checkOut,
          'locale': locale,
          'siteCode': this.siteCode,
          'currencyCode': currencyCode,
          'deviceType': this.deviceType
        }
      };
  },
};

module.exports = HotelDetailsClient;
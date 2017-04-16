var HotelSearchMerger = require('./Merger');
var sorting = require('./sorting');
var filtering = require('./filtering');
var Api = require('../Api');
var Poller = require('../Poller');

var HotelSearchClient = function(options) {
  var self = this;
  options = options || {};
  this.currency  = options.currency || {};
  this.locale = options.locale;
  this.siteCode = options.siteCode;
  this.deviceType = options.deviceType || "DESKTOP";
  this.appType = options.appType;
  this.rateAmenityIds = options.rateAmenityIds || [];
  this.onProgressChanged = options.onProgressChanged || function() {};
  this.onHotelsChanged = options.onHotelsChanged || function() {};
  this.onTotalHotelsChanged = options.onTotalHotelsChanged || function() {};
  this.onDisplayedFilterChanged = options.onDisplayedFilterChanged || function() {};

  this.merger = new HotelSearchMerger();
  this.poller = new Poller({
    delays: [0, 300, 600, 900, 2400, 3800, 5000, 6000],
    pollLimit: 7,
    callApi: function() {
      return Api.searchHotels(self.getSearchRequestBody(), {
        currencyCode: self.currency.code,
        locale: self.locale,
      });
    },
    onSuccessResponse: function(response) {
      return self.handleSearchResponse(response);
    },
  });
  this.reset();
};

HotelSearchClient.prototype = {
  searchHotels: function(search) {
    this.search = search;
    this.reset();
    this.updateResult();
    this.poller.start();
  },

  handleSearchResponse: function(response) {
    this.mergeResponse(response);
    this.updateResult();
  },

  mergeResponse: function(response) {
    this.merger.mergeResponse(response);
    this.lastRatesCount = response.count;
    this.responseSearch = response.search;
  },

  reset: function() {
    this.poller.reset();
    this.merger.reset();
    this.responseSearch = {};
    this.lastRatesCount = 0;
  },

  updateSort: function(sort) {
    this.sort = sort;
    this.updateResult();
  },

  updateFilter: function(filter) {
    this.filter = filter;
    this.updateResult();
  },

  updateCurrency: function(currency) {
    this.currency = currency;
    this.merger.updateCurrency(currency);
    this.updateResult();
  },

  updateRateAmenityIds: function(rateAmenityIds) {
    this.rateAmenityIds = rateAmenityIds;
    this.reset();
    this.poller.reset();
    this.updateResult();
    this.poller.start();
  },

  updateResult: function() {
    var hotels = this.merger.getHotels();
    var filteredHotels = filtering.filterHotels(hotels, this.filter);
    var sortedHotels = sorting.sortHotels(filteredHotels, this.sort);
    this.onHotelsChanged(sortedHotels);
    this.onTotalHotelsChanged(hotels);
    this.onDisplayedFilterChanged(this.merger.getFilter());
    this.onProgressChanged(this.poller.getProgress());
  },

  getSearchRequestBody: function() {
    var search = this.search || {};
    var currency = this.currency || {};
    var currencyCode = currency.code;
    var locale = this.locale;

    return {
      search: {
        id: this.responseSearch.id,
        siteCode: this.siteCode,
        locale: locale,
        currencyCode: currencyCode,
        cityCode: search.cityCode,
        countryCode: search.countryCode,
        roomsCount: search.roomsCount,
        guestsCount: search.guestsCount,
        checkIn: search.checkIn,
        checkOut: search.checkOut,
        deviceType: this.deviceType,
        appType: this.appType,
      },
      rateAmenityIds: this.rateAmenityIds,
      offset: this.lastRatesCount,
    };
  },
};

module.exports = HotelSearchClient;
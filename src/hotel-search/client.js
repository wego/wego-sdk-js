var HotelSearchMerger = require('./Merger');
var sorting = require('./sorting');
var filtering = require('./filtering');
var Api = require('../Api');

var HotelSearchClient = function(options) {
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

  this.__delays = [0, 300, 600, 900, 2400, 3800, 5000, 6000];
  this.__progressStopAfter = 7;
  this.__merger = new HotelSearchMerger();
  this.reset();
};

HotelSearchClient.prototype = {
  searchHotels: function(search) {
    this.search = search;
    this.reset();
    this.updateResult();
    this._prepareFetch();
  },

  handleSearchResponse: function(response) {
    this.mergeResponse(response);
    this.updateResult();
    this._prepareFetch();
  },

  handleSearchError: function() {
    this._retry();
  },

  mergeResponse: function(response) {
    this.__merger.mergeResponse(response);
    this.__lastRatesCount = response.count;
    this.__responseSearch = response.search;
  },

  reset: function() {
    clearTimeout(this.__timer);
    if (this.__abortLastRequest) {
      this.__abortLastRequest();
    }
    this.__merger.reset();
    this.__responseSearch = {};
    this.__lastRatesCount = 0;
    this.__fetchCount = 0;
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
    this.__merger.updateCurrency(currency);
    this.updateResult();
  },

  updateRateAmenityIds: function(rateAmenityIds) {
    this.rateAmenityIds = rateAmenityIds;
    this.reset();
    this.updateResult();
    this._prepareFetch();
  },

  updateProgress: function() {
    var fetchCount = this.__fetchCount;
    var progressStopAfter = this.__progressStopAfter;
    var lastRatesCount = this.__lastRatesCount;

    var progress;
    if (fetchCount >= progressStopAfter || lastRatesCount >= 1000) {
      progress = 100;
    } else {
      progress = fetchCount / progressStopAfter * 50 + lastRatesCount / 1000 * 50;
    }

    this.onProgressChanged(progress);
  },

  updateResult: function() {
    var hotels = this.__merger.getHotels();
    var filteredHotels = filtering.filterHotels(hotels, this.filter);
    var sortedHotels = sorting.sortHotels(filteredHotels, this.sort);
    this.onHotelsChanged(sortedHotels);
    this.onTotalHotelsChanged(hotels);
    this.onDisplayedFilterChanged(this.__merger.getFilter());
    this.updateProgress();
  },

  _fetch: function() {
    this.__fetchCount++;
    this.__retryCount = 0;
    this._callApi();
  },

  _retry: function() {
    if (this.__retryCount < 3) {
      this.__retryCount++;
      this._callApi();
    }
  },

  _callApi: function() {
    var self = this;
    var aborted = false;
    this.__abortLastRequest = function() {
      aborted = true;
    };

    Api.searchHotels(this._getSearchRequestBody(), {
      currencyCode: this.currency.code,
      locale: this.locale,
    }).then(function(response) {
      if (!aborted) {
        self.handleSearchResponse(response);
      }
    }).catch(function() {
      self.handleSearchError();
    });
  },

  _prepareFetch: function() {
    var fetchCount = this.__fetchCount;
    var delays = this.__delays;
    var self = this;
    if (fetchCount < delays.length) {
      this.__timer = setTimeout(function() {
        self._fetch();
      }, delays[fetchCount]);
    }
  },

  _getSearchRequestBody: function() {
    var search = this.search || {};
    var currency = this.currency || {};
    var currencyCode = currency.code;
    var locale = this.locale;

    return {
      search: {
        id: this.__responseSearch.id,
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
      offset: this.__lastRatesCount,
    };
  },
};

module.exports = HotelSearchClient;
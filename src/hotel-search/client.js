var HotelSearchMerger = require("./Merger");
var sorting = require("./sorting");
var filtering = require("./filtering");
var dataUtils = require("./dataUtils");
var Api = require("../Api");
var Poller = require("../Poller");

var HotelSearchClient = function(options) {
  var self = this;
  options = options || {};
  this.currency = options.currency || {};
  this.locale = options.locale;
  this.siteCode = options.siteCode;
  this.deviceType = options.deviceType || "DESKTOP";
  this.appType = options.appType || "WEB_APP";
  this.userLoggedIn = options.userLoggedIn;
  this.rateAmenityIds = options.rateAmenityIds || [];
  this.selectedHotelIds = options.selectedHotelIds || [];
  this.onProgressChanged = options.onProgressChanged || function() {};
  this.onHotelsChanged = options.onHotelsChanged || function() {};
  this.onTotalHotelsChanged = options.onTotalHotelsChanged || function() {};
  this.onDisplayedFilterChanged =
    options.onDisplayedFilterChanged || function() {};
  this.onSearchCreated = options.onSearchCreated || function() {};

  var originDelays = [0, 300, 600, 900, 2400, 3800, 5000, 6000];
  var approximateTime = originDelays.reduce((a,b) => a+b);
  var timeout = 45000;
  var stepTime = 6000;
  var extendedDelays = originDelays.slice();
  while (approximateTime < timeout) {
    approximateTime += stepTime;
    extendedDelays.push(stepTime);
  }

  this.merger = new HotelSearchMerger();
  this.poller = new Poller({
    delays: extendedDelays,
    pollLimit: extendedDelays.length - 1,
    initCallApi: function() {
      return Api.searchHotels(self.getSearchRequestBody(), {
        currencyCode: self.currency.code,
        locale: self.locale
      });
    },
    callApi: function() {
      return Api.fetchHotels(self.responseSearch.id, self.fetchHotelsParams());
    },
    onSuccessResponse: function(response) {
      return self.handleSearchResponse(response);
    }
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
    if (response.done) {
      this.poller.stop();
    }
    this.mergeResponse(response); 
    this.updateResult();
    if (this.poller.pollCount === 1) this.onSearchCreated(response.search);
  },

  mergeResponse: function(response) {
    if (response.done) {
      this.merger.lastMergeResponse(response); 
    } else {
      this.merger.mergeResponse(response);  
    }
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
    var self = this,
      search = self.search || {},
      currency = self.currency || {},
      currencyCode = currency.code,
      locale = self.locale,
      searchParams,
      selectedHotelIds = dataUtils.trimArray(self.selectedHotelIds);

    searchParams = {
      search: {
        id: self.responseSearch.id,
        siteCode: self.siteCode,
        locale: locale,
        currencyCode: currencyCode,
        cityCode: search.cityCode,
        hotelId: search.hotelId,
        districtId: search.districtId,
        countryCode: search.countryCode,
        roomsCount: search.roomsCount,
        guestsCount: search.guestsCount,
        checkIn: search.checkIn,
        checkOut: search.checkOut,
        deviceType: self.deviceType,
        appType: self.appType,
        userLoggedIn: self.userLoggedIn
      },
      rateAmenityIds: self.rateAmenityIds,
      offset: self.lastRatesCount
    };

    if (!!selectedHotelIds.length && Array.isArray(selectedHotelIds)) {
      searchParams.selectedHotelIds = selectedHotelIds;
    }

    return searchParams;
  },

  fetchHotelsParams: function() {
    var params = {
      currencyCode: this.currency.code,
      locale: this.locale,
      offset: this.lastRatesCount || 0
    };

    var selectedHotelIds = dataUtils.trimArray(this.selectedHotelIds);
    if (!!selectedHotelIds.length && Array.isArray(selectedHotelIds)) {
      params.selectedHotelIds = selectedHotelIds;
    }
    return params;
  }
};

module.exports = HotelSearchClient;

var FlightSearchMerger = require('./Merger');
var sorting = require('./sorting');
var filtering = require('./filtering');
var Api = require('../Api');

var FlightSearchClient = function(options) {
  options = options || {};
  this.currency  = options.currency || {};
  this.locale = options.locale;
  this.siteCode = options.siteCode;
  this.paymentMethodIds = options.paymentMethodIds || [];
  this.providerTypes = options.providerTypes || [];
  this.onProgressChanged = options.onProgressChanged || function() {};
  this.onTripsChanged = options.onTripsChanged || function() {};
  this.onTotalTripsChanged = options.onTotalTripsChanged || function() {};
  this.onCheapestTripChanged = options.onCheapestTripChanged || function() {};
  this.onFastestTripChanged = options.onFastestTripChanged || function() {};
  this.onBestExperienceTripChanged = options.onBestExperienceTripChanged || function() {};
  this.onDisplayedFilterChanged = options.onDisplayedFilterChanged || function() {};
  this.onSearchCreated = options.onSearchCreated || function() {};

  this.__delays = [0, 1000, 3000, 4000, 5000, 6000, 6000, 6000];
  this.__progressStopAfter = 7;
  this.__merger = new FlightSearchMerger();
  this.reset();
};

FlightSearchClient.prototype = {
  searchTrips: function(search) {
    this.search = search;
    this.reset();
    this.updateProgress();
    this.updateResult();
    this.updateDisplayedFilter();
    this._prepareFetch();
  },

  handleSearchResponse: function(response) {
    this.mergeResponse(response);
    this.updateResult();
    this.updateDisplayedFilter();
    this.updateProgress();
    if (this.__fetchCount === 1) this.onSearchCreated(response.search);
    this._prepareFetch();
  },

  handleSearchError: function() {
    this._retry();
  },

  mergeResponse: function(response) {
    this.__merger.mergeResponse(response);
    this.__processedFaresCount = response.count;
    this.__responseSearch = response.search;
  },

  reset: function() {
    clearTimeout(this.__timer);
    if (this.__abortLastRequest) {
      this.__abortLastRequest();
    }
    this.__merger.reset();
    this.__responseSearch = {};
    this.__processedFaresCount = 0;
    this.__fetchCount = 0;
  },

  updatePaymentMethodIds: function(paymentMethodIds) {
    this.paymentMethodIds = paymentMethodIds;
    this.reset();
    this._prepareFetch();
  },

  updateProviderTypes: function(providerTypes) {
    this.providerTypes = providerTypes;
    this.reset();
    this._prepareFetch();
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
    this.updateDisplayedFilter();
  },

  updateProgress: function() {
    var fetchCount = this.__fetchCount;
    var progressStopAfter = this.__progressStopAfter;
    var processedFaresCount = this.__processedFaresCount;

    var progress;
    if (fetchCount >= progressStopAfter || processedFaresCount >= 1000) {
      progress = 100;
    } else {
      progress = fetchCount / progressStopAfter * 50 + processedFaresCount / 1000 * 50;
    }

    this.onProgressChanged(progress);
  },

  updateResult: function() {
    var trips = this.__merger.getTrips();
    var filteredTrips = filtering.filterTrips(trips, this.filter);
    var sortedTrips = sorting.sortTrips(filteredTrips, this.sort);

    this.onTripsChanged(sortedTrips);
    this.onCheapestTripChanged(sorting.getCheapestTrip(filteredTrips));
    this.onFastestTripChanged(sorting.getFastestTrip(filteredTrips));
    this.onBestExperienceTripChanged(sorting.getBestExperienceTrip(filteredTrips));
    this.onTotalTripsChanged(trips);
  },

  updateDisplayedFilter: function() {
    this.onDisplayedFilterChanged(this.__merger.getFilter());
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

    Api.searchTrips(this._getSearchRequestBody(), {
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
    var legs = search.legs || [];
    var responseSearch = this.__responseSearch || {};
    return {
      search: {
        id: responseSearch.id,
        cabin: search.cabin,
        adultsCount: search.adultsCount,
        childrenCount: search.childrenCount,
        infantsCount: search.infantsCount,
        siteCode: this.siteCode,
        currencyCode: this.currency.code,
        locale: this.locale,
        legs: legs.map(function(leg) {
          return {
            departureCityCode: leg.departureCityCode,
            departureAirportCode: leg.departureAirportCode,
            arrivalCityCode: leg.arrivalCityCode,
            arrivalAirportCode: leg.arrivalAirportCode,
            outboundDate: leg.outboundDate,
          };
        }),
      },
      offset: this.__processedFaresCount,
      paymentMethodIds: this.paymentMethodIds,
      providerTypes: this.providerTypes,
    }
  },
};

module.exports = FlightSearchClient;
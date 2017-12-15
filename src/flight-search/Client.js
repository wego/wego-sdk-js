var FlightSearchMerger = require("./Merger");
var sorting = require("./sorting");
var filtering = require("./filtering");
var Api = require("../Api");
var Poller = require("../Poller");

var FlightSearchClient = function(options) {
  var self = this;
  options = options || {};
  this.currency = options.currency || {};
  this.locale = options.locale;
  this.siteCode = options.siteCode;
  this.deviceType = options.deviceType || "DESKTOP";
  this.appType = options.appType || "WEB_APP";
  this.userLoggedIn = options.userLoggedIn;
  this.paymentMethodIds = options.paymentMethodIds || [];
  this.providerTypes = options.providerTypes || [];
  this.onProgressChanged = options.onProgressChanged || function() {};
  this.onTripsChanged = options.onTripsChanged || function() {};
  this.onTotalTripsChanged = options.onTotalTripsChanged || function() {};
  this.onCheapestTripChanged = options.onCheapestTripChanged || function() {};
  this.onFastestTripChanged = options.onFastestTripChanged || function() {};
  this.onBestExperienceTripChanged =
    options.onBestExperienceTripChanged || function() {};
  this.onDisplayedFilterChanged =
    options.onDisplayedFilterChanged || function() {};
  this.onSearchCreated = options.onSearchCreated || function() {};

  this.merger = new FlightSearchMerger();

  this.poller = new Poller({
    delays: [0, 1000, 3000, 4000, 5000, 6000, 6000, 6000],
    pollLimit: 7,
    initCallApi: function() {
      return Api.searchTrips(self.getSearchRequestBody(), {
        currencyCode: self.currency.code,
        locale: self.locale
      });
    },
    callApi: function() {
      return Api.fetchTrips(self.responseSearch.id, self.fetchTripsParams());
    },
    onSuccessResponse: function(response) {
      return self.handleSearchResponse(response);
    }
  });
  this.reset();
};

FlightSearchClient.prototype = {
  searchTrips: function(search) {
    this.search = search;
    this.reset();
    this.updateResult();
    this.poller.start();
  },

  handleSearchResponse: function(response) {
    this.mergeResponse(response);
    this.updateResult();
    if (this.poller.pollCount === 1) this.onSearchCreated(response.search);
  },

  mergeResponse: function(response) {
    this.merger.mergeResponse(response);
    this.processedFaresCount = response.count;
    this.responseSearch = response.search;
  },

  reset: function() {
    this.poller.reset();
    this.merger.reset();
    this.responseSearch = {};
    this.processedFaresCount = 0;
  },

  updatePaymentMethodIds: function(paymentMethodIds) {
    this.paymentMethodIds = paymentMethodIds;
    this.reset();
    this.updateResult();
    this.poller.start();
  },

  updateProviderTypes: function(providerTypes) {
    this.providerTypes = providerTypes;
    this.reset();
    this.updateResult();
    this.poller.start();
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

  updateResult: function() {
    var trips = this.merger.getTrips();
    var filteredTrips = filtering.filterTrips(trips, this.filter);
    var sortedTrips = sorting.sortTrips(filteredTrips, this.sort);

    this.onTripsChanged(sortedTrips);
    this.onCheapestTripChanged(sorting.getCheapestTrip(filteredTrips));
    this.onFastestTripChanged(sorting.getFastestTrip(filteredTrips));
    this.onBestExperienceTripChanged(
      sorting.getBestExperienceTrip(filteredTrips)
    );
    this.onTotalTripsChanged(trips);
    this.onDisplayedFilterChanged(this.merger.getFilter());
    this.onProgressChanged(this.poller.getProgress());
  },

  getSearchRequestBody: function() {
    var search = this.search || {};
    var legs = search.legs || [];
    return {
      search: {
        id: this.responseSearch.id,
        cabin: search.cabin,
        deviceType: this.deviceType,
        appType: this.appType,
        userLoggedIn: this.userLoggedIn,
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
            outboundDate: leg.outboundDate
          };
        })
      },
      offset: this.processedFaresCount,
      paymentMethodIds: this.paymentMethodIds,
      providerTypes: this.providerTypes
    };
  },

  fetchTripsParams: function() {
    var self = this;
    return {
      currencyCode: this.currency.code,
      locale: this.locale,
      paymentMethodIds: this.paymentMethodIds || [],
      offset: this.processedFaresCount
    };
  }
};

module.exports = FlightSearchClient;

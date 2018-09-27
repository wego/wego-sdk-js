var FlightSearchMerger = require("./Merger");
var sorting = require("./sorting");
var filtering = require("./filtering");
var Api = require("../Api");
var Poller = require("../Poller");

var FlightSearchClient = function(options) {
  var self = this;
  options = options || {};
  self.currency = options.currency || {};
  self.locale = options.locale;
  self.siteCode = options.siteCode;
  self.deviceType = options.deviceType || "DESKTOP";
  self.appType = options.appType || "WEB_APP";
  self.userLoggedIn = options.userLoggedIn;
  self.paymentMethodIds = options.paymentMethodIds || [];
  self.providerTypes = options.providerTypes || [];
  self.onProgressChanged = options.onProgressChanged || function() {};
  self.onTripsChanged = options.onTripsChanged || function() {};
  self.onTotalTripsChanged = options.onTotalTripsChanged || function() {};
  self.onCheapestTripChanged = options.onCheapestTripChanged || function() {};
  self.onFastestTripChanged = options.onFastestTripChanged || function() {};
  self.onBestExperienceTripChanged =
    options.onBestExperienceTripChanged || function() {};
  self.onDisplayedFilterChanged =
    options.onDisplayedFilterChanged || function() {};
  self.onSearchCreated = options.onSearchCreated || function() {};

  self.merger = new FlightSearchMerger();

  self.poller = new Poller({
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
  self.reset();
};

FlightSearchClient.prototype = {
  searchTrips: function(search) {
    var self = this;
    self.search = search;
    self.reset();

    // determine whether multi city 
    var legs = search.legs;
    var multiCity = legs.length > 2;        
    // 2 legs can still be multi city
    if( legs.length === 2 ) {
      var p = ['departureCityCode', 'departureAirportCode', 'arrivalCityCode', 'arrivalAirportCode'];
      let sameLocations = (a, b) => a === b || (a[p[0]] === b[p[2]] && a[p[1]] === b[p[3]]);
      if( !sameLocations(legs[0], legs[1]) ) multiCity = true;
    }
    self.multiCity = multiCity;
    self.merger.multiCity = multiCity;

    var poller = self.poller;
    poller.delays = (multiCity ? 
                      [0, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6] : 
                      [0, 1, 3, 4, 5, 6, 6, 6]
                    ).map(v => v*1000);
    poller.pollLimit = poller.delays.length - 1;

    self.updateResult();
    poller.start();
  },

  handleSearchResponse: function(response) {
    this.mergeResponse(response);
    this.updateResult();
    if (this.poller.pollCount === 1) this.onSearchCreated(response.search);
  },

  mergeResponse: function(response) {
    var self = this, merger = self.merger;
    merger.mergeResponse(response);
    self.processedFaresCount = response.count;
    self.responseSearch = response.search;
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
    var self = this, trips = self.merger.getTrips();

    if (Object.keys(self.merger.getLegConditions()).length !== 0) {
      filtering.passLegConditions(self.merger.getLegConditions());
    }

    if (Object.keys(self.merger.getFareConditions()).length !== 0) {
      filtering.passFareConditions(self.merger.getFareConditions());
    }

    var filteredTrips = filtering.filterTrips(trips, self.filter, self.multiCity);
    var sortedTrips = sorting.sortTrips(filteredTrips, self.sort);

    self.onTripsChanged(sortedTrips);
    self.onCheapestTripChanged(sorting.getCheapestTrip(filteredTrips));
    self.onFastestTripChanged(sorting.getFastestTrip(filteredTrips));
    self.onBestExperienceTripChanged(
      sorting.getBestExperienceTrip(filteredTrips)
    );
    self.onTotalTripsChanged(trips);
    self.onDisplayedFilterChanged(self.merger.getFilter());
    self.onProgressChanged(self.poller.getProgress());
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
      currencyCode: self.currency.code,
      locale: self.locale,
      paymentMethodIds: self.paymentMethodIds || [],
      offset: self.processedFaresCount
    };
  }
};

module.exports = FlightSearchClient;

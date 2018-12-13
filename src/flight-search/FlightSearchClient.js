const FlightSearchMerger = require("./Merger");
const sorting = require("./sorting");
const filtering = require("./filtering");
const Api = require("../Api");
const Poller = require("../Poller");

class FlightSearchClient {
  constructor(flightSearchEndpointUrl, options) {
    let self = this;
    options = options || {};
    self.currency = options.currency || {};
    self.locale = options.locale;
    self.siteCode = options.siteCode;
    self.deviceType = options.deviceType || "DESKTOP";
    self.appType = options.appType || "WEB_APP";
    self.userLoggedIn = options.userLoggedIn;
    self.paymentMethodIds = options.paymentMethodIds || [];
    self.providerTypes = options.providerTypes || [];
    self.onProgressChanged = options.onProgressChanged || function () { };
    self.onTripsChanged = options.onTripsChanged || function () { };
    self.onTotalTripsChanged = options.onTotalTripsChanged || function () { };
    self.onCheapestTripChanged = options.onCheapestTripChanged || function () { };
    self.onFastestTripChanged = options.onFastestTripChanged || function () { };
    self.onBestExperienceTripChanged = options.onBestExperienceTripChanged || function () { };
    self.onDisplayedFilterChanged = options.onDisplayedFilterChanged || function () { };
    self.onSearchCreated = options.onSearchCreated || function () { };
    self.requestHeaders = options.requestHeaders;

    self.merger = new FlightSearchMerger();

    self.poller = new Poller({
      initCallApi: () => {
        return Api.searchTrips(flightSearchEndpointUrl, self.getSearchRequestBody(), { currencyCode: self.currency.code, locale: self.locale }, self.requestHeaders);
      },
      callApi: () => {
        return Api.fetchTrips(flightSearchEndpointUrl, self.responseSearch.id, self.fetchTripsParams(), self.requestHeaders);
      },
      onSuccessResponse: response => {
        return self.handleSearchResponse(response);
      }
    });
    self.reset();
  }

  searchTrips(search) {
    let self = this;
    self.search = search;
    self.reset();

    // determine whether multi city 
    let legs = search.legs;
    let multiCity = legs.length > 2;
    // 2 legs can still be multi city
    if (legs.length === 2) {
      let p = ['departureCityCode', 'departureAirportCode', 'arrivalCityCode', 'arrivalAirportCode'];
      // compare leg 1's departure codes vs leg 2's arrival codes
      let sameLocations = (a, b) => a === b ||
        (a[p[0]] === b[p[2]] && a[p[1]] === b[p[3]] && a[p[2]] === b[p[0]] && a[p[3]] === b[p[1]]);
      if (!sameLocations(legs[0], legs[1])) multiCity = true;
    }
    self.multiCity = multiCity;
    self.merger.multiCity = multiCity;

    let poller = self.poller;
    poller.delays = (multiCity ?
      [0, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 5, 6] :
      [0, 1, 3, 4, 5, 6, 6, 6]
    ).map(v => v * 1000);
    poller.pollLimit = poller.delays.length - 1;

    self.updateResult();
    poller.start();
  }

  handleSearchResponse(response) {
    let self = this;
    self.mergeResponse(response);
    self.updateResult();
    if (self.poller.pollCount === 1) self.onSearchCreated(response.search);
  }

  mergeResponse(response) {
    let self = this;
    let merger = self.merger;

    merger.mergeResponse(response);
    self.processedFaresCount = response.count;
    self.responseSearch = response.search;
  }

  reset() {
    let self = this;
    self.poller.reset();
    self.merger.reset();
    self.responseSearch = {};
    self.processedFaresCount = 0;
  }

  updatePaymentMethodIds(paymentMethodIds) {
    let self = this;
    self.paymentMethodIds = paymentMethodIds;
    self.reset();
    self.updateResult();
    self.poller.start();
  }

  updateProviderTypes(providerTypes) {
    let self = this;
    self.providerTypes = providerTypes;
    self.reset();
    self.updateResult();
    self.poller.start();
  }

  updateSort(sort) {
    let self = this;
    self.sort = sort;
    self.updateResult();
  }

  updateFilter(filter) {
    let self = this;
    self.filter = filter;
    self.updateResult();
  }

  updateCurrency(currency) {
    let self = this;
    self.currency = currency;
    self.merger.updateCurrency(currency);
    self.updateResult();
  }

  updateResult() {
    let self = this;
    let trips = self.merger.getTrips();

    if (Object.keys(self.merger.getLegConditions()).length !== 0) {
      filtering.passLegConditions(self.merger.getLegConditions());
    }

    if (Object.keys(self.merger.getFareConditions()).length !== 0) {
      filtering.passFareConditions(self.merger.getFareConditions());
    }

    let filteredTrips = filtering.filterTrips(trips, self.filter, self.multiCity);
    let sortedTrips = sorting.sortTrips(filteredTrips, self.sort);

    self.onTripsChanged(sortedTrips);
    self.onCheapestTripChanged(sorting.getCheapestTrip(filteredTrips));
    self.onFastestTripChanged(sorting.getFastestTrip(filteredTrips));
    self.onBestExperienceTripChanged(
      sorting.getBestExperienceTrip(filteredTrips)
    );
    self.onTotalTripsChanged(trips);
    self.onDisplayedFilterChanged(self.merger.getFilter());
    self.onProgressChanged(self.poller.getProgress());
  }

  getSearchRequestBody() {
    let self = this;
    let search = self.search || {};
    let legs = search.legs || [];
    return {
      search: {
        id: self.responseSearch.id,
        cabin: search.cabin,
        deviceType: self.deviceType,
        appType: self.appType,
        userLoggedIn: self.userLoggedIn,
        adultsCount: search.adultsCount,
        childrenCount: search.childrenCount,
        infantsCount: search.infantsCount,
        siteCode: self.siteCode,
        currencyCode: self.currency.code,
        locale: self.locale,
        legs: legs.map(leg => {
          return {
            departureRegionId: leg.departureRegionId,
            departureCityCode: leg.departureCityCode,
            departureAirportCode: leg.departureAirportCode,
            arrivalRegionId: leg.arrivalRegionId,
            arrivalCityCode: leg.arrivalCityCode,
            arrivalAirportCode: leg.arrivalAirportCode,
            outboundDate: leg.outboundDate
          };
        })
      },
      offset: self.processedFaresCount,
      paymentMethodIds: self.paymentMethodIds,
      providerTypes: self.providerTypes
    };
  }

  fetchTripsParams() {
    let self = this;
    return {
      currencyCode: self.currency.code,
      locale: self.locale,
      paymentMethodIds: self.paymentMethodIds || [],
      offset: self.processedFaresCount
    };
  }
}

module.exports = FlightSearchClient;
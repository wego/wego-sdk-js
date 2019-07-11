const HotelSearchMerger = require("./Merger");
const sorting = require("./sorting");
const filtering = require("./filtering");
const dataUtils = require("./dataUtils");
const Api = require("../Api");
const Poller = require("../Poller");

const DELAYS = [0, 300, 600, 900, 2400, 3800, 5000, 6000];

class HotelSearchClient {
  constructor(hotelSearchEndpointUrl, options) {
    let self = this;
    options = options || {};
    self.currency = options.currency || {};
    self.locale = options.locale;
    self.siteCode = options.siteCode;
    self.deviceType = options.deviceType || "DESKTOP";
    self.appType = options.appType || "WEB_APP";
    self.userLoggedIn = options.userLoggedIn;
    self.rateAmenityIds = options.rateAmenityIds || [];
    self.selectedHotelIds = options.selectedHotelIds || [];
    self.onProgressChanged = options.onProgressChanged || function () { };
    self.onHotelsChanged = options.onHotelsChanged || function () { };
    self.onTotalHotelsChanged = options.onTotalHotelsChanged || function () { };
    self.onDisplayedFilterChanged = options.onDisplayedFilterChanged || function () { };
    self.onSearchCreated = options.onSearchCreated || function () { };
    self.onDestinationInfoChanged = options.onDestinationInfoChanged || function () { };
    self.requestHeaders = options.requestHeaders;

    self.merger = new HotelSearchMerger();
    self.poller = new Poller({
      delays: DELAYS,
      pollLimit: DELAYS.length - 1,
      initCallApi: () => {
        const params = { currencyCode: self.currency.code, locale: self.locale, amountType: 'NIGHTLY' };

        return Api.searchHotels(hotelSearchEndpointUrl, self.getSearchRequestBody(), params, self.requestHeaders);
      },
      callApi: () => {
        return Api.fetchHotels(hotelSearchEndpointUrl, self.responseSearch.id, self.fetchHotelsParams(), self.requestHeaders);
      },
      onSuccessResponse: (response) => {
        return self.handleSearchResponse(response);
      }
    });
    self.reset();
  }

  searchHotels(search) {
    let self = this;
    self.search = search;
    self.reset();
    self.updateResult();
    self.poller.start();
  }

  handleSearchResponse(response) {
    let self = this;
    if (response.done) {
      self.poller.stop();
    }
    self.mergeResponse(response);
    self.updateResult();
    if (self.poller.pollCount === 1) self.onSearchCreated(response.search);
  }

  mergeResponse(response) {
    let self = this;
    let isSearchEnd = response.done || self.poller.isLastPolling()
    self.merger.mergeResponse(response, isSearchEnd);
    self.lastRatesCount = response.count;
    self.responseSearch = response.search;
    dataUtils.prepareResponseSearch(self.responseSearch, self.merger.getStaticData());
  }

  reset() {
    let self = this;
    self.poller.reset();
    self.merger.reset();
    self.responseSearch = {};
    self.lastRatesCount = 0;
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

  updateRateAmenityIds(rateAmenityIds) {
    let self = this;
    self.rateAmenityIds = rateAmenityIds;
    self.reset();
    self.poller.reset();
    self.updateResult();
    self.poller.start();
  }

  updateResult() {
    let self = this;
    let hotels = self.merger.getHotels();
    let filteredHotels = filtering.filterHotels(hotels, self.filter);
    let sortedHotels = sorting.sortHotels(filteredHotels, self.sort);
    self.onHotelsChanged(sortedHotels);
    self.onTotalHotelsChanged(hotels);
    self.onDisplayedFilterChanged(self.merger.getFilter());
    self.onProgressChanged(self.poller.getProgress());
    self.onDestinationInfoChanged(self.merger.getStaticData().destinationInfo);
  }

  getSearchRequestBody() {
    let self = this;
    let search = self.search || {};
    let currency = self.currency || {};
    let currencyCode = currency.code;
    let locale = self.locale;
    let searchParams;
    let selectedHotelIds = dataUtils.trimArray(self.selectedHotelIds);

    searchParams = {
      search: {
        id: self.responseSearch.id,
        siteCode: self.siteCode,
        locale: locale,
        currencyCode: currencyCode,
        cityCode: search.cityCode,
        hotelId: search.hotelId,
        districtId: search.districtId,
        regionId: search.regionId,
        countryCode: search.countryCode,
        rooms: search.rooms,
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
  }

  fetchHotelsParams() {
    let self = this;
    const params = {
      currencyCode: self.currency.code,
      locale: self.locale,
      offset: self.lastRatesCount || 0,
      amountType: 'NIGHTLY'
    };

    let trackingParams = self.trackingParams || {};
    for (let key in trackingParams) {
      if (trackingParams.hasOwnProperty(key)) {
        params[key] = trackingParams[key];
      }
    }

    let selectedHotelIds = dataUtils.trimArray(self.selectedHotelIds);
    if (!!selectedHotelIds.length && Array.isArray(selectedHotelIds)) {
      params.selectedHotelIds = selectedHotelIds;
    }

    if (self.poller.isLastPolling()) {
      params.isLastPolling = true;
    }
    return params;
  }
}

module.exports = HotelSearchClient;
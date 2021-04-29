const HotelSearchMerger = require("./Merger");
const sorting = require("./sorting");
const filtering = require("./filtering");
const dataUtils = require("./dataUtils");
const Api = require("../Api");
const Poller = require("../Poller");

const DELAYS = [0, 300, 600, 900, 2400, 3800, 5000, 6000, 6000, 6000];

class HotelSearchClient {
  constructor(hotelSearchEndpointUrl, options) {
    let self = this;
    options = options || {};
    self.currency = options.currency || {};
    self.locale = options.locale;
    self.siteCode = options.siteCode;
    self.deviceType = options.deviceType || "DESKTOP";
    self.appType = options.appType || "WEB_APP";
    self.clientId = options.clientId;
    self.userLoggedIn = options.userLoggedIn;
    self.rateAmenityIds = options.rateAmenityIds || [];
    self.selectedHotelIds = options.selectedHotelIds || [];
    self.onProgressChanged = options.onProgressChanged || function () { };
    self.onHotelsChanged = options.onHotelsChanged || function () { };
    self.onTotalHotelsChanged = options.onTotalHotelsChanged || function () { };
    self.onDisplayedFilterChanged = options.onDisplayedFilterChanged || function () { };
    self.onProvidersChanged = options.onProvidersChanged || function () { };
    self.onSearchCreated = options.onSearchCreated || function () { };
    self.onDestinationInfoChanged = options.onDestinationInfoChanged || function () { };
    self.requestHeaders = options.requestHeaders;
    self.shortlistedHotelIds = options.shortlistedHotelIds || [];
    self.onGroupSearchChanged = options.onGroupSearchChanged || function () { };
    self.extraSearchRequestBody = options.extraSearchRequestBody;

    self.merger = new HotelSearchMerger();
    self.poller = new Poller({
      delays: DELAYS,
      pollLimit: DELAYS.length - 1,
      initCallApi: () => {
        const params = {
          currencyCode: self.currency.code,
          locale: self.locale,
          clientId: self.clientId,
          amountType: 'NIGHTLY'
        };

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
    self.onGroupSearchChanged(response.groupSearch);
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
    let sortedHotels = sorting.sortHotels(filteredHotels, self.sort, self.filter);
    self.onHotelsChanged(sortedHotels);
    self.onTotalHotelsChanged(hotels);
    self.onDisplayedFilterChanged(self.merger.getFilter());
    self.onProgressChanged(self.poller.getProgress());
    self.onDestinationInfoChanged(self.merger.getStaticData().destinationInfo);
    self.onProvidersChanged(self.merger.getProviders());
  }

  getSearchRequestBody() {
    const self = this;
    const search = self.search || {};
    const currency = self.currency || {};
    const currencyCode = currency.code;
    const locale = self.locale;
    const extraSearchRequestBody = self.extraSearchRequestBody || {};
    const selectedHotelIds = dataUtils.trimArray(self.selectedHotelIds);
    const shortlistedHotelIds = self.shortlistedHotelIds;

    const searchParams = {
      search: {
        ...extraSearchRequestBody,
        appType: self.appType,
        checkIn: search.checkIn,
        checkOut: search.checkOut,
        cityCode: search.cityCode,
        countryCode: search.countryCode,
        currencyCode: currencyCode,
        deviceType: self.deviceType,
        districtId: search.districtId,
        hotelId: search.hotelId,
        id: self.responseSearch.id,
        locale: locale,
        regionId: search.regionId,
        rooms: search.rooms,
        siteCode: self.siteCode,
        userLoggedIn: self.userLoggedIn,
      },
      includeDirect: true, // to show Book on Wego rates
      rateAmenityIds: self.rateAmenityIds,
      offset: self.lastRatesCount
    };

    if (!!selectedHotelIds.length && Array.isArray(selectedHotelIds)) {
      searchParams.selectedHotelIds = selectedHotelIds;
    }

    if (!!shortlistedHotelIds.length && Array.isArray(shortlistedHotelIds)) {
      searchParams.shortlistedHotelIds = shortlistedHotelIds;
    }

    return searchParams;
  }

  fetchHotelsParams() {
    let self = this;
    const params = {
      currencyCode: self.currency.code,
      locale: self.locale,
      offset: self.lastRatesCount || 0,
      amountType: 'NIGHTLY',
      clientId: self.clientId,
      moreRates: true
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

    params.shortlistedHotelIds = self.shortlistedHotelIds;

    return params;
  }
}

module.exports = HotelSearchClient;

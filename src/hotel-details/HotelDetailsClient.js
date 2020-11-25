const Api = require('../Api');
const Poller = require('../Poller');

const DELAYS = [0, 300, 600, 900, 2400, 3800, 5000, 6000];

class HotelDetailsClient {
  constructor(hotelDetailsEndpointUrl, options) {
    let self = this;
    options = options || {};
    self.currency = options.currency || {};
    self.locale = options.locale;
    self.searchId = options.searchId;
    self.siteCode = options.siteCode;
    self.deviceType = options.deviceType || "DESKTOP";
    self.appType = options.appType || "WEB_APP";
    self.clientId = options.clientId;
    self.userLoggedIn = options.userLoggedIn;
    self.onProgressChanged = options.onProgressChanged || function () { };
    self.onHotelRatesChanged = options.onHotelRatesChanged || function () { };
    self.onSearchCreated = options.onSearchCreated || function () { };
    self.requestHeaders = options.requestHeaders;
    self.similarHotels = options.similarHotels || {};
    self.hotelDetailsEndpointUrl = hotelDetailsEndpointUrl;

    self.poller = new Poller({
      delays: DELAYS,
      pollLimit: 7,
      callApi: () => {
        const params = { currencyCode: self.currency.code, locale: self.locale, clientId: self.clientId, amountType: 'NIGHTLY', includeDirect: true };
        let trackingParams = self.trackingParams || {};

        for (let key in trackingParams) {
          if (trackingParams.hasOwnProperty(key)) {
            params[key] = trackingParams[key];
          }
        }

        if (self.similarHotels) {
          params.similarHotelLimit = self.similarHotels.limit;
        }

        if (self.searchId) {
          params.searchId = self.searchId;
        }

        return Api.fetchHotelRates(self.search.hotelId, params);
      },
      onSuccessResponse: response => {
        return self.handleSearchResponse(response);
      },
    });
    self.reset();
  }

  searchHotelRates(search, mainSearchId) {
    let self = this;
    self.search = search;
    self.searchId = undefined;

    if (mainSearchId !== undefined) {
      self.reset();
      self.onProgressChanged(self.poller.getProgress());
      self.searchId = mainSearchId;
      self.poller.start();
    } else {
      const params = {
        currencyCode: self.currency.code,
        locale: self.locale,
        clientId: self.clientId,
        amountType: 'NIGHTLY'
      };

      Api.searchHotel(self.hotelDetailsEndpointUrl, self.getSearchRequestBody(), params, self.requestHeaders)
        .then(hotelSearch => {
          self.reset();
          self.onProgressChanged(self.poller.getProgress());
          self.searchId = hotelSearch.search.id;
          self.onSearchCreated(hotelSearch.search);
          self.poller.start();
        });
    }
  }

  handleSearchResponse(response) {
    let self = this;

    self.onProgressChanged(self.poller.getProgress());
    self.onHotelRatesChanged(response);
  }

  reset() {
    this.poller.reset();
  }

  updateCurrency(currency) {
    this.currency = currency;
  }

  getSearchRequestBody() {
    let self = this
    let hotelSearch = self.search || {};
    let currency = self.currency || {};
    let currencyCode = currency.code;
    let locale = self.locale;
    let searchRequestBody = {};

    searchRequestBody = {
      search: {
        cityCode: hotelSearch.cityCode,
        rooms: hotelSearch.rooms,
        hotelId: hotelSearch.hotelId,
        checkIn: hotelSearch.checkIn,
        checkOut: hotelSearch.checkOut,
        locale: locale,
        siteCode: self.siteCode,
        currencyCode: currencyCode,
        deviceType: self.deviceType,
        appType: self.appType,
        userLoggedIn: self.userLoggedIn
      },
      includeDirect: true
    };

    if (self.searchId !== undefined) {
      searchRequestBody.search.id = self.searchId;
    }

    if (self.similarHotels != null) {
      searchRequestBody.similarHotels = self.similarHotels;
    }

    return searchRequestBody;
  }
}

module.exports = HotelDetailsClient;

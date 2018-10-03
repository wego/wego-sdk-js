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
    self.userLoggedIn = options.userLoggedIn;
    self.onProgressChanged = options.onProgressChanged || function () { };
    self.onHotelRatesChanged = options.onHotelRatesChanged || function () { };
    self.onSearchCreated = options.onSearchCreated || function () { };
    self.requestHeaders = options.requestHeaders;
    self.hotelDetailsEndpointUrl = hotelDetailsEndpointUrl;

    self.poller = new Poller({
      delays: DELAYS,
      pollLimit: 7,
      callApi: () => {
        let params = { currencyCode: self.currency.code, locale: self.locale };
        let trackingParams = self.trackingParams || {};

        for (let key in trackingParams) {
          if (trackingParams.hasOwnProperty(key)) {
            params[key] = trackingParams[key];
          }
        }
        return Api.searchHotel(self.hotelDetailsEndpointUrl, self.getSearchRequestBody(), params, self.requestHeaders);
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
      let params = { currencyCode: self.currency.code, locale: self.locale };

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
      }
    };

    if (self.searchId !== undefined) {
      searchRequestBody.search.id = self.searchId;
    }
    return searchRequestBody;
  }
}

module.exports = HotelDetailsClient;
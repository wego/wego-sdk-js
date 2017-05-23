/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var utils = {
  cloneObject: function(obj) {
    var clonedObj = {};
    for (var key in obj) {
      clonedObj[key] = obj[key];
    }
    return clonedObj;
  },

  cloneArray: function(arr) {
    var clonedArr = [];
    arr.forEach(function(item) {
      clonedArr.push(item);
    });
    return clonedArr;
  },

  mapValues: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  },

  compare: function(item1, item2, propertyGetter, order) {
    var val1 = propertyGetter(item1);
    var val2 = propertyGetter(item2);
    if (val1 === val2) return 0;
    if (val1 === null || val1 === undefined) return 1;
    if (val2 === null || val2 === undefined) return -1;
    return (val1 > val2) === (order === 'ASC') ? 1 : -1;
  },

  filterByKey: function(key, filterMap) {
    return !filterMap || filterMap[key];
  },

  filterByAllKeys: function(keys, filterMap) {
    if (!filterMap) return true;
    for (var i = 0; i < keys.length; i++) {
      if (!filterMap[keys[i]]) return false;
    }
    return true;
  },

  filterBySomeKeys: function(map, filterKeys) {
    if (!filterKeys || filterKeys.length === 0) return true;
    for (var i = 0; i < filterKeys.length; i++) {
      if (map[filterKeys[i]]) return true;
    }
    return false;
  },

  filterByContainAllKeys: function(keyMap, filterKeys) {
    if (!filterKeys) return true;
    for (var i = 0; i < filterKeys.length; i++) {
      if (!keyMap[filterKeys[i]]) return false;
    }
    return true;
  },

  filterByTextMatching: function(text, query) {
    if (!query) return true;
    return this.stripAccents(text).toLowerCase().indexOf(this.stripAccents(query).toLowerCase()) > -1;
  },

  filterByRange: function(value, range) {
    if (!range) return true;
    return range.min <= value && value <= range.max;
  },

  arrayToMap: function(items) {
    if (!items || items.length === 0) return null;
    var map = {};
    items.forEach(function(item) {
      map[item] = true;
    });
    return map;
  },

  stripAccents: (function () {
    var inChars = 'àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ';
    var outChars = 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY';
    var charsRgx = new RegExp('[' + inChars + ']', 'g');
    var dictionary = {};

    function lookup(key) {
      return dictionary[key] || key;
    }

    for (var i = 0; i < inChars.length; i++) {
      dictionary[inChars[i]] = outChars[i];
    }

    return function (text) {
      return text.replace(charsRgx, lookup);
    }
  })(),
};

module.exports = utils;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

var Api = {
  __host: {
    staging: {
      v2: 'https://srv.wegostaging.com/v2',
      v1: 'https://srv.wego.com'
    },
    production: {
      v2: 'https://srv.wego.com/v2',
      v1: 'https://srv.wego.com'
    }
  },

  setEnvironment: function(env) {
    this.env = env;
  },

  getEnvironment: function() {
    return this.env || Wego.ENV || 'staging';
  },

  searchTrips: function(requestBody, query) {
    var uri = this.__host[this.getEnvironment()].v2 + '/metasearch/flights/searches';
    return this.post(requestBody, uri, query);
  },

  searchHotels: function(requestBody, query) {
    var uri = this.__host[this.getEnvironment()].v2 + '/metasearch/hotels/searches';
    return this.post(requestBody, uri, query);
  },

  searchHotel: function(requestBody, query) {
    var hotelId = requestBody.search.hotelId,
        uri = this.__host[this.getEnvironment()].v2 + '/metasearch/hotels/' + hotelId + '/searches';
    return this.post(requestBody, uri, query);
  },

  fetchHotelDetails: function(hotelId, query) {
    var uri = this.__host[this.getEnvironment()].v1 + '/hotels/hotels/' + hotelId;
    return this.get(uri, query);
  },

  fetchCities: function(query) {
    var uri = this.__host[this.getEnvironment()].v1 + '/places/cities';
    return this.get(uri, query);
  },

  fetchAirports: function(query) {
    var uri = this.__host[this.getEnvironment()].v1 + '/places/airports';
    return this.get(uri, query);
  },

  post: function(requestBody, uri, query) {
    return fetch(this.buildUrl(uri, query), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }).then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    }).catch(function(e) {
      return Promise.reject(e);
    });
  },

  get: function(uri, query) {
    return fetch(this.buildUrl(uri, query), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    }).catch(function(e) {
      return Promise.reject(e);
    });
  },

  buildUrl: function(uri, query) {
    if (query) {
      var arr = [];
      for (var key in query) {
        var value = query[key];
        if (value instanceof Array) {
          value.forEach(function(item) {
            arr.push(key + '[]=' + item);
          });
        } else {
          arr.push(key + '=' + query[key]);
        }
      }
      uri += '?' + arr.join('&');
    }
    return uri;
  }
};

module.exports = Api;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

var Poller = function (options) {
  options = options || {};
  this.callApi = options.callApi;
  this.delays = options.delays;
  this.onSuccessResponse = options.onSuccessResponse;
  this.pollLimit = options.pollLimit;
};

Poller.prototype = {
  start: function() {
    this.preparePoll();
  },

  reset: function() {
    clearTimeout(this.timer);
    if (this.abortLastFetch) {
      this.abortLastFetch();
    }
    this.pollCount = 0;
    this.resultCount = 0;
  },

  getProgress: function() {
    if (this.pollCount >= this.pollLimit || this.resultCount >= 1000) {
      return 100;
    }

    return this.pollCount / this.pollLimit * 50 + this.resultCount / 1000 * 50;
  },

  handleSuccessResponse: function(response) {
    this.onSuccessResponse(response);
    this.resultCount = response.count;
    this.preparePoll();
  },

  handleErrorResponse: function() {
    this.retry();
  },

  preparePoll: function() {
    var self = this;
    if (this.pollCount < this.delays.length) {
      this.timer = setTimeout(function() {
        self.poll();
      }, this.delays[this.pollCount]);
    }
  },

  poll: function() {
    this.pollCount++;
    this.retryCount = 0;
    this.fetch();
  },

  retry: function() {
    if (this.retryCount < 3) {
      this.retryCount++;
      this.fetch();
    }
  },

  fetch: function() {
    var self = this;
    var aborted = false;
    this.abortLastFetch = function() {
      aborted = true;
    };

    this.callApi().then(function(response) {
      if (!aborted) {
        self.handleSuccessResponse(response);
      }
    }).catch(function() {
      self.handleErrorResponse();
    });
  },
};

module.exports = Poller;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var FlightSearchMerger = __webpack_require__(7);
var sorting = __webpack_require__(10);
var filtering = __webpack_require__(9);
var Api = __webpack_require__(1);
var Poller = __webpack_require__(2);

var FlightSearchClient = function(options) {
  var self = this;
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

  this.merger = new FlightSearchMerger();

  this.poller = new Poller({
    delays: [0, 1000, 3000, 4000, 5000, 6000, 6000, 6000],
    pollLimit: 7,
    callApi: function() {
      return Api.searchTrips(self.getSearchRequestBody(), {
        currencyCode: self.currency.code,
        locale: self.locale,
      });
    },
    onSuccessResponse: function(response) {
      return self.handleSearchResponse(response);
    },
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
    this.onBestExperienceTripChanged(sorting.getBestExperienceTrip(filteredTrips));
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
      offset: this.processedFaresCount,
      paymentMethodIds: this.paymentMethodIds,
      providerTypes: this.providerTypes,
    }
  },
};

module.exports = FlightSearchClient;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

var Api = __webpack_require__(1);
var Poller = __webpack_require__(2);

var HotelDetailsClient = function(options) {
  var self = this;

  options = options || {};
  self.currency  = options.currency || {};
  self.locale = options.locale;
  self.searchId = options.searchId;
  self.siteCode = options.siteCode;
  self.deviceType = options.deviceType || "DESKTOP";
  self.onHotelRatesChanged = options.onHotelRatesChanged || function() {};
  self.onSearchCreated = options.onSearchCreated || function() {};

  self.poller = new Poller({
    delays: [0, 300, 600, 900, 2400, 3800, 5000, 6000],
    pollLimit: 7,
    callApi: function() {
      return Api.searchHotel(self.getSearchRequestBody(), {
        currencyCode: self.currency.code,
        locale: self.locale,
      });
    },
    onSuccessResponse: function(response) {
      self.onHotelRatesChanged(response);
    },
  });
  self.reset();
};

HotelDetailsClient.prototype = {
  searchHotelRates: function(search, mainSearchId) {
    var self = this;
    self.search = search;

    if (mainSearchId !== undefined) {
      self.reset();
      self.searchId = mainSearchId;
      self.poller.start();
    } else {
      Api.searchHotel(self.getSearchRequestBody(), {
        currencyCode: self.currency.code,
        locale: self.locale,
      }).then(function (hotelSearch) {
        self.reset();
        self.searchId = hotelSearch.search.id;
        self.onSearchCreated(hotelSearch);
        self.poller.start();
      });
    }
  },

  reset: function() {
    this.poller.reset();
  },

  updateCurrency: function(currency) {
    this.currency = currency;
  },

  getSearchRequestBody: function() {
    var self = this,
        hotelSearch = self.search || {},
        currency = self.currency || {},
        currencyCode = currency.code,
        locale = self.locale
        searchRequestBody = {};

    searchRequestBody = {
      search: {
        cityCode: hotelSearch.cityCode,
        roomsCount: hotelSearch.roomsCount,
        guestsCount: hotelSearch.guestsCount,
        hotelId: hotelSearch.hotelId,
        checkIn: hotelSearch.checkIn,
        checkOut: hotelSearch.checkOut,
        locale: locale,
        siteCode: self.siteCode,
        currencyCode: currencyCode,
        deviceType: self.deviceType
      }
    };

    if (self.searchId !== undefined) {
      searchRequestBody.search.id = self.searchId;
    }

    return searchRequestBody;
  },
};

module.exports = HotelDetailsClient;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var HotelSearchMerger = __webpack_require__(11);
var sorting = __webpack_require__(14);
var filtering = __webpack_require__(13);
var Api = __webpack_require__(1);
var Poller = __webpack_require__(2);

var HotelSearchClient = function(options) {
  var self = this;
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
  this.onSearchCreated = options.onSearchCreated || function() {};

  this.merger = new HotelSearchMerger();
  this.poller = new Poller({
    delays: [0, 300, 600, 900, 2400, 3800, 5000, 6000],
    pollLimit: 7,
    callApi: function() {
      return Api.searchHotels(self.getSearchRequestBody(), {
        currencyCode: self.currency.code,
        locale: self.locale,
      });
    },
    onSuccessResponse: function(response) {
      return self.handleSearchResponse(response);
    },
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
    this.mergeResponse(response);
    this.updateResult();
    if (this.poller.pollCount === 1) this.onSearchCreated(response.search);
  },

  mergeResponse: function(response) {
    this.merger.mergeResponse(response);
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
    var search = this.search || {};
    var currency = this.currency || {};
    var currencyCode = currency.code;
    var locale = this.locale;

    return {
      search: {
        id: this.responseSearch.id,
        siteCode: this.siteCode,
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
        deviceType: this.deviceType,
        appType: this.appType
      },
      rateAmenityIds: this.rateAmenityIds,
      offset: this.lastRatesCount,
    };
  },
};

module.exports = HotelSearchClient;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var Api = __webpack_require__(1);
var FlightSearchClient = __webpack_require__(3);
var HotelSearchClient = __webpack_require__(5);
var HotelDetailsClient = __webpack_require__(4);

module.exports = {
  Api: Api,
  FlightSearchClient: FlightSearchClient,
  HotelSearchClient: HotelSearchClient,
  HotelDetailsClient: HotelDetailsClient,
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var dataUtils = __webpack_require__(8);
var utils = __webpack_require__(0);

var FlightSearchMerger = function(options) {
  options = options || {};
  this.currency  = options.currency;
};

FlightSearchMerger.prototype = {
  mergeResponse: function(response) {
    var updatedTripIds = this._getUpdatedTripIds(response);

    this._mergeStaticData(response);
    this._mergeLegs(response.legs);
    this._mergeTrips(response.trips);
    this._mergeFilter(response.filters);
    this._mergeScores(response.scores);
    this._mergeFares(response.fares);

    this._cloneTrips(updatedTripIds);
  },

  reset: function() {
    this.__staticData = this._getEmptyStaticData();
    this.__legMap = {};
    this.__tripMap = {};
    this.__trips = [];
    this.__filter = this._getEmptyFilter();
    this.__filterOptionsMap = this._getEmptyFilterOptionsMap();
  },

  getTrips: function() {
    return this.__trips;
  },

  getFilter: function() {
    return this.__filter;
  },

  updateCurrency: function(currency) {
    this.currency = currency;
    var self = this;

    var tripMap = this.__tripMap;
    for (var tripId in tripMap) {
      tripMap[tripId].fares.forEach(function(fare) {
        fare.price = dataUtils.convertPrice(fare.price, currency);
        fare.paymentFees = dataUtils.convertPaymentFees(fare.paymentFees, currency);
      });
    }
    this._cloneTrips(Object.keys(tripMap));

    var filter = this.__filter;
    this.__filterOptionTypes.forEach(function(type) {
      var optionMap = self.__filterOptionsMap[type];
      for (var code in optionMap) {
        var option = optionMap[code];
        option.price = dataUtils.convertPrice(option.price, currency);
        optionMap[code] = utils.cloneObject(option);
      }
      self._buildFilterOptions(type);
    });
    filter.minPrice = dataUtils.convertPrice(filter.minPrice, currency);
    filter.maxPrice = dataUtils.convertPrice(filter.maxPrice, currency);
    this._cloneFilter();
  },

  _mergeStaticData: function(response) {
    var staticData = this.__staticData;

    function merge(itemMap, items, type) {
      if (!items) return;
      items.forEach(function(item) {
        var key = item.id || item.code;
        itemMap[key] = item;
        if (type === 'airports') {
          item.city = staticData.cities[item.cityCode];
        } else if (type === 'cities') {
          item.country = staticData.countries[item.countryCode];
        }
      });
    }

    this.__staticDataTypes.forEach(function(type) {
      merge(staticData[type], response[type], type);
    });
  },

  _mergeLegs: function(newLegs) {
    if (!newLegs) return;
    var self = this;
    var legMap = this.__legMap;
    newLegs.forEach(function(newLeg) {
      var legId = newLeg.id;
      if (!legMap[legId]) {
        dataUtils.prepareLeg(newLeg, self.__staticData);
        legMap[legId] = newLeg;
      }
    });
  },

  _mergeTrips: function(newTrips) {
    if (!newTrips) return;
    var self = this;
    var tripMap = this.__tripMap;
    newTrips.forEach(function(newTrip) {
      var tripId = newTrip.id;
      if (!tripMap[tripId]) {
        var legIds = newTrip.legIds || [];
        newTrip.legs = legIds.map(function(legId) {
          return self.__legMap[legId];
        });

        dataUtils.prepareTrip(newTrip);
        tripMap[tripId] = newTrip;
      }
    });
  },

  _mergeFares: function(newFares) {
    if (!newFares) return;
    var self = this;
    newFares.forEach(function(newFare) {
      dataUtils.prepareFare(newFare, self.currency, self.__staticData);
      var tripId = newFare.tripId;
      var trip = self.__tripMap[tripId];
      if (!trip) return;

      var fares = trip.fares;
      var i = 0;
      for(; i < fares.length; i++) {
        if (newFare.id === fares[i].id) return;
        if (newFare.price.amountUsd < fares[i].price.amountUsd) break;
      }
      fares.splice(i, 0, newFare);
    });
  },

  _mergeScores: function(scores) {
    if (!scores) return;
    var tripMap = this.__tripMap;
    for (var tripId in scores) {
      var trip = tripMap[tripId];
      if (trip) {
        trip.score = scores[tripId];
      }
    }
  },

  _mergeFilter: function(newFilter) {
    if (!newFilter) return;
    var self = this;

    var filter = this.__filter;

    if (newFilter.legs) {
      newFilter.legs.forEach(function(leg) {
        dataUtils.prepareLegFilter(leg, self.__staticData);
      });
      filter.legs = newFilter.legs;
    }

    if (newFilter.minPrice) {
      filter.minPrice = dataUtils.convertPrice(newFilter.minPrice, this.currency);
    }

    if (newFilter.maxPrice) {
      filter.maxPrice = dataUtils.convertPrice(newFilter.maxPrice, this.currency);
    }

    if (newFilter.stopoverDurations) {
      filter.stopoverDurations = newFilter.stopoverDurations;
    }

    this.__filterOptionTypes.forEach(function(type) {
      var options = newFilter[type] || [];
      options.forEach(function(option) {
        dataUtils.prepareFilterOption(option, type, self.currency, self.__staticData);
        self.__filterOptionsMap[type][option.code] = option;
      });
      self._buildFilterOptions(type);
    });

    this._cloneFilter();
  },

  _getUpdatedTripIds: function(response) {
    var tripIds = {};
    var self = this;
    if (response.scores) {
      for (var tripId in response.scores) {
        tripIds[tripId] = true;
      }
    }

    if (response.fares) {
      response.fares.forEach(function(fare) {
        tripIds[fare.tripId] = true;
      });
    }

    return Object.keys(tripIds).filter(function(tripId) {
      return self.__tripMap[tripId];
    });
  },

  _cloneTrips: function(tripIds) {
    var tripMap = this.__tripMap;
    tripIds.forEach(function(tripId) {
      var trip = tripMap[tripId];
      if (!trip) {
        console.error("Trip with " + tripId + " is missing");
        return;
      }
      trip.fares = utils.cloneArray(trip.fares);
      tripMap[tripId] = utils.cloneObject(trip);
    });

    this.__trips = utils.mapValues(tripMap);
  },

  _cloneFilter: function() {
    this.__filter = utils.cloneObject(this.__filter);
  },

  _buildFilterOptions: function(type) {
    this.__filter[type] = utils.mapValues(this.__filterOptionsMap[type]);
    this.__filter[type].sort(function(option1, option2) {
      if (type === 'stops') {
        var codes = ['DIRECT','ONE_STOP', 'MORE_THAN_ONE_STOP'];
        return codes.indexOf(option1.code) - codes.indexOf(option2.code);
      } else {
        if (option1.name < option2.name) return -1;
        else if (option1.name === option2.name) return 0;
        else return 1;
      }
    });
  },

  _getEmptyFilter: function() {
    var filter = {
      legs: [],
    };

    this.__filterOptionTypes.forEach(function(type) {
      filter[type] = [];
    });

    return filter;
  },

  _getEmptyFilterOptionsMap: function() {
    var map = {};
    this.__filterOptionTypes.forEach(function(type) {
      map[type] = {};
    });
    return map;
  },

  _getEmptyStaticData: function() {
    var staticData = {};
    this.__staticDataTypes.forEach(function(type) {
      staticData[type] = {};
    });
    return staticData;
  },

  __staticDataTypes: [
    'countries',
    'cities',
    'airlines',
    'airports',
    'providers',
    'stops',
    'alliances',
  ],

  __filterOptionTypes: [
    'airlines',
    'stops',
    'alliances',
    'originAirports',
    'destinationAirports',
    'stopoverAirports',
  ],
};

module.exports = FlightSearchMerger;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = {
  prepareTrip: function(trip) {
    trip.fares = [];

    var legs = trip.legs;
    if (!legs || legs.length === 0) return;

    trip.legIdMap = {};

    legs.forEach(function(leg) {
      trip.legIdMap[leg.id] = true;
    });

    var firstLeg = legs[0];

    function getStopCode(legs) {
      var maxStopsCount = 0;
      legs.forEach(function(leg) {
        maxStopsCount = Math.max(maxStopsCount, leg.stopoversCount);
      });

      switch (maxStopsCount) {
        case 0:
          return 'DIRECT';
        case 1:
          return 'ONE_STOP';
        default:
          return 'MORE_THAN_ONE_STOP';
      }
    }

    function hasOvernightLeg(legs) {
      var hasOvernight = false;
      legs.forEach(function(leg) {
        if (leg.overnight) hasOvernight = true;
      });
      return hasOvernight;
    }

    function hasLongStopoverLeg(legs) {
      var longStopover = false;
      legs.forEach(function(leg) {
        if (leg.longStopover) longStopover = true;
      });
      return longStopover;
    }

    function hasAirportChangeAtStopover(legs) {
      for (var i = 0; i < legs.length - 1; i++) {
        if (legs[i].arrivalAirportCode !== legs[i + 1].departureAirportCode) return true;
      }
      return false;
    }

    function getMarketingAirline(legs) {
      var marketingAirline = null;
      for (var i = 0; i < legs.length; i++) {
        var airline = legs[i].longestSegment.airline;
        if (marketingAirline === null) {
          marketingAirline = airline;
        } else if (marketingAirline.code != airline.code) {
          return null;
        }
      }
      return marketingAirline;
    }

    function concatListsToMap(lists) {
      var map = {};
      lists.forEach(function(list) {
        list = list || [];
        list.forEach(function(item) {
          map[item] = true;
        });
      });
      return map;
    }

    function concatListsToList(lists) {
      return Object.keys(concatListsToMap(lists));
    }

    function max(numbers) {
      var ans = 0;
      numbers.forEach(function(number) {
        ans = Math.max(ans, number);
      });
      return ans;
    }

    // Destination and origin will not work for multi city
    // as there is no concept of destination or origin
    function getDestinationAirportCodes(legs) {
      var codes = [legs[0].arrivalAirportCode];
      if (legs.length > 1) {
        for (var i = 1; i < legs.length; i ++) {
          var code = legs[i].departureAirportCode;
          if (!codes.includes(code)) {
            codes.push(legs[i].departureAirportCode);
          }
        }
      }
      return codes;
    }

    function getOriginAirportCodes(legs) {
      var codes = [legs[0].departureAirportCode];
      if (legs.length > 1) {
        for (var i = 1; i < legs.length; i ++) {
          var code = legs[i].arrivalAirportCode;
          if (!codes.includes(code)) {
            codes.push(legs[i].arrivalAirportCode);
          }
        }
      }
      return codes;
    }

    trip.stopCode = getStopCode(legs);

    trip.airlineCodes = concatListsToList(legs.map(function(leg){
      return leg.airlineCodes;
    }));

    trip.allianceCodes = concatListsToList(legs.map(function(leg){
      return leg.allianceCodes;
    }));

    trip.departureAirportCode = firstLeg.departureAirportCode;

    trip.arrivalAirportCode = firstLeg.arrivalAirportCode;

    trip.stopoverAirportCodeMap = concatListsToMap(legs.map(function(leg) {
      return leg.stopoverAirportCodes;
    }));

    trip.changeAirportAtStopover = hasAirportChangeAtStopover(legs);

    trip.stopoverDurationMinutes = max(legs.map(function(leg) {
      return leg.stopoverDurationMinutes;
    }));

    trip.durationMinutes = max(legs.map(function(leg) {
      return leg.durationMinutes;
    }));

    trip.departureTimeMinutes = firstLeg.departureTimeMinutes;

    trip.arrivalTimeMinutes = legs[legs.length - 1].arrivalTimeMinutes;

    trip.marketingAirline = getMarketingAirline(legs);

    trip.overnight = hasOvernightLeg(legs);

    trip.longStopover = hasLongStopoverLeg(legs);

    trip.destinationAirportCodes = getDestinationAirportCodes(legs);

    trip.originAirportCodes = getOriginAirportCodes(legs)
  },

  prepareLeg: function(leg, staticData) {
    var self = this;
    var airports = staticData.airports;
    leg.departureAirport = airports[leg.departureAirportCode];
    leg.arrivalAirport = airports[leg.arrivalAirportCode];

    var segments = leg.segments || [];

    segments.forEach(function(segment) {
      self.prepareSegment(segment, staticData);
    });

    var sortedSegments = segments.map(function(segment) {
      return segment;
    }).sort(function(s1, s2) {
      return s2.durationMinutes - s1.durationMinutes;
    });

    leg.longestSegment = sortedSegments[0];

    var airlines = sortedSegments.map(function(segment) {
      return segment.airline;
    });

    function uniq(items) {
      return items.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
      })
    }

    leg.airlines = uniq(airlines);
  },

  prepareSegment: function(segment, staticData) {
    var airlines = staticData.airlines;
    var airports = staticData.airports;
    segment.airline = airlines[segment.airlineCode];
    segment.operatingAirline = airlines[segment.operatingAirlineCode];
    segment.departureAirport = airports[segment.departureAirportCode];
    segment.arrivalAirport = airports[segment.arrivalAirportCode];
  },

  prepareFare: function(fare, currency, staticData) {
    fare.provider = staticData.providers[fare.providerCode];
    fare.price = this.convertPrice(fare.price, currency);
    fare.paymentFees = this.convertPaymentFees(fare.paymentFees, currency);
  },

  prepareFilterOption: function(option, type, currency, staticData) {
    var staticDataType = this.__filterOptionTypeToStaticDataType[type];
    var itemMap = staticData[staticDataType] || {};
    var item = itemMap[option.code] || {};
    option.name = item.name;
    option.item = item;
    option.price = this.convertPrice(option.price, currency);
  },

  prepareLegFilter: function(leg, staticData) {
    leg.departureCity = staticData.cities[leg.departureCityCode];
    leg.departureAirport = staticData.airports[leg.departureAirportCode];
    leg.arrivalCity = staticData.cities[leg.arrivalCityCode];
    leg.arrivalAirport = staticData.airports[leg.arrivalAirportCode];
  },

  convertPrice: function(price, currency) {
    if (!currency) return price;
    if (!price) return null;
    var amount = price.amount;
    var totalAmount = price.totalAmount;
    var originalAmount = price.originalAmount;

    if (price.currencyCode != currency.code) {
      var exchangeRate = currency.rate;
      amount = Math.round(price.amountUsd * exchangeRate);
      totalAmount = amount * Math.round(price.totalAmountUsd / price.amountUsd);
      originalAmount = Math.round(price.originalAmountUsd * exchangeRate);
    }

    return {
      currency: currency,
      amount: amount,
      originalAmount: originalAmount,
      totalAmount: totalAmount,
      amountUsd: price.amountUsd,
      totalAmountUsd: price.totalAmountUsd,
      originalAmountUsd: price.originalAmountUsd
    };
  },

  convertPaymentFee: function(paymentFee, currency) {
    if (!currency) return paymentFee;
    if (!paymentFee) return null;

    var amount = paymentFee.amount;
    if (paymentFee.currencyCode !== currency.code) {
      var exchangeRate = currency.rate;
      amount = paymentFee.amountUsd * exchangeRate;
    }

    return {
      paymentMethodId: paymentFee.paymentMethodId,
      currencyCode: currency.code,
      amount: amount,
      amountUsd: paymentFee.amountUsd
    };
  },

  convertPaymentFees: function(paymentFees, currency) {
    if (!paymentFees) return null;

    var self = this;
    return paymentFees.map(function(paymentFee) {
      return self.convertPaymentFee(paymentFee, currency)
    });
  },

  __filterOptionTypeToStaticDataType: {
    airlines: 'airlines',
    stops: 'stops',
    alliances: 'alliances',
    originAirports: 'airports',
    destinationAirports: 'airports',
    stopoverAirports: 'airports',
  }
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);

function filterByPrice(trip, priceRange) {
  if (!priceRange) return true;
  return trip.fares[0] && utils.filterByRange(trip.fares[0].price.amountUsd, priceRange);
}

function filterByProviderTypes(trip, providerTypes) {
  if (!providerTypes) return true;
  var fares = trip.fares;

  if (!fares) return false;
  for (var i = 0; i < fares.length; i++) {
    if (fares[i].provider.code.includes('wego.com') && providerTypes.includes('instant')) return true;
    if (providerTypes.includes(fares[i].provider.type)) return true;
  }

  return false;
}

function filterByTripOptions(trip, tripOptions) {
  if (!tripOptions) return true;
  for (var i = 0; i < tripOptions.length; i++) {
    if (tripOptions[i] === 'SAME_AIRLINE' && trip.airlineCodes.length > 1) return false;
  }
  return true;
}

function filterByStopoverOptions(trip, stopoverOptions) {
  if (!stopoverOptions || stopoverOptions.length === 0) return true;
  for (var i = 0; i < stopoverOptions.length; i++) {
    if (stopoverOptions[i] === 'NOT_CHANGE_AIRPORT' && trip.changeAirportAtStopover) return false
  }
  return true;
}

function filterByItineraryOptions(trip, itineraryOptions) {
  if (!itineraryOptions) return true;
  for (var i = 0; i < itineraryOptions.length; i++) {
    if (itineraryOptions[i] === 'NOT_OVERNIGHT' && !trip.overnight) return true;
    if (itineraryOptions[i] === 'SHORT_STOPOVER' && !trip.longStopover) return true;
  }
  return false;
}

function filterByRanges(trip, ranges, field) {
  if (!ranges) return true;
  for (var i = 0; i < ranges.length; i++) {
    var range = ranges[i];
    var leg = trip.legs[range.legIndex];
    if (!utils.filterByRange(leg[field], range)) return false;
  }
  return true;
}

function filterByAirlines(trip, airlineCodeMap) {
  if (!airlineCodeMap) return true;
  if (!trip.marketingAirline) return false;
  return utils.filterByKey(trip.marketingAirline.code, airlineCodeMap);
}

module.exports = {
  filterTrips: function(trips, filter) {
    if (!filter) return trips;

    var stopCodeMap = utils.arrayToMap(filter.stopCodes);
    var airlineCodeMap = utils.arrayToMap(filter.airlineCodes);
    var allianceCodeMap = utils.arrayToMap(filter.allianceCodes);
    var originAirportCodeMap = utils.arrayToMap(filter.originAirportCodes);
    var destinationAirportCodeMap = utils.arrayToMap(filter.destinationAirportCodes);

    return trips.filter(function(trip) {
      return filterByPrice(trip, filter.priceRange)
        && utils.filterByKey(trip.stopCode, stopCodeMap)
        && filterByRanges(trip, filter.departureTimeMinutesRanges, 'departureTimeMinutes')
        && filterByRanges(trip, filter.arrivalTimeMinutesRanges, 'arrivalTimeMinutes')
        && filterByAirlines(trip, airlineCodeMap)
        && utils.filterByAllKeys(trip.allianceCodes, allianceCodeMap)
        && filterByTripOptions(trip, filter.tripOptions)
        && utils.filterByAllKeys(trip.originAirportCodes, originAirportCodeMap)
        && utils.filterByAllKeys(trip.destinationAirportCodes, destinationAirportCodeMap)
        && utils.filterBySomeKeys(trip.stopoverAirportCodeMap, filter.stopoverAirportCodes)
        && filterByStopoverOptions(trip, filter.stopoverOptions)
        && filterByRanges(trip, filter.durationMinutesRanges, 'durationMinutes')
        && utils.filterByRange(trip.stopoverDurationMinutes, filter.stopoverDurationMinutesRange)
        && filterByItineraryOptions(trip, filter.itineraryOptions)
        && utils.filterByContainAllKeys(trip.legIdMap, filter.legIds)
        && filterByProviderTypes(trip, filter.providerTypes);
    });
  }
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);

module.exports = {
  sortTrips: function(trips, sort) {
    if (!sort) return trips;

    function getBestFare(trip) {
      if (!trip.fares[0]) return null;
      return trip.fares[0].price.amountUsd;
    }

    function getDuration(trip) {
      return trip.durationMinutes;
    }

    function getDepartureTime(legIndex) {
      return function(trip) {
        return trip.legs[legIndex].departureTimeMinutes;
      }
    }

    function getArrivalTime(legIndex) {
      return function(trip) {
        var leg = trip.legs[legIndex];
        return leg.arrivalTimeMinutes + leg.durationDays * 24 * 60;
      }
    }

    function getScore(trip) {
      return trip.score;
    }

    var getterMap = {
      PRICE: getBestFare,
      DURATION: getDuration,
      OUTBOUND_DEPARTURE_TIME: getDepartureTime(0),
      INBOUND_DEPARTURE_TIME: getDepartureTime(1),
      OUTBOUND_ARRIVAL_TIME: getArrivalTime(0),
      INBOUND_ARRIVAL_TIME: getArrivalTime(1),
      SCORE: getScore,
    };

    var propertyGetter = getterMap[sort.by] || function() {};
    var clonedTrips = utils.cloneArray(trips);

    clonedTrips.sort(function(trip1, trip2) {
      var compareResult = utils.compare(trip1, trip2, propertyGetter, sort.order);
      if (compareResult == 0 && sort.by != 'PRICE') {
        return utils.compare(trip1, trip2, getBestFare, 'ASC');
      } else {
        return compareResult;
      }
    });

    return clonedTrips;
  },

  getCheapestTrip: function(trips) {
    return this._getBestTripBy(trips, function(betterTrip, trip) {
      return betterTrip.fares[0].price.amountUsd < trip.fares[0].price.amountUsd;
    });
  },

  getFastestTrip: function(trips) {
    return this._getBestTripBy(trips, function(betterTrip, trip) {
      if (betterTrip.durationMinutes === trip.durationMinutes) {
        return betterTrip.fares[0].price.amountUsd < trip.fares[0].price.amountUsd;
      }
      return betterTrip.durationMinutes < trip.durationMinutes;
    });
  },

  getBestExperienceTrip: function(trips) {
    return this._getBestTripBy(trips, function(betterTrip, trip) {
      if (betterTrip.score === trip.score) {
        return betterTrip.fares[0].price.amountUsd < trip.fares[0].price.amountUsd;
      }
      return betterTrip.score > trip.score;
    });
  },

  _getBestTripBy: function(trips, isBetterFunc) {
    var bestTrip = trips[0];
    for (var i = 1; i < trips.length; i++) {
      if (isBetterFunc(trips[i], bestTrip)) {
        bestTrip = trips[i];
      }
    }
    return bestTrip;
  }
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);
var dataUtils = __webpack_require__(12);

var HotelSearchClient = function(options) {
  options = options || {};
  this.currency  = options.currency;
};

HotelSearchClient.prototype = {
  reset: function() {
    this.__staticData = this._getEmptyStaticData();
    this.__hotelMap = {};
    this.__hotels = [];
    this.__filter = this._getEmptyFilter();
    this.__filterOptionsMap = this._getEmptyFilterOptionsMap();
  },

  mergeResponse: function(response) {
    var hotelIds = this._getUpdatedHotelIds(response);

    this._mergeStaticData(response);
    this._mergeHotels(response.hotels);
    this._mergeFilter(response.filter);
    this._mergeRates(response.rates);
    this._mergeScores(response.scores);
    this._mergeRatesCounts(response.providerRatesCounts);

    this._cloneHotels(hotelIds);
  },

  getFilter: function() {
    return this.__filter;
  },

  getHotels: function () {
    return this.__hotels;
  },

  updateCurrency: function(currency) {
    this.currency = currency;

    var hotelMap = this.__hotelMap;
    for (var hotelId in hotelMap) {
      hotelMap[hotelId].rates.forEach(function(rate) {
        rate.price = dataUtils.convertPrice(rate.price, currency);
      });
    }
    this._cloneHotels(Object.keys(hotelMap));

    var filter = this.__filter;
    filter.minPrice = dataUtils.convertPrice(filter.minPrice, currency);
    filter.maxPrice = dataUtils.convertPrice(filter.maxPrice, currency);
    this.__filter = utils.cloneObject(this.__filter);
  },

  _mergeStaticData: function(response) {
    function merge(itemMap, items, type) {
      if (!items) return;
      items.forEach(function(item) {
        var key = (type === 'providers') ? item.code : item.id;
        itemMap[key] = item;
      });
    }

    var staticData = this.__staticData;
    this.__staticDataTypes.forEach(function(type) {
      merge(staticData[type], response[type], type);
    });
  },

  _mergeHotels: function (hotels) {
    if (!hotels) return;

    var self = this;
    var hotelMap = this.__hotelMap;

    hotels.forEach(function(hotel) {
      dataUtils.prepareHotel(hotel, self.__staticData);
      hotelMap[hotel.id] = hotelMap[hotel.id] || hotel;
    });
  },

  _mergeRates: function(newRates) {
    if (!newRates) return;
    var self = this;

    newRates.forEach(function(newRate) {
      dataUtils.prepareRate(newRate, self.currency, self.__staticData);
      var hotelId = newRate.hotelId;
      var hotel = self.__hotelMap[hotelId];
      if (!hotel) return;
      var rates = hotel.rates;

      var i;
      for (i = 0; i < rates.length; i++) {
        if (dataUtils.isBetterRate(newRate, rates[i])) break;
        if (newRate.providerCode === rates[i].providerCode) return;
      }
      rates.splice(i, 0, newRate);

      i++;
      for (; i < rates.length; i++) {
        if (newRate.providerCode === rates[i].providerCode) {
          rates.splice(i, 1);
          break;
        }
      }
    });
  },

  _mergeScores: function(scores) {
    if (!scores) return;
    var hotelMap = this.__hotelMap;
    for (var hotelId in scores) {
      var hotel = hotelMap[hotelId];
      if (hotel) {
        hotel.score = scores[hotelId];
      }
    }
  },

  _mergeRatesCounts: function(providerRatesCounts) {
    if (!providerRatesCounts) return;
    var self = this;
    providerRatesCounts.forEach(function(providerRatesCount) {
      var hotel = self.__hotelMap[providerRatesCount.hotelId];
      if (!hotel) return;

      var providerCode = providerRatesCount.providerCode;
      var ratesCount = providerRatesCount.ratesCount;
      var oldCount = hotel.ratesCounts[providerCode] || 0;
      hotel.ratesCounts[providerCode] = ratesCount;
      hotel.ratesCounts.total -= oldCount;
      hotel.ratesCounts.total += ratesCount;
    });
  },

  _mergeFilter: function(newFilter) {
    if (!newFilter) return;

    var filter = this.__filter;
    var self = this;

    if (newFilter.minPrice) {
      filter.minPrice = dataUtils.convertPrice(newFilter.minPrice, this.currency);
    }

    if (newFilter.maxPrice) {
      filter.maxPrice = dataUtils.convertPrice(newFilter.maxPrice, this.currency);
    }

    this.__filterOptionTypes.forEach(function(type) {
      var options = newFilter[type] || [];
      options.forEach(function(option) {
        dataUtils.prepareFilterOption(option, type, self.__staticData);
        self.__filterOptionsMap[type][option.code] = option;
      });
      self._buildFilterOptions(type);
    });

    this.__filter = utils.cloneObject(this.__filter);
  },

  _getEmptyStaticData: function() {
    var staticData = {};
    this.__staticDataTypes.forEach(function(type) {
      staticData[type] = {};
    });
    return staticData;
  },

  _getEmptyFilterOptionsMap: function() {
    var map = {};
    this.__filterOptionTypes.forEach(function(type) {
      map[type] = {};
    });
    return map;
  },

  _buildFilterOptions: function(type) {
    this.__filter[type] = utils
      .mapValues(this.__filterOptionsMap[type])
      .sort(function(option1, option2) {
        if (option1.name < option2.name) return -1;
        else if (option1.name === option2.name) return 0;
        else return 1;
      });
  },

  _getEmptyFilter: function() {
    var filter = {};

    this.__filterOptionTypes.forEach(function(type) {
      filter[type] = [];
    });

    return filter;
  },

  _getUpdatedHotelIds: function(response) {
    var hotelIds = {};
    var self = this;
    if (response.rates) {
      response.rates.forEach(function(rate) {
        hotelIds[rate.hotelId] = true;
      });
    }

    if (response.scores) {
      for (var hotelId in response.scores) {
        hotelIds[hotelId] = true;
      }
    }

    if (response.providerRatesCounts) {
      response.providerRatesCounts.forEach(function(providerRatesCount) {
        hotelIds[providerRatesCount.hotelId] = true;
      });
    }

    return Object.keys(hotelIds).filter(function(hotelId) {
      return self.__hotelMap[hotelId];
    });
  },

  _cloneHotels: function(hotelIds) {
    var hotelMap = this.__hotelMap;
    hotelIds.forEach(function(hotelId) {
      var hotel = hotelMap[hotelId];
      if (!hotel) {
        console.error("Hotel with " + hotelId + " is missing");
        return;
      }
      hotel.rates = utils.cloneArray(hotel.rates);
      hotel.ratesCounts = utils.cloneObject(hotel.ratesCounts);
      hotelMap[hotelId] = utils.cloneObject(hotel);
    });

    this.__hotels = utils.mapValues(hotelMap);
  },

  __staticDataTypes: [
    'stars',
    'brands',
    'propertyTypes',
    'districts',
    'amenities',
    'rateAmenities',
    'chains',
    'providers',
  ],

  __filterOptionTypes: [
    'stars',
    'brands',
    'propertyTypes',
    'districts',
    'amenities',
    'rateAmenities',
    'chains',
    'reviewerGroups',
  ],
};

module.exports = HotelSearchClient;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);

module.exports = {
  prepareHotel: function(hotel, staticData) {
    function arrayToMap (items, getKeyFunc) {
      if (!items) return {};
      var map = {};
      items.forEach(function(item) {
        map[getKeyFunc(item)] = item;
      });
      return map;
    }

    hotel.district = staticData.districts[hotel.districtId];
    hotel.reviewMap = arrayToMap(hotel.reviews, function(review) {
      return review.reviewerGroup;
    });

    hotel.ratesCounts = {
      total: 0,
    };

    var amenityIdMap = {};
    var amenityIds = hotel.amenityIds || [];
    amenityIds.forEach(function(id) {
      amenityIdMap[id] = true;
    });
    hotel.amenityIdMap = amenityIdMap;
    hotel.rates = [];
    hotel.images = hotel.images || [];
  },

  prepareRate: function(rate, currency, staticData) {
    rate.provider = staticData.providers[rate.providerCode];
    rate.price = this.convertPrice(rate.price, currency);
  },

  convertPrice: function(price, currency) {
    if (!currency) return price;
    if (!price) return null;
    var amount = price.amount;
    var totalAmount = price.totalAmount;

    if (price.currencyCode != currency.code) {
      var exchangeRate = currency.rate;
      amount = Math.round(price.amountUsd * exchangeRate);
      totalAmount = amount * Math.round(price.totalAmountUsd / price.amountUsd);
    }

    var convertedPrice = utils.cloneObject(price);
    convertedPrice.currency = currency;
    convertedPrice.amount = amount;
    convertedPrice.totalAmount = totalAmount;
    
    return convertedPrice;
  },

  prepareFilterOption: function(option, type, staticData) {
    var staticDataType = this.__filterOptionTypeToStaticDataType[type];
    var itemMap = staticData[staticDataType] || {};
    var item = itemMap[option.code] || {};
    option.name = item.name;
  },

  isBetterRate: function(firstRate, secondRate) {
    function processRateAmount(rate) {
      var amount = Math.round(rate.price.amount);
      if (amount > 99999) {
        amount = (amount / 100) * 100;
      }
      return amount;
    }

    function getPriceTaxAmountInclusive(rate) {
      return rate.price.taxAmountUsd < 0 ? -1 : 1;
    }

    var firstTax = getPriceTaxAmountInclusive(firstRate);
    var secondTax = getPriceTaxAmountInclusive(secondRate);

    if (firstTax != secondTax) return firstTax > secondTax;

    var firstRateAmount = processRateAmount(firstRate);
    var secondRateAmount = processRateAmount(secondRate);
    if (firstRateAmount != secondRateAmount) return firstRateAmount < secondRateAmount;

    return firstRate.price.ecpc > secondRate.price.ecpc;
  },

  __filterOptionTypeToStaticDataType: {
    stars: 'stars',
    brands: 'brands',
    propertyTypes: 'propertyTypes',
    districts: 'districts',
    amenities: 'amenities',
    rateAmenities: 'rateAmenities',
    chains: 'chains',
    reviewerGroups: 'reviewerGroups',
  }
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);

function filterByReviewScore(hotel, filter) {
  if (!filter.reviewScoreRange) return true;
  var review  = hotel.reviewMap['ALL'] || {};
  return utils.filterByRange(review.score, filter.reviewScoreRange)
}

function filterByReviewerGroups(hotel, reviewerGroups) {
  if (!reviewerGroups || reviewerGroups.length === 0) return true;
  for (var i = 0; i < reviewerGroups.length; i++) {
    var review = hotel.reviewMap[reviewerGroups[i]];
    if (review && review.score >= 80 && review.count >= 100) {
      return true;
    }
  }
  return false;
}

function filterByRateAmenities(hotel, rateAmenityIds) {
  if (!rateAmenityIds || rateAmenityIds.length === 0) return true;
  var rates = hotel.rates;

  if (!rates) return false;

  for (var i = 0; i < rates.length; i++) {
    for (var j = 0; j < rateAmenityIds.length; j++) {
      if (rates[i].rateAmenityIds.includes(parseInt(rateAmenityIds[j]))) return true;
    }
  }
  
  return false;
}

function filterByPrice(hotel, priceRange) {
  if (!priceRange) return true;
  return hotel.rates[0] && utils.filterByRange(hotel.rates[0].price.amountUsd, priceRange);
}

module.exports = {
  filterHotels: function(hotels, filter) {
    if (!filter) return hotels;

    var starMap = utils.arrayToMap(filter.stars);
    var districtIdMap = utils.arrayToMap(filter.districtIds);
    var propertyTypeIdMap = utils.arrayToMap(filter.propertyTypeIds);
    var brandIdMap = utils.arrayToMap(filter.brandIds);
    var chainIdMap = utils.arrayToMap(filter.chainIds);

    return hotels.filter(function(hotel) {
      return filterByPrice(hotel, filter.priceRange)
        && utils.filterByKey(hotel.star, starMap)
        && filterByReviewScore(hotel, filter)
        && utils.filterByContainAllKeys(hotel.amenityIdMap, filter.amenityIds)
        && utils.filterByKey(hotel.districtId, districtIdMap)
        && utils.filterByKey(hotel.propertyTypeId, propertyTypeIdMap)
        && utils.filterByKey(hotel.brandId, brandIdMap)
        && utils.filterByTextMatching(hotel.name, filter.name)
        && utils.filterByKey(hotel.chainId, chainIdMap)
        && filterByReviewerGroups(hotel, filter.reviewerGroups)
        && filterByRateAmenities(hotel, filter.rateAmenityIds);
    });
  }
};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);

module.exports = {
  sortHotels: function(hotels, sort) {
    if (!sort) return hotels;

    function getPrice(hotel) {
      if (hotel.rates && hotel.rates.length > 0) {
        return hotel.rates[0].price.amountUsd;
      } else {
        return null;
      }
    }

    function getReviewScore(type) {
      return function(hotel) {
        var review = hotel.reviewMap[type];
        if (!review) return null;
        return review.score;
      };
    }

    function getStar(hotel) {
      return hotel.star === 0 ? undefined : hotel.star;
    }

    function getScore(hotel) {
      return hotel.score;
    }

    function getDistanceToCityCentre(hotel) {
      return hotel.distanceToCityCentre;
    }

    function getDistanceToNearestAirport(hotel) {
      return hotel.distanceToNearestAirport;
    }

    var getterMap = {
      PRICE: getPrice,
      ALL_REVIEW_SCORE: getReviewScore('ALL'),
      FAMILY_REVIEW_SCORE: getReviewScore('FAMILY'),
      BUSINESS_REVIEW_SCORE: getReviewScore('BUSINESS'),
      COUPLE_REVIEW_SCORE: getReviewScore('COUPLE'),
      SOLO_REVIEW_SCORE: getReviewScore('SOLO'),
      STAR: getStar,
      SCORE: getScore,
      DISTANCE_TO_CITY_CENTER: getDistanceToCityCentre,
      DISTANCE_TO_NEAREST_AIRPORT: getDistanceToNearestAirport,
    };

    var propertyGetter = getterMap[sort.by] || function() {};
    var cloneHotels = utils.cloneArray(hotels);

    cloneHotels.sort(function(hotel1, hotel2) {
      var compareResult = utils.compare(hotel1, hotel2, propertyGetter, sort.order);
      if (compareResult == 0 && sort.by != 'PRICE') {
        return utils.compare(hotel1, hotel2, getPrice, 'ASC');
      } else {
        return compareResult;
      }
    });

    return cloneHotels;
  },
};

/***/ })
/******/ ]);
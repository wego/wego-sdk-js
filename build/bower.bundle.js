module.exports =
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
/******/ 	return __webpack_require__(__webpack_require__.s = 21);
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
    if (keys.length === 0) return false;

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
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(7).polyfill();
__webpack_require__(8);

var Api = {
  __host: {
    staging: {
      v2: "https://srv.wegostaging.com/v2",
      v1: "https://srv.wego.com"
    },
    production: {
      v2: "https://srv.wego.com/v2",
      v1: "https://srv.wego.com"
    }
  },

  setEnvironment: function(env) {
    this.env = env;
  },

  getEnvironment: function() {
    return this.env || "staging";
  },

  searchTrips: function(requestBody, query) {
    var uri =
      this.__host[this.getEnvironment()].v2 + "/metasearch/flights/searches";
    return this.post(requestBody, uri, query);
  },

  searchHotels: function(requestBody, query) {
    var uri =
      this.__host[this.getEnvironment()].v2 + "/metasearch/hotels/searches";
    return this.post(requestBody, uri, query);
  },

  searchHotel: function(requestBody, query) {
    var hotelId = requestBody.search.hotelId,
      uri =
        this.__host[this.getEnvironment()].v2 +
        "/metasearch/hotels/" +
        hotelId +
        "/searches";
    return this.post(requestBody, uri, query);
  },

  fetchHotelDetails: function(hotelId, query) {
    var uri =
      this.__host[this.getEnvironment()].v1 + "/hotels/hotels/" + hotelId;
    return this.get(uri, query);
  },

  fetchCities: function(query) {
    var uri = this.__host[this.getEnvironment()].v1 + "/places/cities";
    return this.get(uri, query);
  },

  fetchAirports: function(query) {
    var uri = this.__host[this.getEnvironment()].v1 + "/places/airports";
    return this.get(uri, query);
  },

  post: function(requestBody, uri, query) {
    return fetch(this.buildUrl(uri, query), {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    })
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject();
        }
      })
      .catch(function(e) {
        return Promise.reject(e);
      });
  },

  get: function(uri, query) {
    return fetch(this.buildUrl(uri, query), {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject();
        }
      })
      .catch(function(e) {
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
            arr.push(key + "[]=" + item);
          });
        } else {
          arr.push(key + "=" + query[key]);
        }
      }
      uri += "?" + arr.join("&");
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

    if (this.resultCount === undefined) {
      return this.pollCount / this.pollLimit * 100;
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

var FlightSearchMerger = __webpack_require__(12);
var sorting = __webpack_require__(15);
var filtering = __webpack_require__(14);
var Api = __webpack_require__(1);
var Poller = __webpack_require__(2);

var FlightSearchClient = function(options) {
  var self = this;
  options = options || {};
  this.currency  = options.currency || {};
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
  self.appType = options.appType || "WEB_APP";
  self.userLoggedIn = options.userLoggedIn;
  self.onProgressChanged = options.onProgressChanged || function() {};
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
      return self.handleSearchResponse(response);
    },
  });
  self.reset();
};

HotelDetailsClient.prototype = {
  searchHotelRates: function(search, mainSearchId) {
    var self = this;
    self.search = search;
    self.searchId = undefined;

    if (mainSearchId !== undefined) {
      self.reset();
      self.onProgressChanged(self.poller.getProgress());
      self.searchId = mainSearchId;
      self.poller.start();
    } else {
      Api.searchHotel(self.getSearchRequestBody(), {
        currencyCode: self.currency.code,
        locale: self.locale,
      }).then(function (hotelSearch) {
        self.reset();
        self.onProgressChanged(self.poller.getProgress());
        self.searchId = hotelSearch.search.id;
        self.onSearchCreated(hotelSearch.search);
        self.poller.start();
      });
    }
  },

  handleSearchResponse: function(response) {
    var self = this;

    self.onProgressChanged(self.poller.getProgress());
    self.onHotelRatesChanged(response);
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
        deviceType: self.deviceType,
        appType: self.appType,
        userLoggedIn: self.userLoggedIn
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

var HotelSearchMerger = __webpack_require__(16);
var sorting = __webpack_require__(19);
var filtering = __webpack_require__(18);
var Api = __webpack_require__(1);
var Poller = __webpack_require__(2);

var HotelSearchClient = function(options) {
  var self = this;
  options = options || {};
  this.currency  = options.currency || {};
  this.locale = options.locale;
  this.siteCode = options.siteCode;
  this.deviceType = options.deviceType || "DESKTOP";
  this.appType = options.appType || "WEB_APP";
  this.userLoggedIn = options.userLoggedIn;
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
        appType: this.appType,
        userLoggedIn: this.userLoggedIn
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
  HotelDetailsClient: HotelDetailsClient
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {var require;/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.1.1
 */

(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = require;
    var vertx = __webpack_require__(20);
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && "function" === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === GET_THEN_ERROR) {
      reject(promise, GET_THEN_ERROR.error);
      GET_THEN_ERROR.error = null;
    } else if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      resolve(promise, value);
    } else if (failed) {
      reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator$1(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate(input);
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

Enumerator$1.prototype._enumerate = function (input) {
  for (var i = 0; this._state === PENDING && i < input.length; i++) {
    this._eachEntry(input[i], i);
  }
};

Enumerator$1.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$1 = c.resolve;

  if (resolve$$1 === resolve$1) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise$2) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$1) {
        return resolve$$1(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$1(entry), i);
  }
};

Enumerator$1.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator$1.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all$1(entries) {
  return new Enumerator$1(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race$1(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise$2(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise$2 ? initializePromise(this, resolver) : needsNew();
  }
}

Promise$2.all = all$1;
Promise$2.race = race$1;
Promise$2.resolve = resolve$1;
Promise$2.reject = reject$1;
Promise$2._setScheduler = setScheduler;
Promise$2._setAsap = setAsap;
Promise$2._asap = asap;

Promise$2.prototype = {
  constructor: Promise$2,

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn't find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

/*global self*/
function polyfill$1() {
    var local = undefined;

    if (typeof global !== 'undefined') {
        local = global;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise$2;
}

// Strange compat..
Promise$2.polyfill = polyfill$1;
Promise$2.Promise = Promise$2;

return Promise$2;

})));

//# sourceMappingURL=es6-promise.map

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(9), __webpack_require__(10)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// the whatwg-fetch polyfill installs the fetch() function
// on the global object (window or self)
//
// Return that as the export for use in Webpack, Browserify etc.
__webpack_require__(11);
module.exports = self.fetch.bind(self);


/***/ }),
/* 9 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 10 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 11 */
/***/ (function(module, exports) {

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = 'status' in options ? options.status : 200
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

var dataUtils = __webpack_require__(13);
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
/* 13 */
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

    function getDurationMinutes(legs) {
      return legs.reduce(function(sum, value) {
        return sum + value.durationMinutes;
      }, 0);
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

    trip.durationMinutes = getDurationMinutes(legs);

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
    var paymentFeeAmountUsd = 0;

    if (price.paymentFeeAmountUsd) {
      paymentFeeAmountUsd = price.paymentFeeAmountUsd;
    }

    if (price.currencyCode != currency.code) {
      var exchangeRate = currency.rate;
      originalAmount = Math.round(price.originalAmountUsd * exchangeRate);
      amount = originalAmount + Math.round(paymentFeeAmountUsd * exchangeRate);
      totalAmount = amount * Math.round(price.totalAmountUsd / price.amountUsd);
    }

    return {
      currency: currency,
      amount: amount,
      originalAmount: originalAmount,
      totalAmount: totalAmount,
      amountUsd: price.amountUsd,
      totalAmountUsd: price.totalAmountUsd,
      originalAmountUsd: price.originalAmountUsd,
      paymentFeeAmountUsd: paymentFeeAmountUsd
    };
  },

  convertPaymentFee: function(paymentFee, currency) {
    if (!currency) return paymentFee;
    if (!paymentFee) return null;

    var amount = paymentFee.amount;
    if (paymentFee.currencyCode !== currency.code) {
      var exchangeRate = currency.rate;
      amount = Math.round(paymentFee.amountUsd * exchangeRate);
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
/* 14 */
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
    if (fares[i].provider.instant && providerTypes.includes('instant')) return true;
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

function isBothAirlineAndInstant(value) {
  return value.provider.type === 'airline' || value.provider.instant;
}

module.exports = {
  filterTrips: function(trips, filter) {
    if (!filter) return trips;

    var stopCodeMap = utils.arrayToMap(filter.stopCodes);
    var airlineCodeMap = utils.arrayToMap(filter.airlineCodes);
    var allianceCodeMap = utils.arrayToMap(filter.allianceCodes);
    var originAirportCodeMap = utils.arrayToMap(filter.originAirportCodes);
    var destinationAirportCodeMap = utils.arrayToMap(filter.destinationAirportCodes);

    var filteredTrips = trips.filter(function(trip) {
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

    return filteredTrips;
  }
};

/***/ }),
/* 15 */
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var utils = __webpack_require__(0);
var dataUtils = __webpack_require__(17);

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
/* 17 */
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

    if (firstRate.provider.type == 'DIRECT_PRIORITY' && secondRate.provider.type != 'DIRECT_PRIORITY') {
      return true;
    } else if (secondRate.provider.type == 'DIRECT_PRIORITY' && firstRate.provider.type != 'DIRECT_PRIORITY') {
      return false;
    }

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
/* 18 */
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
/* 19 */
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

/***/ }),
/* 20 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var WegoSdk = __webpack_require__(6);
window.WegoSdk = WegoSdk;

/***/ })
/******/ ]);
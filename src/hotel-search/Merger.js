var utils = require('../utils');
var dataUtils = require('./dataUtils');

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

  mergeResponse: function(response, isSearchEnd = false) {
    var hotelIds = this._getUpdatedHotelIds(response);

    this._mergeStaticData(response);
    this._mergeHotels(response.hotels);
    this._mergeFilter(response.filter);
    this._mergeRates(response.rates, isSearchEnd);  
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

  _mergeRates: function(newRates, isSearchEnd) {
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

    if (isSearchEnd) {
      this._lastMergeRates(newRates);
    }
  },

  _lastMergeRates: function(newRates) {
    if (!newRates) return;
    var self = this;

    var singlePartnerHotels = {};
    for (var hotelId in self.__hotelMap) {
      if (self.__hotelMap[hotelId].rates && self.__hotelMap[hotelId].rates.length === 1) {
        singlePartnerHotels[hotelId] = true;
      }
    }

    var hotelIdToNewRatesMap = {};
    for (var i in newRates) {
      var rate = newRates[i];
      if (singlePartnerHotels[rate.hotelId]) {
        if (!hotelIdToNewRatesMap[rate.hotelId]) {
          hotelIdToNewRatesMap[rate.hotelId] = [];
        }
        var hotelOrderedRates = hotelIdToNewRatesMap[rate.hotelId];
        var index;
        for (index = 0; index < hotelOrderedRates.length; index++) {
          if (dataUtils.isBetterRate(rate, hotelOrderedRates[index])) {
            break;
          }
        }
        hotelOrderedRates.splice(index, 0, rate);
      }
    }

    for (var hotelId in singlePartnerHotels) {
      var currentBestRate = self.__hotelMap[hotelId].rates[0];
      var hotelOrderedRates = hotelIdToNewRatesMap[hotelId];
      if (!hotelOrderedRates) {
        continue;
      }
      if (hotelOrderedRates[0].id !== currentBestRate.id) {
        hotelOrderedRates.splice(0, 0, currentBestRate);
      }
      self.__hotelMap[hotelId].rates = hotelOrderedRates;
    }
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
    'cities',
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
    'cities',
    'amenities',
    'rateAmenities',
    'chains',
    'reviewerGroups',
  ],
};

module.exports = HotelSearchClient;